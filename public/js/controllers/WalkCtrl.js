'use strict';

/* WALK Controllers */

angular.module('walkr-fit')
  .controller('NewWalkCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$window', '$location', '$log', function(Walk, Auth, $scope, $http, $timeout, $window, $location, $log) {
  		console.log('NewWalkCtrl active');
      //for entering date
      $scope.today = function() {
          $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
          $scope.dt = null;
        };

        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
          $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.status = {
          opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
          [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
          ];

        $scope.getDayClass = function(date, mode) {
          if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
              var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

              if (dayToCheck === currentDay) {
                return $scope.events[i].status;
              }
            }
          }

          return '';
        };

        $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
      
      //for entering location
      $scope.autocompleteOptions = {
          componentRestrictions: { country: 'usa' }
      };
      
      //Get walks
      $scope.walks = Walk.query();
      


      //find current user
      $scope.currentUser = Auth.currentUser();

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
.controller('WalkListCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$window', function(Walk, Auth, $scope, $http, $timeout, $location, $window) {
  console.log('WalkListCtrl active');


  $scope.currentUser = Auth.currentUser();

  

  //Get walks split by past or future

    //query walks and use then to wait til promise is fullfilled
    Walk.query().$promise.then(function(response) {
      //create variable for all walks
      $scope.walks = response;
      //create varialble for upcoming walks
      $scope.upcomingWalks = [];
      //create variable to past walks
      $scope.pastWalks = [];
      //set currentDate variable in milliseconds
      var currentDate = +new Date();
      console.log('current date is: ', currentDate);
      //loop through walks
      for(var i=0; i<$scope.walks.length; i++) {
        //set walk date variable to be walk date in milliseconds
        var walkDate = +new Date($scope.walks[i].date);
        //check if walk date is greater than current date (for future walks)
        if(walkDate > currentDate) {
          //push walk into upcoming walks array
          $scope.upcomingWalks.push($scope.walks[i]);  
        } else {
          //push walk into past walks array
          $scope.pastWalks.push($scope.walks[i]);
        }
      }
    });


    //set past walks property on checkbox to false
    $scope.checkboxModel = {
      pastWalks : false
    };


  $scope.walkShow = function(walk) {
        Walk.get({ id: walk._id }, function(walk) {
          $scope.walk = walk;
          //used window.location to redirect so facebook share button shows up
          $window.location.href = '/walks/' + walk._id;
      }); 
  };

  //when createWalk button is clicked
  $scope.createWalk = function() {
    //check if user is guest for creating walk button
    if($scope.currentUser._id == 1) {
        //set guestClick to true so user will be prompted to sign in
        $scope.guestClick = true;
      } else {
          //redirect to create walk page
          $location.path('/createwalk');
      } 
        
  };

  //google maps api

  // $scope.map = new google.maps.Map(document.getElementById('map'), {
  //   center: {lat: -34.397, lng: 150.644},
  //   zoom: 6
  // });
  // $scope.infoWindow = new google.maps.InfoWindow({map: map});

  // $scope.markers = [];
  //   for(var i = 0; i < $scope.walks; i++) {
  //     console.log($scope.walks[i].location);
  //     $scope.markers.push($scope.walks[i].location);
  //   };
  // console.log('its: ', uiGmapGoogleMapApi);
  // uiGmapGoogleMapApi.then(function(maps) {
  //   });
  //   $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  //   console.log('map is', $scope.map);
  
}])
.controller('WalkShowCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$routeParams', function(Walk, Auth, $scope, $http, $timeout, $location, $routeParams) {
  console.log('WalkShowCtrl active');



  $scope.currentUser = Auth.currentUser();
  var owner;
  $scope.rsvpUser = false;
  var indexOfCurrentUser;

  //set facebook share url to the current url
  $('.fb-share-button').attr("data-href", document.URL);

  window.fbAsyncInit = function(){
    FB.XFBML.parse();
   };

  //Get walk
  $scope.walk = Walk.get({ id: $routeParams.id }, function(w) {
    owner = w.owner[0];
    $scope.walkOwner = (($scope.currentUser._id == owner._id)? true : false);
    $scope.guest = (($scope.currentUser._id == 1)? true : false);
    $scope.rsvps = w.rsvps;
    $scope.leader = owner;
    
    //check if current user has already rsvp'd
    
    for(var i=0; i<$scope.walk.rsvps.length; i++) {
      if($scope.walk.rsvps[i]._id == $scope.currentUser._id) {
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
        $scope.guestClick = true;
      } else {
          Walk.get({ id: walk._id }, function(walk) {
            $scope.walk = walk;
            $scope.walk.rsvps.unshift($scope.currentUser);
            $scope.walk.$update(function(walk) {
              Walk.get({id: walk._id}, function(walk) {
                $scope.walk.rsvps = walk.rsvps;
              });
            
            });
            $scope.rsvpUser = true;
          }); 
      } 
        
  };


  //To CANCEL RSVP for a walk
  $scope.rsvpDelete = function(walk) {
    Walk.get({ id: walk._id }, function(walk) {
      $scope.walk = walk;
      $scope.walk.rsvps.splice(indexOfCurrentUser, 1);
      $scope.walk.$update(function(walk) {
      });
      $scope.rsvpUser = false;
    });
  };
  
}])
.controller('WalkEditCtrl', ['Walk', 'Auth', '$scope', '$http', '$timeout', '$location', '$routeParams', '$log', function(Walk, Auth, $scope, $http, $timeout, $location, $routeParams, $log) {
  console.log('WalkEditCtrl active');

  $scope.currentUser = Auth.currentUser();
  var owner;

  //for entering date
      $scope.today = function() {
          $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
          $scope.dt = null;
        };

        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
          $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.status = {
          opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
          [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
          ];

        $scope.getDayClass = function(date, mode) {
          if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
              var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

              if (dayToCheck === currentDay) {
                return $scope.events[i].status;
              }
            }
          }

          return '';
        };

        $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

      //for entering location
      $scope.autocompleteOptions = {
          componentRestrictions: { country: 'usa' }
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










