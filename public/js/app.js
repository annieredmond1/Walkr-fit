'use strict';

// Declare app level module which depends on filters, and services
angular.module('walkr-fit', ['walkr-fit.services',
                              'ngRoute',
                              'ngResource',
                              'satellizer',
                              'ui.bootstrap',
                              'ui.bootstrap.datetimepicker',
                              'google.places',
                              'xeditable',
                              'ngConfirm'
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
    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; 
});
