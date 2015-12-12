'use strict';

/* USER Controllers */

angular.module('walkr-fit')
  .controller('ProfileCtrl', ['Walk', '$scope', '$http', '$auth', 'Auth', function(Walk, $scope, $http, $auth, Auth) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });

    $scope.myWalks = Walk.myWalks();

    
  }]);