// API base URL for the backend.
//
// - Same-origin setup (Express serves both frontend and API): leave as ""
// - Split deployment (frontend hosted separately, e.g. Render Static Site / GitHub Pages):
//   set this to the API's full origin, e.g. "https://resume-roaster-api.onrender.com"
//
// On Render Static Sites you can skip editing this file entirely by adding an
// environment variable API_BASE_URL to the static site (see README).
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL_OVERRIDE) || '';
