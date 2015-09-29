var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var app = express();
var Schema = mongoose.Schema;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('node-monkey').start({host: "127.0.0.1", port:"50500"});


app.use( bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};


// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(allowCrossDomain);
// app.use('/' , require('./index'))
mongoose.connect('mongodb://localhost:27017/myappdatabase');

var userSchema = new Schema({
  name:  String,
  password: String
});


var userTable =  new Schema({
  email: String,
  password: String
});


var Todo = mongoose.model('Todo', userSchema);
var User = mongoose.model('User' , userTable);

app.get('/getAll' , function(req, res){
    Todo.find({} , function(err , todos){
      if (err){
        res.send(err);
      }
      console.log(todos);
      res.send(todos);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("New Local Strategy");
    User.find({ email: username }, function (err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user[0]) { return done(null, false); }
      if (user[0]._doc.password != password) { return done(null, false); }
      console.log("sending" );
      return done(null, user);
      console.log("sendt");
    });
    // return done(null , false);
  }
));

var isValidPassword = function(user, password){
  return true;
}

app.post('/login',
passport.authenticate('local' ) ,
function(req, res) {
  console.log("Back");
    res.send(req.user[0]);
});

app.get('/logout', function(req, res){

  req.logout();
  res.send("true");
});

passport.serializeUser(function(user, done) {
  console.log("Serialize User");
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("De Serialize User");
  done(null, user);
});

app.get('/delete/:name' , function(req , res){
  Todo.remove({
            name : req.params.name
        }, function(err, todo) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
});

app.get('/getOne/:id' , function(req , res){
  Todo.find({name : req.params.id}, function(err, todo) {
            if (err)
                res.send(err);
            res.send  (todo[0]);
            // get and return all the todos after you create another
        });
});


app.post('/update', function(req , res){
  console.log(req.param('rec').name);
  Todo.update({_id:req.param('rec').id} , {$set : {name:req.param('rec').name , password:req.param('rec').password}} , function(err){
    if(err){
      res.send("Error occured");
      console.log("Not Updated")
    };
    console.log("Updated");
    res.send("true");
  });
});

app.post('/signUp' , function(req , res){
  var p = new User ({email : req.param('rec').username  , password: req.param('rec').password});
  p.save(function(err){
    if(err){
      res.send(err)
    }
    res.send(p);
  });
});


app.post('/addData' , function(req , res){
  console.log( req.param('rec').name);

  var p = new Todo({name: req.param('rec').name  , password: req.param('rec').password});
  p.save(function(err){
    if(err){
      res.send(err);
      console.log(error);
    }
    res.json(p);
  });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



// module.exports = app;
