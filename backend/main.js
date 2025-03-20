const express = require("express"); // impport express
const path = require("path"); // import path

const webServer = express(); // create new instance of express

webServer.use(express.urlencoded({extended: false})); // allows parsing of body data

webServer.use((req, res, next) => {
    if (req.path.endsWith(".html")) {
        return res.redirect(req.path.slice(0, -5));
    }
    next();
});

// using a different filestructure, allows using the files from frontend folder
webServer.use(express.static(path.join(__dirname, "../frontend")));

// creates clean URL's
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


webServer.listen(3000);