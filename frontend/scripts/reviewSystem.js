// Review system with backend API integration
// Requires user authentication to submit reviews
// Reviews are linked to user accounts and specific places (cities)

function initReviewSystem() {
  const nameInput = document.getElementById("reviewName");
  const textInput = document.getElementById("reviewText");
  const submitBtn = document.getElementById("submitReview");
  const starContainer = document.getElementById("stars");
  const reviewsContainer = document.getElementById("reviewsList");

  if (!textInput || !submitBtn || !starContainer || !reviewsContainer) return;

  let rating = 0;
  let placeKey = null;

  // Get API URL from config
  const getApiUrl = () => {
    const apiUrl = window.API_BASE_URL || "http://127.0.0.1:9000/api";
    // Log for debugging (only once)
    if (!getApiUrl._logged) {
      console.log("[Review System] API URL:", apiUrl);
      getApiUrl._logged = true;
    }
    return apiUrl;
  };

  // Get auth token
  const getToken = () => {
    return window.getToken ? window.getToken() : localStorage.getItem("auth_token");
  };

  // Get current user name
  const getUserName = () => {
    return localStorage.getItem("user_name") || "";
  };

  // Determine place_key from current page
  const determinePlaceKey = () => {
    // Extract from URL path (e.g., /pages/cities/makkah.html -> makkah)
    const path = window.location.pathname;
    const match = path.match(/cities\/([^\/]+)\.html/);
    if (match) {
      return match[1].toLowerCase();
    }
    
    // Fallback: try to extract from page title or other indicators
    const title = document.title.toLowerCase();
    const cities = ['makkah', 'riyadh', 'madinah', 'jeddah', 'alula', 'aseer', 'alkhobar'];
    for (const city of cities) {
      if (title.includes(city)) {
        return city;
      }
    }
    
    // Default fallback
    return 'unknown';
  };

  placeKey = determinePlaceKey();
  console.log('[Review System] Place key:', placeKey);

  // Helper that defers to global i18n when present so placeholders flip with language changes
  const t = (key, fallback = "") => {
    if (window.i18n?.t) {
      const translation = window.i18n.t(key);
      // If translation exists and is different from the key, use it
      // Otherwise use fallback
      if (translation && translation !== key) {
        return translation;
      }
    }
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

  // Load reviews from backend API
  const loadReviews = async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/reviews/${placeKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("[Review System] Failed to load reviews:", response.status);
        reviewsContainer.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary, #b6c7c2); padding: 20px;">
          ${t("reviews.loadError", "Unable to load reviews. Please try again later.")}
        </div>`;
        return;
      }

      const reviews = await response.json();
      reviewsContainer.innerHTML = "";

      if (reviews.length === 0) {
        const noReviewsDiv = document.createElement("div");
        noReviewsDiv.style.cssText = "text-align: center; color: var(--color-text-secondary, #b6c7c2); padding: 20px;";
        noReviewsDiv.textContent = t("reviews.noReviews", "No reviews yet. Be the first to review!");
        reviewsContainer.innerHTML = "";
        reviewsContainer.appendChild(noReviewsDiv);
        return;
      }

      reviews.forEach((review) => {
        const item = document.createElement("div");
        item.className = "review-item";

        const stars = document.createElement("div");
        stars.className = "review-stars";
        stars.textContent = "★".repeat(review.rating || 0);

        const name = document.createElement("div");
        name.className = "review-name";
        name.textContent = review.user?.name || t("reviews.anonymous", "Anonymous");

        const text = document.createElement("div");
        text.className = "review-text";
        text.textContent = review.comment || "";

        // Add date if available
        if (review.created_at) {
          const date = document.createElement("div");
          date.style.cssText = "font-size: 0.85rem; color: var(--color-text-muted, #8da3a0); margin-top: 4px;";
          const dateObj = new Date(review.created_at);
          date.textContent = dateObj.toLocaleDateString();
          item.appendChild(date);
        }

        item.appendChild(stars);
        item.appendChild(name);
        item.appendChild(text);
        reviewsContainer.prepend(item);
      });
    } catch (error) {
      console.error("[Review System] Error loading reviews:", error);
      reviewsContainer.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary, #b6c7c2); padding: 20px;">
        ${t("reviews.loadError", "Unable to load reviews. Please try again later.")}
      </div>`;
    }
  };

  // Save a new review to backend API
  const saveReview = async () => {
    // Check authentication
    const token = getToken();
    if (!token) {
      const loginUrl = "/auth/login.html";
      const currentPath = window.location.pathname;
      localStorage.setItem("post_login_redirect", currentPath);
      
      if (confirm(t("reviews.loginRequired", "You must be logged in to submit a review. Would you like to login now?"))) {
        window.location.href = loginUrl;
      }
      return;
    }

    const text = textInput.value.trim();
    if (!text || rating === 0) {
      alert(t("reviews.missingFields", "Please enter a rating and review text."));
      return;
    }

    // Disable submit button during request
    submitBtn.disabled = true;
    submitBtn.textContent = t("reviews.submitting", "Submitting...");

    try {
      const apiUrl = getApiUrl();
      const requestUrl = `${apiUrl}/reviews`;
      console.log("[Review System] Submitting review to:", requestUrl);
      console.log("[Review System] Place key:", placeKey);
      console.log("[Review System] Token present:", !!token);
      console.log("[Review System] Request body:", {
        place_key: placeKey,
        rating: rating,
        comment: text.substring(0, 50) + "...",
      });
      
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({
          place_key: placeKey,
          rating: rating,
          comment: text,
        }),
      }).catch((fetchError) => {
        // Handle network errors (CORS, connection refused, etc.)
        console.error("[Review System] Fetch error details:", {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack,
        });
        
        // Provide more specific error message
        let errorMsg = "Could not connect to server";
        if (fetchError.message.includes("Failed to fetch") || fetchError.message.includes("NetworkError")) {
          errorMsg = `Cannot reach server at ${apiUrl}. Please ensure:\n1. Backend server is running\n2. Server is accessible at this URL\n3. CORS is properly configured`;
        } else {
          errorMsg = fetchError.message || errorMsg;
        }
        
        throw new Error(`Network error: ${errorMsg}`);
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, get text
          const errorText = await response.text().catch(() => "");
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Success - clear form and reload reviews
      textInput.value = "";
      rating = 0;
      paintStars();
      await loadReviews();

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.style.cssText = "text-align: center; color: var(--color-accent-saudi-green, #00b365); padding: 10px; margin-top: 10px; background: rgba(0, 179, 101, 0.1); border-radius: 8px;";
      successMsg.textContent = t("reviews.success", "Review submitted successfully!");
      reviewsContainer.parentElement.insertBefore(successMsg, reviewsContainer);
      setTimeout(() => successMsg.remove(), 3000);

    } catch (error) {
      console.error("[Review System] Error saving review:", error);
      let errorMessage = t("reviews.submitError", "Failed to submit review. Please try again.");
      
      // Provide more specific error messages
      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        errorMessage += "\n\nNetwork error: Could not connect to the server. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage += "\n\n" + error.message;
      }
      
      alert(errorMessage);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t("reviews.submit", "Submit");
    }
  };

  // Update UI based on authentication status
  const updateAuthUI = () => {
    const token = getToken();
    const userName = getUserName();

    if (token && userName) {
      // User is logged in - hide name input, show user name
      if (nameInput) {
        nameInput.style.display = "none";
        // Optionally show user name label
        const nameLabel = nameInput.previousElementSibling;
        if (nameLabel && nameLabel.tagName === "LABEL") {
          nameLabel.textContent = `${t("reviews.reviewingAs", "Reviewing as")}: ${userName}`;
        } else {
          // Create a label if it doesn't exist
          const label = document.createElement("div");
          label.style.cssText = "margin-bottom: 8px; color: var(--color-text-secondary, #b6c7c2); font-size: 0.9rem;";
          label.textContent = `${t("reviews.reviewingAs", "Reviewing as")}: ${userName}`;
          nameInput.parentElement.insertBefore(label, nameInput);
        }
      }
    } else {
      // User is not logged in - show message
      if (nameInput) {
        nameInput.style.display = "none";
        const loginPrompt = document.createElement("div");
        loginPrompt.style.cssText = "margin-bottom: 12px; padding: 12px; background: rgba(255, 125, 45, 0.1); border-radius: 8px; border: 1px solid rgba(255, 125, 45, 0.3);";
        
        const messageDiv = document.createElement("div");
        messageDiv.style.cssText = "color: var(--color-text-primary, #e8f3ec); margin-bottom: 8px;";
        messageDiv.textContent = t("reviews.loginToReview", "Please login to leave a review");
        
        const loginLink = document.createElement("a");
        loginLink.href = "/auth/login.html";
        loginLink.style.cssText = "color: var(--color-accent-saudi-green, #00b365); text-decoration: underline;";
        loginLink.textContent = t("reviews.loginLink", "Login");
        
        loginPrompt.appendChild(messageDiv);
        loginPrompt.appendChild(loginLink);
        nameInput.parentElement.insertBefore(loginPrompt, nameInput);
      }
    }
  };

  // Bind events and initialize UI
  submitBtn.addEventListener("click", saveReview);
  buildStars();
  paintStars();
  updateAuthUI();
  loadReviews();

  // Reload reviews when auth state changes (e.g., after login)
  window.addEventListener("storage", (e) => {
    if (e.key === "auth_token") {
      updateAuthUI();
      loadReviews();
    }
  });
}

document.addEventListener("DOMContentLoaded", initReviewSystem);
