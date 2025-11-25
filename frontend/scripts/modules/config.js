/**
 * API Configuration
 *
 * This file defines where your frontend should send API requests.
 *
 * DEV (local):
 *   - Frontend: http://localhost:8000  (or any local port)
 *   - Backend:  http://127.0.0.1:9000/api  (Laravel running locally)
 *
 * PROD (live server):
 *   - Frontend: https://visitsaudia.tech
 *   - Backend:  https://api.visitsaudia.tech/api
 */

(function () {
  console.log("%c[CONFIG] Loading API configuration...", "color: #0af; font-weight: bold;");

  // Detect current host
  const hostname = window.location.hostname;

  // You can adjust this list if you use other local hostnames
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "" ||
    hostname === "0.0.0.0";

  let API_BASE_URL;

  if (isLocalhost) {
    // 🧪 Development mode (local machine)
    API_BASE_URL = "http://127.0.0.1:9000/api";
    console.log(
      `%c[CONFIG] Running on LOCAL environment → API: ${API_BASE_URL}`,
      "color: orange; font-weight: bold;"
    );
  } else {
    // 🌍 Production mode (real domain)
    API_BASE_URL = "https://api.visitsaudia.tech/api";
    console.log(
      `%c[CONFIG] Running on PRODUCTION → API: ${API_BASE_URL}`,
      "color: green; font-weight: bold;"
    );
  }

  // Expose to other scripts
  window.API_BASE_URL = API_BASE_URL;
})();
