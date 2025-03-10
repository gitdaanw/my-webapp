document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const addPictureForm = document.getElementById("addPictureForm");
    const submitButton = document.querySelector("button[type='submit']");

    if (!loggedInUser) {
        window.location.href = "index.html"; // redirect if not logged in
    }

    // submit button listener
    submitButton.addEventListener("click", function () {
        addPictureForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    // form listener, needed to handle data and prevent refresh
    addPictureForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        let storedData = JSON.parse(localStorage.getItem("collectionData")) || [];

        // get form data
        const newPicture = {
            image: document.getElementById("image").value,
            date: document.getElementById("date").value,
            country_nl: document.getElementById("country_nl").value,
            country_en: document.getElementById("country_nl").value,
            city: document.getElementById("city").value,
            category_nl: document.getElementById("category_nl").value,
            category_en: document.getElementById("category_nl").value, 
            description_nl: document.getElementById("description_nl").value,
            description_en: document.getElementById("description_nl").value 
        };

        // add new picture to the collection
        storedData.push(newPicture);
        
        // save to local storage, this is only usable in demo as it is tempstorage
        localStorage.setItem("collectionData", JSON.stringify(storedData));

        alert("Foto Succesvol Toegevoegd!");

        // redirect to gallery page
        window.location.href = "pictures.html";
    });
});
