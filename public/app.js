document.addEventListener("DOMContentLoaded", () => {
  const problemsGrid = document.getElementById("problemsGrid");
  const skinTypeGrid = document.getElementById("skinTypeGrid");
  const btnRecommend = document.getElementById("btnRecommend");
  const resultsSection = document.getElementById("results");
  const topPicksContainer = document.getElementById("topPicks");
  const routineContainer = document.getElementById("routineContainer");
  const btnReset = document.getElementById("btnReset");

  let selectedSkinType = null;
  let selectedProblems = new Set();

  // Load skin problems from API
  fetch("/api/problems")
    .then((res) => res.json())
    .then((problems) => {
      problems.forEach((problem) => {
        const btn = document.createElement("button");
        btn.className = "problem-btn";
        btn.dataset.id = problem.id;
        btn.innerHTML = `
          <span class="icon">${problem.icon}</span>
          <span>${problem.label}</span>
          <span class="check-mark">&#10003;</span>
        `;
        btn.addEventListener("click", () => toggleProblem(btn, problem.id));
        problemsGrid.appendChild(btn);
      });
    });

  // Skin type selection
  skinTypeGrid.querySelectorAll(".skin-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      skinTypeGrid.querySelectorAll(".skin-type-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSkinType = btn.dataset.type;
      updateButton();
    });
  });

  function toggleProblem(btn, id) {
    if (selectedProblems.has(id)) {
      selectedProblems.delete(id);
      btn.classList.remove("active");
    } else {
      selectedProblems.add(id);
      btn.classList.add("active");
    }
    updateButton();
  }

  function updateButton() {
    btnRecommend.disabled = selectedProblems.size === 0;
  }

  // Smooth scroll for hero CTA
  const heroCta = document.querySelector(".hero-cta");
  if (heroCta) {
    heroCta.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("step-skin-type").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Get recommendations
  btnRecommend.addEventListener("click", async () => {
    const btnText = btnRecommend.innerHTML;
    btnRecommend.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      Analyzing your skin profile...
    `;
    btnRecommend.disabled = true;

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problems: Array.from(selectedProblems),
          skinType: selectedSkinType,
        }),
      });

      const data = await res.json();
      renderResults(data);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      btnRecommend.innerHTML = btnText;
      btnRecommend.disabled = false;
    }
  });

  function renderResults(data) {
    resultsSection.classList.remove("hidden");

    // Top Picks
    topPicksContainer.innerHTML = "";
    data.topPicks.forEach((product, i) => {
      const card = createProductCard(product);
      card.style.animationDelay = `${i * 0.1}s`;
      card.classList.add("fade-in");
      topPicksContainer.appendChild(card);
    });

    // Routine
    routineContainer.innerHTML = "";
    const typeOrder = ["Cleanser", "Toner", "Exfoliant", "Serum", "Treatment", "Eye Cream", "Moisturizer", "Sunscreen"];
    const sortedTypes = Object.keys(data.routine).sort(
      (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
    );

    sortedTypes.forEach((type, idx) => {
      const category = document.createElement("div");
      category.className = "routine-category fade-in";
      category.style.animationDelay = `${idx * 0.1}s`;

      const header = document.createElement("div");
      header.className = "routine-category-header";
      header.innerHTML = `<span class="routine-step-num">${idx + 1}</span><h4>${type}</h4>`;
      category.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "products-grid";
      data.routine[type].forEach((product) => {
        grid.appendChild(createProductCard(product));
      });
      category.appendChild(grid);
      routineContainer.appendChild(category);
    });

    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const fullStars = Math.floor(product.rating);
    const hasHalf = product.rating % 1 >= 0.5;
    const starsStr = "&#9733;".repeat(fullStars) + (hasHalf ? "&#189;" : "");

    let matchedHtml = "";
    if (product.matchedProblems && product.matchedProblems.length > 0) {
      const tags = product.matchedProblems
        .map((p) => `<span class="matched-tag">&#10003; ${formatProblemId(p)}</span>`)
        .join("");
      matchedHtml = `<div class="matched-problems">${tags}</div>`;
    }

    const imageUrl = product.image || "";

    card.innerHTML = `
      <div class="product-card-image img-loading">
        <span class="product-type-badge">${product.type}</span>
        <img src="${imageUrl}" alt="${product.name}" loading="lazy" onload="this.parentElement.classList.remove('img-loading')" onerror="this.style.display='none';this.parentElement.classList.remove('img-loading');" />
      </div>
      <div class="product-card-body">
        <h4>${product.name}</h4>
        <p class="product-desc">${product.description}</p>
        <div class="product-meta">
          <span class="price">${product.price}</span>
          <span class="rating">
            <span class="rating-stars">${starsStr}</span>
            ${product.rating}
          </span>
        </div>
        <div class="ingredients">
          ${product.keyIngredients.map((i) => `<span class="ingredient-tag">${i}</span>`).join("")}
        </div>
        ${matchedHtml}
      </div>
    `;

    return card;
  }

  function formatProblemId(id) {
    return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Reset
  btnReset.addEventListener("click", () => {
    selectedProblems.clear();
    selectedSkinType = null;
    document.querySelectorAll(".problem-btn, .skin-type-btn").forEach((b) => b.classList.remove("active"));
    resultsSection.classList.add("hidden");
    btnRecommend.disabled = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
