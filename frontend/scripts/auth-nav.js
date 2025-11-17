// frontend/scripts/auth-nav.js
// ✅ ملف ES Module فيه التوكن + حماية الصفحات + التحكم في عناصر الهيدر

// =============
//  Helpers
// =============

// نرجّع التوكن من localStorage
export function getToken() {
  return localStorage.getItem("auth_token");
}

// نتأكد أن المستخدم مسجل دخول لو الصفحة طالبة auth
// نستخدم data-requires-auth و data-post-login-redirect من الـ <body>
export function requireAuth() {
  const token = getToken();
  const body = document.body;
  const requiresAuth = body?.dataset.requiresAuth === "true";

  if (!requiresAuth) {
    // الصفحة عادي حتى لو المستخدم مو لاقن إن
    return true;
  }

  if (!token) {
    const redirect =
      body.dataset.postLoginRedirect ||
      window.location.pathname.split("/").pop();

    console.log("[auth-nav] not logged in, redirecting to login.html, then ->", redirect);

    // نخزن الوجهة اللي نرجع لها بعد اللوقن
    localStorage.setItem("post_login_redirect", redirect);
    window.location.href = "auth/login.html";
    return false;
  }

  return true;
}

// =============
//  داخلي: تحديث الهيدر + اللوق أوت + حماية الروابط
// =============

function updateAuthNav() {
  const token = getToken();
  console.log("[auth-nav] updateAuthNav, token:", token);

  const navLogin   = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navProfile  = document.getElementById("nav-profile");
  const navLogout   = document.getElementById("nav-logout");

  console.log("[auth-nav] nav items:", { navLogin, navRegister, navProfile, navLogout });

  if (token) {
    if (navLogin) navLogin.style.display = "none";
    if (navRegister) navRegister.style.display = "none";
    if (navProfile) navProfile.style.display = "block";
    if (navLogout) navLogout.style.display = "block";
  } else {
    if (navLogin) navLogin.style.display = "block";
    if (navRegister) navRegister.style.display = "block";
    if (navProfile) navProfile.style.display = "none";
    if (navLogout) navLogout.style.display = "none";
  }
}

function bindLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("[auth-nav] Logout clicked");

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("post_login_redirect");

    window.location.href = "index.html";
  });
}

// أي رابط أو عنصر عليه data-requires-auth="true" نحميه
function bindProtectedLinks() {
  const protectedLinks = document.querySelectorAll("[data-requires-auth='true']");
  console.log("[auth-nav] found protected links:", protectedLinks.length);

  protectedLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const token = getToken();
      console.log("[auth-nav] protected link clicked, token:", token);

      if (!token) {
        e.preventDefault();

        const targetHref =
          link.dataset.redirect ||
          link.getAttribute("href") ||
          link.href ||
          "";

        console.log("[auth-nav] saving post_login_redirect:", targetHref);
        localStorage.setItem("post_login_redirect", targetHref);
        window.location.href = "auth/login.html";
      }
    });
  });
}

function initAuthNav() {
  console.log("[auth-nav] initAuthNav()");
  updateAuthNav();
  bindLogout();
  bindProtectedLinks();
}

// نشغّل التهيئة أول ما تحمل الصفحة
document.addEventListener("DOMContentLoaded", initAuthNav);

// لو التوكن تغيّر من تبويب ثاني
window.addEventListener("storage", (e) => {
  if (e.key === "auth_token") {
    updateAuthNav();
  }
});
