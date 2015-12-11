'use strict';

/* WALK Controllers */

angular.module('walkr-fit')
  .controller('WalkCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', function(Walk, Auth, $scope, $http, $timeout) {
  		//for entering date
      $scope.dateTimeNow = function() {
        $scope.date = new Date();
      };
      $scope.dateTimeNow();
      
      
        $scope.minDate = Date.now();
      
       
      $scope.maxDate = new Date('2016-12-01');
      

      $scope.dateOptions = {
        startingDay: 1,
        showWeeks: false
      };

      //for entering location
      $scope.autocompleteOptions = {
          componentRestrictions: { country: 'usa' },
          types: ['geocode']
      };
      
      //Get walks
      $scope.walks = Walk.query();
      
      	

      //find current user
      $scope.currentUser = Auth.currentUser();
      console.log('current user is: ', $scope.currentUser);

      //Create a walk
      $scope.walk = {};
      $scope.newWalk = function() {
      console.log('scope.walk is ', $scope.walk);
      $scope.walk.owner = $scope.currentUser;
      var walk = new Walk($scope.walk);
      walk.$save(function(data) {
        $scope.walks.unshift(data);
        $scope.walk = {};

      });
    };

      
  }]);