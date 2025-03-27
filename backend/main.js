const cors = require("cors"); // import cors, needed to have backend talk to frontend
const express = require("express"); // impport express framework
const path = require("path"); // import path module, this is used to work with file paths

const webServer = express(); // create new instance of express
webServer.set("trust proxy", 1); // "trust proxy" enables secure cookie usage when behind a reverse proxy, as is Azure

const PORT = process.env.PORT || 3000;

// enable CORS to allow requests from frontend
webServer.use(cors({
    origin: "https://agreeable-mud-02e923310.6.azurestaticapps.net", // deployed frontend
    credentials: true   // needed to be able to handle cookies
}));

// sequalize related
const sequelize = require("./sequelize");
const Picture = require("./models/Picture"); // import picture table
const User = require("./models/User"); // import user table

// sync the model when starting server
const seedPictures = require("./scripts/seed-pictures");

// code to seed database, method checks if there is data in the database first
sequelize.sync().then(async () => {
    console.log("Database synced");

    if (process.env.NODE_ENV === "production") {
        await seedPictures();
        console.log("Seeding finished");
    }
});

// authentication
const session = require("express-session");
webServer.use(express.json());
const { requireLoginPage, requireLoginApi } = require("./utils/authentication"); // imports authentication methods

// session management, using temp secret, not for production purpose
// resave prevents saving session if no changes are made
// saveUnintialized prevents storing empty sessions
// without database the session is lost upon reset of node.js server

// adds logging to see what environment is running at start
// might be better to move to a separate file later
const env = process.env.NODE_ENV || "development";
const isProduction = process.env.NODE_ENV === "production" || process.env.WEBSITE_SITE_NAME !== undefined;
console.log("Running in:", env);

webServer.use(session({
  secret: "your-secret-key", // this needs to be fixed, I should not share secret like this in code
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,              // secure cookies only in production
    sameSite: isProduction ? "none" : "lax"
  }
}));

// remove .html from URLs using slice
webServer.use((req, res, next) => {
    if (req.path.endsWith(".html")) {
        return res.redirect(req.path.slice(0, -5));
    }
    next();
});

// serve my frontend folder to be able to use my .html, .css and .js
webServer.use(express.static(path.join(__dirname, "../frontend")));

// ordering matters in this file to handle files correctly
// handle serving protected .html files
webServer.get("/add-pictures", requireLoginPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/add-pictures.html"));
});

webServer.get("/update-picture", requireLoginPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/update-picture.html"));
});

// TODO later, add delete-picture route as also protected

// route mounting, might be moved to function later on
webServer.use("/api/pictures", require("./routes/pictures"));
webServer.use("/api/authentication", require("./routes/authentication"));
webServer.use("/api/", require("./routes/home"));
webServer.use("/api/add-pictures", requireLoginPage, require("./routes/logged_in_user/add-pictures"));
webServer.use("/api/update-picture", requireLoginPage, require("./routes/logged_in_user/update-picture"));
webServer.use("/api/delete-picture", requireLoginPage, require("./routes/logged_in_user/delete-picture"));

// path.join uses _dirname(current script location) to base filepath structure to used OS
// then serves correct .html file defined in frontend
webServer.get("/:page", (req, res) => {
    const filePath = path.join(__dirname, `../frontend/${req.params.page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).send("Page not found"); // Handle missing pages
    });
});

// default route index.html
webServer.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// starts the server and adds a message to log
webServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); // use of backtick instead of quotes to add variable
});