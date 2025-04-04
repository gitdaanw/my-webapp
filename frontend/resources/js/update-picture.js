// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./utils/api-base.js";

document.addEventListener("DOMContentLoaded", async function () {
    const updatePictureForm = document.getElementById("updatePictureForm");
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownList = document.getElementById("dropdownList");
    const submitButton = document.querySelector("button[type='submit']");
    const pictureThumbnail = document.getElementById("thumbnailPreview");


    // lightbox 
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");

    let currentId = null; // used to track current selected picture

    // function to load selected picture data into the form fields
    async function loadPictureIntoForm(id) {
        try {
            // fetch picture using id
            const res = await fetch(`${API_BASE_URL}/pictures/${id}`, { credentials: "include" });
            const picture = await res.json();
            currentId = picture.id;

            // thumnbnail
            pictureThumbnail.src = picture.image;
            pictureThumbnail.alt = `Preview picture to update: ${picture.image.split("/").pop()}`;
            pictureThumbnail.style.display = "block";

            document.getElementById("date").value = picture.date || "";
            document.getElementById("country_nl").value = picture.country_nl || "";
            document.getElementById("city").value = picture.city || "";
            document.getElementById("category_nl").value = picture.category_nl || "";
            document.getElementById("description_nl").value = picture.description_nl || "";
            document.getElementById("image").value = picture.image || "";
            addLightboxEventListeners();
        } catch (err) {
            console.error("Fout bij ophalen van de afbeelding:", err);
        }
    }

    // function to fetch pictures collection and load dropdown list
    async function loadPictureList() {
        try {
            const res = await fetch(`${API_BASE_URL}/pictures?category=all&perPage=all&sort=id-asc`, { credentials: "include" }); // sorting on id
            const data = await res.json();

            // prevent crash if wrong format is used
            if (!Array.isArray(data.pictures)) {
                console.warn("No picture data received");
                return;
              }

            data.pictures.forEach(picture => {
                const fileName = picture.image.split("/").pop();
                const li = document.createElement("li");
                li.textContent = `${picture.id} – ${fileName}`;
                li.title = fileName;

                li.addEventListener("click", () => {
                    dropdownButton.textContent = `${picture.id} – ${fileName}`;
                    dropdownList.classList.add("hidden");
                    loadPictureIntoForm(picture.id);
                });

                dropdownList.appendChild(li);
            });
        } catch (err) {
            console.error("Fout bij laden van de collectie:", err);
        }
    }

    // makes dropdown visible when clicked
    dropdownButton.addEventListener("click", () => {
        dropdownList.classList.toggle("hidden");
    });

    // hide dropdown when clicked outside of component
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#pictureDropdown")) {
            dropdownList.classList.add("hidden");
        }
    });

    // submit updated picture to collection
    submitButton.addEventListener("click", function () {
        updatePictureForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    // lightbox listener
    closeBtn.addEventListener("click", closeLightbox);

    updatePictureForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // prevent reloading of the page

        // alert user if no picture is selected
        if (!currentId) return alert("Selecteer eerst een foto.");

        // gather form values
        const updatedData = {
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

        // send patch request to backend
        try {
            const response = await fetch(`${API_BASE_URL}/update-picture/${currentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert("Foto succesvol aangepast!");
                window.location.href = "pictures.html";
            } else {
                const errorText = await response.text();
                alert("Aanpassing mislukt");
                console.error("Server response:", response.status, errorText);
            }
        } catch (err) {
            console.error("Error updating picture: ", err);
            alert("Fout bij verzenden van de data");
        }
    });

    // lightbox related
    function openLightbox(imageSrc) {
        lightbox.style.display = "flex";
        lightboxImg.src = imageSrc;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function addLightboxEventListeners() {
        pictureThumbnail.addEventListener("click", function () {
            openLightbox(pictureThumbnail.src);
        });
    }

    // populate the dropdown when page loads
    await loadPictureList();
});
