
'use strict';

/* Services */

angular.module('walkr-fit.services', [])
  //get the current user
  .factory('Auth', ['$auth', function ($auth) {

    return {
      currentUser: function() {
        var user = $auth.getPayload();
        var currentUser = {_id: 1}; 
        if(user) {
          currentUser = {
            _id: user.sub,
            displayName: user.displayName 
          };
        }
        return currentUser;
      }
    };
  }])
  

  .factory('Walk', function($resource, $window) {
    return $resource('/api/walks/:id', { id: '@_id'}, {
     query: {method:'GET', isArray:true},
     update: {
        method: 'PUT' 
      },
       myWalks: {
        method: 'GET', url: '/api/my-walks', isArray: true
      },
       rsvpWalks: {
        method: 'GET', url: 'api/rsvp-walks', isArray: true
       }
    });


});