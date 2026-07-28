// /api/scrape.js
//
// Given ?url=<affiliate link>, fetches that page server-side (this has to
// happen on the server, not the browser, because the retailer's site won't
// allow a cross-origin fetch from your frontend / CORS) and pulls out a
// best-effort product name, image, price and rating from:
//   1. Open Graph / meta tags (og:title, og:image, product:price:amount…)
//   2. schema.org "Product" JSON-LD blocks, when the page includes one
//   3. common itemprop="price" / itemprop="ratingValue" markers
//
// ── IMPORTANT LIMITATIONS ────────────────────────────────────────────
// - Big retailers (Amazon, Flipkart, Myntra, Ajio, etc.) frequently block
//   server-side/bot requests, or render price & rating with client-side
//   JavaScript that never appears in the raw HTML this function receives.
//   For those, you'll often only get the name/image, or nothing at all —
//   the UI should let the admin fill in the rest by hand.
// - This is a best-effort autofill, not a guarantee. Always eyeball the
//   result before publishing.
// - Respect each retailer's Terms of Service around automated fetching.
//
// Requires the "cheerio" package: run `npm install cheerio` in your
// project root before deploying.

const cheerio = require("cheerio");

function firstNumber(str) {
  if (str === undefined || str === null) return undefined;
  const cleaned = String(str).replace(/,/g, "");
  const m = cleaned.match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : undefined;
}

module.exports = async function handler(req, res) {
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
    const $ = cheerio.load(html);

    const meta = (name) =>
      $(`meta[property="${name}"]`).attr("content") || $(`meta[name="${name}"]`).attr("content");

    const result = {
      name: meta("og:title") || $("title").first().text().trim() || "",
      image: meta("og:image") || meta("twitter:image") || "",
      price: firstNumber(meta("product:price:amount") || meta("og:price:amount")),
      originalPrice: undefined,
      rating: undefined,
    };

    // schema.org Product JSON-LD — the most reliable source when present.
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
        // Ignore malformed / unrelated JSON-LD blocks and keep looking.
      }
    });

    // Fallback itemprop markers some sites still use.
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
};
