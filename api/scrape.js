// /api/scrape.js
//
// Given ?url=<affiliate link>, fetches that page server-side and pulls out
// product name, image, price and rating from meta tags and JSON-LD.

import { load } from "cheerio";

function firstNumber(str) {
  if (str === undefined || str === null) return undefined;
  const cleaned = String(str).replace(/,/g, "");
  const m = cleaned.match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : undefined;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const targetUrl = req.query.url;
  if (!targetUrl) {
    res.status(400).json({ error: "Missing ?url= query param" });
    return;
  }

  try {
    const pageRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      redirect: "follow",
    });

    if (!pageRes.ok) {
      res.status(200).json({
        fetched: false,
        error: `The site responded with ${pageRes.status}. It may be blocking automated requests — fill the details in manually.`,
      });
      return;
    }

    const html = await pageRes.text();
    const $ = load(html);

    const meta = (name) =>
      $(`meta[property="${name}"]`).attr("content") || $(`meta[name="${name}"]`).attr("content");

    const result = {
      name: meta("og:title") || $("title").first().text().trim() || "",
      image: meta("og:image") || meta("twitter:image") || "",
      price: firstNumber(meta("product:price:amount") || meta("og:price:amount")),
      originalPrice: undefined,
      rating: undefined,
    };

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).contents().text());
        const items = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
        for (const item of items) {
          if (!item) continue;
          const type = item["@type"];
          const isProduct = type === "Product" || (Array.isArray(type) && type.includes("Product"));
          if (!isProduct) continue;

          if (!result.name && item.name) result.name = item.name;
          if (!result.image && item.image) {
            result.image = Array.isArray(item.image) ? item.image[0] : item.image;
          }

          const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
          if (offers) {
            if (offers.price && !result.price) result.price = firstNumber(offers.price);
            if (offers.highPrice) result.originalPrice = firstNumber(offers.highPrice);
          }

          if (item.aggregateRating && item.aggregateRating.ratingValue) {
            result.rating = firstNumber(item.aggregateRating.ratingValue);
          }
        }
      } catch {
        // Ignore malformed JSON-LD blocks
      }
    });

    if (!result.price) {
      const p = $('[itemprop="price"]').attr("content") || $('[itemprop="price"]').first().text();
      result.price = firstNumber(p);
    }
    if (!result.rating) {
      const r = $('[itemprop="ratingValue"]').attr("content") || $('[itemprop="ratingValue"]').first().text();
      result.rating = firstNumber(r);
    }

    res.status(200).json({
      ...result,
      fetched: Boolean(result.name || result.image || result.price),
    });
  } catch (err) {
    res.status(200).json({
      fetched: false,
      error: "Couldn't reach that page: " + err.message,
    });
  }
}
