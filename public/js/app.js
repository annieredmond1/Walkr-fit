'use strict';

// Declare app level module which depends on filters, and services
angular.module('walkr-fit', ['walkr-fit.services',
                              'ngLodash',
                              'ngRoute',
                              'ngResource',
                              'satellizer',
                              'ui.bootstrap',
                              'google.places',
                              'xeditable',
                              'ngConfirm',
                              'toastr',
                              'uiGmapgoogle-maps'
                              ])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/splash'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });
      $routeProvider.when('/createwalk', {
        templateUrl: 'templates/newWalkForm',
        controller: 'NewWalkCtrl'
      });
      $routeProvider.when('/walks', {
        templateUrl: 'templates/walk-index',
        controller: 'WalkListCtrl'
      });
      $routeProvider.when('/walks/:id', {
        templateUrl: 'templates/walk-show',
        controller: 'WalkShowCtrl'
      });
      $routeProvider.when('/walks/:id/edit', {
        templateUrl: 'templates/editWalkForm',
        controller: 'WalkEditCtrl'
      });


      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }])

    .config(function($authProvider, $windowProvider) {
      var $window = $windowProvider.$get();
      if ($window.location.host == 'localhost:1337') {
        console.log('development app');
        $authProvider.facebook({        
          clientId: '798530816959903'
        });
      } else {
        console.log('production app');
        $authProvider.facebook({        
          clientId: '798017697011215'
        });
      }
    })
    // .config(function(uiGmapGoogleMapApiProvider) {
    //   uiGmapGoogleMapApiProvider.configure({
    //       //    key: 'your api key',
    //       v: '3.20', //defaults to latest 3.X anyhow
    //       libraries: 'weather,geometry,visualization'
    //   });
    // })
    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; 
    });
