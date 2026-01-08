const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/signup");
        }

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listing");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Airbnb!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            req.flash("error", "Something went wrong during logout.");
            return next(err);
        }
        req.flash("success", "You logged out successfully!");
        res.redirect("/listing");
    });
};