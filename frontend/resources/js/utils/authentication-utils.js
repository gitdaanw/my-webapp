// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./api-base.js";

// check if a user is logged in
export async function checkLogin() {
    try {
        const res = await fetch(`${API_BASE_URL}/authentication/check`, { credentials: "include" });
        if (res.ok) {
            return await res.json(); // logged in user information
        } 
    } catch (err) {
        console.error("Login check failed: ", err);
    }
    return null;
}

// protects pages where login is required
export async function guardProtectedPage() {
    // check if .html has data-protected= "true" tag
    const requiresLogin = document.body.dataset.protected === "true";
    if (!requiresLogin) return; // if not it skips login check

    // perform the check if required
    const user = await checkLogin();
    if (!user) {
        window.location.href = "/login.html";
    }
}