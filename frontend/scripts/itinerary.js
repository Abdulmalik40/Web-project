// =====================================
// 1) تحميل الداتا من JSON الموحد
// =====================================

let PLACES = [];

async function loadPlaces() {
  try {
    const response = await fetch("../../data/places_unified.json");
    PLACES = await response.json();

    console.log("Loaded places:", PLACES.length);

    const counts = {};
    PLACES.forEach((p) => {
      const r = (p.region || p.reigon || "UNKNOWN").toString();
      counts[r] = (counts[r] || 0) + 1;
    });
    console.log("Places per region:", counts);
  } catch (err) {
    console.error("Error loading places:", err);
  }
}

loadPlaces();

// =====================================
// 2) تصنيف الاهتمامات لكل مكان
// =====================================

function enrichPlaceInterests(place) {
  const name = (place.name || "").toLowerCase();
  const category = (place.category || "").toLowerCase();
  const type = (place.category_type || "").toLowerCase();

  const interests = [];

  // ديني
  const isReligion =
    type === "mosque" ||
    name.includes("mosque") ||
    name.includes("masjid") ||
    category.includes("mosque") ||
    category.includes("masjid");

  if (isReligion) interests.push("religion");

  // متاحف → تاريخ
  const isMuseum =
    type === "museum" ||
    name.includes("museum") ||
    category.includes("museum");

  if (isMuseum) interests.push("history");

  // أكل / مقاهي
  const isFood =
    type === "restaurant" ||
    type === "cafe" ||
    ["cafe", "coffee", "restaurant"].some((k) => name.includes(k)) ||
    ["cafe", "restaurant", "food"].some((k) => category.includes(k));

  if (isFood) interests.push("food");

  // ترفيهي (غير المتاحف)
  const isEntertainment =
    !isMuseum &&
    (type === "entertainment" ||
      type === "park" ||
      type === "mall" ||
      type === "hotel" ||
      type === "hospital" ||
      type === "metro" ||
      category.includes("entertainment") ||
      name.includes("park") ||
      name.includes("mall") ||
      name.includes("cinema"));

  if (isEntertainment) interests.push("entertainment");

  if (interests.length === 0) interests.push("entertainment");

  return interests;
}

function getEnrichedPlaces() {
  return PLACES.map((p) => {
    const interests =
      Array.isArray(p.interests) && p.interests.length > 0
        ? p.interests
        : enrichPlaceInterests(p);

    return {
      ...p,
      interests,
      estimated_duration: p.estimated_duration || 1.5,
    };
  });
}

// =====================================
// Helpers
// =====================================

function getPlaceId(place) {
  return (
    place.id ||
    place.place_id ||
    place.code ||
    `${place.name || place.name_ar}`
  );
}

function isCafe(place) {
  const type = (place.category_type || "").toLowerCase();
  if (type === "cafe") return true;

  const name = (place.name || "").toLowerCase();
  const tags = (place.tags || []).join(" ").toLowerCase();

  return ["cafe", "coffee", "كوفي", "مقهى"].some(
    (w) => name.includes(w) || tags.includes(w)
  );
}

// فلترة حسب الميزانية
function matchesBudget(place, budget) {
  if (budget === "any") return true;

  const level = (place.price_level || "").toLowerCase();
  const type = (place.category_type || "").toLowerCase();

  if (type === "mosque") return true; // مساجد: بدون ميزانية

  if (!level) return budget === "medium"; // بدون تقييم = متوسط

  if (budget === "cheap") return level === "cheap";
  if (budget === "medium") return level === "cheap" || level === "medium";
  if (budget === "luxury") return level === "luxury";

  return true;
}

// =======================
// Helpers للوقت
// =======================

function parseTimeToMinutes(t) {
  if (!t) return 540;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutesToTime(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
}

// =====================================
// اختيار مكان للاهتمام
// =====================================

function pickPlaceForInterest({
  interest,
  buckets,
  ptrs,
  usedPlaceIds,
  cafesUsedToday,
  maxCafesPerDay,
}) {
  const bucket = buckets[interest] || [];
  if (bucket.length === 0) return { place: null, cafesUsedToday };

  const allowRepeat = interest === "religion";

  let startIndex = ptrs[interest] || 0;

  for (let offset = 0; offset < bucket.length; offset++) {
    const idx = (startIndex + offset) % bucket.length;
    const p = bucket[idx];
    const id = getPlaceId(p);

    if (!allowRepeat && usedPlaceIds.has(id)) continue;

    if (interest === "food" && isCafe(p)) {
      if (cafesUsedToday >= maxCafesPerDay) continue;
      cafesUsedToday++;
    }

    ptrs[interest] = (idx + 1) % bucket.length;

    if (!allowRepeat) usedPlaceIds.add(id);

    return { place: p, cafesUsedToday };
  }

  return { place: null, cafesUsedToday };
}

// =====================================
// 3) توليد الخطة
// =====================================

function generateItinerary({ city, days, hoursPerDay, interests, budget, startTime }) {
  const enrichedPlaces = getEnrichedPlaces();

  const selectedInterests =
    interests.length > 0
      ? interests
      : ["religion", "food", "entertainment"];

  const cityNorm = city.toLowerCase();

  const isMakkah =
    cityNorm.includes("makkah") || cityNorm.includes("mecca");

  const hasFood = selectedInterests.includes("food");
  const hasOther = selectedInterests.some((i) => i !== "food");

  let filtered = enrichedPlaces.filter((p) => {
    const region = (p.region || p.reigon || "").toLowerCase();
    const matchRegion = region.includes(cityNorm);
    if (!matchRegion) return false;

    if (!matchesBudget(p, budget)) return false;

    const interestMatch = p.interests.some((i) =>
      selectedInterests.includes(i)
    );
    if (!interestMatch) return false;

    if (
      isMakkah &&
      hasFood &&
      hasOther &&
      isCafe(p)
    )
      return false;

    return true;
  });

  console.log("After filter:", filtered.length);

  if (filtered.length === 0) {
    return Array.from({ length: days }).map((_, d) => ({
      day: d + 1,
      totalHours: 0,
      places: [],
    }));
  }

  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // buckets
  const buckets = {};
  selectedInterests.forEach((i) => (buckets[i] = []));

  filtered.forEach((p) => {
    p.interests.forEach((i) => {
      if (selectedInterests.includes(i)) buckets[i].push(p);
    });
  });

  const available = selectedInterests.filter(
    (i) => buckets[i].length > 0
  );

  const result = [];
  const usedIds = new Set();
  const AVG = 1.5;

  const slotsPerDay = Math.max(1, Math.floor(hoursPerDay / AVG));

  const ptrs = {};
  available.forEach((i) => (ptrs[i] = 0));

  const startMinutes = parseTimeToMinutes(startTime);

  for (let d = 1; d <= days; d++) {
    let slots = slotsPerDay;
    const chosen = [];

    let cafesUsedToday = 0;
    const maxCafesPerDay =
      isMakkah && hasFood && hasOther ? 0 : slots;

    const daily = [...available];

    // 1) واحد من كل اهتمام
    for (const interest of daily) {
      if (slots <= 0) break;
      const pick = pickPlaceForInterest({
        interest,
        buckets,
        ptrs,
        usedPlaceIds: usedIds,
        cafesUsedToday,
        maxCafesPerDay,
      });

      if (pick.place) {
        chosen.push(pick.place);
        cafesUsedToday = pick.cafesUsedToday;
        slots--;
      }
    }

    // 2) الباقي round-robin
    while (slots > 0) {
      let added = false;
      for (const interest of daily) {
        if (slots <= 0) break;

        const pick = pickPlaceForInterest({
          interest,
          buckets,
          ptrs,
          usedPlaceIds: usedIds,
          cafesUsedToday,
          maxCafesPerDay,
        });

        if (pick.place) {
          chosen.push(pick.place);
          cafesUsedToday = pick.cafesUsedToday;
          slots--;
          added = true;
        }
      }
      if (!added) break;
    }

    // توزيع الأوقات
    let cur = startMinutes;
    const timed = chosen.map((p) => {
      const dur = (p.estimated_duration || 1.5) * 60;
      const start = cur;
      const end = cur + dur;
      cur = end;
      return {
        ...p,
        visit_start: formatMinutesToTime(start),
        visit_end: formatMinutesToTime(end),
      };
    });

    const totalHours = timed.reduce(
      (s, p) => s + (p.estimated_duration || 1.5),
      0
    );

    result.push({
      day: d,
      totalHours,
      places: timed,
    });
  }

  return result;
}

// =====================================
// 4) الفورم
// =====================================

document.getElementById("plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const days = parseInt(document.getElementById("days").value);
  const hoursPerDay = parseFloat(document.getElementById("hoursPerDay").value);
  const startTime = document.getElementById("startTime").value;
  const budget = document.getElementById("budget")?.value || "any";

  const interests = Array.from(
    document.querySelectorAll("input[name='interests']:checked")
  ).map((i) => i.value);

  const itinerary = generateItinerary({
    city,
    days,
    hoursPerDay,
    startTime,
    interests,
    budget,
  });

  renderItinerary(itinerary);
});

// =====================================
// 5) عرض الخطة
// =====================================

function renderItinerary(itinerary) {
  const container = document.getElementById("itineraryResult");
  container.innerHTML = "";

  itinerary.forEach((day) => {
    const div = document.createElement("div");
    div.className = "day-card";

    div.innerHTML = `
      <h3>اليوم ${day.day}</h3>
      <div class="day-meta">
        عدد الساعات التقريبية: ${day.totalHours.toFixed(1)} ساعة
      </div>

      ${day.places.length === 0
        ? `<p class="muted">ما فيه أماكن كفاية لهذا اليوم.</p>`
        : `
        <ul class="day-list">
          ${day.places
          .map(
            (p) => `
            <li>
              <div class="place-time">${p.visit_start} — ${p.visit_end}</div>
              <span class="place-name">${p.name}</span><br>
              <span class="place-meta">
  ${(p.region || "").toString()} • ${p.category || ""}
  • مدة الزيارة: ${p.estimated_duration || 1.5} ساعة
  ${p.price_level
                ? ` • ${p.price_level === "cheap"
                  ? "اقتصادي"
                  : p.price_level === "medium"
                    ? "متوسط"
                    : "فاخر"
                }`
                : ""
              }
</span><br>
              ${p.link
                ? `<a href="${p.link}" target="_blank" style="color:#38bdf8;">عرض على خرائط قوقل</a>`
                : ""
              }
            </li>`
          )
          .join("")}
        </ul>
      `}
    `;

    container.appendChild(div);
  });
}
