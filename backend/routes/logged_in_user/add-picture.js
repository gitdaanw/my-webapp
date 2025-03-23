const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// function to block users if not logged in
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        next(); // if logged in user can proceed
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

// route post /add-picture
router.post("/", requireLogin, (req, res) => {
    const newPicture = req.body; // collect data sent by frontend

    const filePath = path.join(__dirname, "../../data/picture_collection.json");
    console.log("filepath is located in ", filePath);
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log(data);

        // check if data is of type array to prevent errors
        if (!data.pictures || !Array.isArray(data.pictures)) {
            return res.status(500).json({message: "invalid data structure"});
        }

        // add id to the new picture
        const nextId = Math.max(...data.pictures.map(p => p.id || 0)) + 1;
        newPicture.id = nextId;

        // add picture to the array
        data.pictures.push(newPicture);

        // save updated data back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        res.status(201).json({message: "Picture added", id: nextId});
    } catch (err) {
        console.error("Error writing to JSON", err);
        res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;