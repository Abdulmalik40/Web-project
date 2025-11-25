console.log("login.js loaded");

// BACKEND CONNECTION - Load from config.js
// Make sure config.js is loaded before this script
const getApiUrl = () => {
  return window.API_BASE_URL || "http://127.0.0.1:9000/api";
};

// Wait for DOM to be ready
const setupLoginForm = () => {
  console.log("Setting up login form...");
  const loginForm = document.getElementById("loginForm");
  const loginMsgEl = document.getElementById("loginMessage");

  if (!loginForm) {
    console.error("loginForm not found! Retrying...");
    // Retry after a short delay
    setTimeout(setupLoginForm, 100);
    return;
  }

  console.log("Login form found, attaching submit handler");

  // Check if handler already attached
  if (loginForm.hasAttribute('data-handler-attached')) {
    console.log("Handler already attached, skipping");
    return;
  }

  loginForm.setAttribute('data-handler-attached', 'true');

  // Also attach click handler to button as backup
  const submitButton = loginForm.querySelector('button[type="submit"]');
  if (submitButton) {
    console.log("Submit button found, attaching click handler");
    submitButton.addEventListener("click", (e) => {
      console.log("Submit button clicked!");
      e.preventDefault();
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("✅ Login form submitted - preventDefault called");
    console.log("Form element:", loginForm);
    console.log("Event type:", e.type);

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
      console.error("Login inputs not found (loginEmail / loginPassword)");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!loginMsgEl) {
      console.error("loginMessage element not found");
      return;
    }

    // تفريغ الرسالة القديمة
    loginMsgEl.textContent = "";
    loginMsgEl.className = "auth-message";

    // تحقّق بسيط
    if (!email || !password) {
      loginMsgEl.textContent = "Please fill all fields.";
      loginMsgEl.classList.add("error");
      return;
    }

    try {
      const apiUrl = getApiUrl();
      console.log("Making fetch request to:", `${apiUrl}/login`);
      console.log("Request data:", { email, password: "***" });

      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      // Check if response has content
      const responseText = await res.text();
      console.log("Response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Login response (parsed):", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.error("Response was:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        loginMsgEl.textContent = data.message || "Login failed";
        loginMsgEl.classList.add("error");
        return;
      }

      // حفظ التوكن وبيانات المستخدم
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        localStorage.setItem("user_email", data.user?.email || "");
      }

      loginMsgEl.textContent = "Logged in successfully ✅";
      loginMsgEl.classList.add("success");

      // نقرأ الوجهة اللي كان ناوي يروح لها قبل ما نوقفه
      let redirectStored = localStorage.getItem("post_login_redirect");

      // نرجع للهوم أو للصفحة اللي كان يبيها وهو مسجل دخول
      setTimeout(() => {
        // Use document-relative path (no leading slash) for Ubuntu server
        let redirectTo = "index.html";
        if (redirectStored) {
          // Normalize: remove /pages/ prefix and leading slash
          let normalizedPath = redirectStored
            .replace(/^\/pages\//, '')  // remove /pages/ prefix if present
            .replace(/^\//, '')         // remove leading slash
            || "index.html";
          
          redirectTo = normalizedPath;
          localStorage.removeItem("post_login_redirect");
        }

        window.location.href = redirectTo;
      }, 800);

    } catch (err) {
      console.error("Login fetch error:", err);
      if (loginMsgEl) {
        loginMsgEl.textContent = "Error connecting to server";
        loginMsgEl.classList.add("error");
      }
    }
  };

  loginForm.addEventListener("submit", handleSubmit);

  // Also attach to button click as backup
  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Button clicked, triggering form submit handler");
      handleSubmit(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }

  console.log("Login form submit handler attached successfully");
};

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLoginForm);
} else {
  setupLoginForm();
}

// Also try after a delay as fallback
setTimeout(() => {
  const form = document.getElementById("loginForm");
  if (form && !form.hasAttribute('data-handler-attached')) {
    console.log("Fallback: attaching handler");
    setupLoginForm();
  }
}, 500);
