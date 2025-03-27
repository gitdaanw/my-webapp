const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

// define the user model
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // username is unique, prevents doubles
    },
    passwordHash: { // TODO naming convention error, I need to update this later password_hash
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
    }
}, {
    timestamps: false   // no createdAt or updatedAt used at this point
});

module.exports = User;