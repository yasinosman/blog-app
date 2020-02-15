//Router requirements
var express = require("express"),
    router  = express.Router({mergeParams:true});
    
//Model requirements
var Comment = require("../models/comment"),
    Blog    = require("../models/blog");

//Middleware requirement
var middleware = require("../middleware");

//COMMENT ROUTES
//--------------------------------------------------
//new route (/blogs/:id/comments/new, GET request, shows a form for comments)
router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function(req, res){
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
router.post("/blogs/:id/comments", middleware.isLoggedIn, function(req, res){
    //find blog with matching id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            redirect("/blogs");
        } else {
            //create a new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    //connect comment to that particular blog
                    blog.comments.push(comment);
                    blog.save();
                    //redirect to blog show page
                    req.flash("success", "Comment added successfully");
                    res.redirect("/blogs/" + blog._id);
                }
            });  
        }
    });
});

//edit route (/blogs/:id/comments/:comment_id/edit), GET request, shows comment edit form
router.get("/blogs/:id/comments/:comment_id/edit", middleware.commentAuthorization, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err || !foundBlog){
            console.log(err);
            req.flash("error", "Blog not found");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    console.log(err);
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    res.render("../views/comments/edit.ejs",
                    {
                        comment:foundComment,
                        blog:foundBlog
                    });
                }
            });
        }
    }); 
});

//update route (/blogs/:id/comments/:comment_id), PUT request, handles comment updating
router.put("/blogs/:id/comments/:comment_id", middleware.commentAuthorization, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            console.log(err);
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//destroy route (/blogs/:id/comments/:comment_id), DELETE request, deletes comment
router.delete("/blogs/:id/comments/:comment_id", middleware.commentAuthorization, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//--------------------------------------------------
//END OF COMMENT ROUTES



module.exports = router;