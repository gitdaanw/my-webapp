const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Picture = sequelize.define("Picture", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: DataTypes.DATEONLY,
    country_nl: DataTypes.STRING,
    country_en: DataTypes.STRING,
    city: DataTypes.STRING,
    category_nl: DataTypes.STRING,
    category_en: DataTypes.STRING,
    description_nl: DataTypes.TEXT,
    description_en: DataTypes.TEXT
}, {
    timestamps: false
});

module.exports = Picture;
