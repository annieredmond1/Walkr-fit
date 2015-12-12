'use strict';

/* WALK Controllers */

angular.module('walkr-fit')
  .controller('NewWalkCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$window', '$location', function(Walk, Auth, $scope, $http, $timeout, $window, $location) {
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
      $scope.hourStep = 1;
      $scope.minuteStep = 15;
      $scope.timeOptions = {
        hourStep: [1, 2, 3],
        minuteStep: [1, 5, 10, 15, 25, 30]
      };
      
      $scope.showMeridian = true;
      $scope.timeToggleMode = function() {
        $scope.showMeridian = !$scope.showMeridian;
      };
          
      $scope.$watch("date", function(value) {
        console.log('New date value:' + value);
      }, true);
           
      $scope.resetHours = function() {
        $scope.date.setHours(1);
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

      //go back button
      $scope.backButton = function() {
         $window.history.back();
      };

      //Create a walk
      $scope.walk = {};
      $scope.newWalk = function() {
      $scope.walk.owner = $scope.currentUser;
      var walk = new Walk($scope.walk);
      walk.$save(function(data) {
        $scope.walks.unshift(data);
        $scope.walk = {};
        $location.path('/walks/' + data._id);
      });
    };

      
  }])
.controller('WalkListCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', function(Walk, Auth, $scope, $http, $timeout, $location) {
  console.log('WalkListCtrl active');

  $scope.currentUser = Auth.currentUser();

  

  //Get walks
  $scope.walks = Walk.query();
  console.log("walks are: ", $scope.walks);

  $scope.walkShow = function(walk) {
      Walk.get({ id: walk._id }, function(walk) {
        $scope.walk = walk;
    console.log('walk is; ', $scope.walk);
    $location.path('/walks/' + walk._id);
    });
  };
  
}])
.controller('WalkShowCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$routeParams', function(Walk, Auth, $scope, $http, $timeout, $location, $routeParams) {
  console.log('WalkShowCtrl active');

  $scope.currentUser = Auth.currentUser();
  var owner;
  //Get walk
  $scope.walk = Walk.get({ id: $routeParams.id }, function(w) {
    owner = w.owner[0];
    console.log('w.owner is: ', owner);
    $scope.walkOwner = (($scope.currentUser._id == owner)? true : false);
    console.log('walkOwner is: ', $scope.walkOwner);
  });
  console.log("walk is: ", $scope.walk);

  //Setting what to show on page

  // $scope.walkOwner = (($scope.currentUser._id == owner)? true : false);
  // console.log('currentUser._id is: ', $scope.currentUser._id);
  // console.log('owner is: ', owner);
  // console.log('walkOwner is: ', $scope.walkOwner);
  
}]);










