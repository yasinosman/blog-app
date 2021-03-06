//Package requirements
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    expressSession   = require("express-session"),
    LocalStrategy    = require("passport-local"),
    bodyParser       = require("body-parser"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
//Root requirements
var commentRoutes    = require("./routes/comments"),
    blogRoutes       = require("./routes/blogs"),
    indexRoutes      = require("./routes/index");
//Model requirements
var Comment          = require("./models/comment"),
    Blog             = require("./models/blog"),
    User             = require("./models/user");
//For seeding database
//var seedDB           = require("./seeds");

require('dotenv').config()
var port = process.env.PORT || 3000;

//  App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

//Seeding for working with new data every restart
//seedDB();

//  Passport config
app.use(expressSession({
    secret:"<secretkey>",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//For current user info
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");  
    next();
});
//Mongodb connection
mongoose.connect( process.env.DATABASE_URI,
{ useNewUrlParser: true, useUnifiedTopology: true }, 
() => { console.log("database connected")}).catch(err => console.log(err));

//Routes
app.use(commentRoutes);
app.use(indexRoutes);
app.use(blogRoutes);

//Express listener
app.listen(port, function(){
    console.log(` > Server started on port ${port}!`);
});
