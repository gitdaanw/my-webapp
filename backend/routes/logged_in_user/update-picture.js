const express = require("express");
const router = express.Router();
const { requireLoginPage } = require("../../utils/authentication");
const Picture = require("../../models/Picture");

/* 
This file defines a protected route to update a picture
*/

// route PATCH /pictures/id, requirelogin, update existing picture
router.patch("/:id", requireLoginPage, async (req, res) => {
    // define the filepath to collection
    const pictureId = Number(req.params.id);

  try {
    const picture = await Picture.findByPk(pictureId);

    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }

    // only allow specific fields to be updated
    const allowedFields = [
      "date",
      "country_nl", "country_en",
      "city",
      "category_nl", "category_en",
      "description_nl", "description_en",
      "image"
    ];

    // filter only allowed fields from the request body
    const updates = {};
    for (const key of allowedFields) {
      if (key in req.body) {
        updates[key] = req.body[key];
      }
    }

    // apply the update
    await picture.update(updates);

    res.status(200).json({ message: "Picture updated" });
  } catch (error) {
    console.error("Error updating picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;