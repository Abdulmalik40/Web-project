// frontend/scripts/auth-nav.js
// ✅ مسؤول عن التحكم في عناصر الهيدر (Login / Register / Profile / Logout)

(function () {
  // ⭐ دالة تحديث حالة عناصر الهيدر بناءً على وجود التوكن
  function updateAuthNav() {
    const token = localStorage.getItem("auth_token");
    console.log("[auth-nav] updateAuthNav, token:", token);

    const navLogin    = document.getElementById("nav-login");
    const navRegister = document.getElementById("nav-register");
    const navProfile  = document.getElementById("nav-profile");
    const navLogout   = document.getElementById("nav-logout");

    console.log("[auth-nav] nav items:", { navLogin, navRegister, navProfile, navLogout });

    if (token) {
      // مستخدم مسجل دخول
      if (navLogin)    navLogin.style.display    = "none";
      if (navRegister) navRegister.style.display = "none";
      if (navProfile)  navProfile.style.display  = "block";
      if (navLogout)   navLogout.style.display   = "block";
    } else {
      // مستخدم غير مسجل
      if (navLogin)    navLogin.style.display    = "block";
      if (navRegister) navRegister.style.display = "block";
      if (navProfile)  navProfile.style.display  = "none";
      if (navLogout)   navLogout.style.display   = "none";
    }
  }

  // ⭐ ربط زر تسجيل الخروج
  function bindLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("[auth-nav] Logout clicked");

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");

      // ارجاع المستخدم للهوم
      window.location.href = "index.html"; // عدّلها لو المسار مختلف
    });
  }

  // ⭐ تهيئة السكربت عند تحميل الصفحة
  function initAuthNav() {
    console.log("[auth-nav] initAuthNav()");
    updateAuthNav();
    bindLogout();
  }

  // تشغيل التهيئة
  document.addEventListener("DOMContentLoaded", initAuthNav);

  // ⭐ في حال تغيّر الـ localStorage من تبويب آخر
  window.addEventListener("storage", function (e) {
    if (e.key === "auth_token") {
      updateAuthNav();
    }
  });
})();
