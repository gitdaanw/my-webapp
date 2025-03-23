import { checkLogin } from "./utils/authentication-utils.js";

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
            <a href="#" id="logoutLink">Uitloggen</a>
        `;
    } else {
        authLink = `<a href="/login.html">Inloggen</a>`;
    }

    navbarLinksContainer.innerHTML = homeLink + aboutMeLink + picturesLink + authLink;

    if (loggedInUser) {
        document.getElementById("logoutLink").addEventListener("click", async function () {
            await fetch("/auth/logout", { method: "POST" });
            alert("Uitloggen succesvol!");
            window.location.href = "/";
        });
    }
}

window.updateNavbar = updateNavbar;


function toggleMenu() {
    const menu = document.querySelector('.navbar-links');
    menu.classList.toggle('active');
}