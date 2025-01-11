const user = require("../models/users")

module.exports.signupForm = (req,res) => {
    res.render("../views/Users/signUp.ejs")
}

module.exports.signup =  async (req,res) => {
    try{
        let {username,email,password} = req.body
        const newUser = new user({
            email,username
        })
    const registeredUser = await user.register(newUser,password);
    req.login(registeredUser,(err) =>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome To WanderLust")
        res.redirect("/listing")
    })
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.loginForm = (req,res) => {
    res.render("../views/Users/login.ejs")
}

module.exports.login =  async(req,res) => {
    req.flash("success","Welcome back to WanderLust")
    let redirectUrl =res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res) =>{
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success","you are logged out")
        res.redirect("/listing")
    })
}