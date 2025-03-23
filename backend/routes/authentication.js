const express = require("express");
const router = express.Router();

// TODO fix temp developer users
const users =[
    { username: "test", password: "test", role: "admin"}
];

// endpoint to login
// POST /authentication/login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // look for users with matching credentials
    const user = users.find(u => u.username === username && u.password === password);

    if(!user) {
        return res.status(401).json({message: "invalid credentials"});
    }

    // stores userinfo in session, excluding the password
    req.session.user = {username: user.username, role: user.role};
    res.json({message: "Login successful"});
});

// endpoint to logout
// POST /authentication/logout
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({message: "Logged out"});
});

// endpoint to check if user is logged in
// GET /authentication/check
router.get("/check", (req, res) => {
    if(req.session?.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({message: "Not logged in"});
    }
});

module.exports = router;