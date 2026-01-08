if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Suppress specific deprecation warnings from dependencies
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('util.isArray')) {
        return; // Ignore util.isArray deprecation warnings
    }
    console.warn(warning.name, warning.message);
});

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const Listing = require("./models/listings.js");
const ExpressError = require('./utils/ExpressError.js');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log(' Connected to MongoDB successfully!');
        return true;
    } catch (error) {
        console.error(' Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const createSessionStore = () => {
    try {
        return MongoStore.create({
            mongoUrl: process.env.ATLASDB_URL,
            touchAfter: 24 * 3600,
            autoRemove: 'native'
        });
    } catch (error) {
        console.warn('Failed to create MongoStore, using memory store:', error.message);
        return null;
    }
};

const initializeApp = async () => {
    await connectDB();
    
    const sessionConfig = {
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false
        }
    };

    app.use(session(sessionConfig));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.userData = req.user;
        next();
    });

    setupRoutes();
    setupErrorHandling();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

const setupRoutes = () => {
    const listingsRouter = require("./routes/listing.js");
    const reviewsRouter = require("./routes/review.js");
    const userRouter = require("./routes/user.js");

    app.use("/listing", listingsRouter);
    app.use("/listing/:id/reviews", reviewsRouter);
    app.use("/", userRouter);

    app.post("/search", async (req, res) => {
        try {
            const { query } = req.body;
            if (!query || query.trim() === '') {
                return res.redirect('/listing');
            }

            const searchRegex = new RegExp(query.trim(), 'i');
            const results = await Listing.find({
                $or: [
                    { title: searchRegex },
                    { location: searchRegex },
                    { category: searchRegex }
                ]
            }).limit(50);

            res.render("listings/search.ejs", { listing: results, query });
        } catch (error) {
            console.error('Search error:', error);
            req.flash('error', 'Search failed. Please try again.');
            res.redirect('/listing');
        }
    });
};

const setupErrorHandling = () => {
    app.all("*", (req, res, next) => {
        // Ignore Chrome DevTools requests
        if (req.originalUrl.includes('.well-known/appspecific/com.chrome.devtools')) {
            return res.status(404).end();
        }
        console.log("404 - Route not found:", req.originalUrl);
        next(new ExpressError(404, "Page Not Found"));
    });

    app.use((err, req, res, next) => {
        const { statusCode = 500, message = "Something went wrong!" } = err;
        console.error(`Error ${statusCode}: ${message} - URL: ${req.originalUrl}`);
        res.status(statusCode).render("error.ejs", { err });
    });
};

initializeApp().catch(console.error);