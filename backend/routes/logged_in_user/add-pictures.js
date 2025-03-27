const express = require("express");
const router = express.Router();
const { requireLoginPage } = require("../../utils/authentication");
const Picture = require("../../models/Picture");

/* 
This file defines a protected route to add a new picture
*/

// route post /add-pictures, with requiredlogin
// demo usage only
router.post("/", requireLoginPage, async (req, res) => {
    try {
        const {
            image,
            date,
            country_nl,
            country_en,
            city,
            category_nl,
            category_en,
            description_nl,
            description_en
        } = req.body;

        // validate required fields, needs extention when used in live
        if (!image || !date || !category_nl || !description_nl) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newPicture = await Picture.create({
            image,
            date,
            country_nl,
            country_en,
            city,
            category_nl,
            category_en,
            description_nl,
            description_en
        });

        res.status(201).json({ message: "Picture added", id: newPicture.id });
    } catch (err) {
        console.error("Error creating picture:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;