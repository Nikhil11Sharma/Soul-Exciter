// /api/products.js
//
// Vercel Serverless Function that persists the product catalog in Upstash
// Redis, so every device/browser that opens the site sees the SAME list.

const KEY = "se:products";

async function redisGet(key) {
  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const r = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!r.ok) throw new Error("Redis GET failed: " + r.status);
  const data = await r.json();
  return data.result;
}

async function redisSet(key, value) {
  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const r = await fetch(`${REDIS_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "text/plain",
    },
    body: value,
  });
  if (!r.ok) throw new Error("Redis SET failed: " + r.status);
}

async function getProducts() {
  const raw = await redisGet(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveProducts(list) {
  await redisSet(KEY, JSON.stringify(list));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!REDIS_URL || !REDIS_TOKEN) {
    res.status(500).json({
      error:
        "Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN environment variables. See the setup notes at the top of api/products.js.",
    });
    return;
  }

  try {
    if (req.method === "GET") {
      const products = await getProducts();
      res.status(200).json(products);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !body.name) {
        res.status(400).json({ error: "Product must at least have a name" });
        return;
      }
      const products = await getProducts();
      const newProduct = { clicks: 0, ...body, id: body.id || "u" + Date.now() };
      const updated = [newProduct, ...products];
      await saveProducts(updated);
      res.status(200).json(updated);
      return;
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, ...changes } = body || {};
      if (!id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      const products = await getProducts();
      const updated = products.map((p) => (p.id === id ? { ...p, ...changes } : p));
      await saveProducts(updated);
      res.status(200).json(updated);
      return;
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: "Missing id query param" });
        return;
      }
      const products = await getProducts();
      const updated = products.filter((p) => p.id !== id);
      await saveProducts(updated);
      res.status(200).json(updated);
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unexpected server error" });
  }
}
