// import express
let express = require('express');
let app = express();

// import mongoose
let mongoose = require('mongoose');

// import body parser
let bodyParser = require('body-parser');

// server port
var port = process.env.port || 8000;

// configure body parser to handle post request
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

// static files
app.use(express.static('static'));

// import api routes
let userroutes = require('./usermanagement/routers/router');
app.use('/', userroutes);


// connect to mongoose and set connection options
mongoose.connect("mongodb://localhost:27017/nodedb",function(err){

  if(err)
    console.log("Error connecting to mongodb with error " + err);
  else
    console.log("Succesfully connected to mongodb");

});

var db = mongoose.connection;

// server setup
app.listen(port,function(){
  console.log("Running server on port " + port + " ....");
})
