import { API_BASE_URL } from "./utils/api-base.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    // handle the form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // prevents page refresh

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/authentication/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert("Account succesvol aangemaakt!");
                window.location.href = "index.html";
            } else {
                const error = await response.json();
                alert(`Fout: ${error.message}`);
            }
        } catch (err) {
            console.error("Registratie mislukt:", err);
            alert("Er is een fout opgetreden tijdens registratie.");
        }
    });
});
