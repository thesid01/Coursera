const express = require("express");
const passport=require("passport");
const bodyParser = require('body-parser');
const User = require('../models/users');
const router = express.Router();

router.post('/register',(req,res,next)=>{

  User.create({
    firstName : req.firstname,
    lastName : req.lastname,
    email : req.email,
    contact : req.contact
  })
  .then((newUser)=>{
    console.log(newUser);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

  },(err) => next(err))
  .catch((err) => next(err));

});

module.exports = router;
