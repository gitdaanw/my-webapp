document.addEventListener("DOMContentLoaded", async function () {
    const deletePictureForm = document.getElementById("deletePictureForm");
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownList = document.getElementById("dropdownList");
    const submitButton = document.querySelector("button[type='submit']");
    const pictureThumbnail = document.getElementById("thumbnailPreview");

    // lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");

    let currentId = null; // track picture selected for deletion

    // load details for selected picture into form
    async function loadPictureIntoForm(id) {
        try {
            const res = await fetch(`api/pictures/${id}`, { credentials: "same-origin" });
            const picture = await res.json();
            currentId = picture.id;

            // Thumbnail preview
            pictureThumbnail.src = picture.image;
            pictureThumbnail.alt = `Preview picture to delete: ${picture.image.split("/").pop()}`;
            pictureThumbnail.style.display = "block";

            // fills the fields with data or empty string
            document.getElementById("date").value = picture.date || "";
            document.getElementById("country_nl").value = picture.country_nl || "";
            document.getElementById("city").value = picture.city || "";
            document.getElementById("category_nl").value = picture.category_nl || "";
            document.getElementById("description_nl").value = picture.description_nl || "";
            document.getElementById("image").value = picture.image || "";

            // enables lightbox
            addLightboxEventListeners();
        } catch (err) {
            console.error("Fout bij ophalen van de afbeelding:", err);
        }
    }

    // function to load pictures into dropdownlist
    async function loadPictureList() {
        try {
            const res = await fetch("api/pictures?category=all&perPage=all&sort=id-asc", {
                credentials: "same-origin"
            });
            const data = await res.json();

            // prevents crash when list is empty or wrong
            if (!Array.isArray(data.pictures)) {
                console.warn("No picture data received.");
                return;
            }

            // create dropdown items
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

    // toggle dropdown
    dropdownButton.addEventListener("click", () => {
        dropdownList.classList.toggle("hidden");
    });

    // hide dropdown if clicked outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#pictureDropdown")) {
            dropdownList.classList.add("hidden");
        }
    });

    // trigger deletion of picture
    submitButton.addEventListener("click", function () {
        deletePictureForm.dispatchEvent(new Event("submit", { cancelable: true }));
    });

    // close lightbox
    closeBtn.addEventListener("click", closeLightbox);

    // delete the picture using backend
    deletePictureForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!currentId) {
            return alert("Selecteer eerst een foto.");
        }

        const confirmDelete = confirm(`Weet je zeker dat je foto ${currentId} wilt verwijderen?`);
        if (!confirmDelete) return;

        try {
            const response = await fetch(`api/delete-picture/${currentId}`, {
                method: "DELETE",
                credentials: "same-origin"
            });

            if (response.ok) {
                alert("Foto succesvol verwijderd!");
                window.location.href = "pictures.html";
            } else {
                const errorText = await response.text();
                console.error("Server response:", response.status, errorText);
                alert("Verwijderen mislukt");
            }
        } catch (err) {
            console.error("Error deleting picture:", err);
            alert("Fout bij verzenden van de data");
        }
    });

    // lightbox logic
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

    await loadPictureList();
});
