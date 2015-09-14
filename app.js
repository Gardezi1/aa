  var express = require('express');
var mongoose = require('mongoose');
var util = require('util');
var bodyParser = require('body-parser')
var app = express();
var Schema = mongoose.Schema;
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



var Todo = mongoose.model('Todo', userSchema);


app.get('/getAll' , function(req, res){
    Todo.find({} , function(err , todos){
      if (err){
        res.send(err);
      }
      console.log(todos);
      res.send(todos);
    });
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
  // Todo.find({_id : req.params.id} , function(err , user){
  //   if (err)
  //     res.send(err);
  //   user.name = req.param('rec').name;
  //   user.password = req.param('rec').password;
  //   console.log(user);
  //   user.update(function(err){
  //     if (err)
  //       res.send(err);
  //
  console.log(req.param('rec').name);
  Todo.update({_id:req.param('rec').id} , {$set : {name:req.param('rec').name , password:req.param('rec').password}} , function(err){
    if(err)
      console.log("Error occured");
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
