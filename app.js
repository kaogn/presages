const cityPool = [
  "Paris, France",
  "Lyon, France",
  "Marseille, France",
  "Bruxelles, Belgique",
  "Genève, Suisse",
  "Montréal, Canada",
  "Québec, Canada",
  "Dakar, Sénégal",
  "Casablanca, Maroc",
  "Abidjan, Côte d'Ivoire",
  "Hanoï, Vietnam",
  "Ho Chi Minh Ville, Vietnam",
];

const westernSigns = [
  { name: "Capricorne", from: "12-22", to: "01-19" },
  { name: "Verseau", from: "01-20", to: "02-18" },
  { name: "Poissons", from: "02-19", to: "03-20" },
  { name: "Bélier", from: "03-21", to: "04-19" },
  { name: "Taureau", from: "04-20", to: "05-20" },
  { name: "Gémeaux", from: "05-21", to: "06-20" },
  { name: "Cancer", from: "06-21", to: "07-22" },
  { name: "Lion", from: "07-23", to: "08-22" },
  { name: "Vierge", from: "08-23", to: "09-22" },
  { name: "Balance", from: "09-23", to: "10-22" },
  { name: "Scorpion", from: "10-23", to: "11-21" },
  { name: "Sagittaire", from: "11-22", to: "12-21" },
];

const chineseAnimals = [
  "Rat",
  "Buffle",
  "Tigre",
  "Lapin",
  "Dragon",
  "Serpent",
  "Cheval",
  "Chèvre",
  "Singe",
  "Coq",
  "Chien",
  "Cochon",
];

const chineseElements = ["Bois", "Feu", "Terre", "Métal", "Eau"];
const canChiStems = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

const loadingMessages = [
  "Lecture des influences célestes…",
  "Alignement des cycles…",
  "Interprétation de votre énergie intérieure…",
  "Fusion des archétypes symboliques…",
];

const impactTemplates = [
  "Tu es faite pour ressentir profondément ce que les autres fuient.",
  "Ton intuition éclaire les zones que les autres n'osent pas regarder.",
  "Tu transformes le chaos émotionnel en vision claire et magnétique.",
  "Ta présence réveille les vérités dormantes chez ceux qui te croisent.",
];

const narrativeBank = {
  western: {
    feu: "Votre essence agit en pionnière, guidée par l'élan et la volonté.",
    terre: "Votre base intérieure recherche la cohérence, la stabilité et l'incarnation.",
    air: "Votre personnalité est mobile, mentale et orientée vers les idées vivantes.",
    eau: "Votre profondeur émotionnelle capte subtilement ce qui n'est pas dit.",
  },
  chinese: {
    Yang: "Votre tempérament avance avec franchise et expansion.",
    Yin: "Votre énergie rayonne par finesse, écoute et adaptation.",
  },
  cycle: [
    "Cycle de consolidation : matérialiser vos intuitions devient prioritaire.",
    "Cycle de mue : vos relations deviennent le miroir de votre évolution.",
    "Cycle d'ouverture : les opportunités émergent via des alliances inattendues.",
  ],
};

const compatMatrix = {
  Rat: { Dragon: 92, Singe: 90, Cheval: 48 },
  Buffle: { Serpent: 89, Coq: 87, Chèvre: 44 },
  Tigre: { Cheval: 90, Chien: 86, Singe: 46 },
  Lapin: { Chèvre: 91, Cochon: 88, Coq: 49 },
  Dragon: { Rat: 92, Singe: 87, Chien: 52 },
  Serpent: { Buffle: 89, Coq: 86, Cochon: 50 },
  Cheval: { Tigre: 90, Chèvre: 85, Rat: 48 },
  Chèvre: { Lapin: 91, Cochon: 86, Buffle: 44 },
  Singe: { Rat: 90, Dragon: 87, Tigre: 46 },
  Coq: { Buffle: 87, Serpent: 86, Lapin: 49 },
  Chien: { Tigre: 86, Cheval: 84, Dragon: 52 },
  Cochon: { Lapin: 88, Chèvre: 86, Serpent: 50 },
};

let primaryProfile = null;
let audioCtx;
let ambienceNode;

const citySuggestions = document.getElementById("citySuggestions");
const form = document.getElementById("astroForm");
const loadingSection = document.getElementById("loading");
const resultSection = document.getElementById("results");
const onboarding = document.getElementById("onboarding");
const loadingMessage = document.getElementById("loadingMessage");
const unknownTime = document.getElementById("unknownTime");
const birthTimeInput = form.querySelector("input[name='birthTime']");

cityPool.forEach((city) => {
  const option = document.createElement("option");
  option.value = city;
  citySuggestions.appendChild(option);
});

unknownTime.addEventListener("change", () => {
  birthTimeInput.disabled = unknownTime.checked;
  if (unknownTime.checked) birthTimeInput.value = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fd = new FormData(form);
  const payload = {
    firstName: fd.get("firstName").toString().trim(),
    birthDate: fd.get("birthDate").toString(),
    birthTime: unknownTime.checked ? null : fd.get("birthTime").toString() || null,
    birthPlace: fd.get("birthPlace").toString().trim(),
  };

  if (!payload.birthDate) return;

  onboarding.classList.add("hidden");
  loadingSection.classList.remove("hidden");

  await runImmersiveLoading();
  primaryProfile = buildProfile(payload);
  renderProfile(primaryProfile);

  loadingSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
});

function runImmersiveLoading() {
  const duration = 15000 + Math.floor(Math.random() * 15000);
  const step = Math.floor(duration / loadingMessages.length);

  return new Promise((resolve) => {
    let i = 0;
    loadingMessage.textContent = loadingMessages[i];
    const interval = setInterval(() => {
      i += 1;
      loadingMessage.textContent = loadingMessages[i % loadingMessages.length];
    }, step);

    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, duration);
  });
}

function buildProfile(payload) {
  const date = new Date(`${payload.birthDate}T12:00:00`);
  const [year, month, day] = payload.birthDate.split("-").map(Number);
  const western = getWesternSign(month, day);
  const moon = westernSigns[(westernSigns.findIndex((s) => s.name === western) + 4) % 12].name;
  const chinese = getChineseProfile(year);
  const vietnamese = getVietnameseCycle(year, month, day);
  const ascendant = payload.birthTime ? getAscendant(payload.birthTime, month) : null;

  const elementalType = toElement(western);
  const yinYang = year % 2 === 0 ? "Yang" : "Yin";
  const dominantEnergy = `${elementalType} ${chinese.element}`;

  const profileNarrative = `${narrativeBank.western[elementalType]}
${narrativeBank.chinese[yinYang]}
${narrativeBank.cycle[vietnamese.cycleIndex]}`;

  return {
    ...payload,
    western,
    moon,
    ascendant,
    chinese,
    vietnamese,
    dominantEnergy,
    impact: impactTemplates[(year + month + day) % impactTemplates.length],
    profileNarrative,
    planets: buildPlanets(year, month, day),
  };
}

function getWesternSign(month, day) {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const sign = westernSigns.find(({ from, to }) => (from <= to ? key >= from && key <= to : key >= from || key <= to));
  return sign?.name || "Capricorne";
}

function getChineseProfile(year) {
  const animal = chineseAnimals[(year - 4) % 12];
  const element = chineseElements[Math.floor(((year - 4) % 10) / 2)];
  return { animal, element };
}

function getVietnameseCycle(year, month, day) {
  const stem = canChiStems[(year + 6) % 10];
  const branch = chineseAnimals[(year - 4) % 12];
  const lifePath = ((day + month + year) % 9) + 1;
  return {
    canChi: `${stem} ${branch}`,
    cycleIndex: lifePath % 3,
    lifePath,
  };
}

function getAscendant(time, month) {
  const hour = Number(time.split(":")[0]);
  const index = Math.floor(((hour + month) % 24) / 2) % 12;
  return westernSigns[index].name;
}

function buildPlanets(year, month, day) {
  const pool = ["Mercure", "Vénus", "Mars", "Jupiter", "Saturne"];
  return pool.map((planet, i) => `${planet} en ${westernSigns[(year + month + day + i) % 12].name}`).join(" • ");
}

function toElement(sign) {
  if (["Bélier", "Lion", "Sagittaire"].includes(sign)) return "feu";
  if (["Taureau", "Vierge", "Capricorne"].includes(sign)) return "terre";
  if (["Gémeaux", "Balance", "Verseau"].includes(sign)) return "air";
  return "eau";
}

function renderProfile(profile) {
  document.getElementById("resultTitle").textContent = `${profile.firstName}, votre signature céleste`;
  document.getElementById("shortSummary").textContent = profile.profileNarrative;
  document.getElementById("westernResult").textContent = `Soleil ${profile.western} • Lune ${profile.moon}${
    profile.ascendant ? ` • Ascendant ${profile.ascendant}` : " • Ascendant : lecture adaptée (heure inconnue)"
  }. ${profile.planets}`;
  document.getElementById("chineseResult").textContent = `${profile.chinese.animal} de ${profile.chinese.element}. Tempérament orienté vers l'action consciente et la loyauté relationnelle.`;
  document.getElementById("vietnameseResult").textContent = `${profile.vietnamese.canChi}, chemin de vie ${profile.vietnamese.lifePath}. ${narrativeBank.cycle[profile.vietnamese.cycleIndex]}`;
  document.getElementById("impactPhrase").textContent = `“${profile.impact}”`;
}

const compatibilityDialog = document.getElementById("compatibilityDialog");
document.getElementById("openCompatibility").addEventListener("click", () => compatibilityDialog.showModal());
document.getElementById("closeCompatibility").addEventListener("click", () => compatibilityDialog.close());

const compatibilityForm = document.getElementById("compatibilityForm");
compatibilityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!primaryProfile) return;

  const fd = new FormData(compatibilityForm);
  const partnerDate = fd.get("birthDate2").toString();
  const [year, month, day] = partnerDate.split("-").map(Number);
  const chinese2 = getChineseProfile(year);

  const metrics = getCompatibilityMetrics(primaryProfile, chinese2, month + day);
  document.getElementById("compatibilityResult").classList.remove("hidden");
  document.getElementById("compatibilityTitle").textContent = `${primaryProfile.firstName} × ${fd
    .get("name2")
    .toString()} — ${metrics.total}/100`;
  document.getElementById("compatibilityTeaser").textContent =
    "Connexion intense avec un potentiel de croissance élevé. Le détail complet révèle vos points d'alignement et vos zones de vigilance.";
  drawRadar(metrics.dimensions);
});

function getCompatibilityMetrics(primary, chinese2, seed) {
  const base = compatMatrix[primary.chinese.animal]?.[chinese2.animal] ?? 68;
  const emotion = clamp(base + (seed % 9) - 4, 35, 97);
  const communication = clamp(base + (seed % 7) - 3, 30, 96);
  const values = clamp(base + (seed % 11) - 5, 32, 98);
  const attraction = clamp(base + (seed % 13) - 6, 34, 99);
  const stability = clamp(base + (seed % 5) - 2, 28, 94);
  const total = Math.round((emotion + communication + values + attraction + stability) / 5);

  return {
    total,
    dimensions: [
      ["Émotion", emotion],
      ["Communication", communication],
      ["Valeurs", values],
      ["Attraction", attraction],
      ["Stabilité", stability],
    ],
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function drawRadar(dimensions) {
  const canvas = document.getElementById("radarChart");
  const ctx = canvas.getContext("2d");
  const center = canvas.width / 2;
  const maxRadius = canvas.width * 0.35;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let level = 1; level <= 5; level++) {
    const r = (maxRadius / 5) * level;
    polygon(ctx, center, r, dimensions.length, "rgba(212,169,83,0.2)");
  }

  const points = dimensions.map(([, value], i) => {
    const angle = (-Math.PI / 2) + (i * (Math.PI * 2)) / dimensions.length;
    const radius = (value / 100) * maxRadius;
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius, angle];
  });

  ctx.beginPath();
  points.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = "rgba(255,204,125,0.35)";
  ctx.strokeStyle = "#ffcc7d";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f4efe4";
  ctx.font = "13px Inter";
  dimensions.forEach(([label], i) => {
    const a = (-Math.PI / 2) + (i * (Math.PI * 2)) / dimensions.length;
    ctx.fillText(label, center + Math.cos(a) * (maxRadius + 12) - 25, center + Math.sin(a) * (maxRadius + 12));
  });
}

function polygon(ctx, center, radius, sides, strokeStyle) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (-Math.PI / 2) + (i * (Math.PI * 2)) / sides;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

document.getElementById("unlockCompatibility").addEventListener("click", () => {
  alert("Paiement compatibilité à connecter (Stripe/Checkout) — 2,99€");
});

document.getElementById("buyPdf").addEventListener("click", () => {
  if (!primaryProfile) return;
  const doc = buildPdfText(primaryProfile);
  const blob = new Blob([doc], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `presages-premium-${primaryProfile.firstName.toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  alert("Prototype: remplacez ce flux par génération PDF parchemin + paiement 4,99€.");
});

function buildPdfText(profile) {
  return `PRÉSAGES PREMIUM\n\n1. Personnalité profonde\n${profile.profileNarrative}\n\n2. Amour & relations\nVotre dynamique affective se nourrit d'intensité consciente.\n\n3. Carrière & potentiel\nVous performez dans des environnements où vision et sens se rencontrent.\n\n4. Cycles de vie\n${profile.vietnamese.canChi} • Cycle ${profile.vietnamese.lifePath}\n\n5. Synthèse globale\n${profile.impact}`;
}

const shareCanvas = document.getElementById("shareCanvas");
document.getElementById("downloadPreview").addEventListener("click", () => shareOrDownload(false));
document.getElementById("sharePreview").addEventListener("click", () => shareOrDownload(true));

async function shareOrDownload(shareMode) {
  if (!primaryProfile) return;

  const ctx = shareCanvas.getContext("2d");
  ctx.fillStyle = "#090d20";
  ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);

  const gradient = ctx.createRadialGradient(500, 380, 60, 540, 560, 700);
  gradient.addColorStop(0, "rgba(255,204,125,0.34)");
  gradient.addColorStop(1, "rgba(255,204,125,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);

  ctx.strokeStyle = "rgba(212,169,83,0.5)";
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, shareCanvas.width - 96, shareCanvas.height - 96);

  ctx.fillStyle = "#ffcc7d";
  ctx.font = "74px Cormorant Garamond";
  ctx.fillText("Présages Premium", 120, 200);

  ctx.fillStyle = "#f4efe4";
  ctx.font = "56px Cormorant Garamond";
  ctx.fillText(`${primaryProfile.firstName} • ${primaryProfile.western}`, 120, 300);

  ctx.font = "44px Cormorant Garamond";
  wrapText(ctx, `“${primaryProfile.impact}”`, 120, 420, 840, 56);

  const blob = await new Promise((resolve) => shareCanvas.toBlob(resolve, "image/png", 0.95));
  if (!blob) return;

  const file = new File([blob], "presages-preview.png", { type: "image/png" });
  if (shareMode && navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: `${primaryProfile.firstName} vient de révéler sa carte Présages Premium ✨`,
      title: "Mon profil astrologique",
    });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "presages-preview.png";
  a.click();
  URL.revokeObjectURL(url);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = `${line}${words[i]} `;
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = `${words[i]} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function initStarfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function seed() {
    stars.length = 0;
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008,
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }

  resize();
  seed();
  frame();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}

document.getElementById("audioToggle").addEventListener("click", () => {
  const btn = document.getElementById("audioToggle");
  if (!audioCtx) {
    audioCtx = new AudioContext();
    ambienceNode = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    ambienceNode.frequency.value = 196;
    ambienceNode.type = "sine";
    gain.gain.value = 0.015;
    ambienceNode.connect(gain).connect(audioCtx.destination);
    ambienceNode.start();
    btn.setAttribute("aria-pressed", "true");
    btn.textContent = "🔊 Son actif";
    return;
  }

  if (audioCtx.state === "running") {
    audioCtx.suspend();
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = "🔈 Son rituel";
  } else {
    audioCtx.resume();
    btn.setAttribute("aria-pressed", "true");
    btn.textContent = "🔊 Son actif";
  }
});

initStarfield();
