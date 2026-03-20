const SKIN_PROBLEMS = [
  { id: "acne", label: "Acne / Breakouts", icon: "😣" },
  { id: "dark_spots", label: "Dark Spots / Hyperpigmentation", icon: "🔵" },
  { id: "wrinkles", label: "Wrinkles / Fine Lines", icon: "〰️" },
  { id: "dry_skin", label: "Dry / Flaky Skin", icon: "🏜️" },
  { id: "oily_skin", label: "Oily / Shiny Skin", icon: "💧" },
  { id: "dark_circles", label: "Dark Circles Under Eyes", icon: "👁️" },
  { id: "large_pores", label: "Large Pores", icon: "🔍" },
  { id: "redness", label: "Redness / Rosacea", icon: "🔴" },
  { id: "uneven_tone", label: "Uneven Skin Tone", icon: "🎨" },
  { id: "blackheads", label: "Blackheads / Whiteheads", icon: "⚫" },
  { id: "sun_damage", label: "Sun Damage", icon: "☀️" },
  { id: "dullness", label: "Dull / Tired Skin", icon: "😴" },
  { id: "sensitivity", label: "Sensitive / Irritated Skin", icon: "⚡" },
  { id: "eczema", label: "Eczema / Dermatitis", icon: "🩹" },
  { id: "scars", label: "Acne Scars / Textured Skin", icon: "✨" },
];

const PRODUCTS = [
  // Acne
  {
    name: "CeraVe Acne Foaming Cream Cleanser",
    type: "Cleanser",
    targets: ["acne", "blackheads", "oily_skin"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Benzoyl Peroxide 4%", "Ceramides", "Niacinamide"],
    description: "A foaming cleanser that fights acne while maintaining the skin barrier with ceramides.",
    price: "$15",
    rating: 4.5,
  },
  {
    name: "Paula's Choice 2% BHA Liquid Exfoliant",
    type: "Exfoliant",
    targets: ["acne", "blackheads", "large_pores", "uneven_tone"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Salicylic Acid 2%", "Green Tea Extract"],
    description: "A leave-on exfoliant that unclogs pores, smooths wrinkles, and evens skin tone.",
    price: "$32",
    rating: 4.7,
  },
  {
    name: "La Roche-Posay Effaclar Duo",
    type: "Treatment",
    targets: ["acne", "blackheads", "large_pores", "oily_skin"],
    skinTypes: ["oily", "combination"],
    keyIngredients: ["Benzoyl Peroxide 5.5%", "Lipo Hydroxy Acid"],
    description: "Dual-action acne treatment that targets blemishes and prevents new breakouts.",
    price: "$30",
    rating: 4.4,
  },
  // Dark Spots / Hyperpigmentation
  {
    name: "The Ordinary Vitamin C Suspension 23%",
    type: "Serum",
    targets: ["dark_spots", "uneven_tone", "dullness", "sun_damage"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["L-Ascorbic Acid 23%", "HA Spheres"],
    description: "A high-strength vitamin C formula that brightens skin and fades dark spots.",
    price: "$6",
    rating: 4.3,
  },
  {
    name: "Good Molecules Discoloration Correcting Serum",
    type: "Serum",
    targets: ["dark_spots", "uneven_tone", "scars"],
    skinTypes: ["oily", "combination", "normal", "dry", "sensitive"],
    keyIngredients: ["Tranexamic Acid 3%", "Niacinamide 4%", "Kojic Acid"],
    description: "Targets stubborn dark spots and post-acne marks with a gentle yet effective formula.",
    price: "$14",
    rating: 4.6,
  },
  {
    name: "Murad Rapid Dark Spot Correcting Serum",
    type: "Serum",
    targets: ["dark_spots", "uneven_tone", "sun_damage"],
    skinTypes: ["oily", "combination", "normal", "dry"],
    keyIngredients: ["Resorcinol", "Glycolic Acid", "Tranexamic Acid"],
    description: "Clinical-strength serum that visibly reduces dark spots in as little as one week.",
    price: "$72",
    rating: 4.4,
  },
  // Wrinkles / Anti-Aging
  {
    name: "The Ordinary Retinol 0.5% in Squalane",
    type: "Serum",
    targets: ["wrinkles", "uneven_tone", "large_pores", "dullness"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Retinol 0.5%", "Squalane"],
    description: "A moderate-strength retinol serum for reducing fine lines and improving skin texture.",
    price: "$6",
    rating: 4.3,
  },
  {
    name: "RoC Retinol Correxion Deep Wrinkle Night Cream",
    type: "Moisturizer",
    targets: ["wrinkles", "dark_spots", "dullness"],
    skinTypes: ["normal", "dry", "combination"],
    keyIngredients: ["Retinol", "Mineral Complex"],
    description: "Clinically proven to visibly reduce wrinkles and brighten skin overnight.",
    price: "$25",
    rating: 4.4,
  },
  {
    name: "Neutrogena Rapid Wrinkle Repair Serum",
    type: "Serum",
    targets: ["wrinkles", "dark_spots", "uneven_tone"],
    skinTypes: ["oily", "combination", "normal", "dry"],
    keyIngredients: ["Retinol SA", "Glucose Complex", "Hyaluronic Acid"],
    description: "Fast-acting retinol serum that visibly reduces wrinkles and evens skin tone.",
    price: "$22",
    rating: 4.3,
  },
  // Dry Skin
  {
    name: "CeraVe Moisturizing Cream",
    type: "Moisturizer",
    targets: ["dry_skin", "sensitivity", "eczema"],
    skinTypes: ["dry", "normal", "sensitive"],
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "MVE Technology"],
    description: "Rich, non-greasy moisturizer that provides 24-hour hydration and restores the skin barrier.",
    price: "$16",
    rating: 4.7,
  },
  {
    name: "The Ordinary Hyaluronic Acid 2% + B5",
    type: "Serum",
    targets: ["dry_skin", "dullness", "wrinkles"],
    skinTypes: ["oily", "combination", "normal", "dry", "sensitive"],
    keyIngredients: ["Hyaluronic Acid", "Vitamin B5"],
    description: "A lightweight hydrating serum with multiple weights of hyaluronic acid for deep hydration.",
    price: "$8",
    rating: 4.5,
  },
  {
    name: "La Roche-Posay Toleriane Double Repair Moisturizer",
    type: "Moisturizer",
    targets: ["dry_skin", "sensitivity", "redness"],
    skinTypes: ["dry", "normal", "sensitive"],
    keyIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Thermal Water"],
    description: "Restores the skin barrier and provides long-lasting moisture for sensitive skin.",
    price: "$20",
    rating: 4.6,
  },
  // Oily Skin
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    type: "Serum",
    targets: ["oily_skin", "large_pores", "acne", "uneven_tone"],
    skinTypes: ["oily", "combination"],
    keyIngredients: ["Niacinamide 10%", "Zinc PCA 1%"],
    description: "Controls sebum production and minimizes pore appearance with a lightweight formula.",
    price: "$6",
    rating: 4.5,
  },
  {
    name: "Neutrogena Hydro Boost Water Gel",
    type: "Moisturizer",
    targets: ["oily_skin", "dry_skin", "dullness"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Hyaluronic Acid", "Olive Extract"],
    description: "Oil-free, water-based gel moisturizer that hydrates without clogging pores.",
    price: "$20",
    rating: 4.5,
  },
  // Dark Circles
  {
    name: "CeraVe Eye Repair Cream",
    type: "Eye Cream",
    targets: ["dark_circles", "wrinkles"],
    skinTypes: ["oily", "combination", "normal", "dry", "sensitive"],
    keyIngredients: ["Ceramides", "Niacinamide", "Marine & Botanical Complex"],
    description: "Reduces dark circles and puffiness while strengthening the delicate under-eye skin.",
    price: "$15",
    rating: 4.3,
  },
  {
    name: "The INKEY List Caffeine Eye Cream",
    type: "Eye Cream",
    targets: ["dark_circles"],
    skinTypes: ["oily", "combination", "normal", "dry", "sensitive"],
    keyIngredients: ["Caffeine", "Matrixyl Peptide"],
    description: "Depuffs and brightens under-eyes with a fast-absorbing caffeine formula.",
    price: "$10",
    rating: 4.2,
  },
  // Redness / Rosacea
  {
    name: "Dr. Jart+ Cicapair Tiger Grass Cream",
    type: "Moisturizer",
    targets: ["redness", "sensitivity", "dry_skin"],
    skinTypes: ["dry", "normal", "sensitive"],
    keyIngredients: ["Centella Asiatica", "Niacinamide", "Madecassoside"],
    description: "Calms redness and repairs the skin barrier with soothing centella asiatica.",
    price: "$48",
    rating: 4.5,
  },
  {
    name: "Azelaic Acid Suspension 10% (The Ordinary)",
    type: "Treatment",
    targets: ["redness", "acne", "uneven_tone", "dark_spots"],
    skinTypes: ["oily", "combination", "normal", "sensitive"],
    keyIngredients: ["Azelaic Acid 10%"],
    description: "Brightens skin, reduces redness, and fights blemishes with azelaic acid.",
    price: "$8",
    rating: 4.4,
  },
  // Sun Damage
  {
    name: "EltaMD UV Clear Broad-Spectrum SPF 46",
    type: "Sunscreen",
    targets: ["sun_damage", "acne", "redness", "dark_spots"],
    skinTypes: ["oily", "combination", "normal", "dry", "sensitive"],
    keyIngredients: ["Zinc Oxide 9%", "Niacinamide", "Hyaluronic Acid"],
    description: "Lightweight, oil-free sunscreen that calms and protects acne-prone and sensitive skin.",
    price: "$37",
    rating: 4.7,
  },
  {
    name: "La Roche-Posay Anthelios Melt-in Milk SPF 100",
    type: "Sunscreen",
    targets: ["sun_damage"],
    skinTypes: ["oily", "combination", "normal", "dry"],
    keyIngredients: ["Cell-Ox Shield Technology", "Antioxidants"],
    description: "Ultra-high protection sunscreen with a lightweight, non-greasy finish.",
    price: "$36",
    rating: 4.6,
  },
  // Dullness
  {
    name: "Pixi Glow Tonic",
    type: "Toner",
    targets: ["dullness", "uneven_tone", "large_pores"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Glycolic Acid 5%", "Aloe Vera", "Ginseng"],
    description: "An exfoliating toner that reveals brighter, smoother skin with each use.",
    price: "$15",
    rating: 4.4,
  },
  // Sensitivity / Eczema
  {
    name: "Vanicream Gentle Facial Cleanser",
    type: "Cleanser",
    targets: ["sensitivity", "eczema", "redness", "dry_skin"],
    skinTypes: ["dry", "normal", "sensitive"],
    keyIngredients: ["No dyes, fragrance, or parabens"],
    description: "Ultra-gentle cleanser formulated for the most sensitive and eczema-prone skin.",
    price: "$9",
    rating: 4.6,
  },
  {
    name: "Aveeno Eczema Therapy Moisturizing Cream",
    type: "Moisturizer",
    targets: ["eczema", "dry_skin", "sensitivity"],
    skinTypes: ["dry", "sensitive"],
    keyIngredients: ["Colloidal Oatmeal 1%", "Ceramides"],
    description: "Clinically proven to soothe eczema-prone skin and strengthen the skin barrier.",
    price: "$15",
    rating: 4.5,
  },
  // Scars
  {
    name: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    type: "Treatment",
    targets: ["scars", "uneven_tone", "dullness", "blackheads"],
    skinTypes: ["oily", "combination", "normal"],
    keyIngredients: ["Glycolic Acid 30%", "Salicylic Acid 2%", "Tasmanian Pepperberry"],
    description: "A 10-minute exfoliating mask that dramatically improves skin texture and radiance.",
    price: "$8",
    rating: 4.6,
  },
  {
    name: "Bio-Oil Skincare Oil",
    type: "Treatment",
    targets: ["scars", "uneven_tone", "dry_skin"],
    skinTypes: ["normal", "dry", "combination"],
    keyIngredients: ["PurCellin Oil", "Vitamin A", "Vitamin E", "Calendula Oil"],
    description: "Specialist skincare oil that helps improve the appearance of scars and uneven skin tone.",
    price: "$14",
    rating: 4.3,
  },
];

function getRecommendations(problemIds, skinType) {
  const scored = PRODUCTS.map((product) => {
    let score = 0;

    // Score based on how many selected problems this product targets
    const matchedProblems = product.targets.filter((t) => problemIds.includes(t));
    score += matchedProblems.length * 10;

    // Bonus if skin type matches
    if (skinType && product.skinTypes.includes(skinType)) {
      score += 3;
    }

    // Bonus for rating
    score += product.rating;

    return { ...product, score, matchedProblems };
  });

  // Filter to products that match at least one problem
  const relevant = scored.filter((p) => p.matchedProblems.length > 0);

  // Sort by score descending
  relevant.sort((a, b) => b.score - a.score);

  // Group by product type for a routine
  const routine = {};
  for (const product of relevant) {
    if (!routine[product.type]) {
      routine[product.type] = [];
    }
    routine[product.type].push(product);
  }

  // Take top 2 per category
  const finalRoutine = {};
  for (const [type, products] of Object.entries(routine)) {
    finalRoutine[type] = products.slice(0, 2);
  }

  return {
    routine: finalRoutine,
    topPicks: relevant.slice(0, 5),
  };
}

module.exports = { getRecommendations, SKIN_PROBLEMS, PRODUCTS };
