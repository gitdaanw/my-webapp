// Determine base URL based on environment
export const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api"
  : "webdevelopmentwebappbackend-e6gvg5eja3c7hueg.westeurope-01.azurewebsites.net"; // found in azure backend as standard domain
