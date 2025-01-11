const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user")

router
.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup))

router
.route("/login")
.get(userController.loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate(
    "local",{
        failureRedirect:"/login",// ye likha hai ki jab authenticate n ho kha redirect ho
        failureFlash:true,// for flash message
    }),
    userController.login
   )

//router.get("/signup",userController.signupForm)

//router.post("/signup",wrapAsync(userController.signup))

//router.get("/login",userController.loginForm)

// passport.authenticate is built in middleware by passport for authentication
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate(
//     "local",{
//         failureRedirect:"/login",// ye likha hai ki jab authenticate n ho kha redirect ho
//         failureFlash:true,// for flash message
//     }),
//     userController.login
//    )

router.get("/logout",userController.logout)

module.exports = router