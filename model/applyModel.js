const mongoose = require("mongoose");
const validator = require("validator");
const applySchema = new mongoose.Schema({
     role_name:{
        type:String,
     },
     minimum : {
        type:Number,
     },
     maximum : {
        type:Number,
     },
     location:{
        type:String,
     }

});
 const Applied = mongoose.model('Applied',applySchema);
 module.exports = Applied;