
'use strict';

/* Services */

angular.module('walkr-fit.services', [])
  //get the current user
  .factory('Auth', ['$auth', function ($auth) {
    return {
      currentUser: function() {
        var user = $auth.getPayload();
        var currentUser = {
          _id: user.sub
          
        };
        return currentUser;
      }
    };
  }])
  

  .factory('Walk', function($resource, $window) {
  return $resource('/api/walks/:id', { id: '@_id'}, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });


});