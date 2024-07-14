const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

const mongoURL = process.env.mongodb;

const registerRoute = require('./api/routes/registerController')
// app.use((req, res, next) =>{
//     res.status(200).json({
//       message: 'It works!'                                                                                    
//     });                                                                                      
// });

mongoose.connect(mongoURL).then(()=>{
   console.log('Database connection established');
}).catch((error)=>{
   console.log(error);
   console.log('Error connecting to Mongo');
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var userRoutes = require('./api/routes/userRoute.js');

// router.set('view engine','ejs');
// router.set('user')

app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With, Content-Type, Accept, Authorization"                                                                                    
   );
   if(req.method === 'OPTIONS')
    {
       res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
       return res.status(200).json({
       });                                                                               
    }  
    next();                                                                                    
})

app.use(express.json());
//Routes which should handle requests
app.use('/user', userRoutes);

app.use((req,res,next)=>{
  const error=new Error('not found');
  error.status=404;
  next(error);                                                                                        
})

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
     error: 
         {
               message: error.message                                                                           
         }                                                                                  
  })                                                                                        
})

module.exports = app;
