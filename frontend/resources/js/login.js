// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./utils/api-base.js";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert("Login succesvol!");
        window.location.href = "index.html";
    } else {
        alert("Gebruikersnaam of password klopt niet");
    }
});
