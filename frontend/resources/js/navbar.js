function updateNavbar() {
    const navbarLinksContainer = document.querySelector(".navbar-links");
    const homeLink = `<a href="/index.html">Home</a>`;
    const aboutMeLink = `<a href="/aboutme.html">Over Mij</a>`;
    const picturesLink = `<a href="/pictures.html">Foto's</a>`;
    const loggedInUser = localStorage.getItem("loggedInUser");

    // clear existing links before adding new ones prevents null error
    navbarLinksContainer.innerHTML = "";

    // show links when logged in
    let authLink;
    if (loggedInUser) {
        authLink = `
            <a href="/add-pictures.html">Foto Toevoegen</a>
            <a href="#" id="logoutLink">Uitloggen</a>
        `;
    } else {
        authLink = `<a href="/login.html">Inloggen</a>`;    // if not logged in it shows inloggen
    }

    // inject links into navbar
    navbarLinksContainer.innerHTML = homeLink + aboutMeLink + picturesLink + authLink;

    // log out functionality
    if (loggedInUser) {
        document.getElementById("logoutLink").addEventListener("click", function () {
            alert("Uitloggen succesvol!");
            localStorage.removeItem("loggedInUser");
            window.location.href = "/index.html";
        });
    }
}

function toggleMenu() {
    const menu = document.querySelector('.navbar-links');
    menu.classList.toggle('active');
}