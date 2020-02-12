//Package requirements
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    //LocalStrategy    = require("passport-local"),
    bodyParser       = require("body-parser"),
    //passport         = require("passport"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

//Model requirements
var Comment          = require("./models/comment"),
    Blog             = require("./models/blog");
    //User             = require("./models/user");
//For seeding database
var seedDB           = require("./seeds");

var port = 3000;

/*
//  Passport config
app.use(require("express-session")({
    secret:"En iyi yemek tavuklu pilavdir.",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);*/

//  App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Seeding for working with new data every restart
seedDB();

//Mongodb connection
/*mongoose.connect("mongodb://localhost/cydd-kutuphane-app", 
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);
*/
mongoose.connect("mongodb+srv://yasinosman:123**saatkac123@blog-app-wx0nf.mongodb.net/test?retryWrites=true&w=majority", 
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);
//mongodb+srv://yasinosman:123**saatkac123@blog-app-wx0nf.mongodb.net/test?retryWrites=true&w=majority

//BLOG ROUTES  
//--------------------------------------------------
//root route 
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//index route ( /blogs, GET request, lists blogs)
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error!");
        }
        else {
            res.render("./blogs/index.ejs", {blogs: blogs});
        }
    });
});

//new route (/blogs/new, GET request, shows a form)
app.get("/blogs/new", function(req, res){
    res.render("./blogs/new.ejs");
});

//create route (/blogs, POST request, sends data)
app.post("/blogs", function(req, res){
    //sanitize input for security reasons
    req.body.blog.body = req.sanitize(req.body.blog.body);

    //Create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("./blogs/new.ejs");
        } else {
            //Then, redirect to index page
            res.redirect("/blogs");
        }
    }); 
});

//show route (/blogs/:id, GET request, shows a single blog post)
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("./blogs/show.ejs", {blog: foundBlog});
        }
    });
});

//edit route (/blogs/:id/edit, GET request, shows form for update)
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("./blogs/edit.ejs", {blog: foundBlog});
        }
    });
});

//update route (/blogs/:id, PUT request, edits a blog)
app.put("/blogs/:id", function(req, res){
    //sanitize input for security reasons
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //find the existing blog and update it
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//destroy route (/blogs/:id, DELETE request, deletes a blog)
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    }); 
});
//--------------------------------------------------
//END OF BLOG ROUTES



//COMMENT ROUTES
//--------------------------------------------------
//new route (/blogs/:id/comments/new, GET request, shows a form for comments)
app.get("/blogs/:id/comments/new", function(req, res){
    //find blog by id and send it to new form
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
            res.render("./comments/new.ejs", {blog: blog});
        }
    });
});

//post route (/blogs/:id/comments), POST request, sends form
app.post("/blogs/:id/comments", function(req, res){
    //find blog with matching id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            redirect("/blogs");
        } else {
            //create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect comment to that particular blog
                    blog.comments.push(comment);
                    blog.save();
                    //redirect to blog show page
                    res.redirect("/blogs/" + blog._id);
                }
            });  
        }
    });
});
//--------------------------------------------------
//END OF COMMENT ROUTES


/*
//AUTHERIZATION ROUTES
//--------------------------------------------------
//register route (/register), GET request, shows register form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

//register route (/register), POST request, handles sign up
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local", req, res, function(){
            res.redirect("/blogs");
        });
    });
});


//--------------------------------------------------
//END OF AUTHERIZATION ROUTES
*/


//Express listener
app.listen(port, process.env.IP, function(){
    console.log(`Example app listening on port ${port}!`);
});