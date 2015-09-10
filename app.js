var express = require('express');
var mongoose = require('mongoose');
var app = express();
var Schema = mongoose.Schema;

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
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
      res.json(todos);
    });
});

app.get('/delete/:id' , function(req , res){
  console.log(req.params.id);
  Todo.remove({
            _id : req.params.todo_id
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
  Todo.findOne({_id : req.params.id}, function(err, todo) {
            if (err)
                res.send(err);
            res.json(todos);
            // get and return all the todos after you create another
        });
});


app.get('/update/:obj', function(req , res){
  Todo.findById(req.params.obj.id , function(err , user){
    if (err)
      res.send(err);
    user = req.obj;
    user.save(function(err){
      if (err)
        res.send(err);

      Todo.find({} , function(err , users){
        if(err)
          res.send(err);
        res.json(users);
      });
    });
  });
});


app.post('/addData' , function(req , res){
  console.log("Request Params ");
  console.log(req.params);
  // var t = new userSchema(req.params.stickie.a    );
  // t.save(function(err){
  //   if(err)
  //     res.send(err);
  //   Todo.find({} , function(err , users){
  //     if(err)
  //       res.send(err);
  //     res.json(users);
  //   });
  // });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



// module.exports = app;
