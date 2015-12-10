'use strict';

/* USER Controllers */

angular.module('walkr-fit')
  .controller('ProfileCtrl', ['$scope', '$http', '$auth', 'Auth', 'Users', function($scope, $http, $auth, Auth, Users) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });

    $scope.users = Users.all();
  }]);