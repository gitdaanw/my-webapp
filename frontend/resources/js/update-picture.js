document.addEventListener("DOMContentLoaded", async function () {
    const updatePictureForm = document.getElementById("updatePictureForm");
    const submitButton = document.querySelector("button[type='submit']");

    // trigger picture submission when submit button is clicked
    submitButton.addEventListener("click", function () {
        updatePictureForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    // handler for form submission
    updatePictureForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // prevents unwanted refresh of the page

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

        // attempt to sent pciture using PATCH
        try {
            console.log("trying to fetch add");
            const response = await fetch("/update-picture/35", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin", // needed for session-cookie
                body: JSON.stringify(newPicture)
            });

            if (response.ok) {
                alert("Foto sucesvol aangepast!");
                window.location.href = "pictures.html";
            } else {
                alert("Toevoegen foto mislukt");
                const errorText = await response.text();
                console.error("Server response:", response.status, errorText);
            }
        } catch (err) {
            console.error("Error submitting picture: ", err);
            alert("Er ging iets mis bij het verzenden van de data")
        }
    });

});