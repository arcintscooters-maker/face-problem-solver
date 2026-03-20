// Face Scanner — uses camera + canvas pixel analysis to detect skin concerns
const FaceScanner = (() => {
  let stream = null;

  async function startCamera(videoEl) {
    if (stream) stopCamera(videoEl);
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
    });
    videoEl.srcObject = stream;
    await videoEl.play();
  }

  function stopCamera(videoEl) {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    videoEl.srcObject = null;
  }

  function capture(videoEl, canvasEl) {
    const w = videoEl.videoWidth;
    const h = videoEl.videoHeight;
    canvasEl.width = w;
    canvasEl.height = h;
    const ctx = canvasEl.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }

  // Analyze the captured image for skin concerns
  function analyze(imageData) {
    const { data, width, height } = imageData;

    // Define face zones (approximate percentages of image)
    const zones = {
      forehead: { x1: 0.25, y1: 0.08, x2: 0.75, y2: 0.30 },
      leftCheek: { x1: 0.05, y1: 0.35, x2: 0.35, y2: 0.70 },
      rightCheek: { x1: 0.65, y1: 0.35, x2: 0.95, y2: 0.70 },
      nose: { x1: 0.35, y1: 0.30, x2: 0.65, y2: 0.65 },
      chin: { x1: 0.30, y1: 0.70, x2: 0.70, y2: 0.92 },
      underEyeL: { x1: 0.15, y1: 0.30, x2: 0.40, y2: 0.42 },
      underEyeR: { x1: 0.60, y1: 0.30, x2: 0.85, y2: 0.42 },
    };

    const stats = {};
    for (const [name, z] of Object.entries(zones)) {
      stats[name] = analyzeZone(data, width, height, z);
    }

    // Determine concerns based on analysis
    const concerns = [];

    // Redness detection — high red channel relative to green/blue
    const avgRedness = avg([stats.leftCheek.redness, stats.rightCheek.redness, stats.nose.redness]);
    if (avgRedness > 0.38) {
      concerns.push({ id: "redness", confidence: Math.min(95, Math.round(avgRedness * 200)), label: "Redness / Rosacea" });
    }

    // Oily / shine detection — high brightness variance + high brightness in T-zone
    const tZoneShine = avg([stats.forehead.brightness, stats.nose.brightness]);
    const cheekBrightness = avg([stats.leftCheek.brightness, stats.rightCheek.brightness]);
    if (tZoneShine > 155 && tZoneShine - cheekBrightness > 12) {
      concerns.push({ id: "oily_skin", confidence: Math.min(90, Math.round((tZoneShine - cheekBrightness) * 3)), label: "Oily / Shiny Skin" });
    }

    // Dark circles — under-eye zones significantly darker than cheeks
    const underEyeDark = avg([stats.underEyeL.brightness, stats.underEyeR.brightness]);
    const cheekRef = avg([stats.leftCheek.brightness, stats.rightCheek.brightness]);
    if (cheekRef - underEyeDark > 15) {
      concerns.push({ id: "dark_circles", confidence: Math.min(88, Math.round((cheekRef - underEyeDark) * 2.5)), label: "Dark Circles Under Eyes" });
    }

    // Uneven tone — high brightness variance across zones
    const allBrightness = [stats.forehead.brightness, stats.leftCheek.brightness, stats.rightCheek.brightness, stats.nose.brightness, stats.chin.brightness];
    const brightnessRange = Math.max(...allBrightness) - Math.min(...allBrightness);
    if (brightnessRange > 20) {
      concerns.push({ id: "uneven_tone", confidence: Math.min(85, Math.round(brightnessRange * 2)), label: "Uneven Skin Tone" });
    }

    // Dark spots — high color variance within zones
    const spotScore = avg([stats.leftCheek.colorVariance, stats.rightCheek.colorVariance, stats.forehead.colorVariance]);
    if (spotScore > 22) {
      concerns.push({ id: "dark_spots", confidence: Math.min(82, Math.round(spotScore * 2)), label: "Dark Spots / Hyperpigmentation" });
    }

    // Texture / acne — high local contrast (edge detection proxy)
    const textureScore = avg([stats.forehead.texture, stats.leftCheek.texture, stats.rightCheek.texture, stats.chin.texture]);
    if (textureScore > 28) {
      concerns.push({ id: "acne", confidence: Math.min(80, Math.round(textureScore * 1.8)), label: "Acne / Breakouts" });
    }

    // Large pores — high texture specifically in nose and cheeks
    const poreScore = avg([stats.nose.texture, stats.leftCheek.texture, stats.rightCheek.texture]);
    if (poreScore > 25) {
      concerns.push({ id: "large_pores", confidence: Math.min(78, Math.round(poreScore * 1.6)), label: "Large Pores" });
    }

    // Dull skin — low overall brightness + low saturation
    const avgBright = avg(allBrightness);
    const avgSat = avg([stats.forehead.saturation, stats.leftCheek.saturation, stats.rightCheek.saturation]);
    if (avgBright < 120 && avgSat < 30) {
      concerns.push({ id: "dullness", confidence: Math.min(75, Math.round((140 - avgBright) + (35 - avgSat))), label: "Dull / Tired Skin" });
    }

    // Dry skin indicators — low saturation in cheeks
    const cheekSat = avg([stats.leftCheek.saturation, stats.rightCheek.saturation]);
    if (cheekSat < 22 && cheekBrightness < 140) {
      concerns.push({ id: "dry_skin", confidence: Math.min(72, Math.round((25 - cheekSat) * 4)), label: "Dry / Flaky Skin" });
    }

    // Sort by confidence
    concerns.sort((a, b) => b.confidence - a.confidence);

    // Always return at least something helpful
    if (concerns.length === 0) {
      concerns.push({ id: "dullness", confidence: 50, label: "General Skin Maintenance" });
    }

    return concerns;
  }

  function analyzeZone(data, imgW, imgH, zone) {
    const x1 = Math.floor(zone.x1 * imgW);
    const y1 = Math.floor(zone.y1 * imgH);
    const x2 = Math.floor(zone.x2 * imgW);
    const y2 = Math.floor(zone.y2 * imgH);

    let totalR = 0, totalG = 0, totalB = 0;
    let count = 0;
    const brightnesses = [];
    const reds = [];
    let textureSum = 0;
    let satSum = 0;

    for (let y = y1; y < y2; y += 2) {
      for (let x = x1; x < x2; x += 2) {
        const i = (y * imgW + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        totalR += r; totalG += g; totalB += b;
        const bright = (r + g + b) / 3;
        brightnesses.push(bright);

        // Redness ratio
        reds.push(r / (g + b + 1));

        // Saturation approximation
        const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
        satSum += maxC - minC;

        // Texture: compare with neighbor pixel
        if (x + 2 < x2) {
          const ni = (y * imgW + x + 2) * 4;
          const nBright = (data[ni] + data[ni + 1] + data[ni + 2]) / 3;
          textureSum += Math.abs(bright - nBright);
        }

        count++;
      }
    }

    if (count === 0) count = 1;

    const avgBrightness = (totalR + totalG + totalB) / (3 * count);
    const avgRedness = reds.reduce((a, b) => a + b, 0) / count;

    // Color variance
    let varSum = 0;
    for (const b of brightnesses) {
      varSum += (b - avgBrightness) ** 2;
    }
    const colorVariance = Math.sqrt(varSum / count);

    return {
      brightness: avgBrightness,
      redness: avgRedness,
      colorVariance,
      texture: textureSum / count,
      saturation: satSum / count,
    };
  }

  function avg(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  return { startCamera, stopCamera, capture, analyze };
})();
