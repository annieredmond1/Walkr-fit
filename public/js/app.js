'use strict';

// Declare app level module which depends on filters, and services
angular.module('walkr-fit', ['walkr-fit.services',
                              'ngRoute',
                              'ngResource',
                              'satellizer',
                              'ui.bootstrap',
                              'ui.bootstrap.datetimepicker',
                              'google.places'
                              ])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/splash'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });
      $routeProvider.when('/walks', {
        templateUrl: 'templates/walk-index',
        controller: 'WalkCtrl'
      });


      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }]);
