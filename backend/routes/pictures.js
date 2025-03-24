const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DEFAULT_SORT = "date-asc"; // adds a backup sort default

// use helper function to load pictures from JSON file
const { getPictures } = require("../utils/picture-data");
const { requireLoginPage } = require("../utils/authentication");

// GET route to get all pictures
router.get("/", (req, res) => {
    try {
        let pictures = getPictures(); // load the pictures 
        const category = req.query.category;
        const sort = req.query.sort || DEFAULT_SORT;
        const page = req.query.page || 1; // 1 is the defautl incase no value is passed in URL
        let perPage = req.query.perPage || 8; // 8 is the default in case no value is passed in URL

        console.log(req.query);

        // filtering of the collection
        if (category && category !== "all") {
            pictures = pictures.filter(p => p.category_nl.toLowerCase() === category.toLowerCase());
        }

        // change per page to 
        if (perPage === "all") {
            perPage = pictures.length;
            console.log(pictures.length);
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

// GET route to get all categories in the collection
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

// GET route to get a count for the number of pictures in the collection
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

// GET route for single picture using ID
router.get("/:id", (req, res) => {
    const pictures = getPictures();
    const picture = pictures.find(p => p.id === Number(req.params.id));

    if(!picture) {
        return res.status(404).json({message: "Picture not found"});
    }

    res.json(picture);
});

// DELETE route for deletion of a single picture, requires login before use
router.delete("/:id", requireLoginPage, (req, res) => {
    const filePath = path.join(__dirname, "../data/picture_collection.json");

    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"))        

        const idToDelete = Number(req.params.id);
        const index = data.pictures.findIndex(p => p.id === idToDelete)

        // if indexs is not found return error
        if (index === -1) {
            return res.status(404).json({ message: "Picture not found" });
        }
        data.pictures.splice(index, 1); // Remove picture from array
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        res.status(200).json({ message: `Picture with ID ${idToDelete} deleted.` });
    } catch (error) {
        console.error("Error deleting picture:", error);
        res.status(500).json({ message: "Internal server error" });
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