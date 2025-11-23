// js/trip-details.js
import { requireAuth, getToken } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  loadTrip();
});

// Load from config.js (fallback to default if not available)
const API = window.API_BASE_URL || "http://127.0.0.1:9000/api";

// ---------------------
// قراءة ID من الرابط
// ---------------------
function getTripId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ---------------------
// تحميل بيانات الخطة
// ---------------------
async function loadTrip() {
  const tripId = getTripId();
  const titleEl = document.getElementById("tripTitle");
  const itemsContainer = document.getElementById("itemsContainer");

  const res = await fetch(`${API}/trips/${tripId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    titleEl.textContent = "Trip not found.";
    return;
  }

  const data = await res.json();

  titleEl.textContent = data.title;

  if (!data.items.length) {
    itemsContainer.innerHTML = "<p>No places added yet.</p>";
    return;
  }

  let html = "";

  data.items.forEach((item) => {
    html += `
      <div class="trip-item-card">
        <h3>${item.place_name}</h3>
        <p>Day: ${item.day_number}</p>
        <p>Category: ${item.category || "—"}</p>
      </div>
    `;
  });

  itemsContainer.innerHTML = html;
}

// ---------------------
// دالة إضافة مكان للخطة
// ---------------------
export async function addPlaceToTrip(place) {
  const tripId = getTripId();

  const body = {
    day_number: place.day_number || 1,
    place_id: place.id,
    place_name: place.name,
    category: place.category,
  };

  const res = await fetch(`${API}/trips/${tripId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("Added!");
    loadTrip(); // نرجع نحدّث الصفحة
  } else {
    alert("Error adding place.");
  }
}
