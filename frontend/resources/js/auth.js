document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const body = document.body;

    // blocks display of page body if not logged in
    body.style.display = "none";

    // below redirects users to index.html if not logged in on pages with login required
    if (!loggedInUser && document.body.dataset.protected === "true") {
        window.location.href = "index.html";
    } else {
        // show the body if the user is logged in
        body.style.display = "block";
    }
});
