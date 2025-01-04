const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middelware.js");

const userController = require("../controllers/userController.js");

router.get("/singup",userController.renderSingup);

router.post("/singup",wrapAsync(userController.singup));

router.get("/login",userController.renderLogin);

router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),userController.login);

router.get("/logout", userController.logout);

module.exports= router;
