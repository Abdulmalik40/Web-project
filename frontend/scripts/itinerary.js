// =========================
// 1) تحميل الداتا كاملة
// =========================
let places = [];

async function loadPlaces() {
  try {
    // من planner.html (داخل pages/plans) نطلع لحد frontend ثم ندخل data
    const res = await fetch("../../data/places_unified.json");
    places = await res.json();
    console.log("Loaded places:", places.length);
  } catch (err) {
    console.error("Error loading places:", err);
  }
}

// =========================
// 2) اشتقاق الاهتمامات والمدة من نوع المكان / الملف
// =========================
//
// نهتم بثلاث اهتمامات فعليًا من الداتا:
// - food        → أكل / مقاهي
// - religion    → ديني
// - entertainment → ترفيهي (يشمل ترفيه + مترو + مستشفيات + فنادق)
//
// تاريخ + ثقافة موجودة في الواجهة لكن حالياً ما فيه داتا لها في CSV.
function deriveMeta(place) {
  const cat = (place.category || "").toString().toLowerCase();
  const src = (place._source_file || "").toString().toLowerCase();

  let interests = [];
  let duration = 2; // عدد الساعات الافتراضي لأي زيارة

  // ================= FOOD =================
  if (
    cat.includes("cafe") ||
    cat.includes("coffee") ||
    cat.includes("restaurant") ||
    cat.includes("resturant") ||
    src.includes("full_cafe") ||
    src.includes("final_resturant")
  ) {
    interests = ["food"];
    duration = 1.5;
  }

  // ================= RELIGION =================
  else if (
    cat.includes("mosque") ||
    cat.includes("masjid") ||
    src.includes("mousqes")
  ) {
    interests = ["religion"];
    duration = 1.5;
  }

  // ================= ENTERTAINMENT (كل شيء آخر) =================
  else {
    // ترفيهي + مترو + مستشفيات + فنادق + أي شيء ما فوق
    interests = ["entertainment"];
    duration = 2;

    // مثال: ممكن تقلل مدة المستشفى أو المترو لو حبيت
    if (src.includes("hospital")) {
      duration = 1;
    } else if (src.includes("metro")) {
      duration = 1;
    } else if (src.includes("hotel")) {
      duration = 2;
    }
  }

  // نرجع فقط الاهتمامات اللي يدعمها الفورم
  // (history, culture موجودة لكن بدون داتا حالياً)
  return { interests, duration };
}

// نجهز نسخة "مثرية" من الأماكن بدون ما نغيّر الأصل
function getEnrichedPlaces() {
  return places.map((p) => {
    const meta = deriveMeta(p);
    return {
      ...p,
      interests: meta.interests,
      estimated_duration: meta.duration,
    };
  });
}

// =========================
// 3) قراءة الاهتمامات من الفورم
// =========================
function getSelectedInterests() {
  const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
  return Array.from(checkboxes).map((cb) => cb.value);
}

// =========================
// 4) توليد الخطة
// =========================
function generateItinerary(options) {
  const { city, days, hoursPerDay, interests } = options;

  const enrichedPlaces = getEnrichedPlaces();

  // فلترة حسب المدينة والاهتمامات
  let filtered = enrichedPlaces.filter((p) => {
    // مطابقة المنطقة: نستخدم includes عشان نغطي "Al Madinah" و "Madinah" إلخ
    const region = (p.region || "").toString().toLowerCase();
    const regionMatch = city
      ? region.includes(city.toLowerCase())
      : true;

    // الاهتمامات (قائمة القيم المختارة من الفورم)
    const interestsMatch =
      interests.length === 0
        ? true
        : Array.isArray(p.interests) &&
          p.interests.some((i) => interests.includes(i));

    const duration = p.estimated_duration || 0;

    // نستبعد فقط الأماكن اللي مدتها 0 (لو صارت بالخطأ)
    return regionMatch && interestsMatch && duration > 0;
  });

  // نرتب الأماكن حسب التقييم من الأعلى للأقل
  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const result = [];
  let index = 0;

  for (let day = 1; day <= days; day++) {
    let remaining = hoursPerDay;
    const dayPlaces = [];

    while (index < filtered.length) {
      const place = filtered[index];
      const duration = place.estimated_duration || 2;

      if (duration <= remaining) {
        dayPlaces.push(place);
        remaining -= duration;
        index++;
      } else {
        break;
      }
    }

    result.push({
      day,
      totalHours: hoursPerDay - remaining,
      places: dayPlaces,
    });
  }

  return result;
}

// =========================
// 5) عرض الخطة في الصفحة
// =========================
function renderItinerary(itinerary) {
  const container = document.getElementById("itineraryResult");

  if (!itinerary || itinerary.length === 0) {
    container.innerHTML =
      `<p class="muted">ما قدرنا نولد خطة بناءً على المعطيات. جرّب تقلل الأيام أو تزيد الاهتمامات أو تغيّر المدينة.</p>`;
    return;
  }

  let html = "";

  itinerary.forEach((dayPlan) => {
    html += `
      <div class="day-card">
        <h3>اليوم ${dayPlan.day}</h3>
        <div class="day-meta">
          عدد الساعات التقريبية لهذا اليوم: ${dayPlan.totalHours.toFixed(
            1
          )} ساعة
        </div>
    `;

    if (!dayPlan.places || dayPlan.places.length === 0) {
      html += `<p class="muted">ما فيه أماكن كفاية لهذا اليوم.</p>`;
    } else {
      html += `<ul class="day-list">`;
      dayPlan.places.forEach((p) => {
        html += `
          <li>
            <div class="place-name">${p.name || "مكان بدون اسم"}</div>
            <div class="place-meta">
              ${(p.category || "مكان")} • 
              تقييم: ${p.rating ?? "غير متوفر"} • 
              مدة الزيارة: ${(p.estimated_duration || 2).toFixed(1)} ساعة
              ${p.region ? " • " + p.region : ""}
            </div>
            ${
              p.link
                ? `<a href="${p.link}" target="_blank" rel="noopener" class="muted">عرض على خرائط قوقل</a>`
                : ""
            }
          </li>
        `;
      });
      html += `</ul>`;
    }

    html += `</div>`;
  });

  container.innerHTML = html;
}

// =========================
// 6) ربط كل شيء مع الفورم
// =========================
document.addEventListener("DOMContentLoaded", () => {
  loadPlaces();

  const form = document.getElementById("plannerForm");
  const resetBtn = document.getElementById("resetPlanner");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = document.getElementById("city").value;
    const days = parseInt(document.getElementById("days").value, 10) || 1;
    const hoursPerDay =
      parseInt(document.getElementById("hoursPerDay").value, 10) || 6;
    const interests = getSelectedInterests();

    const itinerary = generateItinerary({ city, days, hoursPerDay, interests });
    renderItinerary(itinerary);
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    document.getElementById("itineraryResult").innerHTML =
      `<p class="muted">بعد ما تعبّي البيانات وتضغط "ولد الخطة" راح تظهر لك الخطة هنا.</p>`;
  });
});
