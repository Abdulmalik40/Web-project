// API & Auth Setup

// Load from config.js (fallback to default if not available)
// Use a function to avoid redeclaration error
const getApiUrl = () => {
  return window.API_BASE_URL || "http://127.0.0.1:9000/api";
};

// Import getToken from auth-nav.js (we'll use dynamic import or check if it's available)
function getToken() {
  return localStorage.getItem("auth_token");
}

// Store current itinerary data for saving
let currentItineraryData = null;
let currentFormData = null;

// 1) تحميل الداتا من JSON الموحد

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

// 2) تصنيف الاهتمامات لكل مكان

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

// Helpers

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

// Helpers للوقت

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

// اختيار مكان للاهتمام

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

// 3) توليد الخطة

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

// 4) الفورم

function setupPlannerForm() {
  const plannerForm = document.getElementById("plannerForm");
  if (!plannerForm) {
    console.error("plannerForm not found!");
    return;
  }

  // Check if handler already attached
  if (plannerForm.hasAttribute('data-handler-attached')) {
    console.log("Planner form handler already attached");
    return;
  }

  plannerForm.setAttribute('data-handler-attached', 'true');

  plannerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    const city = document.getElementById("city").value;
    const days = parseInt(document.getElementById("days").value);
    const hoursPerDay = parseFloat(document.getElementById("hoursPerDay").value);
    const startTime = document.getElementById("startTime").value;
    const budget = document.getElementById("budget")?.value || "any";

    const interests = Array.from(
      document.querySelectorAll("input[name='interests']:checked")
    ).map((i) => i.value);

    console.log("Form data:", { city, days, hoursPerDay, startTime, budget, interests });

    if (!city) {
      alert("Please select a city");
      return;
    }

    if (interests.length === 0) {
      alert("Please select at least one interest");
      return;
    }

    // Store form data for saving
    currentFormData = {
      city,
      days,
      hoursPerDay,
      startTime,
      interests,
      budget,
    };

    const itinerary = generateItinerary({
      city,
      days,
      hoursPerDay,
      startTime,
      interests,
      budget,
    });

    console.log("Generated itinerary:", itinerary);

    // Store itinerary data for saving
    currentItineraryData = itinerary;

    renderItinerary(itinerary);
    
    // Show confirmation dialog to ask if user wants to save
    showSaveConfirmation();
  });

  // Setup reset button
  const resetBtn = document.getElementById("resetPlanner");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      plannerForm.reset();
      const resultContainer = document.getElementById("itineraryResult");
      if (resultContainer) {
        resultContainer.innerHTML = `<p class="muted" data-i18n="plannerPage.initialHint">بعد ما تعبّي البيانات وتضغط "ولّد الخطة" راح تظهر لك الخطة هنا.</p>`;
        // Refresh translations for the hint
        if (window.i18n && window.i18n.refresh) {
          window.i18n.refresh();
        }
      }
      currentItineraryData = null;
      currentFormData = null;
    });
  }

  console.log("Planner form setup complete");
}

// Setup form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlannerForm);
} else {
  setupPlannerForm();
}

// Also try after a delay as fallback
setTimeout(() => {
  const form = document.getElementById("plannerForm");
  if (form && !form.hasAttribute('data-handler-attached')) {
    console.log("Fallback: setting up planner form");
    setupPlannerForm();
  }
}, 500);

// 5) عرض تأكيد الحفظ

function showSaveConfirmation() {
  const token = getToken();
  
  // Helper function to get translations
  const t = (key) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key);
    }
    // Fallback
    const fallbacks = {
      'plannerPage.saveTip': '💡 نصيحة: سجّل دخولك لحفظ هذه الخطة وعرضها لاحقاً',
      'plannerPage.saveConfirmTitle': 'هل تريد حفظ هذه الخطة؟',
      'plannerPage.saveConfirmDesc': 'يمكنك حفظ الخطة لعرضها لاحقاً أو تعديلها',
      'plannerPage.saveConfirmYes': 'نعم، احفظها',
      'plannerPage.saveConfirmLater': 'لاحقاً',
      'plannerPage.saving': 'جاري الحفظ...',
    };
    return fallbacks[key] || key;
  };

  // If user is not logged in, show a message instead
  if (!token) {
    const statusEl = document.getElementById("saveStatus");
    if (statusEl) {
      statusEl.innerHTML = `💡 <strong>${t('plannerPage.saveTip').replace('💡 ', '').split(':')[0]}:</strong> ${t('plannerPage.saveTip').split(':')[1] || t('plannerPage.saveTip')}`;
      statusEl.style.color = "#2ECC71";
      statusEl.style.backgroundColor = "#2ecc701a";
      statusEl.style.border = "1px solid #2ECC71";
      statusEl.style.display = "block";
    }
    return;
  }

  // Remove any existing dialog
  const existingDialog = document.getElementById("saveConfirmationDialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  const dialog = document.createElement("div");
  dialog.id = "saveConfirmationDialog";
  dialog.className = "confirmation-dialog";
  
  // Add inline styles to ensure dialog is visible and clickable
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  dialog.innerHTML = `
    <div class="confirmation-content" style="
      background: #1a1a1a;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      cursor: default;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    ">
      <h3 style="color: #f0f0f0; margin: 0 0 10px 0; font-size: 1.5rem;" data-i18n="plannerPage.saveConfirmTitle">هل تريد حفظ هذه الخطة؟</h3>
      <p style="color: #cccccc; margin: 0 0 20px 0;" data-i18n="plannerPage.saveConfirmDesc">يمكنك حفظ الخطة لعرضها لاحقاً أو تعديلها</p>
      <div class="confirmation-actions" style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-secondary" id="cancelSaveBtn" type="button" style="
          background: transparent;
          color: #cccccc;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          pointer-events: auto;
        " data-i18n="plannerPage.saveConfirmLater">لاحقاً</button>
        <button class="btn-primary" id="confirmSaveBtn" type="button" style="
          background: #006C35;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          pointer-events: auto;
        " data-i18n="plannerPage.saveConfirmYes">نعم، احفظها</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  console.log("Dialog created and appended to body");

  // Wait a bit for DOM to be ready, then attach handlers
  setTimeout(() => {
    // Handle cancel
    const cancelBtn = document.getElementById("cancelSaveBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Cancel button clicked");
        dialog.remove();
      });
    } else {
      console.error("cancelSaveBtn not found!");
    }

    // Handle confirm
    const confirmBtn = document.getElementById("confirmSaveBtn");
    if (confirmBtn) {
      console.log("Confirm button found, attaching handler");
      confirmBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("✅ Save button clicked!");
        console.log("currentItineraryData:", currentItineraryData);
        console.log("currentFormData:", currentFormData);
        
        // Helper function to get translations
        const t = (key) => {
          if (window.i18n && typeof window.i18n.t === 'function') {
            return window.i18n.t(key);
          }
          const fallbacks = {
            'plannerPage.saving': 'جاري الحفظ...',
          };
          return fallbacks[key] || key;
        };

        // Disable button to prevent double clicks
        confirmBtn.disabled = true;
        confirmBtn.textContent = t('plannerPage.saving');
        
        dialog.remove();
        await handleSaveItinerary();
      });
      
      // Also try mousedown as backup
      confirmBtn.addEventListener("mousedown", (e) => {
        console.log("Save button mousedown event");
      });
    } else {
      console.error("confirmSaveBtn not found!");
    }
  }, 50);

  // Close on outside click (but not on button clicks)
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.remove();
    }
  });
  
  // Prevent dialog from closing when clicking inside the content
  const content = dialog.querySelector(".confirmation-content");
  if (content) {
    content.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

// po 6) حفظ الخطة في قاعدة البيانات POSTGRESQL

async function handleSaveItinerary() {
  console.log("handleSaveItinerary called");
  console.log("currentItineraryData:", currentItineraryData);
  console.log("currentFormData:", currentFormData);
  
  // Helper function to get translations
  const t = (key) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key);
    }
    return key;
  };

  if (!currentItineraryData || !currentFormData) {
    console.error("Missing data:", { 
      hasItinerary: !!currentItineraryData, 
      hasFormData: !!currentFormData 
    });
    alert(t('plannerPage.saveError') || "لا توجد خطة لحفظها");
    return;
  }

  console.log("Calling saveItinerary...");
  const result = await saveItinerary(currentItineraryData, currentFormData);
  console.log("saveItinerary result:", result);

  if (result.success) {
    // Show success message
    const statusEl = document.getElementById("saveStatus");
    if (statusEl) {
      statusEl.innerHTML = t('plannerPage.saveSuccess') || "✅ تم حفظ الخطة بنجاح! يمكنك عرضها في قسم 'خططك المحفوظة' أدناه";
      statusEl.className = "success";
      statusEl.style.color = "#22c55e";
      statusEl.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
      statusEl.style.border = "1px solid rgba(34, 197, 94, 0.3)";
      statusEl.style.display = "block";
    }
    
    // Reload saved plans
    loadSavedPlans();
    
    // Scroll to saved plans section
    setTimeout(() => {
      const section = document.getElementById("savedPlansSection");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  } else {
    const statusEl = document.getElementById("saveStatus");
    if (statusEl) {
      statusEl.textContent = `❌ ${result.error || t('plannerPage.saveError') || "حدث خطأ أثناء الحفظ"}`;
      statusEl.className = "error";
      statusEl.style.color = "#ef4444";
      statusEl.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
      statusEl.style.border = "1px solid rgba(239, 68, 68, 0.3)";
      statusEl.style.display = "block";
    } else {
      alert(`${t('plannerPage.saveError') || 'فشل حفظ الخطة'}: ${result.error || "حدث خطأ"}`);
    }
  }
}

async function saveItinerary(itinerary, formData) {
  const token = getToken();
  
  if (!token) {
    alert("يجب تسجيل الدخول أولاً لحفظ الخطة. سيتم توجيهك لصفحة تسجيل الدخول.");
    // Store the full path for redirect after login (document-relative, no leading slash)
    const pathToStore = window.location.pathname.replace(/^\/pages/, '').replace(/^\//, '') || 'planner.html';
    localStorage.setItem("post_login_redirect", pathToStore);
    window.location.href = "auth/login.html";
    return false;
  }

  // Generate title
  const cityNames = {
    "Makkah": "مكة المكرمة",
    "Madinah": "المدينة المنورة",
    "Riyadh": "الرياض"
  };
  const cityName = cityNames[formData.city] || formData.city;
  const title = `خطة ${formData.days} أيام في ${cityName}`;

  // Calculate dates (optional - can be null)
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + (formData.days - 1) * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // Prepare budget (optional)
  const budgetMap = {
    "cheap": 500,
    "medium": 1500,
    "luxury": 5000,
    "any": null
  };
  const totalBudget = budgetMap[formData.budget] || null;

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/itineraries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        main_destination: formData.city,
        start_date: startDate,
        end_date: endDate,
        total_budget: totalBudget,
        plan_details: itinerary,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "فشل حفظ الخطة");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error saving itinerary:", error);
    return { success: false, error: error.message };
  }
}

// 7) عرض الخطة

function renderItinerary(itinerary) {
  const container = document.getElementById("itineraryResult");
  container.innerHTML = "";

  // Add save status indicator (if saved)
  const saveStatus = document.createElement("div");
  saveStatus.id = "saveStatus";
  saveStatus.style.marginBottom = "16px";
  saveStatus.style.padding = "8px 12px";
  saveStatus.style.borderRadius = "8px";
  saveStatus.style.fontSize = "0.9rem";
  saveStatus.style.display = "none";
  saveStatus.style.textAlign = "center";
  container.appendChild(saveStatus);

  // Render itinerary days
  itinerary.forEach((day) => {
    const div = document.createElement("div");
    div.className = "day-card";

    // Get translations
    const t = (key) => {
      if (window.i18n && typeof window.i18n.t === 'function') {
        return window.i18n.t(key);
      }
      // Fallback translations
      const fallbacks = {
        'plannerPage.day': 'اليوم',
        'plannerPage.approxHours': 'عدد الساعات التقريبية:',
        'plannerPage.hoursSuffix': 'ساعة',
        'plannerPage.noPlaces': 'ما فيه أماكن كفاية لهذا اليوم.',
        'plannerPage.visitDuration': 'مدة الزيارة:',
        'plannerPage.visitDurationHours': 'ساعة',
        'plannerPage.viewOnMaps': 'عرض على خرائط قوقل',
      };
      return fallbacks[key] || key;
    };

    const getPriceLevelText = (level) => {
      if (!level) return '';
      if (window.i18n && typeof window.i18n.t === 'function') {
        if (level === 'cheap') return window.i18n.t('plannerPage.budgetCheap');
        if (level === 'medium') return window.i18n.t('plannerPage.budgetMedium');
        if (level === 'luxury') return window.i18n.t('plannerPage.budgetLuxury');
      }
      // Fallback
      return level === 'cheap' ? 'اقتصادي' : level === 'medium' ? 'متوسط' : 'فاخر';
    };

    div.innerHTML = `
      <h3>${t('plannerPage.day')} ${day.day}</h3>
      <div class="day-meta">
        ${t('plannerPage.approxHours')} ${day.totalHours.toFixed(1)} ${t('plannerPage.hoursSuffix')}
      </div>

      ${day.places.length === 0
        ? `<p class="muted">${t('plannerPage.noPlaces')}</p>`
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
  • ${t('plannerPage.visitDuration')} ${p.estimated_duration || 1.5} ${t('plannerPage.visitDurationHours')}
  ${p.price_level ? ` • ${getPriceLevelText(p.price_level)}` : ""}
</span><br>
              ${p.link
                ? `<a href="${p.link}" target="_blank" style="color:#2ECC71;">${t('plannerPage.viewOnMaps')}</a>`
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

// 8) تحميل وعرض الخطط المحفوظة

async function loadSavedPlans() {
  const token = getToken();
  const container = document.getElementById("savedPlansContainer");
  const section = document.getElementById("savedPlansSection");
  
  if (!container || !section) return;

  // Only show section if user is logged in
  if (!token) {
    section.style.display = "none";
    return;
  }

  // Helper function to get translations
  const t = (key) => {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key);
    }
    const fallbacks = {
      'plannerPage.loadingPlans': 'جاري تحميل الخطط...',
      'plannerPage.noSavedPlans': 'لا توجد خطط محفوظة بعد.',
      'plannerPage.loadBtn': '📋 عرض',
      'plannerPage.deleteBtn': '🗑️ حذف',
      'plannerPage.confirmDelete': 'هل أنت متأكد من حذف هذه الخطة؟',
    };
    return fallbacks[key] || key;
  };

  section.style.display = "block";
  container.innerHTML = `<p class='muted'>${t('plannerPage.loadingPlans')}</p>`;

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/itineraries`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        container.innerHTML = "<p class='muted'>يجب تسجيل الدخول لعرض الخطط المحفوظة</p>";
        section.style.display = "none";
        return;
      }
      throw new Error("فشل تحميل الخطط");
    }

    const itineraries = await response.json();

    if (!itineraries || itineraries.length === 0) {
      container.innerHTML = `<p class='muted'>${t('plannerPage.noSavedPlans')}</p>`;
      return;
    }

    container.innerHTML = "";

    itineraries.forEach((itinerary) => {
      const card = document.createElement("div");
      card.className = "saved-plan-card";

      const dateStr = itinerary.created_at 
        ? new Date(itinerary.created_at).toLocaleDateString("ar-SA")
        : "";

      card.innerHTML = `
        <div class="saved-plan-info">
          <h4>${itinerary.title || t('plannerPage.title')}</h4>
          <div class="saved-plan-meta">
            ${itinerary.main_destination ? `📍 ${itinerary.main_destination}` : ""}
            ${itinerary.start_date && itinerary.end_date 
              ? ` • 📅 ${itinerary.start_date} - ${itinerary.end_date}` 
              : ""}
            ${dateStr ? ` • 💾 ${dateStr}` : ""}
          </div>
        </div>
        <div class="saved-plan-actions">
          <button class="btn-small btn-load" data-load="${itinerary.id}">
            ${t('plannerPage.loadBtn')}
          </button>
          <button class="btn-small btn-delete" data-delete="${itinerary.id}">
            ${t('plannerPage.deleteBtn')}
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Handle load button
    container.querySelectorAll("[data-load]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-load");
        await loadSavedPlan(id);
      });
    });

    // Handle delete button
    container.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-delete");
        if (confirm(t('plannerPage.confirmDelete'))) {
          await deleteSavedPlan(id);
        }
      });
    });

  } catch (error) {
    console.error("Error loading saved plans:", error);
    container.innerHTML = `<p class='muted' style='color:#ef4444;'>خطأ في تحميل الخطط: ${error.message}</p>`;
  }
}

// 9) تحميل خطة محفوظة

async function loadSavedPlan(id) {
  const token = getToken();
  if (!token) {
    alert("يجب تسجيل الدخول أولاً");
    return;
  }

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/itineraries/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("فشل تحميل الخطة");
    }

    const itinerary = await response.json();

    // Load plan details into the form and display
    if (itinerary.plan_details && Array.isArray(itinerary.plan_details)) {
      // Set form values if available
      if (itinerary.main_destination) {
        const citySelect = document.getElementById("city");
        if (citySelect) {
          citySelect.value = itinerary.main_destination;
        }
      }

      // Render the itinerary
      currentItineraryData = itinerary.plan_details;
      currentFormData = {
        city: itinerary.main_destination || "",
        days: itinerary.plan_details.length,
        hoursPerDay: 6, // Default, could be calculated
        startTime: "09:00",
        interests: [],
        budget: "any",
      };

      renderItinerary(itinerary.plan_details);

      // Scroll to results
      document.getElementById("itineraryResult")?.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }

  } catch (error) {
    console.error("Error loading saved plan:", error);
    alert(`فشل تحميل الخطة: ${error.message}`);
  }
}

// 10) حذف خطة محفوظة

async function deleteSavedPlan(id) {
  const token = getToken();
  if (!token) {
    alert("يجب تسجيل الدخول أولاً");
    return;
  }

  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/itineraries/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("فشل حذف الخطة");
    }

    // Reload saved plans
    await loadSavedPlans();
    
  } catch (error) {
    console.error("Error deleting saved plan:", error);
    alert(`فشل حذف الخطة: ${error.message}`);
  }
}

// 11) تهيئة الصفحة

// Load saved plans when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in and load saved plans
  const token = getToken();
  if (token) {
    loadSavedPlans();
    
    // Show refresh button
    const refreshBtn = document.getElementById("refreshSavedPlansBtn");
    if (refreshBtn) {
      refreshBtn.style.display = "block";
      refreshBtn.addEventListener("click", () => {
        loadSavedPlans();
      });
    }
  }

  // Also reload when auth token changes (user logs in/out)
  window.addEventListener("storage", (e) => {
    if (e.key === "auth_token") {
      const newToken = getToken();
      if (newToken) {
        loadSavedPlans();
        const refreshBtn = document.getElementById("refreshSavedPlansBtn");
        if (refreshBtn) refreshBtn.style.display = "block";
      } else {
        const section = document.getElementById("savedPlansSection");
        if (section) section.style.display = "none";
        const refreshBtn = document.getElementById("refreshSavedPlansBtn");
        if (refreshBtn) refreshBtn.style.display = "none";
      }
    }
  });
  
  // Also check periodically if user logged in (for same-tab login)
  setInterval(() => {
    const token = getToken();
    const section = document.getElementById("savedPlansSection");
    if (token && section && section.style.display === "none") {
      loadSavedPlans();
      const refreshBtn = document.getElementById("refreshSavedPlansBtn");
      if (refreshBtn) refreshBtn.style.display = "block";
    }
  }, 2000);
});
