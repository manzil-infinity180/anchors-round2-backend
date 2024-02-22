const mongoose = require("mongoose");
const validator = require("validator");
const companySchema = new mongoose.Schema({
     name:{
         type:String
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
        default : 200
     },
     logo:{ 
        type:String,
        default:'https://www.anchors.in/static/media/logo-invite-only.05788d79bfb2d37a65d2.png'
     },
     post:[{
      type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
     },],
     student:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
     },]
});


 const Company = mongoose.model('Company',companySchema);
 module.exports = Company;