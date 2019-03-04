const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);
var createError = require('http-errors');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017/data/';
// Database Name
const dbName = 'siddharth';
// Create a new MongoClient
const client = new MongoClient(url,{ useNewUrlParser: true });
// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
});


const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


app.set("view engine" ,"ejs");

const indexRouter = require("./routes/index.js");
const userRoute = require("./routes/user.js");
app.use('/', userRoute);
app.use('/', indexRouter);

const server = app.listen(3000,()=> console.log("Server listenting at port 3000"));
