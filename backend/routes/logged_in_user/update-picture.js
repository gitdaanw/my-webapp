const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// import authentication function
const {requireLoginPage} = require("../../utils/authentication");

router.patch("/:id", requireLoginPage, (req, res) => {
    const filePath = path.join(__dirname, "../../data/picture_collection.json");

    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        if (!data.pictures || !Array.isArray(data.pictures)) {
            return res.status(500).json({ message: "Invalid data structure" });
        }

        const idToPatch = Number(req.params.id);
        const index = data.pictures.findIndex(p => p.id === idToPatch);

        if (index === -1) {
            return res.status(404).json({ message: "Picture not found" });
        }

        // Patch fields from request body
        const allowedFields = [
            "date",
            "country_nl", "country_en",
            "city",
            "category_nl", "category_en",
            "description_nl", "description_en",
            "image"
        ];

        for (const key of allowedFields) {
            if (key in req.body) {
                data.pictures[index][key] = req.body[key];
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        res.status(201).json({message: "Picture updated"});

    } catch (error) {
        console.error("Error updating picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;