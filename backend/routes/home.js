const express = require("express");
const router = express.Router();
const { getRandomPicture } = require("../utils/picture-data");

// Return one random picture (as JSON)
router.get("/slideshow", (req, res) => {
    const picture = getRandomPicture();
    if (!picture) {
        return res.status(404).json({ message: "No pictures found" });
    }
    res.json(picture);
});

module.exports = router;