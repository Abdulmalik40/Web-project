// Review system with bilingual labels, dynamic stars, and theme-aware bubbles
function initReviewSystem() {
  const nameInput = document.getElementById("reviewName");
  const textInput = document.getElementById("reviewText");
  const submitBtn = document.getElementById("submitReview");
  const starContainer = document.getElementById("stars");
  const reviewsContainer = document.getElementById("reviewsList");

  if (!nameInput || !textInput || !submitBtn || !starContainer || !reviewsContainer) return;

  let rating = 0;

  // Helper that defers to global i18n when present so placeholders flip with language changes
  const t = (key, fallback = "") => {
    if (window.i18n?.t) return window.i18n.t(key) || fallback || key;
    return fallback || key;
  };

  // Build the 5 clickable stars once
  const buildStars = () => {
    starContainer.innerHTML = "";
    Array.from({ length: 5 }).forEach((_, i) => {
      const star = document.createElement("span");
      star.textContent = "★";
      star.setAttribute("role", "button");
      star.setAttribute("tabindex", "0");
      star.setAttribute("aria-label", `${t("reviews.star", "star")} ${i + 1}`);
      star.addEventListener("click", () => {
        rating = i + 1;
        paintStars();
      });
      star.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          rating = i + 1;
          paintStars();
        }
      });
      starContainer.appendChild(star);
    });
  };

  // Toggle active class based on rating
  const paintStars = () => {
    [...starContainer.children].forEach((star, i) => {
      star.classList.toggle("active", i < rating);
    });
  };

  // Render existing reviews from localStorage
  const loadReviews = () => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviewsContainer.innerHTML = "";

    reviews.forEach((review) => {
      const item = document.createElement("div");
      item.className = "review-item";

      const stars = document.createElement("div");
      stars.className = "review-stars";
      stars.textContent = "★".repeat(review.rating || 0);

      const name = document.createElement("div");
      name.className = "review-name";
      name.textContent = review.name;

      const text = document.createElement("div");
      text.className = "review-text";
      text.textContent = review.text;

      item.appendChild(stars);
      item.appendChild(name);
      item.appendChild(text);
      reviewsContainer.prepend(item);
    });
  };

  // Save a new review locally
  const saveReview = () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text || rating === 0) {
      alert(t("reviews.missingFields", "Please enter your name, rating, and review."));
      return;
    }

    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.push({ name, text, rating });
    localStorage.setItem("reviews", JSON.stringify(reviews));

    nameInput.value = "";
    textInput.value = "";
    rating = 0;
    paintStars();
    loadReviews();
  };

  // Pull translated placeholders/labels from i18n so they update on toggle
  const applyTranslations = () => {
    nameInput.placeholder = t("reviews.namePlaceholder", "Your name...");
    textInput.placeholder = t("reviews.commentPlaceholder", "Write your review...");
    submitBtn.textContent = t("reviews.submit", "Submit");
    const heading = document.querySelector("[data-i18n='reviews.leaveReview']");
    if (heading) heading.textContent = t("reviews.leaveReview", "Leave a Review");
  };

  // Bind events and initialize UI
  submitBtn.addEventListener("click", saveReview);
  buildStars();
  paintStars();
  loadReviews();
  applyTranslations();

  // Refresh placeholders when the language changes
  if (window.i18n?.subscribe) {
    window.i18n.subscribe(applyTranslations);
  }
}

document.addEventListener("DOMContentLoaded", initReviewSystem);
