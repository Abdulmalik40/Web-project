let rating = 0;
const starContainer = document.getElementById("stars");

// click to set rating
starContainer.addEventListener("click", (e) => {
  if (e.target.tagName !== "SPAN" && e.target.textContent !== "★") return;

  const index = [...starContainer.children].indexOf(e.target);
  rating = index + 1;

  updateStars();
});

// turn stars into span elements
function initializeStars() {
  const stars = "★★★★★"
    .split("")
    .map((star) => `<span>${star}</span>`)
    .join("");
  starContainer.innerHTML = stars;
}
initializeStars();

// update gold stars
function updateStars() {
  [...starContainer.children].forEach((star, i) => {
    star.style.color = i < rating ? "gold" : "#555";
  });
}

// load reviews
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const container = document.getElementById("reviewsList");

  container.innerHTML = reviews
    .map(
      (r) => `
      <div class="review-item">
        <div class="review-stars">${"★".repeat(r.rating)}</div>
        <div class="review-name"><b>${r.name}</b></div>
        <div class="review-text">${r.text}</div>
      </div>
    `
    )
    .join("");
}
loadReviews();

// submit review
document
  .getElementById("submitReview")
  .addEventListener("click", () => {
    const name = document.getElementById("reviewName").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (!name || !rating || !text)
      return alert("Please enter your name, rating, and review.");

    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.push({ name, rating, text });

    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadReviews();

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";
    rating = 0;
    updateStars();
  });
