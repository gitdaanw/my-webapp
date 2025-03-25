const fs = require("fs");
const path = require("path");
const sequelize = require("../sequelize");
const Picture = require("../models/Picture");

async function importData() {
  try {
    await sequelize.sync(); // make sure db is ready

    const filePath = path.join(__dirname, "../data/picture_collection.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(rawData);

    if (!jsonData.pictures || !Array.isArray(jsonData.pictures)) {
      console.error("No valid 'pictures' array found in JSON.");
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

    console.log("Data imported successfully.");
  } catch (err) {
    console.error("Import failed:", err);
  } finally {
    await sequelize.close();
  }
}

importData();
