const regModel = require("./registerModel")
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const resettokenSchema=require("./PasswordResetToken");


// //for send mail
const sendVerifyMail = async (firstName, email, newUser_id) => {
  try {     
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jadhavkhushi728@gmail.com',
        pass: 'inawgolmcfddgoyh'
      }
    });

    const mailOptions = {
      from: 'jadhavkhushi728@gmail.com',
      to: email,
      subject: 'for verification mail',
      html: '<p>Hii,' + firstName + ', please click here to <a href="http://localhost:4200/verify/' + newUser_id + '"> Verify </a> your mail. </p>'
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:=", info.response);
      }
    })
  } catch (error) {
    console.log(error.msg);
  }
}

exports.verifyMail = async (req, res) => {
  console.log(req.params.id, "verification api entered");
  try {
    console.log("verify entry entered");
    console.log(req.params.id, "verification api entered");
    const updateInfo = await regModel.updateOne({ _id: req.params.id }, { $set: { is_user: 1 } });

    console.log(updateInfo, "entry verified");
    res.send({ msg: "verification done" });

  } catch (error) {
    console.log(error, "error form api");
  }
}

exports.createdUser = async (req, res, next) => {
  console.log("RegisterVerification");

  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new regModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: encryptedPassword,
    phone: req.body.phone,
    is_admin: 0,
  });
  await newUser
    .save()
    .then((result) => {
      //email send block 
      console.log(newUser._id, "id of user");
      sendVerifyMail(req.body.firstName, req.body.email, newUser._id);

      res.status(201).json({
        msg: "Register Successfully!!..Please Verify your mail..",
        user: result,
        status: 201
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "You already Register",
        error: err,
      });
    });
};

exports.jwtLogin = async (req, res, next) => {
  try {
    const user = await regModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        status: 404,
      });
    }
    if (user.is_user === 0) {
      return res.status(400).json({
        msg: "Please verify your email...",
        status: 400,
      });
    } else {
      console.log("Verified...");
    }

    const result = await bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!result) {
        return res.status(400).json({
          msg: "password incorrect...",
          status: 400,
        });
      }

      if (result) {
        console.log(process.env.JWT_KEY);
        const token = jwt.sign(
          {
            email: user.email,
            userId: user.id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );

        return res.status(200).json({
          msg: "Auth Successfully...",
          status: 200,
          token: token,
        });
      }
    });

  } catch (err) {
    console.log(err);
  }
};

exports.adminLogin = (req, res, next) => {
  if (req.body.email == "admin@gmail.com" && req.body.password == "admin@123") {
    res.status(200).json({
      msg: "Admin Login Success...",
      status: 200
    });
  } else {
    res.status(400).json({
      msg: "You are not Admin...",
      status: 400
    });
  }
}

exports.ResetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(500).json({ message: 'Email is required' });
  }
  const user = await regModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(409).json({ message: 'Email does not exist' });
  }

  var resettoken = new resettokenSchema({
    _userId: user._id,
    resettoken: crypto.randomBytes(16).toString('hex')
  });

  try {
    await resettoken.save();
    await resettokenSchema.deleteMany({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jadhavkhushi728@gmail.com',
        pass: 'inawgolmcfddgoyh'
      }
    });

    var mailOptions = {
      to: user.email,
      from: 'jadhavkhushi728@gmail.com',
      subject: 'Node.js Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:4200/reset-password/' + resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:=", info.response);
      }
    });

    res.status(200).json({ message: 'Reset Password successfully.' });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
}


exports.ValidPasswordToken = async (req, res) => {
  if (!req.body.resettoken) {
    return res.status(500).json({ message: 'Token is required' });
  }
  const user = await resettokenSchema.findOne({ resettoken: req.body.resettoken });
  if (!user) {
    return res.status(409).json({ message: 'Invalid URL' });
  }
  regModel.findOneAndUpdate({ _id: user._userId }).then(() => {
    res.status(200).json({ message: 'Token verified successfully.' });
  }).catch((err) => {
    return res.status(500).send({ msg: err.message });
  });
}

exports.NewPassword = async (req, res) => {
  if (!req.body.resettoken || !req.body.newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const userToken = await resettokenSchema.findOne({ resettoken: req.body.resettoken });
    if (!userToken) {
      return res.status(409).json({ message: 'Token has expired' });
    }

    const user = await regModel.findOne({ _id: userToken._userId });
    if (!user) {
      return res.status(409).json({ message: 'User does not exist' });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    await resettokenSchema.deleteOne({ _id: userToken._id });

    res.status(201).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};















// const regModel = require("./registerModel");
// const mongoose = require("mongoose");
// const nodemailer=require('nodemailer');
// const bcrypt=require("bcrypt");
// const jwt=require("jsonwebtoken");
// // const express = require('express');
// // const router = express.Router();

// //for send mail
// const sendVerifyMail = async(firstName,email,newUser_id)=>{
//   try{
//    const transporter = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     port:'587',
//     secure: false,
//     requireTLS:true,
//     auth:{
//       user:'jadhavkhushi728@gmail.com',
//       pass:'inawgolmcfddgoyh'
//     }
//    });

//    const mailOptions = {
//     from:'jadhavkhushi728@gmail.com',
//     to: email,
//     subject:'for verification mail',
//     html:'<p>Hii,'+firstName+', please click here to <a href="http://localhost:4200/verify/'+newUser_id+'"> Verify </a> your mail. </p>'
//    }

//   transporter.sendMail(mailOptions,function(error,info){
//     if(error)
//       {
//         console.log(error);
//       }else{
//         console.log("Email has been sent:=",info.response);
//       }
//   })
//   }catch(error){
//     console.log(error.msg);
//   }
// }

// exports.verifyMail = async(req,res)=>{
//   console.log(req.params.id,"verification api entered");
// try{
//   console.log("verify entry entered");
//   console.log(req.params.id,"verification api entered");
//   const updateInfo = await regModel.updateOne({_id:req.params.id},{$set:{is_user: 1}});
  
//   console.log(updateInfo,"entry verified");
//   // res.render("verified");
//   res.send({msg:"verification done"});

// }catch(error){
//   console.log(error,"error form api");
// }
// }

// // exports.loadRegister = async(req,res)=>{
// //   try{
// //     res.render('registration');
// //   }catch(error){
// //     console.log(error.msg);
// //   }
// // }

// exports.createdUser = async(req,res,next)=>{
//   console.log("RegisterVerification");  
  
//   const encryptedPassword = await bcrypt.hash(req.body.password,10);


//   const newUser = new regModel({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: encryptedPassword,
//     phone: req.body.phone,  
//     is_admin:0,                                                                                 
//   });
//   await newUser
//     .save()
//     .then((result)=>{
//         //email send block 
//         console.log(newUser._id,"id of user");
//         sendVerifyMail(req.body.firstName,req.body.email,newUser._id); 
        
//        res.status(201).json({                                                               
//          msg:"Register Successfully!!..Please Verify your mail..",
//          user:result,
//          status:201      
//        });                                                                                  
//     })
//     .catch((err)=>{
//        res.status(500).json({
//         msg:"You already Register",
//         error: err,                                                                                  
//        });                                                                                   
//     });
// };

// exports.jwtLogin = async(req,res,next)=>{
//   try{
//     const user = await regModel.findOne({email:req.body.email});
//     if(!user){
//       return res.status(404).json({
//         msg:"User not found",
//         status:404,
//       });
//     }
//     if (user.is_user === 0) {
//       return res.status(400).json({
//         msg: "Please verify your email...",
//         status: 400,
//       });
//     } else {
//       console.log("Verified...");
//     }
    
//     const result = await bcrypt.compare(req.body.password, user.password,(err, result)=>{
//       if(!result){
//         return res.status(400).json({
//           msg: "password incorrect...",
//           status: 400,        
//         });
//       }
      
//       if(result){
//         console.log(process.env.JWT_KEY);
//         const token = jwt.sign(
//           {
//             email: user.email,
//             userId: user.id,
//           },
//           process.env.JWT_KEY,
//           {
//             expiresIn:"1h"
//           }
//         );
        
//         return res.status(200).json({
//           msg:"Auth Successfully...",
//           status:200,
//           token: token,
//         });
//       }
//     });

//   }catch(err){
//     console.log(err);
//   }
// };

// exports.adminLogin = (req,res,next)=>{
//   if (req.body.email == "admin@gmail.com" && req.body.password == "admin@123") {
//     res.status(200).json({
//       msg: "Admin Login Success...",
//       status:200
//     });
//   } else {
//     res.status(400).json({ 
//       msg: "You are not Admin...",
//       status: 400

//     });
//   }
// }









// //Handle incoming GET requests to /register
// // router.get('/',(req,res,next)=>{
// //       res.status(200).json({
// //        msg: "Handling get request to /register"                                                                                   
// //       });                                                                                  
// // });

// // router.post('/',(req,res,next)=>{
// //   const reg = {
// //     firstName: req.body.firstName,
// //     lastName: req.body.lastName,
// //     email: req.body.email,
// //     password: req.body.password,
// //     phone: req.body.phone,
// //   }
// //   console.log(reg);
// //    res.status(200).json({

// //      msg:"Handling post request to /register",
// //      createdProduct: reg                                                                                          
// //    })
// // })
