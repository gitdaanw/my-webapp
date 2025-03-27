const {Sequelize} = require("sequelize");
const path = require("path");

// setting up sequalize ORM
// sequalize is the bridge between Javascript and database
// Using sequalize prevents having to write all queries ourselves
const sequelize = new Sequelize({
    dialect: "sqlite", // we will use sqlite
    storage: path.join(__dirname, "data/database.sqlite"), // location of the database
    logging: false // no logging, delete this or set to true if I need logging
  });

module.exports = sequelize; // export the instance to be used elsewhere 