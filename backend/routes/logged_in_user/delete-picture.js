const express = require("express");
const router = express.Router();
const { requireLoginPage } = require("../../utils/authentication");
const Picture = require("../../models/Picture");

// route delete /pictures/id, requirelogin, delete picture from collection
router.delete("/:id", requireLoginPage, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const picture = await Picture.findByPk(id);

        if (!picture) {
            return res.status(404).json({ message: "Picture not found" });
        }

        await picture.destroy();
        res.status(200).json({ message: `Picture with ID ${id} deleted.` });
    } catch (error) {
        console.error("Error deleting picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;