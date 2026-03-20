const express = require("express");
const path = require("path");
const https = require("https");
const http = require("http");
const { getRecommendations, SKIN_PROBLEMS } = require("./data/products");
const { getStoresForRegion } = require("./data/stores");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Image proxy to avoid hotlink blocking
app.get("/api/image-proxy", (req, res) => {
  const url = req.query.url;
  if (!url || (!url.startsWith("https://") && !url.startsWith("http://"))) {
    return res.status(400).send("Invalid URL");
  }

  const client = url.startsWith("https") ? https : http;
  const proxyReq = client.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "image/*",
    },
  }, (proxyRes) => {
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      // Follow redirect once
      const redirectClient = proxyRes.headers.location.startsWith("https") ? https : http;
      redirectClient.get(proxyRes.headers.location, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*",
        },
      }, (redirectRes) => {
        res.set("Content-Type", redirectRes.headers["content-type"] || "image/jpeg");
        res.set("Cache-Control", "public, max-age=86400");
        redirectRes.pipe(res);
      }).on("error", () => res.status(502).send(""));
      return;
    }
    res.set("Content-Type", proxyRes.headers["content-type"] || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => res.status(502).send(""));
  proxyReq.setTimeout(5000, () => { proxyReq.destroy(); res.status(504).send(""); });
});

// Get all available skin problems
app.get("/api/problems", (req, res) => {
  res.json(SKIN_PROBLEMS);
});

// Get product recommendations for selected problems
app.post("/api/recommend", (req, res) => {
  const { problems, skinType } = req.body;

  if (!problems || !Array.isArray(problems) || problems.length === 0) {
    return res.status(400).json({ error: "Please select at least one skin problem." });
  }

  const recommendations = getRecommendations(problems, skinType);
  res.json(recommendations);
});

// Get best stores based on country code
app.get("/api/stores", (req, res) => {
  const country = (req.query.country || "US").toUpperCase();
  const stores = getStoresForRegion(country);
  res.json(stores);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
