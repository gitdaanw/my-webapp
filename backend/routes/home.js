const express = require("express");
const router = express.Router();
const Picture = require("../models/Picture");

/*
THis file contains routes for /index.html. Currently it only 
handles serving a random picture used for slideshow on /index.html
*/

// GET route for home to get random picture
router.get("/slideshow", async (req, res) => {
  try {
    const count = await Picture.count();

    if (count === 0) {
      return res.status(404).json({ message: "No pictures found" });
    }

    const randomOffset = Math.floor(Math.random() * count);
    const picture = await Picture.findOne({ offset: randomOffset });

    if (!picture) {
      return res.status(404).json({ message: "No picture found" });
    }

    res.json(picture);
  } catch (err) {
    console.error("Error fetching random picture:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
