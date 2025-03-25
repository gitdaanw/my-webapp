/* This script is meant to seed the db with 
data connected to the pictures found under frontend/media/images
To run you can run:
node backend/scripts/seed-pictures.js */

const fs = require("fs");
const path = require("path");
const sequelize = require("../sequelize");
const Picture = require("../models/Picture");

async function seedPictures() {
  try {
    await sequelize.sync(); // Ensures DB and tables are created

    const filePath = path.join(__dirname, "../data/backup/backup - picture_collection.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(rawData);

    if (!jsonData.pictures || !Array.isArray(jsonData.pictures)) {
      console.error(" No valid 'pictures' array found.");
      return;
    }

    for (const pic of jsonData.pictures) {
      await Picture.create({
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

seedPictures();
