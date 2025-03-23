const express = require("express");
const router = express.Router();

const users =[
    { username: "test", password: "test", role: "admin"} // i need to change to db later if there is time left
];

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if(!user) {
        return res.status(401).json({message: "invalid credentials"});
    }

    req.session.user = {username: user.username, role: user.role};
    res.json({message: "Login successful"});
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({message: "Logged out"});
});

router.get("/check", (req, res) => {
    if(req.session?.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({message: "Not logged in"});
    }
});

module.exports = router;