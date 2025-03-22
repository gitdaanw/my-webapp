const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DEFAULT_SORT = "date-asc"; // adds a backup sort default

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
        // console.log("pictures before sorting: ", pictures);
        const category = req.query.category;
        const sort = req.query.sort || DEFAULT_SORT;
        const page = req.query.page || 1; // 1 is the defautl incase no value is passed in URL
        const perPage = req.query.perPage || 8; // 8 is the default in case no value is passed in URL

        console.log(req.query);

        // filtering of the collection
        if (category && category !== "all") {
            pictures = pictures.filter(p => p.category_nl.toLowerCase() === category.toLowerCase());
        }

        // sorting the collection
        if (sort) {
            const [attribute, order] = sort.split("-");
            pictures = sortCollection(pictures, attribute, order);
        }

        const total = pictures.length;
        const startIndex = (page - 1) * perPage;
        const paginatedData = pictures.slice(startIndex, startIndex + parseInt(perPage));

        res.json({
            totalPages: Math.ceil(total / perPage),
            currentPage: parseInt(page),
            pictures: paginatedData
        });
    } catch (error) {
        console.error("Error processing /pictures request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/categories", (req, res) => {
    try {
        const pictures = getPictures();
        const categories = [...new Set(pictures.map(p => p.category_nl))].sort();
        res.json(categories);
    } catch (error) {
        console.error("Error getting categories", error );
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function sortCollection(data, attribute, order = "asc") {
    return data.sort((a, b) => {
        let result;
        if (attribute === "date") {
            result = new Date(a.date) - new Date(b.date);
        } else {
            result = (a[attribute] || "").localeCompare(b[attribute] || "");
        }
        return order === "desc" ? -result : result;
    });
};

module.exports = router;