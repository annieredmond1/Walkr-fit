
var Walk = require('../models/walk.js'),
    User = require('../models/user.js'), 
    qs = require('querystring'),  
    request = require('request'), 
    config = require('../config.js'), 
    moment = require('moment'),
    auth = require('./auth');

module.exports = function(app) {

  //get all walks
  app.get('/api/walks', function(req, res){
    // INDEX - GET ALL POSTS
    Walk.find().sort('-created_at').exec(function(err, walks) {
      if (err) { return res.status(404).send(err); }
      res.send(walks); 
    });    
  });

  //get walks owned by current user
  app.get('/api/my-walks', auth.ensureAuthenticated, function(req, res){
    // INDEX - GET ALL POSTS
    Walk.find({owner: req.userId}).sort('-created_at').exec(function(err, walks) {
      if (err) { return res.status(404).send(err); }
      res.send(walks); 
    });    
  });

  //get walk by id
   app.get('/api/walks/:id',function(req,res){   
    Walk.findById(req.params.id)
      .populate('rsvps')
      .exec(function(err, walk) {
      console.log('req.params.id is: ', req.params.id);
      console.log('walk is: ', walk);
      if (err) { return res.status(404).send(err); }
      res.send(walk); 
    });
  });

  // CREATE
  app.post('/api/walks', function(req,res){  
   // var walk = new Walk( req.body );
   // walk.save(function (err, walk) {
    Walk.create(req.body, function(err, walk){
      if (err) { return res.send(err); }
        walk.owner.push(req.body.owner);
      res.status(201).send(walk);
    });
  });

   // UPDATE
  app.put('/api/walks/:id', function(req,res){ 
    console.log('hitting api/walks/:id path');
    Walk.findOneAndUpdate({ _id: req.params.id}, req.body, { new: true }, function (err, walk) {
      if (err) { return res.send(err); }
      console.log('req.body is: ', req.body);
      console.log('walk is: ', walk);
      res.send(walk);
    });
  });

  //DELETE
  app.delete('/api/walks/:id', function(req,res) {
    Walk.findById({ _id: req.params.id}).remove().exec();
    res.sendStatus(200);
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