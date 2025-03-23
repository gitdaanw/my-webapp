const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DEFAULT_SORT = "date-asc"; // adds a backup sort default

// use helper function to load pictures from JSON file
const { getPictures } = require("../utils/picture-data");

router.get("/", (req, res) => {
    try {
        let pictures = getPictures(); // load the pictures 
        // TODO console.log("pictures before sorting: ", pictures);
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

router.get("/count", (req, res) => {
    try {
        let pictures = getPictures();

        const category = req.query.category;
        if (category && category !== "all") {
            pictures = pictures.filter(p => p.category_nl.toLowerCase() === category.toLowerCase());
        }

        res.json({ total: pictures.length });
    }
    catch (error) {
        console.error("Error in /pictures/count:", error);
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