const isLocalHost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const LOCAL_API_URL = "http://localhost:5000/api";

// Update this before deploying the frontend.
const PRODUCTION_API_URL = "https://your-render-backend.onrender.com/api";

export const API_URL = isLocalHost ? LOCAL_API_URL : PRODUCTION_API_URL;
