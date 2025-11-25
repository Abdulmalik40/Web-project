// ../scripts/trips.js
// Non-module version, works with global auth-nav + config.js

console.log("[trips] file loaded");

// Load from config.js (fallback to default if not available)
const API = window.API_BASE_URL || "http://127.0.0.1:9000/api";

// Wrapper around global getToken from auth-nav.js
function getAuthToken() {
  if (typeof window.getToken === "function") {
    return window.getToken();
  }
  // Fallback if auth-nav hasn't loaded
  return localStorage.getItem("auth_token");
}

// Wrapper around global requireAuth from auth-nav.js
function ensureAuth() {
  if (typeof window.requireAuth === "function") {
    return window.requireAuth();
  }
  console.warn("[trips] window.requireAuth not found, allowing access");
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("[trips] DOMContentLoaded fired");

  const ok = ensureAuth();
  console.log("[trips] ensureAuth() =>", ok);
  if (!ok) return;

  setupForm();
  loadTrips();
});

function setupForm() {
  const form = document.getElementById("createTripForm");
  const saveBtn = document.getElementById("saveTripBtn");

  if (!form || !saveBtn) {
    console.warn("[trips] Missing form or save button", { form, saveBtn });
    return;
  }

  console.log("[trips] setupForm: attaching click listener");

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("[trips] Save clicked");

    const titleInput = document.getElementById("tripTitle");
    const cityInput = document.getElementById("tripCity");
    const daysInput = document.getElementById("tripDays");

    const title = titleInput?.value.trim() || "";
    const city = cityInput?.value.trim() || "";
    const days = Number(daysInput?.value || 1);

    if (!title) {
      alert("Please enter a trip title");
      return;
    }

    try {
      const res = await fetch(`${API}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ title, city, days }),
      });

      if (!res.ok) {
        console.error("Create trip failed:", await res.text());
        alert("Error creating trip");
        return;
      }

      form.reset();
      if (daysInput) daysInput.value = 1;
      await loadTrips();
    } catch (err) {
      console.error("Create trip error:", err);
      alert("Network error");
    }
  });
}

async function loadTrips() {
  const container = document.getElementById("tripsContainer");
  const emptyHint = document.getElementById("tripsEmptyHint");

  if (!container) return;

  console.log("[trips] Loading trips...");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/trips`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!res.ok) {
      if (emptyHint) emptyHint.textContent = "Failed to load trips.";
      return;
    }

    const trips = await res.json();

    if (!trips.length) {
      if (emptyHint) emptyHint.style.display = "block";
      return;
    }

    if (emptyHint) emptyHint.style.display = "none";

    trips.forEach((trip) => {
      const card = document.createElement("article");
      card.className = "plan-summary-card";

      card.innerHTML = `
        <span>${trip.city || "Custom trip"}</span>
        <strong>${trip.title}</strong>
        <p>${trip.days} day(s)</p>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button class="cta-btn primary" data-view="${trip.id}">View details</button>
          <button class="cta-btn secondary" data-delete="${trip.id}">Delete</button>
        </div>
      `;

      container.appendChild(card);
    });

    container.onclick = async (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const viewId = target.getAttribute("data-view");
      const deleteId = target.getAttribute("data-delete");

      if (viewId) {
        window.location.href = `/user/trips-details.html?id=${viewId}`;
      }

      if (deleteId) {
        if (!confirm("Delete this trip?")) return;

        const res = await fetch(`${API}/trips/${deleteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (res.ok) loadTrips();
        else alert("Error deleting trip");
      }
    };
  } catch (err) {
    console.error("[trips] loadTrips error:", err);
    if (emptyHint) emptyHint.textContent = "Failed to load trips.";
  }
}
