//Package requirements
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    expressSession   = require("express-session"),
    LocalStrategy    = require("passport-local"),
    bodyParser       = require("body-parser"),
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

var port = 3000;

//  Passport config
app.use(expressSession({
    secret:"En iyi yemek tavuklu pilavdir.",
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
    next();
});

//  App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Seeding for working with new data every restart
//seedDB();

//Mongodb connection
mongoose.connect("mongodb://localhost/cydd-kutuphane-app", 
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

//Routes
app.use(commentRoutes);
app.use(indexRoutes);
app.use(blogRoutes);

//Express listener
app.listen(port, process.env.IP, function(){
    console.log(`Example app listening on port ${port}!`);
});