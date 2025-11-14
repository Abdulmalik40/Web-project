// عنوان الـ API حق الباكند (Laravel)
const API_BASE_URL = "http://127.0.0.1:9000/api";

const registerForm = document.getElementById("registerForm");
const messageEl = document.getElementById("registerMessage");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ناخذ القيم من الحقول
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // تصفير الرسالة
    messageEl.textContent = "";
    messageEl.style.color = "";

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // لو الفاليديشن أو أي خطأ ثاني
        console.error("Register error:", data);
        messageEl.textContent = data.message || "Registration failed";
        messageEl.style.color = "red";
        return;
      }

      // نجاح ✅: نخزن التوكن مثلاً ونطلع رسالة
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        localStorage.setItem("user_email", data.user?.email || "");
      }

      messageEl.textContent = "Account created successfully 🎉";
      messageEl.style.color = "green";

      // ممكن مستقبلاً نوجّه لصفحة تسجيل الدخول / الصفحة الرئيسية
      // window.location.href = "/pages/login.html";

    } catch (err) {
      console.error(err);
      messageEl.textContent = "Error connecting to server";
      messageEl.style.color = "red";
    }
  });
}
