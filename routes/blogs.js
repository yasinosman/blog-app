//Router requirements
var express = require("express"),
    router  = express.Router({mergeParams:true});

//Model requirements
var Comment = require("../models/comment"),
    Blog    = require("../models/blog"),
    User    = require("../models/user");

//Middleware requirement
var middleware = require("../middleware");


//BLOG ROUTES  
//--------------------------------------------------

//index route ( /blogs, GET request, lists blogs)
router.get("/blogs", function(req, res){
  
        Blog.find({}, function(err, foundBlogs){
            if(err){
                console.log("error!");
            }
            else {
                res.render("./blogs/index.ejs", 
                {
                    blogs: foundBlogs, 
                    currentUser:req.user,
                    searchText:null
                });
            }
        });
});

//new route (/blogs/new, GET request, shows a form)
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("./blogs/new.ejs");
});

//create route (/blogs, POST request, sends data)
router.post("/blogs", middleware.isLoggedIn, function(req, res){
    //sanitize input for security reasons
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var author = 
    {
        id:req.user._id,
        username:req.user.username
    }
    req.body.blog.author = author;
    //Create blog
    Blog.create(req.body.blog, function(err, createdBlog){
        if(err){
            console.log(err);
            req.flash("error", err);
            res.render("./blogs/new.ejs");
        } else {
            //Then, redirect to index page
            res.redirect("/blogs");
        }
    }); 
});

//show route (/blogs/:id, GET request, shows a single blog post)
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err || !foundBlog){
            req.flash("error", "Blog not found");
            res.redirect("/blogs");
        } else {
            res.render("./blogs/show.ejs", {blog: foundBlog});
        }
    });
});

//edit route (/blogs/:id/edit, GET request, shows form for update)
router.get("/blogs/:id/edit", middleware.blogAuthorization, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("./blogs/edit.ejs", {blog: foundBlog});       
    });
});

//update route (/blogs/:id, PUT request, edits a blog)
router.put("/blogs/:id", middleware.blogAuthorization, function(req, res){
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
router.delete("/blogs/:id", middleware.blogAuthorization, function(req, res){
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




module.exports = router;