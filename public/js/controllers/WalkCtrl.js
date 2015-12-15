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
      console.log('walk created is: ', walk);
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
      console.log('currentUser is: ', $scope.currentUser);
        Walk.get({ id: walk._id }, function(walk) {
          $scope.walk = walk;
      console.log('walk is; ', $scope.walk);
      $location.path('/walks/' + walk._id);
      }); 
  };
  
}])
.controller('WalkShowCtrl', ['$modal', 'Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$routeParams', function($modal, Walk, Auth, $scope, $http, $timeout, $location, $routeParams) {
  console.log('WalkShowCtrl active');

  $scope.currentUser = Auth.currentUser();
  var owner;
  $scope.rsvpUser = false;
  var indexOfCurrentUser;
  console.log('rsvpUser', $scope.rsvpUser);
  
  //Get walk
  $scope.walk = Walk.get({ id: $routeParams.id }, function(w) {
    owner = w.owner[0];
    $scope.walkOwner = (($scope.currentUser._id == owner)? true : false);
    $scope.guest = (($scope.currentUser._id == 1)? true : false);
    $scope.rsvps = w.rsvps;
    
    //check if current user has already rsvp'd
    
    for(var i=0; i<$scope.rsvps.length; i++) {
      if($scope.rsvps[i]._id == $scope.currentUser._id) {
        $scope.rsvpUser = true;
        indexOfCurrentUser = i;
      }
    }  
  });
 

  //Delete walk
  $scope.deleteWalk = function(walk) {
    Walk.delete({ id: $routeParams.id }, function(walk) {

      $location.path('/walks');
    });
    
  };

  //go to edit page
  $scope.editWalk = function() {
    $location.path('/walks/' + $scope.walk._id + '/edit');
  };

  //To RSVP for walk
  $scope.rsvpWalk = function(walk) {
    if($scope.currentUser._id == 1) {
        console.log('guest user');
        $scope.guestClick = true;
      } else {
        console.log('currentUser is: ', $scope.currentUser);
          Walk.get({ id: walk._id }, function(walk) {
            $scope.walk = walk;
            $scope.walk.rsvps.push($scope.currentUser);
            $scope.walk.$update(function(walk) {
            });
          });
        
      }
    
  };

  //To CANCEL RSVP for a walk
  $scope.rsvpDelete = function(walk) {
    Walk.get({ id: walk._id }, function(walk) {
      $scope.walk = walk;
      $scope.walk.rsvps.splice(indexOfCurrentUser, 1);
      console.log('walk after splice is: ', $scope.walk);
      $scope.walk.$update(function(walk) {

      });
    });
  };
  
}])
.controller('WalkEditCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$routeParams', function(Walk, Auth, $scope, $http, $timeout, $location, $routeParams) {
  console.log('WalkEditCtrl active');

  $scope.currentUser = Auth.currentUser();
  var owner;

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
  
  //Get walk
  $scope.walk = Walk.get({ id: $routeParams.id }, function() {
    console.log('walk.get worked for $scope.walk');
  });

  $scope.updateWalk = function(walk) {
    console.log('walk in form function is: ', walk);
    Walk.get({ id: $routeParams.id }, function() {
      console.log('walk is: ', walk);
      $scope.walk = walk;
      $scope.walk.$update(function(walk) {
        console.log('scope.walk.update worked');
      });

      $location.path('/walks/' + walk._id);
    });
  };


    // $scope.updateBook = function(book) {
  //    Book.get({ id: book.id }, function() {
  //      Book.update({id: book.id}, book);
  //      book.editForm = false;
  //    }); 
  //  };
  
}]);










