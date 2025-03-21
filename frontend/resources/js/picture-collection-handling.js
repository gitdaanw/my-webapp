document.addEventListener("DOMContentLoaded", function () {
    const pictureContainer = document.getElementById("gallery");
    const sortSelect = document.getElementById("sort");
    const categoryFilter = document.getElementById("categoryFilter");
    const picturesPerPageFilter = document.getElementById("picturesPerPageFilter");
    const navigationContainer = document.getElementById("navigation");
    
    // lightbox 
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close-lightbox");
    

    // let filteredData = [];
    let currentPage = 1;
    let picturesPerPage = 5;


    async function fetchPictures() {
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

//     function initializeCollection() {
//         const storedData = JSON.parse(localStorage.getItem("collectionData")) || [];
    
//         // Merge storedData into collectionData without reassigning
//         collectionData.push(...storedData);
    
//         populateCategoryDropdown();
//         applyFilterAndSort();
//     }
//     // Populate category filter dropdown dynamically
//     function populateCategoryDropdown() {
//         // create an array (map) of all categories using Set to remove duplicates
//         // Add all as a category top of the list
//         // => for each item returns category_nl from json
//         const categories = ["Alles", ...new Set(collectionData.map(item => item.category_nl))];

//         categoryFilter.innerHTML = categories
//             .map(category => `<option value="${category}">${category}</option>`)
//             .join("");
//     }

//     // function to sort the collection using the labels
//     function sortCollection(attribute, order = "asc") {
//         // use .sort to sort the items in filteredData
//         filteredData.sort((a, b) => {
//             let result;
            
//             // date needs different sort then strings
//             if (attribute === "date") {
//                 result = new Date(a.date) - new Date(b.date);
//             } else {
//                 result = a[attribute].localeCompare(b[attribute]);
//             }
//             // ? is ternary (if else) so condition desc ? expression_true : expression_false
//             return order === "desc" ? -result : result;
//         });
    
//         currentPage = 1;
//         renderCollection();
//     }

//     // Function to apply filtering and sorting
//     function applyFilterAndSort() {
//         const selectedCategory = categoryFilter.value;
//         // ...collectionData creates a copy of the list, prevents me from modifying the original list
//         filteredData = selectedCategory === "Alles" ? [...collectionData] : collectionData.filter(item => item.category_nl === selectedCategory);

//         currentPage = 1;    // reset to first page when filter is applied

//         const selectedOption = sortSelect.value;
//         const [attribute, order] = selectedOption.split("-");
//         sortCollection(attribute, order === "desc" ? "desc" : "asc");

//         // Update pagination based on new filtered data
//         updateNavigationControls();
//     }

//     function filterCollectionByCategory(category) {
//         return category === "Alles" ? [...collectionData] : collectionData.filter(item => item.category_nl === category);
//     }

    // function to render the collected data
    function renderCollection(pictures, totalPages) {
        pictureContainer.innerHTML = "";

        // const startIndex = (currentPage - 1) * picturesPerPage;
        // const endIndex = startIndex + picturesPerPage;
        // const paginatedData = filteredData.slice(startIndex, endIndex);

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
            <button id="prevPage" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <span> Page ${currentPage} of ${totalPages} </span>
            <button id="nextPage" ${currentPage >= totalPages ? "disabled" : ""}>Next</button>
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
    }

    // change page function back or forward direction
    function changePageByDirection(direction) {
        const totalPages = getTotalPages();
        
        currentPage += direction;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages > 0 ? totalPages : 1;

        renderCollection();
    }

    // change page function
    function changePage(page) {
        const totalPages = getTotalPages();
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        currentPage = page;
        renderCollection();
    }

    function setPicturesPerPage() {
        const selectedValue = picturesPerPageFilter.value;

        picturesPerPage = selectedValue === "all" ? filteredData.length : parseInt(selectedValue, 10);
        currentPage = 1; // reset to first page
        renderCollection(); // re-render the collection
        updateNavigationControls(); // update the navigation based on picture per page
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

    function getTotalPages() {
       return Math.ceil(filteredData.length / picturesPerPage);
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

    // // event sort listener
    // sortSelect.addEventListener("change", () => {
    //     const selectedOption = sortSelect.value;
    //     const [attribute, order] = selectedOption.split("-");
    //     sortCollection(attribute, order === "desc" ? "desc" : "asc");
    // });

    fetchPictures();

});