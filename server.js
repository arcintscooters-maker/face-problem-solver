const express = require("express");
const path = require("path");
const { getRecommendations, SKIN_PROBLEMS } = require("./data/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
