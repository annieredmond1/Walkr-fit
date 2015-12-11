'use strict';

/* WALK Controllers */

angular.module('walkr-fit')
  .controller('NewWalkCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', function(Walk, Auth, $scope, $http, $timeout) {
  		console.log('NewWalkCtrl active');
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

      //show new walk form when create walk button is clicked
      $scope.createWalkForm = false;
      $scope.createWalkButton = function() {
        
          $scope.createWalkForm = true;
          
     
        console.log('create walk button clicked');
        console.log('$scope.createWalkForm is: ', $scope.createWalkForm);
      };

      //Create a walk
      $scope.walk = {};
      $scope.newWalk = function() {
      console.log('scope.walk is ', $scope.walk);
      $scope.walk.owner = $scope.currentUser;
      var walk = new Walk($scope.walk);
      walk.$save(function(data) {
        $scope.walks.unshift(data);
        $scope.walk = {};
        $scope.createWalkForm = false;
        console.log('after save createWalkForm is: ', $scope.createWalkForm);

      });
    };

      
  }])
.controller('WalkListCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', function(Walk, Auth, $scope, $http, $timeout) {
  console.log('WalkListCtrl active');
  $scope.currentUser = Auth.currentUser();
  //Get walks
      $scope.walks = Walk.query();
}]);






