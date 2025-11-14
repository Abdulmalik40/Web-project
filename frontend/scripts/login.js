// BACKEND CONNECTION
const API_BASE_URL = "http://127.0.0.1:9000/api";

const loginForm   = document.getElementById("loginForm");
const loginMsgEl  = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginMsgEl.textContent = "";
    loginMsgEl.style.color = "";

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login error:", data);
        loginMsgEl.textContent = data.message || "Login failed";
        loginMsgEl.style.color = "red";
        return;
      }

      // حفظ التوكن وبيانات المستخدم
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        localStorage.setItem("user_email", data.user?.email || "");
      }

      loginMsgEl.textContent = "Logged in successfully ✅";
      loginMsgEl.style.color = "green";

      setTimeout(() => {
        window.location.href = "/pages/index.html";
      }, 800);

    } catch (err) {
      console.error(err);
      loginMsgEl.textContent = "Error connecting to server";
      loginMsgEl.style.color = "red";
    }
  });
}
