/**
 * API Configuration
 * 
 * Frontend domain:  visitthekingdom.sa
 * Backend domain:   api.visitthekingdom.sa
 * 
 * In production we call the backend via its domain, not localhost.
 */

const USE_MANUAL_CONFIG = true;

// In production, we use the API domain behind Nginx
const BACKEND_HOST = "api.visitthekingdom.sa";

let API_BASE_URL;

if (USE_MANUAL_CONFIG && BACKEND_HOST) {
  // Use http for now; after SSL, change to https
  API_BASE_URL = `http://${BACKEND_HOST}/api`;
  console.log(`[API Config] Using production backend: ${API_BASE_URL}`);
} else {
  // Fallback: auto-detect for local development
  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "";

  if (isLocalhost) {
    API_BASE_URL = "http://127.0.0.1:9000/api";
    console.log(`[API Config] Frontend on localhost → Backend: ${API_BASE_URL}`);
  } else {
    API_BASE_URL = `http://${hostname}:9000/api`;
    console.log(`[API Config] Frontend on ${hostname} → Backend: ${API_BASE_URL}`);
  }
}

export { API_BASE_URL };
