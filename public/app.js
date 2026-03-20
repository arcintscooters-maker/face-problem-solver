document.addEventListener("DOMContentLoaded", () => {
  const problemsGrid = document.getElementById("problemsGrid");
  const skinTypeGrid = document.getElementById("skinTypeGrid");
  const btnRecommend = document.getElementById("btnRecommend");
  const resultsSection = document.getElementById("results");
  const topPicksContainer = document.getElementById("topPicks");
  const routineContainer = document.getElementById("routineContainer");
  const btnReset = document.getElementById("btnReset");
  const locationBar = document.getElementById("locationBar");
  const storesContainer = document.getElementById("storesContainer");
  const locationText = document.getElementById("locationText");

  let selectedSkinType = null;
  let selectedProblems = new Set();
  let userCountry = null;
  let storeData = null;

  // Detect user location via free IP geolocation
  detectLocation();

  async function detectLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.country_code) {
        userCountry = data.country_code;
        loadStores(userCountry);
      }
    } catch {
      // Fallback: try another service
      try {
        const res = await fetch("https://ip2c.org/s");
        const text = await res.text();
        const parts = text.split(";");
        if (parts.length >= 2 && parts[1]) {
          userCountry = parts[1];
          loadStores(userCountry);
        }
      } catch {
        // Silent fail — stores section just won't show
      }
    }
  }

  async function loadStores(country) {
    try {
      const res = await fetch(`/api/stores?country=${encodeURIComponent(country)}`);
      storeData = await res.json();
    } catch {
      // Silent fail
    }
  }

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

    // Where to buy section
    renderStores();

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

  function renderStores() {
    if (!storeData || !storeData.stores) {
      locationBar.classList.add("hidden");
      return;
    }

    locationBar.classList.remove("hidden");
    locationText.textContent = storeData.region;
    storesContainer.innerHTML = "";

    storeData.stores.forEach((store) => {
      const el = document.createElement("a");
      el.className = "store-card" + (store.cheapest ? " cheapest" : "");
      el.href = store.searchUrl;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      el.innerHTML = `
        ${store.cheapest ? '<span class="cheapest-badge">Cheapest</span>' : ""}
        <div class="store-icon">${getStoreIcon(store.icon)}</div>
        <div class="store-info">
          <span class="store-name">${store.name}</span>
          <span class="store-note">${store.note}</span>
        </div>
        <svg class="store-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
      `;
      storesContainer.appendChild(el);
    });
  }

  function getStoreIcon(icon) {
    const icons = {
      amazon: "&#x1F4E6;",
      iherb: "&#x1F33F;",
      target: "&#x1F3AF;",
      ulta: "&#x1F484;",
      cvs: "&#x1F3E5;",
      shoppers: "&#x1F6D2;",
      well: "&#x1F33F;",
      ordinary: "&#x1F9EA;",
      boots: "&#x1F462;",
      superdrug: "&#x1F48A;",
      lookfantastic: "&#x2728;",
      dm: "&#x1F6D2;",
      douglas: "&#x1F338;",
      rossmann: "&#x1F48A;",
      leclerc: "&#x1F6D2;",
      sephora: "&#x1F484;",
      pharmacy: "&#x1F48A;",
      nykaa: "&#x1F484;",
      flipkart: "&#x1F6D2;",
      dermaco: "&#x1F9EA;",
      cosme: "&#x2728;",
      matsukiyo: "&#x1F48A;",
      rakuten: "&#x1F6D2;",
      oliveyoung: "&#x1F33F;",
      coupang: "&#x1F4E6;",
      chemist: "&#x1F48A;",
      priceline: "&#x1F48A;",
      adore: "&#x2728;",
      life: "&#x1F48A;",
      noon: "&#x1F6D2;",
      faces: "&#x1F484;",
      nahdi: "&#x1F48A;",
      shopee: "&#x1F6D2;",
      lazada: "&#x1F4E6;",
      watsons: "&#x1F48A;",
      beautymnl: "&#x1F484;",
      guardian: "&#x1F48A;",
      jumia: "&#x1F6D2;",
      konga: "&#x1F4E6;",
      clicks: "&#x1F48A;",
      dischem: "&#x1F48A;",
      takealot: "&#x1F6D2;",
      beleza: "&#x1F484;",
      drogaria: "&#x1F48A;",
      yesstyle: "&#x2728;",
    };
    return icons[icon] || "&#x1F6D2;";
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

    // Try direct URL first, fall back to proxy if blocked
    const directUrl = product.image || "";
    const proxyUrl = product.image ? `/api/image-proxy?url=${encodeURIComponent(product.image)}` : "";
    const productInitials = product.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

    // Build buy link if store data available
    let buyBtnHtml = "";
    if (storeData && storeData.stores && storeData.stores.length > 0) {
      const cheapest = storeData.stores.find(s => s.cheapest) || storeData.stores[0];
      const searchQuery = encodeURIComponent(product.name);
      buyBtnHtml = `
        <a href="${cheapest.searchUrl}${searchQuery}" target="_blank" rel="noopener noreferrer" class="buy-btn">
          Buy at ${cheapest.name}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
        </a>
      `;
    }

    card.innerHTML = `
      <div class="product-card-image">
        <span class="product-type-badge">${product.type}</span>
        <div class="product-img-placeholder" id="placeholder-${Math.random().toString(36).slice(2)}">${productInitials}</div>
        <img src="${directUrl}" alt="${product.name}" loading="lazy"
          onload="this.style.opacity='1';this.previousElementSibling.style.display='none';"
          onerror="if(this.dataset.retry!=='1'&&'${proxyUrl}'){this.dataset.retry='1';this.src='${proxyUrl}';}else{this.style.display='none';}" />
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
        ${buyBtnHtml}
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
    locationBar.classList.add("hidden");
    btnRecommend.disabled = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
