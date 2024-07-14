const  mongoose  = require("mongoose");

const regModel= new mongoose.Schema({
    
    firstName:{type: String,required: true},
    lastName: {type: String, required: true},
    email: {
       type: String,
       required: true,
       unique: true,
       match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
       type: String, 
       required: true                                                                                   
    },
    phone:{
       type: String, 
       required: true                                                                                   
    },
    is_admin:{
      type:Number,   //admin value 1
      required:true
    },
    is_user:{
      type:Number,  //user value 0
      default:0
    }
})

const model=mongoose.model('User',regModel);

module.exports = model;