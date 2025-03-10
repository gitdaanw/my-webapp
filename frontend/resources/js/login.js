document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    //test users
    const users = [
        {username : "testUser", password: "password1234"}
    ];

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // prevents form to refresh page

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        const user = users.find(user => user.username === username && user.password === password);
        
        if(user) {
            alert("Login Succesvol!")
            localStorage.setItem("loggedInUser", username);
            window.location.href= "index.html";
        } else {
            alert("Gebruikersnaam of password klopt niet");
            window.location.href = "login.html";
        }
    });
});