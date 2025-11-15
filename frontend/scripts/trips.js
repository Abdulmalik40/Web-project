// ../scripts/trips.js
import { requireAuth, getToken } from "./auth-nav.js";

const API = "http://localhost:9000/api";

console.log("[trips] file loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("[trips] DOMContentLoaded fired");

  // نتأكد أن المستخدم مسجّل دخول
  const ok = requireAuth();
  console.log("[trips] requireAuth() =>", ok);
  if (!ok) return;

  setupForm();
  loadTrips();
});

function setupForm() {
  const form = document.getElementById("createTripForm");
  const saveBtn = document.getElementById("saveTripBtn");

  if (!form || !saveBtn) {
    console.warn("[trips] form or save button not found", { form, saveBtn });
    return;
  }

  console.log("[trips] setupForm: attaching click listener on saveTripBtn");

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("[trips] saveTripBtn clicked");

    const titleInput = document.getElementById("tripTitle");
    const cityInput  = document.getElementById("tripCity");
    const daysInput  = document.getElementById("tripDays");

    const title = titleInput?.value.trim() || "";
    const city  = cityInput?.value.trim() || "";
    const days  = Number(daysInput?.value || 1);

    console.log("[trips] form data:", { title, city, days });

    if (!title) {
      alert("Please enter a trip title");
      return;
    }

    try {
      const res = await fetch(`${API}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, city, days }),
      });

      console.log("[trips] POST /trips status:", res.status);

      if (!res.ok) {
        const txt = await res.text();
        console.error("Create trip failed:", res.status, txt);
        alert("Error creating trip");
        return;
      }

      form.reset();
      if (daysInput) daysInput.value = 1;

      await loadTrips();
    } catch (err) {
      console.error("Create trip error:", err);
      alert("Error creating trip (network issue)");
    }
  });
}

async function loadTrips() {
  const container = document.getElementById("tripsContainer");
  const emptyHint = document.getElementById("tripsEmptyHint");
  if (!container) {
    console.warn("[trips] tripsContainer not found");
    return;
  }

  console.log("[trips] loadTrips() start");
  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/trips`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log("[trips] GET /trips status:", res.status);

    if (!res.ok) {
      if (emptyHint) emptyHint.textContent = "Failed to load trips.";
      return;
    }

    const trips = await res.json();
    console.log("[trips] trips data:", trips);

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
        window.location.href = `trip-details.html?id=${viewId}`;
      }

      if (deleteId) {
        if (!confirm("Delete this trip?")) return;

        const res = await fetch(`${API}/trips/${deleteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
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
