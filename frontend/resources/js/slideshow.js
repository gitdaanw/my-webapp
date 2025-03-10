import { collectionData } from "../media/images/picture_collection.js";

document.addEventListener("DOMContentLoaded", function () {
    const slideshowImage = document.getElementById("slideshowImage");
    const slideshowDescription = document.getElementById("slideshowDescription");


    // creates a random index from collection to pick a picture using math floor to round down
    let currentIndex = Math.floor(Math.random() * collectionData.length);

    // null check
    if(!collectionData || collectionData.length ===0) {
        console.error("No images found in collectionData");
        return;
    }

    // function to update image and description
    function updateSlideshow() {
        slideshowImage.src = collectionData[currentIndex].image;
        slideshowDescription.textContent = collectionData[currentIndex].description_nl;
        
        // use opacity and css styling to create a ease in
        slideshowImage.style.opacity = "1";
    }

    // sets a random image
    updateSlideshow();

    // listener on picture click
    slideshowImage.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % collectionData.length; // cycle through images upon click
        updateSlideshow();
    });
});

