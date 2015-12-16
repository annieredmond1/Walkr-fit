'use strict';

/* USER Controllers */

angular.module('walkr-fit')
  .controller('ProfileCtrl', ['Walk', '$scope', '$http', '$auth', 'Auth', '$location', function(Walk, $scope, $http, $auth, Auth, $location) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    console.log('user is: ', $scope.user);
    });
    $scope.currentUser = Auth.currentUser;
    $scope.myWalks = Walk.myWalks();

    $scope.walkShow = function(walk) {
      Walk.get({ id: walk._id }, function(walk) {
        $scope.walk = walk;
    console.log('walk is; ', $scope.walk);
    $location.path('/walks/' + walk._id);
    });
  };
    
    
  }]);