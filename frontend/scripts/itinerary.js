// =====================================
// 1) تحميل الداتا من JSON الموحد
// =====================================

let PLACES = [];

async function loadPlaces() {
  try {
    const response = await fetch("../../data/places_unified.json");
    PLACES = await response.json();
    console.log("Loaded places:", PLACES.length);
  } catch (err) {
    console.error("Error loading places:", err);
  }
}

// نبدأ التحميل أول ما يشتغل السكربت
loadPlaces();

// =====================================
// 2) تصنيف الاهتمامات لكل مكان (enrichment)
// =====================================

function enrichPlaceInterests(place) {
  const name = (place.name || "").toLowerCase();
  const category = (place.category || "").toLowerCase();

  const interests = [];

  // ديني
  const isReligion =
    name.includes("mosque") ||
    name.includes("masjid") ||
    category.includes("mosque") ||
    category.includes("masjid");

  if (isReligion) interests.push("religion");

  // أكل / مقاهي / مطاعم
  const isFood =
    ["cafe", "coffee", "restaurant", "food", "ice cream"].some((k) =>
      name.includes(k)
    ) ||
    ["cafe", "restaurant", "food"].some((k) => category.includes(k));

  if (isFood) interests.push("food");

  // ترفيهي
  const isEntertainment =
    category.includes("entertainment") ||
    category.includes("park") ||
    category.includes("mall") ||
    category.includes("museum") ||
    category.includes("cinema") ||
    category.includes("hotel") ||
    category.includes("hospital") ||
    category.includes("metro") ||
    name.includes("park") ||
    name.includes("mall") ||
    name.includes("museum") ||
    name.includes("cinema") ||
    name.includes("hotel") ||
    name.includes("hospital") ||
    name.includes("metro");

  if (isEntertainment) interests.push("entertainment");

  // لو ما قدرنا نصنفه نهائياً → نحسبه ترفيهي
  if (!isReligion && !isFood && !isEntertainment) {
    interests.push("entertainment");
  }

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
      estimated_duration: p.estimated_duration || 1.5, // default 1.5h
    };
  });
}

// =====================================
// 2.1) دوال مساعدة
// =====================================

function getPlaceId(place) {
  return (
    place.id ||
    place.place_id ||
    place.code ||
    `${place.name || place.name_ar || JSON.stringify(place)}`
  );
}

function isCafe(place) {
  const name = (place.name || "").toString().toLowerCase();
  const category = (place.category || "").toString().toLowerCase();

  const rawTags =
    place.tags ||
    place.types ||
    place.interest_categories ||
    place.interests ||
    [];

  const tags = Array.isArray(rawTags)
    ? rawTags.join(" ").toLowerCase()
    : rawTags.toString().toLowerCase();

  const cafeWords = ["كافيه", "كوفي", "مقهى", "cafe", "coffee", "قهوة"];

  return cafeWords.some(
    (w) => name.includes(w) || category.includes(w) || tags.includes(w)
  );
}

// اختيار مكان لاهتمام معيّن
// للدين نسمح بالتكرار بين الأيام (نفس المسجد ممكن ينعاد).
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

  const allowReuseReligion = interest === "religion";

  let startIndex = ptrs[interest] || 0;

  for (let offset = 0; offset < bucket.length; offset++) {
    const j = (startIndex + offset) % bucket.length;
    const p = bucket[j];
    const id = getPlaceId(p);

    if (!allowReuseReligion && usedPlaceIds.has(id)) continue;

    // ضبط الكافيهات
    if (interest === "food" && isCafe(p)) {
      if (cafesUsedToday >= maxCafesPerDay) continue;
      cafesUsedToday += 1;
    }

    // اخترنا المكان
    ptrs[interest] = (j + 1) % bucket.length;

    if (!allowReuseReligion) {
      usedPlaceIds.add(id);
    }

    return { place: p, cafesUsedToday };
  }

  return { place: null, cafesUsedToday };
}

// =====================================
// 3) توليد الخطة مع توزيع متوازن "لكل يوم"
//    وتصفية الكافيهات من مكة عند تنوّع الاهتمامات
// =====================================

function generateItinerary(options) {
  const { city, days, hoursPerDay, interests } = options;

  const enrichedPlaces = getEnrichedPlaces();

  const selectedInterests =
    interests && interests.length > 0
      ? interests
      : ["religion", "food", "entertainment"];

  const cityNorm = city ? city.toLowerCase() : "";

  const isMakkah =
    cityNorm.includes("makkah") ||
    cityNorm.includes("mecca") ||
    cityNorm.includes("مكة");

  const hasFood = selectedInterests.includes("food");
  const hasNonFoodInterest = selectedInterests.some((i) => i !== "food");

  // فلترة حسب المدينة + الاهتمامات + وجود مدة
  let filtered = enrichedPlaces.filter((p) => {
    const region = (p.region || "").toString().toLowerCase();
    const regionMatch = cityNorm ? region.includes(cityNorm) : true;

    const placeInterests = Array.isArray(p.interests) ? p.interests : [];
    const interestsMatch = placeInterests.some((i) =>
      selectedInterests.includes(i)
    );

    const hasDuration = (p.estimated_duration || 0) > 0;

    if (!regionMatch || !interestsMatch || !hasDuration) return false;

    // مكة + اهتمامات متنوّعة + فيها أكل: نشيل الكافيهات تمامًا
    if (isMakkah && hasFood && hasNonFoodInterest && isCafe(p)) return false;

    return true;
  });

  if (filtered.length === 0) {
    return Array.from({ length: days }).map((_, idx) => ({
      day: idx + 1,
      totalHours: 0,
      places: [],
    }));
  }

  // ترتيب عام حسب التقييم
  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // سلال الاهتمامات
  const buckets = {};
  selectedInterests.forEach((i) => {
    buckets[i] = [];
  });

  filtered.forEach((p) => {
    if (!Array.isArray(p.interests)) return;
    p.interests.forEach((i) => {
      if (selectedInterests.includes(i)) {
        buckets[i].push(p);
      }
    });
  });

  // نهتم فقط بالاهتمامات اللي لها بيانات
  let availableInterests = selectedInterests.filter(
    (i) => (buckets[i] || []).length > 0
  );

  if (availableInterests.length === 0) {
    return Array.from({ length: days }).map((_, idx) => ({
      day: idx + 1,
      totalHours: 0,
      places: [],
    }));
  }

  // food: مطاعم أول ثم أي شيء ثاني
  if (buckets["food"]) {
    buckets["food"].sort((a, b) => {
      const aCafe = isCafe(a) ? 1 : 0;
      const bCafe = isCafe(b) ? 1 : 0;
      if (aCafe !== bCafe) return aCafe - bCafe;
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  // باقي الاهتمامات: حسب التقييم
  availableInterests.forEach((i) => {
    if (i === "food") return;
    buckets[i].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  });

  const result = [];
  const usedPlaceIds = new Set();
  const AVG_DURATION = 1.5;

  // تقدير عدد الأنشطة في اليوم
  const slotsPerDay = Math.max(
    1,
    Math.floor(hoursPerDay / AVG_DURATION)
  );

  // مؤشرات لكل سلة (للدوران عليها)
  const ptrs = {};
  availableInterests.forEach((i) => (ptrs[i] = 0));

  for (let day = 1; day <= days; day++) {
    let remainingSlots = slotsPerDay;
    const dayPlaces = [];

    // حد الكافيهات في اليوم (خارج مكة مو مهم، لأن الكافيهات أصلاً موجودة فقط لو المستخدم مهتم بالأكل بس)
    let cafesUsedToday = 0;
    const maxCafesPerDay =
      isMakkah && hasFood && hasNonFoodInterest ? 0 : slotsPerDay; // في مكة + اهتمامات متنوعة: 0 كافيهات

    // نغيّر ترتيب الاهتمامات من يوم ليوم شوي
    const dailyInterests = [];
    for (let i = 0; i < availableInterests.length; i++) {
      const idx = (day - 1 + i) % availableInterests.length;
      dailyInterests.push(availableInterests[idx]);
    }

    // 🔹 الخطوة 1: واحد على الأقل من كل اهتمام (لو فيه بيانات)
    for (const interest of dailyInterests) {
      if (remainingSlots <= 0) break;

      const pick = pickPlaceForInterest({
        interest,
        buckets,
        ptrs,
        usedPlaceIds,
        cafesUsedToday,
        maxCafesPerDay,
      });

      if (!pick.place) continue;

      dayPlaces.push(pick.place);
      cafesUsedToday = pick.cafesUsedToday;
      remainingSlots--;
    }

    // 🔹 الخطوة 2: لو باقي slots، نوزعها بالـ round-robin
    while (remainingSlots > 0) {
      let added = false;

      for (const interest of dailyInterests) {
        if (remainingSlots <= 0) break;

        const pick = pickPlaceForInterest({
          interest,
          buckets,
          ptrs,
          usedPlaceIds,
          cafesUsedToday,
          maxCafesPerDay,
        });

        if (!pick.place) continue;

        dayPlaces.push(pick.place);
        cafesUsedToday = pick.cafesUsedToday;
        remainingSlots--;
        added = true;
      }

      if (!added) break; // ما عاد فيه أماكن نضيفها
    }

    const totalHours = dayPlaces.reduce(
      (sum, p) => sum + (p.estimated_duration || AVG_DURATION),
      0
    );

    result.push({
      day,
      totalHours,
      places: dayPlaces,
    });
  }

  return result;
}

// =====================================
// 4) ربط الفورم بالصفحة
// =====================================

document.getElementById("plannerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const days = parseInt(document.getElementById("days").value, 10);
  const hoursPerDay = parseFloat(
    document.getElementById("hoursPerDay").value
  );
  const startTime = document.getElementById("startTime").value; // احتياط للمستقبل

  const interests = Array.from(
    document.querySelectorAll("input[name='interests']:checked")
  ).map((i) => i.value);

  const itinerary = generateItinerary({
    city,
    days,
    hoursPerDay,
    startTime,
    interests,
  });

  renderItinerary(itinerary);
});

// =====================================
// 5) عرض الخطة في الصفحة
// =====================================

function renderItinerary(itinerary) {
  const container = document.getElementById("itineraryResult");
  container.innerHTML = "";

  itinerary.forEach((dayInfo) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-card";

    dayDiv.innerHTML = `
      <h3>اليوم ${dayInfo.day}</h3>
      <div class="day-meta">
        عدد الساعات التقريبية لهذا اليوم: ${dayInfo.totalHours.toFixed(
          1
        )} ساعة
      </div>
      ${
        dayInfo.places.length === 0
          ? `<p class="muted">ما فيه أماكن كفاية لهذا اليوم.</p>`
          : `<ul class="day-list">
              ${dayInfo.places
                .map(
                  (p) => `
                <li>
                  <span class="place-name">${p.name}</span><br />
                  <span class="place-meta">
                    ${(p.region || "").toString()} • ${(p.category || "").toString()} • مدة الزيارة ${
                    p.estimated_duration || 1.5
                  } ساعة
                  </span><br />
                  ${
                    p.link
                      ? `<a href="${p.link}" target="_blank" style="color:#38bdf8;">عرض على خرائط قوقل</a>`
                      : ""
                  }
                </li>`
                )
                .join("")}
            </ul>`
      }
    `;

    container.appendChild(dayDiv);
  });
}
