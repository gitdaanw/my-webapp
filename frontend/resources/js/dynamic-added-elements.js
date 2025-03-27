/* 
This file has helper functions that allow dyncamic adding of elements and content on multiple pages
*/

function loadComponent(id, file) {
    return fetch(file)
        .then(response => response.text())
        .then(data =>  {
            document.getElementById(id).innerHTML = data;
            });
    }

async function loadHeaderAndFooter() {
    await Promise.all([ // makes sure both are present
        loadComponent("header", "header.html"),
        loadComponent("footer", "footer.html")
    ]);
    
    if (typeof updateNavbar === "function") {
        await updateNavbar();
    }

    // adds listener for the hamburgermenu only if present
    if (typeof attachNavbarHamburgerMenu === "function") {
        attachNavbarHamburgerMenu();
    }
}


// DOMContentLoaded event waits for page to be parsed and the fires below loadHeaderAndFooter function
// async function tells javascript there are asynchronous operations allows to use await

document.addEventListener("DOMContentLoaded", loadHeaderAndFooter);