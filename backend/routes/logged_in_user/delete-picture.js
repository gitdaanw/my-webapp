const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// import authentication function
const {requireLoginPage} = require("../../utils/authentication");

// route delete /pictures/id, requirelogin, delete picture from collection
router.delete("/:id", requireLoginPage, (req, res) => {
    // define the filepath to collection
    const filePath = path.join(__dirname, "../../data/picture_collection.json");

    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const idToPatch = Number(req.params.id); // get the id
        const index = data.pictures.findIndex(p => p.id === idToPatch); // find the index of the id

        // if the index cannot be found, throw an error
        if (index === -1) {
            return res.status(404).json({ message: "Picture not found" });
        }

        // remove the picture from the array
        data.pictures.splice(index, 1);


        // write updated data back to the collection
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        // send response with success
        res.status(201).json({message: "Picture deleted"});

        // handle errors related to read and write
    } catch (error) {
        console.error("Error deleting picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;