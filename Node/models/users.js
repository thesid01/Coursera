const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  firstName : {
    type : String,
    default : ""
  },
  lastName : {
    type : String,
    default : ""
  },
  email : {
    type: String,
    default: ""
  },
  password : {
    type : String,
    default : ''
  },
  contact:{
    type : String,
    default : ''
  }
})


User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
