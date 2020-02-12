var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment   = require("./models/comment");
 
var data = [
    {
        title: "Seed 1", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        title: "Seed 2", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        title: "Seed 3", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all blogs
   Blog.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed blogs!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few blogs
            data.forEach(function(seed){
                Blog.create(seed, function(err, blog){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a blog");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            },
                                function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    blog.comments.push(comment);
                                    blog.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedDB;