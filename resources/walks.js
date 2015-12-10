
var Walk = require('../models/walk.js'),
    User = require('../models/user.js'), 
    qs = require('querystring'),  
    request = require('request'), 
    config = require('../config.js'), 
    moment = require('moment');

module.exports = function(app) {

  app.get('/api/walks', function(req, res){
    // INDEX - GET ALL POSTS
    Walk.find().sort('-created_at').exec(function(err, walks) {
      if (err) { return res.status(404).send(err); }
      res.send(walks); 
    });    
  });

  // CREATE
  app.post('/api/walks', function(req,res){  
   // var walk = new Walk( req.body );
   // walk.save(function (err, walk) {
    Walk.create(req.body, function(err, walk){
      console.log("walk created is: ", walk);
      if (err) { 
        console.log('err is: ', err);
        return res.send(err); }

      res.status(201).send(walk);
    });
  });

  // app.get('/api/posts/:post_id',function(req,res){   
  //   Post.findById(req.params.post_id, function(err, post) {
  //     if (err) { return res.status(404).send(err); }
  //     res.send(post); 
  //   });
  // });

  //   // full update of one post by id
  // app.put('/api/posts/:post_id', function(req,res){ 
  //   Post.findOneAndUpdate({ _id: req.params.post_id}, req.query.post, function (err, post) {
  //     if (err) { return res.send(err); }
  //     res.send(post);
  //   });
  // })

  //   // delete one post by id
  // app.delete('/api/posts/:post_id', function(req,res){   
  //   Post.findByIdAndRemove(req.params.post_id, function (err, post) {
  //     if (err) { return res.send(err); }
  //     res.status(200).send('Success');
  //   });
  // });
 
};