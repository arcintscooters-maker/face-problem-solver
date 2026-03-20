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

  // ─── Location detection ───
  detectLocation();

  async function detectLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.country_code) { userCountry = data.country_code; loadStores(userCountry); }
    } catch {
      try {
        const res = await fetch("https://ip2c.org/s");
        const text = await res.text();
        const parts = text.split(";");
        if (parts.length >= 2 && parts[1]) { userCountry = parts[1]; loadStores(userCountry); }
      } catch {}
    }
  }

  async function loadStores(country) {
    try {
      const res = await fetch(`/api/stores?country=${encodeURIComponent(country)}`);
      storeData = await res.json();
    } catch {}
  }

  // ─── Load skin problems ───
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

  // ─── Skin type selection ───
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

  // Programmatically select problems (used by scanner)
  function selectProblemById(id) {
    const btn = problemsGrid.querySelector(`[data-id="${id}"]`);
    if (btn && !selectedProblems.has(id)) {
      selectedProblems.add(id);
      btn.classList.add("active");
    }
    updateButton();
  }

  // ─── Face Scanner ───
  const videoEl = document.getElementById("cameraFeed");
  const canvasEl = document.getElementById("scannerCanvas");
  const capturedImg = document.getElementById("capturedPhoto");
  const scannerOverlay = document.getElementById("scannerOverlay");
  const scannerPlaceholder = document.getElementById("scannerPlaceholder");
  const btnStartCamera = document.getElementById("btnStartCamera");
  const btnCapture = document.getElementById("btnCapture");
  const btnRetake = document.getElementById("btnRetake");
  const scanResults = document.getElementById("scanResults");
  const scanFindings = document.getElementById("scanFindings");
  const btnUseResults = document.getElementById("btnUseResults");
  const btnScanAgain = document.getElementById("btnScanAgain");
  const scannerPrompt = document.getElementById("scannerPrompt");

  let cameraActive = false;

  btnStartCamera.addEventListener("click", async () => {
    try {
      await FaceScanner.startCamera(videoEl);
      cameraActive = true;
      videoEl.style.display = "block";
      scannerPlaceholder.style.display = "none";
      scannerOverlay.style.display = "flex";
      btnStartCamera.classList.add("hidden");
      btnCapture.classList.remove("hidden");
    } catch (err) {
      alert("Could not access camera. Please allow camera permission and try again.");
    }
  });

  btnCapture.addEventListener("click", () => {
    if (!cameraActive) return;

    // Capture frame
    const imageData = FaceScanner.capture(videoEl, canvasEl);

    // Show captured image
    capturedImg.src = canvasEl.toDataURL("image/jpeg");
    capturedImg.style.display = "block";
    videoEl.style.display = "none";
    scannerOverlay.style.display = "none";
    FaceScanner.stopCamera(videoEl);
    cameraActive = false;

    btnCapture.classList.add("hidden");
    btnRetake.classList.remove("hidden");

    // Analyze
    const concerns = FaceScanner.analyze(imageData);
    showScanResults(concerns);
  });

  btnRetake.addEventListener("click", () => {
    resetScanner();
    btnStartCamera.click();
  });

  btnScanAgain.addEventListener("click", () => {
    resetScanner();
    scanResults.classList.add("hidden");
    scannerPrompt.style.display = "";
  });

  function resetScanner() {
    if (cameraActive) FaceScanner.stopCamera(videoEl);
    cameraActive = false;
    videoEl.style.display = "none";
    capturedImg.style.display = "none";
    scannerOverlay.style.display = "none";
    scannerPlaceholder.style.display = "";
    btnStartCamera.classList.remove("hidden");
    btnCapture.classList.add("hidden");
    btnRetake.classList.add("hidden");
  }

  function showScanResults(concerns) {
    scanResults.classList.remove("hidden");
    scannerPrompt.style.display = "none";
    scanFindings.innerHTML = "";

    concerns.forEach((c) => {
      const el = document.createElement("div");
      el.className = "finding-item";
      const barColor = c.confidence > 70 ? "var(--primary)" : c.confidence > 50 ? "#f9a825" : "var(--text-muted)";
      el.innerHTML = `
        <div class="finding-label">${c.label}</div>
        <div class="finding-bar-track">
          <div class="finding-bar" style="width:${c.confidence}%;background:${barColor}"></div>
        </div>
        <div class="finding-pct">${c.confidence}%</div>
      `;
      scanFindings.appendChild(el);
    });

    // Store detected concerns for "Use These Results"
    btnUseResults.onclick = () => {
      // Clear existing selections
      selectedProblems.clear();
      problemsGrid.querySelectorAll(".problem-btn").forEach((b) => b.classList.remove("active"));

      // Select detected concerns
      concerns.forEach((c) => selectProblemById(c.id));

      // Switch to concerns tab on mobile
      switchStep(2);

      // Scroll to concerns
      document.getElementById("step-problems").scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  // ─── Stepper tabs (mobile) ───
  const stepperTabs = document.getElementById("stepperTabs");
  if (stepperTabs) {
    stepperTabs.querySelectorAll(".stepper-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchStep(parseInt(tab.dataset.step)));
    });
  }

  const btnNextStep = document.getElementById("btnNextStep");
  if (btnNextStep) {
    btnNextStep.addEventListener("click", () => switchStep(2));
  }

  function switchStep(step) {
    document.querySelectorAll(".stepper-tab").forEach((t) =>
      t.classList.toggle("active", parseInt(t.dataset.step) === step)
    );
    document.querySelectorAll(".step-panel").forEach((p) =>
      p.classList.toggle("active", parseInt(p.dataset.step) === step)
    );
  }

  // ─── Results tabs (mobile) ───
  const resultsTabs = document.getElementById("resultsTabs");
  if (resultsTabs) {
    resultsTabs.querySelectorAll(".results-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.rtab;
        resultsTabs.querySelectorAll(".results-tab").forEach((t) =>
          t.classList.toggle("active", t.dataset.rtab === target)
        );
        document.querySelectorAll(".results-panel").forEach((p) => {
          if (p.dataset.rtab === target) {
            p.classList.add("active");
            p.classList.remove("hidden");
          } else {
            p.classList.remove("active");
          }
        });
      });
    });
  }

  // ─── Hero buttons ───
  document.getElementById("heroScanBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("scanner-section").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("heroManualBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("step-skin-type").scrollIntoView({ behavior: "smooth" });
  });

  // ─── Get recommendations ───
  btnRecommend.addEventListener("click", async () => {
    const btnText = btnRecommend.innerHTML;
    btnRecommend.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      Analyzing...
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
    } catch {
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

    // Stores
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
      data.routine[type].forEach((product) => grid.appendChild(createProductCard(product)));
      category.appendChild(grid);
      routineContainer.appendChild(category);
    });

    // Reset results tabs to "picks"
    if (resultsTabs) {
      resultsTabs.querySelector('[data-rtab="picks"]')?.click();
    }

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
      amazon: "&#x1F4E6;", iherb: "&#x1F33F;", target: "&#x1F3AF;", ulta: "&#x1F484;",
      cvs: "&#x1F3E5;", shoppers: "&#x1F6D2;", well: "&#x1F33F;", ordinary: "&#x1F9EA;",
      boots: "&#x1F462;", superdrug: "&#x1F48A;", lookfantastic: "&#x2728;",
      dm: "&#x1F6D2;", douglas: "&#x1F338;", rossmann: "&#x1F48A;",
      leclerc: "&#x1F6D2;", sephora: "&#x1F484;", pharmacy: "&#x1F48A;",
      nykaa: "&#x1F484;", flipkart: "&#x1F6D2;", dermaco: "&#x1F9EA;",
      cosme: "&#x2728;", matsukiyo: "&#x1F48A;", rakuten: "&#x1F6D2;",
      oliveyoung: "&#x1F33F;", coupang: "&#x1F4E6;", chemist: "&#x1F48A;",
      priceline: "&#x1F48A;", adore: "&#x2728;", life: "&#x1F48A;",
      noon: "&#x1F6D2;", faces: "&#x1F484;", nahdi: "&#x1F48A;",
      shopee: "&#x1F6D2;", lazada: "&#x1F4E6;", watsons: "&#x1F48A;",
      beautymnl: "&#x1F484;", guardian: "&#x1F48A;", jumia: "&#x1F6D2;",
      konga: "&#x1F4E6;", clicks: "&#x1F48A;", dischem: "&#x1F48A;",
      takealot: "&#x1F6D2;", beleza: "&#x1F484;", drogaria: "&#x1F48A;",
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

    const directUrl = product.image || "";
    const proxyUrl = product.image ? `/api/image-proxy?url=${encodeURIComponent(product.image)}` : "";
    const productInitials = product.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

    let buyBtnHtml = "";
    if (storeData && storeData.stores && storeData.stores.length > 0) {
      const cheapest = storeData.stores.find((s) => s.cheapest) || storeData.stores[0];
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
        <div class="product-img-placeholder">${productInitials}</div>
        <img src="${directUrl}" alt="${product.name}" loading="lazy"
          onload="this.style.opacity='1';this.previousElementSibling.style.display='none';"
          onerror="if(this.dataset.retry!=='1'&&'${proxyUrl}'){this.dataset.retry='1';this.src='${proxyUrl}';}else{this.style.display='none';}" />
      </div>
      <div class="product-card-body">
        <h4>${product.name}</h4>
        <p class="product-desc">${product.description}</p>
        <div class="product-meta">
          <span class="price">${product.price}</span>
          <span class="rating"><span class="rating-stars">${starsStr}</span> ${product.rating}</span>
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

  // ─── Reset ───
  btnReset.addEventListener("click", () => {
    selectedProblems.clear();
    selectedSkinType = null;
    document.querySelectorAll(".problem-btn, .skin-type-btn").forEach((b) => b.classList.remove("active"));
    resultsSection.classList.add("hidden");
    locationBar.classList.add("hidden");
    btnRecommend.disabled = true;
    resetScanner();
    scanResults.classList.add("hidden");
    scannerPrompt.style.display = "";
    switchStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
