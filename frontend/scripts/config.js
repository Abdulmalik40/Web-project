/**
 * API Configuration
 * 
 * This file centralizes the API base URL configuration.
 * 
 * IMPORTANT NOTES:
 * - Frontend runs on port 8000 (or any port) - this is where HTML/JS files are served
 * - Backend API runs on port 9000 - this is where Laravel API is served
 * - These are DIFFERENT ports and that's fine!
 * 
 * AUTO-DETECTION MODE (default):
 * - If accessing frontend from localhost:8000 → API calls go to "http://127.0.0.1:9000/api"
 * - If accessing frontend from network IP:8000 → API calls go to "http://[SAME_IP]:9000/api"
 * 
 * Example:
 * - Frontend: http://192.168.1.100:8000 → API: http://192.168.1.100:9000/api
 * - Frontend: http://localhost:8000 → API: http://127.0.0.1:9000/api
 * 
 * MANUAL CONFIGURATION MODE:
 * Set USE_MANUAL_CONFIG = true and set BACKEND_IP below
 */

// ============================================
// CONFIGURATION OPTIONS
// ============================================

// Set to true to use manual IP configuration, false for auto-detection
const USE_MANUAL_CONFIG = false;

// Manual backend server IP (only used if USE_MANUAL_CONFIG = true)
// This should be the IP address where the backend (port 9000) is running
// Example: "192.168.1.100" or "10.0.0.5"
// Leave empty to use auto-detection
const BACKEND_IP = "";

// ============================================
// AUTO-DETECTION LOGIC
// ============================================

let API_BASE_URL;

if (USE_MANUAL_CONFIG && BACKEND_IP) {
  // Manual mode: use specified backend IP
  API_BASE_URL = `http://${BACKEND_IP}:9000/api`;
  console.log(`[API Config] Using manual configuration: ${API_BASE_URL}`);
} else {
  // Auto-detection mode: use the same hostname as the frontend
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
  
  if (isLocalhost) {
    // Frontend accessed via localhost → backend also on localhost
    API_BASE_URL = "http://127.0.0.1:9000/api";
    console.log(`[API Config] Frontend on localhost → Backend: ${API_BASE_URL}`);
  } else {
    // Frontend accessed via network IP → backend on same IP (different port)
    API_BASE_URL = `http://${hostname}:9000/api`;
    console.log(`[API Config] Frontend on ${hostname} → Backend: ${API_BASE_URL}`);
  }
}

// Expose to window for use in other scripts
window.API_BASE_URL = API_BASE_URL;

