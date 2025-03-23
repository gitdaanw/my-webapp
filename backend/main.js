const express = require("express"); // impport express framework
const path = require("path"); // import path module, this is used to work with file paths

const webServer = express(); // create new instance of express
const PORT = 3000; 

// authentication
const session = require("express-session");
webServer.use(express.json());

webServer.use(session({secret: "your-secret-key", resave: false, saveUninitialized: false}));

// using a different filestructure, this allows the use of my files from frontend folder
webServer.use(express.static(path.join(__dirname, "../frontend")));

// remove .html from URLs
webServer.use((req, res, next) => {
    if (req.path.endsWith(".html")) {
        return res.redirect(req.path.slice(0, -5));
    }
    next();
});

// load the API endpoints returning JSON data
webServer.use("/pictures", require("./routes/pictures"));
webServer.use("/auth", require("./routes/authentication"));
webServer.use("/", require("./routes/home"));

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