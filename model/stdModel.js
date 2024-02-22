const mongoose = require("mongoose");
const validator = require("validator");
const stdSchema = new mongoose.Schema({
     name:{
       type:String,
     },
     email: {
        type:String,
        required:[true,'User cannot without emailId'],
        unique:[true,'User Already exist with this email'],
        lowercase:true,
        validate : [validator.isEmail,'Please Provide Valid Email'],
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
     },
     coins:{
        type:Number,
        default : 300
     },
     applied:[{
      type:mongoose.Schema.Types.ObjectId,
        ref:"Applied"
     },]
});


 const Student = mongoose.model('Student',stdSchema);
 module.exports = Student;