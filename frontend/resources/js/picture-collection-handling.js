// default sorting value
const DEFAULT_SORT = "date-asc";

// import base URL for deployed functionality and local testing
import { API_BASE_URL } from "./utils/api-base.js";


/* 
This file contains javascript for the /pictures page
*/

document.addEventListener("DOMContentLoaded", async () => {
    
    const pictureContainer = document.getElementById("gallery");
    const sortSelect = document.getElementById("sort");
    const categoryFilter = document.getElementById("categoryFilter");
    const picturesPerPageFilter = document.getElementById("picturesPerPageFilter");
    const navigationContainer = document.getElementById("navigation");
    
    await populateCategoryDropdown();

    sortSelect.value = DEFAULT_SORT;

    // lightbox 
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");
    
    // let filteredData = [];
    let currentPage = 1;
    let picturesPerPage = 5;
    let totalPages = 1; // placeholder


    // endpoint to fetch pictures using dynamic URL builder
    async function fetchPictures(page = currentPage) {
        currentPage = page;
        const category = categoryFilter.value;
        const sort = sortSelect.value;
        
        let url = `${API_BASE_URL}/pictures?page=${currentPage}&perPage=${picturesPerPage}`;
        if (category !== "Alles") url += `&category=${category}`;
        if (sort) url += `&sort=${sort}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            renderCollection(data.pictures, data.totalPages);
        } catch (error) {
            console.error("Error fetching pictures:", error);
        }   
    }

    // endpoint to fetch picture count
    async function getTotalPicturesForCategory() {
        const category = categoryFilter.value;
        
        // endpoint to get the count of the collection
        let url = `${API_BASE_URL}/pictures/count`;

        // if category is not all we add it to the query parameter
        if (category !== "Alles") {
            url += `?category=${category}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.total || 0; // return the count or a 0 if undefined to prevent errors
        } catch (err) {
            console.error("Error fetching picture count:", err);
            return 0;
        }
    }

    // function to populate categorydropdown using /pictures/categories endpoint
    async function populateCategoryDropdown() {
        try {
            const response = await fetch(`${API_BASE_URL}/pictures/categories`);
            const categories = await response.json();
            const options = ["Alles", ...categories];

            categoryFilter.innerHTML = options
                .map(category => `<option value="${category}">${category}</option>`)
                .join("");
        } catch (error) {
            console.error("Error loading category list:", error);
        }
    };

    // helper function to update pictures per page when changing filters
    async function updatePicturesPerPage() {
        const selectedValue = picturesPerPageFilter.value;
    
        if (selectedValue === "all") {
            picturesPerPage = await getTotalPicturesForCategory();
        } else {
            picturesPerPage = parseInt(selectedValue, 10);
        }
    }

    // function to render the collected data
    function renderCollection(pictures, passedTotalPages) {
        // check if there is any pictures and of type array
        if (!Array.isArray(pictures)) {
            console.warn("No pictures received");
            pictureContainer.innerHTML = "<p>Geen foto's gevonden.</p>";
            return;
        }
        
        totalPages = passedTotalPages;
        pictureContainer.innerHTML = "";

        pictures.forEach(item => {
            const photoCard = document.createElement("article");
            photoCard.classList.add("photo-card");

            // photoCard layout and dynamic elements from collection
            photoCard.innerHTML = `
                <img src="${item.image}" alt="${item.description_en}" class="photo-thumbnail" data-full="${item.image}">
                <div class="photo-info">
                    <p class="photo-label">Date: <span>${item.date}</span></p>
                    <p class="photo-label">Country: <span>${item.country_nl}</span></p>
                    <p class="photo-label">City: <span>${item.city}</span></p>
                    <p class="photo-label">Category: <span>${item.category_nl}</span></p>
                    <p class="photo-description">${item.description_nl}</p>
                </div>
            `;
            pictureContainer.appendChild(photoCard);
        });
        
        updateNavigationControls(totalPages);
        addLightboxEventListeners();
    }

    // Navigationcontrols function
    function updateNavigationControls(totalPages) {
        navigationContainer.innerHTML = `
            <button id="firstPage" ${currentPage === 1 ? "disabled" : ""}><<</button>
            <button id="prevPage" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <span> Page ${currentPage} of ${totalPages} </span>
            <button id="nextPage" ${currentPage >= totalPages ? "disabled" : ""}>Next</button>
            <button id="lastPage" ${currentPage === totalPages ? "disabled" : ""}>>></button>
            `;

        document.getElementById("prevPage").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                fetchPictures();
            }
        });

        document.getElementById("nextPage").addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchPictures();
            }
        });

        document.getElementById("firstPage").addEventListener("click", () => {
            changePage(1)
        });

        document.getElementById("lastPage").addEventListener("click", () => {
            changePage(totalPages);
        }); 
    }

    // change page function
    function changePage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    fetchPictures(page);
}

    // lightbox related
    function openLightbox(imageSrc) {
        lightbox.style.display = "flex";
        lightboxImg.src = imageSrc;
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function addLightboxEventListeners() {
        document.querySelectorAll(".photo-thumbnail").forEach(image => {
            image.addEventListener("click", function () {
                openLightbox(this.dataset.full);
            });
        });
    }

    // lightbox listener
    closeBtn.addEventListener("click", closeLightbox);

    // sortm, filter and pictures per page listener
    sortSelect.addEventListener("change", () => {
        currentPage = 1;
        fetchPictures();
    });

    categoryFilter.addEventListener("change", async () => {
        await updatePicturesPerPage(); 
        currentPage = 1;
        fetchPictures();
    });
    
    picturesPerPageFilter.addEventListener("change", async () => {
        await updatePicturesPerPage(); 
        currentPage = 1;
        fetchPictures();
    });

    // call fetchPictures
    fetchPictures();

});