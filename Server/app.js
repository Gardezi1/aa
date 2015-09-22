var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
var Schema = mongoose.Schema;
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy,
require('node-monkey').start({host: "127.0.0.1", port:"50500"});

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
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
    debugger;
    console.log("asdasd");
    User.find({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
    return done(null , false);
  }
));

app.get('/login', passport.authenticate('local') , function(req, res) {
  console.log("I am in this");
      res.send(req.user);
});

app.get('/delete/:name' , function(req , res){
  console.log(req.params);
  console.log(req.params.name);
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
    if(err)
      res.send("Error occured");
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
