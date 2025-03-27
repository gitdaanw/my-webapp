/* This script is meant to seed the db with 
data connected to the pictures found under frontend/media/images
To run it execute:
node backend/scripts/seed-pictures.js */

const fs = require("fs");
const path = require("path");
const sequelize = require("../sequelize");
const Picture = require("../models/Picture");

async function seedPictures() {
    try {
        await sequelize.sync(); // Ensures DB and tables are created

        // add code to check if there is data in the db
        const count = await Picture.count();
        if (count > 0) {
            console.log("Database already contains data. Skipping seeding.");
            await sequelize.close();
            return;
        }

        const filePath = path.join(__dirname, "../data/backup/backup - picture_collection.json"); // point to backup json
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);

        if (!jsonData.pictures || !Array.isArray(jsonData.pictures)) {
            console.error("No valid 'pictures' array found.");
            return;
        }

        for (const pic of jsonData.pictures) {
            await Picture.create({ // could be done using bulkCreate function but for small collection its fine
                image: pic.image,
                date: pic.date,
                country_nl: pic.country_nl,
                country_en: pic.country_en,
                city: pic.city,
                category_nl: pic.category_nl,
                category_en: pic.category_en,
                description_nl: pic.description_nl,
                description_en: pic.description_en
            });
        }

        console.log(`✅ ${jsonData.pictures.length} pictures added to the database.`);
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        await sequelize.close();
    }
}

module.exports = seedPictures;

// Allow running manually
if (require.main === module) {
    seedPictures();
}
