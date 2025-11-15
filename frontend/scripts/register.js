console.log("register.js loaded");

const API_BASE_URL = "http://127.0.0.1:9000/api";

const registerForm = document.getElementById("registerForm");
const messageEl = document.getElementById("registerMessage");

// عناصر الإدخال من الصفحة
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (!registerForm) {
  console.warn("registerForm not found on this page");
}

if (registerForm && nameInput && emailInput && passwordInput) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Register response:", data);

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
        // عدّل المسار إذا صفحة register في مجلد مختلف
        window.location.href = "index.html";
      }, 800);
    } catch (err) {
      console.error("Register fetch error:", err);
      if (messageEl) {
        messageEl.textContent = "Error connecting to server";
        messageEl.classList.add("error");
      }
    }
  });
} else {
  console.warn("Some auth inputs not found (name/email/password).");
}

// ⛔️ ملاحظة هامة:
// لا نضيف هنا أي كود له علاقة بالـ navbar (Login / Register / Profile / Logout)
// منطق التبديل سيكون في main.js فقط
