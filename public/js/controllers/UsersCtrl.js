'use strict';

/* USER Controllers */

angular.module('walkr-fit')
  .controller('ProfileCtrl', ['Walk', '$scope', '$http', '$auth', 'Auth', '$location', '$window', function(Walk, $scope, $http, $auth, Auth, $location, $window) {
    console.log('profile ctrl active');
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });
    $scope.currentUser = Auth.currentUser;


    $scope.walkShow = function(walk) {
      Walk.get({ id: walk._id }, function(walk) {
        $scope.walk = walk;
        //used window.location to redirect so facebook share button shows up
        $window.location.href = '/walks/' + walk._id;
    });
  };

  //set past walks property on checkbox to false
    $scope.checkboxModel = {
      pastWalks : false
    };



    //Get hosted walks split by past or future

      //query myWalks and use then to wait til promise is fullfilled
      Walk.myWalks().$promise.then(function(response) {
        //create variable for all walks
        $scope.myWalks = response;
        //create varialble for upcoming walks
        $scope.myUpcomingWalks = [];
        //create variable to past walks
        $scope.myPastWalks = [];
        //set currentDate variable in milliseconds
        var currentDate = +new Date();
        //loop through walks
        for(var i=0; i<$scope.myWalks.length; i++) {
          //set walk date variable to be walk date in milliseconds
          var walkDate = +new Date($scope.myWalks[i].date);
          //check if walk date is greater than current date (for future walks)
          if(walkDate > currentDate) {
            //push walk into upcoming walks array
            $scope.myUpcomingWalks.push($scope.myWalks[i]);  
          } else {
            //push walk into past walks array
            $scope.myPastWalks.push($scope.myWalks[i]);
          }
        }
      });

    //Get rsvpd walks split by past or future

      //query rsvpWalks and use then to wait til promise is fullfilled
      Walk.rsvpWalks().$promise.then(function(response) {
        //create variable for all walks
        $scope.rsvpWalks = response;
        //create varialble for upcoming walks
        $scope.rsvpUpcomingWalks = [];
        //create variable to past walks
        $scope.rsvpPastWalks = [];
        //set currentDate variable in milliseconds
        var currentDate = +new Date();
        //loop through walks
        for(var i=0; i<$scope.rsvpWalks.length; i++) {
          //set walk date variable to be walk date in milliseconds
          var walkDate = +new Date($scope.rsvpWalks[i].date);
          //check if walk date is greater than current date (for future walks)
          if(walkDate > currentDate) {
            //push walk into upcoming walks array
            $scope.rsvpUpcomingWalks.push($scope.rsvpWalks[i]);  
          } else {
            //push walk into past walks array
            $scope.rsvpPastWalks.push($scope.rsvpWalks[i]);
          }
        }
      });
    
    
  }]);