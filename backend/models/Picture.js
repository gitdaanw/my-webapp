const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // we use sequelize instance from sequelize.js file

// define the picture model
const Picture = sequelize.define("Picture", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: { // stores image filename and path
        type: DataTypes.STRING,
        allowNull: false,
    },
    // optional fields for now
    date: DataTypes.DATEONLY,
    country_nl: DataTypes.STRING,
    country_en: DataTypes.STRING,
    city: DataTypes.STRING,
    category_nl: DataTypes.STRING,
    category_en: DataTypes.STRING,
    description_nl: DataTypes.TEXT,
    description_en: DataTypes.TEXT
}, {
    timestamps: false // disable sequelize default behavior to add createdAt/updatedAt fields
});

module.exports = Picture;
