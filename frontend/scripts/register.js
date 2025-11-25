console.log("register.js loaded");

// BACKEND CONNECTION - Load from config.js
// Make sure config.js is loaded before this script
// Use window.API_BASE_URL directly to avoid redeclaration error
const getApiUrl = () => {
  return window.API_BASE_URL || "http://127.0.0.1:9000/api";
};

// Wait for DOM to be ready
const setupRegisterForm = () => {
  console.log("Setting up register form...");
  const registerForm = document.getElementById("registerForm");
  const messageEl = document.getElementById("registerMessage");

  if (!registerForm) {
    console.error("registerForm not found! Retrying...");
    // Retry after a short delay
    setTimeout(setupRegisterForm, 100);
    return;
  }

  console.log("Register form found, attaching submit handler");

  // Check if handler already attached
  if (registerForm.hasAttribute('data-handler-attached')) {
    console.log("Handler already attached, skipping");
    return;
  }

  registerForm.setAttribute('data-handler-attached', 'true');

  // Also attach click handler to button as backup
  const submitButton = registerForm.querySelector('button[type="submit"]');
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
    console.log("✅ Register form submitted - preventDefault called");
    console.log("Form element:", registerForm);
    console.log("Event type:", e.type);
    
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!nameInput || !emailInput || !passwordInput) {
      console.error("Register inputs not found (name/email/password)");
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!messageEl) {
      console.error("registerMessage element not found");
      return;
    }

    // تفريغ الرسالة القديمة
    messageEl.textContent = "";
    messageEl.className = "auth-message";

    // تحقّق بسيط قبل الإرسال
    if (!name || !email || !password) {
      messageEl.textContent = "Please fill all fields.";
      messageEl.classList.add("error");
      return;
    }

    try {
      const apiUrl = getApiUrl();
      console.log("Making fetch request to:", `${apiUrl}/register`);
      console.log("Request data:", { name, email, password: "***" });
      
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      console.log("Response headers:", res.headers);
      
      // Check if response has content
      const responseText = await res.text();
      console.log("Response text:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Register response (parsed):", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.error("Response was:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        messageEl.textContent = data.message || "Registration failed";
        messageEl.classList.add("error");
        return;
      }

      // ✅ حفظ التوكن وبيانات المستخدم (نعتبره Logged-in مباشرة)
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        localStorage.setItem("user_email", data.user?.email || "");
      }

      messageEl.textContent = "Account created successfully 🎉";
      messageEl.classList.add("success");

      // ✅ نرجع للهوم وهو مسجل دخول
      setTimeout(() => {
        // Redirect to home page (nginx serves from root, not /pages/)
        let redirectTo = "/index.html";
        const redirectStored = localStorage.getItem("post_login_redirect");
        
        if (redirectStored) {
          // Normalize: remove /pages/ prefix if present, keep relative paths
          let normalizedPath = redirectStored
            .replace(/^\/pages\//, '')  // remove /pages/ prefix if present
            .replace(/^\//, '')         // remove leading slash
            || "index.html";
          
          // Use normalized path (without /pages/ prefix)
          redirectTo = `/${normalizedPath}`;
          
          localStorage.removeItem("post_login_redirect");
        }
        
        window.location.href = redirectTo;
      }, 800);
    } catch (err) {
      console.error("Register fetch error:", err);
      if (messageEl) {
        messageEl.textContent = "Error connecting to server";
        messageEl.classList.add("error");
      }
    }
  };

  registerForm.addEventListener("submit", handleSubmit);
  
  // Also attach to button click as backup
  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Button clicked, triggering form submit handler");
      handleSubmit(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }
  
  console.log("Register form submit handler attached successfully");
};

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupRegisterForm);
} else {
  setupRegisterForm();
}

// Also try after a delay as fallback
setTimeout(() => {
  const form = document.getElementById("registerForm");
  if (form && !form.hasAttribute('data-handler-attached')) {
    console.log("Fallback: attaching handler");
    setupRegisterForm();
  }
}, 500);

// ⛔️ ملاحظة هامة:
// لا نضيف هنا أي كود له علاقة بالـ navbar (Login / Register / Profile / Logout)
// منطق التبديل سيكون في main.js فقط
