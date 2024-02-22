const Student = require("../model/stdModel.js");
const multer = require("multer");
const sendEmail = require("./../utils/sendMail.js");
const sendCookiesAndToken = require("../utils/sendToken.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const Apply = require("../model/applyModel.js");
const Company = require("../model/comModel.js");
const mongoose = require("mongoose")
exports.register = async(req,res,next)=>{
    try{

       const dup = await Student.findOne({email : req.body.email});
       if(dup){
        throw new Error("Already user existed");
       }
        const user = await Student.create(req.body);
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
        const user = await Student.findOne({email:req.body.email})
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
  
        const user = await Student.findOne({email: userData})
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
      const currentloginedUser = await Student.findById(decode.id);
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

exports.applyJob = async(req,res,next)=>{
    try{
    console.log(req.body);
    const id_data = req.body._id;

    const user = await Student.findById(req.user);

    // logic 
    const {role_name,minimum,maximum,location} = req.body;
    const cost = role_name.length + minimum.toString().length + maximum.toString().length + location.length;
    console.log(cost);
    const coins = user.coins;
    let amt;
    if(coins < cost){
        throw new Error("oops you don't have enough balance");
    }else if(coins >= cost){
      amt = coins  - cost;
    }
    console.log("amt"+amt);
    
    await Student.findByIdAndUpdate(req.user,{coins:amt});

    const query = {"post": new mongoose.Types.ObjectId(`${id_data}`)};
    const company = await Company.findOne(query);
    console.log("hello")
    console.log(company);
    const companyId = company._id;
    const addAmt = company.coins + cost/2;
    await Company.findByIdAndUpdate(companyId,{coins:addAmt});

    if(!req.user){
      throw new Error("Not logined in");
    }

        const profile = await Apply.create(req.body);
        user.applied.unshift(profile._id);
        await user.save();


        await sendEmail({
            email: company.email,
            subject : 'New Applicant',
            message : `${user.email} applied to ${role_name}`,
           })
        res.status(200).json({
            status:"Success",
            data:{
              profile
            }
        });
    }catch(err){
        console.log(err);
        res.status(404).json({
            status:"Failed",
            
            data:{
              err:err.message
            }
          })
    }
}