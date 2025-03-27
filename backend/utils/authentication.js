/* 
This file holds helper functions. 
Currently only one, other helper code can be added here
*/

// function to block users if not logged in
function requireLoginPage(req, res, next) {
    if (req.session?.user) return next();
    res.redirect("/login.html");
}

module.exports = {requireLoginPage};