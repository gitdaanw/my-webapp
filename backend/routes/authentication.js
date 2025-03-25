const express = require("express");
const bcrypt = require("bcrypt"); // build in encryption
const router = express.Router(); 

const User = require("../models/User");

// endpoint to register
// POST /authentication/register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
        // check required fields
      if (!username || !password) {
        return res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht." });
      }
  
      // check if username is already in use, needs to be unique
      const existing = await User.findOne({ where: { username } });
      if (existing) {
        return res.status(409).json({ message: "Gebruikersnaam is al in gebruik." });
      }
  
      // hash the password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // create the user with default role admin
      const user = await User.create({ username, passwordHash, role: "admin" });
      
      // after successfull registration user is directly logged in
      req.session.user = { username: user.username, role: user.role };

      res.status(201).json({ message: "Registratie gelukt." });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ message: "Fout bij registratie." });
    }
  });

// endpoint to login
// POST /authentication/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try{
    // find user based on username
    const user = await User.findOne({where: {username}});

    // check credentials
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Ongeldige inloggegevens." });
      }

    // stores userinfo in session, excluding the password
    req.session.user = { username: user.username, role: user.role };
    res.json({ message: "Login succesvol." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Fout bij inloggen." });
  }
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

// enpoint to delete users, mainly for testing purpose. No function in application
  // DELETE /authentication/:username
  router.delete("/:username", async (req, res) => {
    try {
      const { username } = req.params;
  
      const deleted = await User.destroy({ where: { username } });
  
      if (deleted === 0) {
        return res.status(404).json({ message: "Gebruiker niet gevonden." });
      }
  
      res.status(200).json({ message: `Gebruiker '${username}' verwijderd.` });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Fout bij verwijderen gebruiker." });
    }
  });

module.exports = router;