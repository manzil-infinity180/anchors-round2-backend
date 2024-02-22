const mongoose = require("mongoose");
const validator = require("validator");
const postSchema = new mongoose.Schema({
    id: {
        type: String,
        unique:[true,"You already applied"]
     },
     role_name:{
        type:String,
     },
     minimum : {
        type:String,
     },
     maximum : {
        type:String,
     },
     location:{
        type:String,
     }

});

 const Post = mongoose.model('Post',postSchema);
 module.exports = Post;