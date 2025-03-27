import { checkLogin } from "./utils/authentication-utils.js";
// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./utils/api-base.js";

/* 
This file contains javascript for the dynamic navbar
*/

async function updateNavbar() {
    const navbarLinksContainer = document.querySelector(".navbar-links");
    const homeLink = `<a href="/">Home</a>`;
    const aboutMeLink = `<a href="/aboutme.html">Over Mij</a>`;
    const picturesLink = `<a href="/pictures.html">Foto's</a>`;

    let loggedInUser = null;

    try {
        loggedInUser = await checkLogin(); // used always, causes 401 when not logged in
    } catch (e) {
        console.error("Login check failed:", e);
    }

    navbarLinksContainer.innerHTML = "";

    let authLink;
    if (loggedInUser) {
        authLink = `
            <a href="/add-pictures.html">Foto Toevoegen</a>
            <a href="/update-picture.html">Foto Aanpassen</a>
            <a href="/delete-picture.html">Foto verwijderen</a>
            <a href="#" id="logoutLink">Uitloggen</a>
        `;
    } else {
        authLink = `<a href="/login.html">Inloggen</a>`;
    }

    navbarLinksContainer.innerHTML = homeLink + aboutMeLink + picturesLink + authLink;

    if (loggedInUser) {
        document.getElementById("logoutLink").addEventListener("click", async function () {
            await fetch(`${API_BASE_URL}/authentication/logout`, { method: "POST", credentials: "include"  });
            alert("Uitloggen succesvol!");
            window.location.href = "/";
        });
    }
}

window.updateNavbar = updateNavbar; // window. makes this globally available

function toggleMenu() {
    const menu = document.querySelector('.navbar-links');
    menu.classList.toggle('active');
}

window.attachNavbarHamburgerMenu = function () { // globally available through window.
    const hamburger = document.querySelector(".navbar-hamburger-menu");
    if (hamburger) {        // checks if hamburger menu is visible, if so adds listener
        hamburger.addEventListener("click", toggleMenu);
    }
};
