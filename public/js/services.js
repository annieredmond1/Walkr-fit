
'use strict';

/* Services */

angular.module('walkr-fit.services', [])
  //get the current user
  .factory('Auth', ['$auth', function ($auth) {
    return {
      currentUser: function() {
        var user = $auth.getPayload();
        var currentUser = {
          _id: user.sub,
          email: user.email,
          picture: user.picture,
          displayName: user.displayName
        };
        return currentUser;
      }
    };
  }])
  //seed data
  .factory('Users', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var users = [{
    id: 1,
    first: 'Ben',
    last: 'Smith',
    username: 'bsmith',
    email: 'b@b.com',
  }, {
    id: 2,
    first: 'Mary',
    last: 'Smith',
    username: 'marylittle',
    email: 'm@m.com',
  }, {
    id: 3,
    first: 'Suzie',
    last: 'Smith',
    username: 'suze',
    email: 's@a.com',
  }];

  return {
    all: function() {
      return users;
    },
    remove: function(user) {
      users.splice(users.indexOf(user), 1);
    },
    get: function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
          return users[i];
        }
      }
      return null;
    }
  };
})

  .factory('Walk', function($resource, $window) {
  return $resource('/api/walks/:id', { id: '@_id'}, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });


});