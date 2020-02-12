var mongoose = require("mongoose");

//  Mongoose Config
var blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        created: 
            { 
                type: Date, default: Date.now
            },
        //reference to ("./models/comment")
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    }
);

var Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;