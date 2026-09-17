// API base URL for the backend.
//
// - Same-origin setup (Express serves both frontend and API): leave as ""
// - Split deployment (frontend hosted separately, e.g. Render Static Site / GitHub Pages):
//   set this to the API's full origin, e.g. "https://resume-roaster-api.onrender.com"
//
// On Render Static Sites you can skip editing this file entirely by adding an
// environment variable API_BASE_URL to the static site (see README).
// Normalize: a trailing slash would produce "//api/roast" (a 404), so strip it.
const RAW_API_BASE = (typeof window !== 'undefined' && window.API_BASE_URL_OVERRIDE) || '';
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');
