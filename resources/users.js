
var User = require('../models/user.js'), 
    qs = require('querystring'), 
    jwt = require('jwt-simple'), 
    request = require('request'), 
    config = require('../config.js'), 
    moment = require('moment'), 
    auth = require('./auth');

module.exports = function(app) {

  app.get('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      if(err){console.log(err)
      }else{
      res.send(user);
    }
    });
  });

  // app.get('/api/users', function(req, res) {
  //   User.findById(req.rsvpId, function(err, users) {
  //     res.send(users);
  //   });
  // });

  app.put('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      
      var user = new User({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      });

      user.save(function(err, result) {
        console.log('entering user.save function');
        if (err) {
          res.status(500).send({ message: err.message });
        }
        res.send({ token: auth.createJWT(result) });
      });
    });
  });

  app.post('/auth/facebook', function(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        console.log('hit step 1');
        return res.status(500).send({ message: accessToken.error.message });
      }

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        console.log('hit step 2');
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }

        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = auth.createJWT(existingUser);
            return res.send({ token: token });
          } else {
            User.findOne({ email: profile.email }, function(err, existingUser) {
              if (existingUser) {
                console.log('hit 3b existing user');
                existingUser.facebook = profile.id;
                existingUser.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

                existingUser.save(function(err) {
                  var token = auth.createJWT(existingUser);
                  return res.send({ token: token });
                });                
              } else {
                console.log('hit 3b new user');
                var user = new User();

                user.email = profile.email;
                user.facebook = profile.id;
                user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                user.displayName = profile.name;

                user.save(function(err) {
                  return res.status(500).send({ message: err });

                  var token = auth.createJWT(user);
                  res.send({ token: token });
                });
              }
            });
          }
        });
      });
    });
});

app.post('/auth/unlink', auth.ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});

};