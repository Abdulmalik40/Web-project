let places = [];

// 1) تحميل الداتا من ملف JSON
async function loadPlaces() {
    try {
        const res = await fetch("../../data/places_unified.json");
        places = await res.json();
        console.log("Loaded places:", places.length);
    } catch (err) {
        console.error("Error loading places:", err);
    }
}

// 2) دالة تساعدنا نقرأ الاهتمامات المختارة من الفورم
function getSelectedInterests() {
    const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
    return Array.from(checkboxes).map((cb) => cb.value);
}

// 3) دالة توليد الخطة
function generateItinerary(options) {
    const { city, days, hoursPerDay, interests } = options;

    // فلترة حسب المدينة والاهتمامات
    let filtered = places.filter((p) => {
        const regionMatch = city ? (p.region && p.region.toLowerCase() === city.toLowerCase()) : true;
        const interestsMatch =
            interests.length === 0
                ? true
                : Array.isArray(p.interests) && p.interests.some((i) => interests.includes(i));

        // نستبعد الأشياء اللي ما لها مدة (مثل فندق/مستشفى/مترو) من الخطة
        const duration = p.estimated_duration ?? 0;
        const hasDuration = duration > 0;

        return regionMatch && interestsMatch && hasDuration;
    });

    // ترتيب الأماكن حسب التقييم (من الأعلى إلى الأقل)
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

        if (dayPlaces.length === 0) {
            // ما لقينا أماكن كفاية لليوم هذا
            result.push({
                day,
                totalHours: 0,
                places: [],
            });
        } else {
            result.push({
                day,
                totalHours: hoursPerDay - remaining,
                places: dayPlaces,
            });
        }
    }

    return result;
}

// 4) عرض الخطة في الصفحة
function renderItinerary(itinerary) {
    const container = document.getElementById("itineraryResult");

    if (!itinerary || itinerary.length === 0) {
        container.innerHTML = `<p class="muted">ما قدرنا نولد خطة بناءً على المعطيات. جرّب تقلل الأيام أو تزيد الاهتمامات.</p>`;
        return;
    }

    let html = "";

    itinerary.forEach((dayPlan) => {
        html += `
      <div class="day-card">
        <h3>اليوم ${dayPlan.day}</h3>
        <div class="day-meta">
          عدد الساعات التقريبية لهذا اليوم: ${dayPlan.totalHours.toFixed(1)} ساعة
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
              ${p.category || "مكان"} • 
              تقييم: ${p.rating ?? "غير متوفر"} • 
              مدة الزيارة: ${p.estimated_duration || 2} ساعة
              ${p.region ? " • " + p.region : ""}
            </div>
            ${p.link
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

// 5) ربط كل شيء مع الفورم بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    loadPlaces();

    const form = document.getElementById("plannerForm");
    const resetBtn = document.getElementById("resetPlanner");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const city = document.getElementById("city").value;
        const days = parseInt(document.getElementById("days").value, 10) || 1;
        const hoursPerDay = parseInt(document.getElementById("hoursPerDay").value, 10) || 6;
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
