var mongoose = require("mongoose");

//Searching requirement
var mongoose_fuzzy_searching = require("mongoose-fuzzy-searching-v2");

//  Mongoose Config
var blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        author:
            {
                id: 
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                username: String
            },
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

blogSchema.plugin(mongoose_fuzzy_searching, {
    fields: ["title", "author.username"]
  });

var Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;