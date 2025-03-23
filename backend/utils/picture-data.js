const fs = require("fs");
const path = require("path");

function getPictures() {
    try {
        const filePath = path.join(__dirname, "../data/picture_collection.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        if (!data.pictures || !Array.isArray(data.pictures)) {
            console.error("Error: Expected 'pictures' to be an array but got:", typeof data.pictures);
            return [];
        }

        return data.pictures;
    } catch (error) {
        console.error("Error loading picture_collection.json:", error);
        return [];
    }
}

function getRandomPicture() {
    const pictures = getPictures();
    if (!pictures || pictures.length === 0) return null;

    const index = Math.floor(Math.random() * pictures.length);
    return pictures[index];
}

module.exports = { getPictures, getRandomPicture };