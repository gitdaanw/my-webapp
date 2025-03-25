document.addEventListener("DOMContentLoaded", async function () {
    const slideshowImage = document.getElementById("slideshowImage");
    const slideshowDescription = document.getElementById("slideshowDescription");

    async function loadRandomPicture() {
        try {
            const res = await fetch("/api/slideshow");
            if (!res.ok) throw new Error("Failed to fetch slideshow image");
            const picture = await res.json();

            // start with hidden image before loading
            // slideshowImage.style.opacity = "0";

            // set image and fade in after it loads
            slideshowImage.onload = () => {
                slideshowImage.style.opacity = "1";
            };

            // set image and description
            slideshowImage.src = picture.image;
            slideshowDescription.textContent = picture.description_nl;

        } catch (err) {
            console.error("Error loading home slideshow:", err);
        }
    }

    // load initial image
    await loadRandomPicture();

    // load a new image on click
    slideshowImage.addEventListener("click", loadRandomPicture);
});
