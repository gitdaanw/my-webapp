const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// function to load pictures from JSON file
const getPictures = () => {
    try {
        const filePath = path.join(__dirname, '../data/picture_collection.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!data.pictures || !Array.isArray(data.pictures)) {
            console.error("Error: Expected 'pictures' to be an array but got:", typeof data.pictures);
            return [];
        }

        return data.pictures; // ✅ Now returning the array instead of the whole object
    } catch (error) {
        console.error("Error loading picture_collection.json:", error);
        return [];
    }
};

router.get("/", (req, res) => {
    try {
        let pictures = getPictures(); // load the pictures 
        console.log("pictures before sorting: ", pictures);
        const { category, sort, page =1, perPage = 5 } = req.query;

        // filtering of the collection
        if (category && category !== "all") {
            pictures = pictures.filter(p => p.category_nl.toLowerCase() === category.toLowerCase());
        }

        // sorting the collection
        if (sort) {
            const [attribute, order] = sort.split("-");
            if (attribute && (attribute === "date" || attribute === "city")) {
                pictures.sort((a, b) => {
                    let result;
                    if (attribute === "date") {
                        result = new Date(a.date) - new Date(b.date);
                    } else {
                        result = a[attribute].localeCompare(b[attribute]);
                    }
                    return order === "asc" ? result : -result;
                });
            } else {
                console.error("Invalid sorting attribute:", attribute);
            }
    }

    const total = pictures.length;
    const startIndex = (page - 1) * perPage;
    const paginatedData = pictures.slice(startIndex, startIndex + parseInt(perPage));

    res.json({
        totalPages: Math.ceil(total / perPage),
        currentPage: parseInt(page),
        pictures:paginatedData
    });
} catch (error) {
    console.error("Error processing /pictures request:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
});

module.exports = router;