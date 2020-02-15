//Router requirements
var express = require("express"),
    router  = express.Router({mergeParams:true});
    passport= require("passport");

//Model requirements
var User    = require("../models/user");

//root route 
router.get("/", function(req, res){
    res.redirect("/blogs");
});

//AUTHENTICATION ROUTES
//--------------------------------------------------
//register route (/register), GET request, shows register form
router.get("/register", function(req, res){
    res.render("register.ejs") ;
});

//register route (/register), POST request, handles sign up
router.post("/register", function(req, res){
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the Blog Site " + user.username);
            res.redirect("/blogs");
        });
    });
});

//login route (/login), GET request, shows login form
router.get("/login", function(req, res){
    res.render("login.ejs");
});

//login route (/login), POST request, handles login
router.post("/login", passport.authenticate("local", 
            {
                successRedirect:"/blogs",
                failureRedirect:"/login",
                failureFlash: true,
                successFlash: "Successfully logged in, " + req.body.username + "!"
            }), function(req, res){   
});

//logout route (/logout), GET request, handles logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/blogs");
});


//--------------------------------------------------
//END OF AUTHENTICATION ROUTES

module.exports = router;
