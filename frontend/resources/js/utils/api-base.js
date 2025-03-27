
/* 
This file sets the correct API base URL depending on app being ran locally or remote in Azure
*/

// Determine base URL based on environment
export const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api"
  : "https://webdevelopmentwebappbackend-e6gvg5eja3c7hueg.westeurope-01.azurewebsites.net/api"; // found in azure backend as standard domain
