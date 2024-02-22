const Company = require("../model/comModel.js");
const Post = require("../model/postModel.js");
const multer = require("multer");
const sendEmail = require("./../utils/sendMail.js");
const sendCookiesAndToken = require("../utils/sendToken.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const Student = require("../model/stdModel.js");

exports.register = async(req,res,next)=>{
    try{

       const dup = await Company.findOne({email : req.body.email});
       if(dup){
        throw new Error("Already user existed");
       }
        const user = await Company.create(req.body);
        console.log(user);
        await sendEmail({
            email: req.body.email,
            subject : 'Xf Registration Successfully Done 🦾',
            message : 'Thank You for Xf registration,you can explore the Xf',
           })
        await sendCookiesAndToken(user,res);

        res.status(200).json({
            status:"Successfully Logined In",
            data:{
                user
            }
          });

    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
          })

    }
}

let otp ;
let userData;

exports.login = async(req,res,next)=>{
    try{
        const user = await Company.findOne({email:req.body.email})
        // .populate('profile').populate('experience').
        // populate('applied').exec();

        otp = (Math.random()*100000);
        otp = Math.floor(otp);
        console.log(otp);

        if(!user){
          throw new Error("No user existed with these email id")
        }
        userData = req.body.email;
       console.log(user);
        await sendEmail({
            email: req.body.email,
            subject : 'Xf Registration OTP 🦾',
            message : `Thank You for Xf registration, \n Your OTP for login is ${otp}`,
           });

        // await sendCookiesAndToken(user,res);

        res.status(200).json({
            status:"Successfully Send OTP",
          });

    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
          })

    }
}

exports.verify = async(req,res,next)=>{
    try{
      let OTP = Number(req.body.otp);
      console.log("doc");
        console.log(OTP);
        console.log(otp)
        console.log(userData);
       if(OTP !== otp){
            throw new Error("Incorrect OTP please check it out")
       }
  
        const user = await Company.findOne({email: userData})
                                //   .populate("profile")
                                //   .populate("experience");
        
      
        await sendEmail({
            email: userData,
            subject : 'Xf Registration Successfully Done 🦾',
            message : `Thank You for Xf registration,You are successfully logined in`,
           });
  
        await sendCookiesAndToken(user,res);
  
        res.status(200).json({
            status:"Successfully Login in",
  
            data:{
                user
            }
          });
  
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
          })
  
    }
  }

exports.isAuthenticated = async (req,res,next) =>{
    try{
      let token;
      console.log(req.cookies);
      if(req.cookies.jwt){
        token = req.cookies.jwt;
      }
      console.log("token----->")
      console.log(token);
      if(!token){
        throw new Error("OOPs, Firstly you have to logined in !!");
      }
      const decode = jwt.verify(token,process.env.JWT_SECRET);
      console.log(decode);
      const currentloginedUser = await Company.findById(decode.id);
      console.log(currentloginedUser);
      req.user = currentloginedUser;
      next();
  
    }catch(err){
      res.status(404).json({
        status:"Failed",
       err: err.message
      })
    }
}

exports.createJob = async(req,res,next)=>{
    try{
    console.log(req.body);

    if(!req.user){
      throw new Error("Not logined in");
    }

        const profile = await Post.create(req.body);
        
        const user = await Company.findById(req.user);
        user.post.unshift(profile._id);
        await user.save();

        const std = await Student.find({});
        
        std.map(async (el)=>{
            await sendEmail({
                email: el.email,
                subject : 'New Job Post',
                message : `${user.email} posted a new job for ${req.body.role_name}`,
               })
        });

        res.status(200).json({
            status:"Success",
            data:{
              profile
            }
        });
    }catch(err){
        res.status(404).json({
            status:"Failed",
            data:{
              err:err.message
            }
          })
    }
}