import { capitalize } from "./utils/string-utils.js";

// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./utils/api-base.js";

/* 
This file contains the add-picture javascript
*/

// async function to enable usage of await
document.addEventListener("DOMContentLoaded", async function () {
    const addPictureForm = document.getElementById("addPictureForm");
    const submitButton = document.querySelector("button[type='submit']");

    // trigger picture submission when submit button is clicked
    // this is redundant, as submit button already performs thid by default
    // TODO delete
    submitButton.addEventListener("click", function () {
        addPictureForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    // handler for form submission
    addPictureForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // prevents unwanted refresh of the page

        // collect values from the form
        const image = document.getElementById("image").value;
        const date = document.getElementById("date").value;
        const country_nl = document.getElementById("country_nl").value;
        const country_en = country_nl; // not handles separately as only for demo
        const city = document.getElementById("city").value;
        const category_nl = capitalize(document.getElementById("category_nl").value);
        const category_en = category_nl; // not handles separately as only for demo
        const description_nl = document.getElementById("description_nl").value;
        const description_en = description_nl; // not handles separately as only for demo

        // create new picture object
        const newPicture = {
            image,
            date,
            country_nl,
            country_en,
            city,
            category_nl,
            category_en,
            description_nl,
            description_en
        };

        // attempt to sent pciture using POST
        try {
            const response = await fetch(`${API_BASE_URL}/add-pictures`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // needed for session-cookie
                body: JSON.stringify(newPicture)
            });

            if (response.ok) {
                alert("Foto sucesvol toegevoegd!");
                window.location.href = "pictures.html";
            } else {
                const errorText = await response.text();
                console.error("Server response:", response.status, errorText);
                alert("Toevoegen foto mislukt");
            }
        } catch (err) {
            console.error("Error submitting picture: ", err);
            alert("Er ging iets mis bij het verzenden van de data")
        }
    });
});
