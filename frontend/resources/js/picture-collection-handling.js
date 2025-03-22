// default sorting value
const DEFAULT_SORT = "date-asc";

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
        
        let url = `/pictures?page=${currentPage}&perPage=${picturesPerPage}`;
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

    async function populateCategoryDropdown() {
        try {
            const response = await fetch("/pictures/categories");
            const categories = await response.json();
            const options = ["Alles", ...categories];

            categoryFilter.innerHTML = options
                .map(category => `<option value="${category}">${category}</option>`)
                .join("");
        } catch (error) {
            console.error("Error loading category list:", error);
        }
    };

    // function to render the collected data
    function renderCollection(pictures, passedTotalPages) {
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

    // sort and filter listener
    sortSelect.addEventListener("change", () => {
        currentPage = 1;
        fetchPictures();
    });

    categoryFilter.addEventListener("change", () => {
        currentPage = 1;
        fetchPictures();
    });

    // pictures per page listener
    picturesPerPageFilter.addEventListener("change", () => {
        picturesPerPage = parseInt(picturesPerPageFilter.value, 10);
        currentPage = 1;
        fetchPictures();
    });

    // call fetchPictures
    fetchPictures();

});