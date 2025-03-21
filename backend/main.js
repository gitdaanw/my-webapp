const express = require("express"); // impport express module
const path = require("path"); // import path, used to work with file paths

const webServer = express(); // create new instance of express
const PORT = 3000; 

// webServer.use(express.urlencoded({extended: false})); // allows parsing of body data

// using a different filestructure, allows using the files from frontend folder
webServer.use(express.static(path.join(__dirname, "../frontend")));

// remove .html from URLs
webServer.use((req, res, next) => {
    if (req.path.endsWith(".html")) {
        return res.redirect(req.path.slice(0, -5));
    }
    next();
});

// load the routes
webServer.use("/pictures", require("./routes/pictures"));

// path.join uses _dirname(current script location) to base filepath structure to used OS
// then adds the correct html page
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