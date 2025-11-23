console.log("login.js loaded");

// BACKEND CONNECTION - Load from config.js
// Make sure config.js is loaded before this script
const API_BASE_URL = window.API_BASE_URL || "http://127.0.0.1:9000/api";

const loginForm  = document.getElementById("loginForm");
const loginMsgEl = document.getElementById("loginMessage");

if (!loginForm) {
  console.warn("loginForm not found on this page");
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput    = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
      console.error("Login inputs not found (loginEmail / loginPassword)");
      return;
    }

    const email    = emailInput.value.trim();
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
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        loginMsgEl.textContent = data.message || "Login failed";
        loginMsgEl.classList.add("error");
        return;
      }

      //  حفظ التوكن وبيانات المستخدم (نفسه)
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        localStorage.setItem("user_email", data.user?.email || "");
      }

      loginMsgEl.textContent = "Logged in successfully ✅";
      loginMsgEl.classList.add("success");

      //  نقرأ الوجهة اللي كان ناوي يروح لها قبل ما نوقفه
      const redirectStored = localStorage.getItem("post_login_redirect");

      //  نرجع للهوم أو للصفحة اللي كان يبيها وهو مسجل دخول
      setTimeout(() => {
        //  (تعديل) لو فيه رابط محفوظ نستخدمه، غير كذا نرجع لـ index.html
        const redirectTo = redirectStored || "../../pages/index.html";

        //  تنظيف القيمة بعد الاستخدام عشان ما تعلق
        if (redirectStored) {
          localStorage.removeItem("post_login_redirect");
        }

        window.location.href = redirectTo;
      }, 800);

    } catch (err) {
      console.error("Login fetch error:", err);
      loginMsgEl.textContent = "Error connecting to server";
      loginMsgEl.classList.add("error");
    }
  });
}
