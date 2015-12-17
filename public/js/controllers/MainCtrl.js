'use strict';

/* MAIN Controller */

angular.module('walkr-fit')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'Auth', 'toastr', function($scope, $rootScope, $location, $auth, $http, Auth, toastr) {

    // LOGIN/REGISTER
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me').then(function (data) {
        if (!!data.data) {
          $scope.currentUser = data.data;
        } else {
          $auth.removeToken();
        }
      }, function (data) {
        $auth.removeToken();
        // $location.path('/');
      });
    };

    $scope.isAuthenticated();

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          console.log(response);
          $auth.setToken(response);
          $scope.isAuthenticated();
          $scope.user = {};
          $('#login-modal').modal('hide');
          $location.path('/profile');
        })
        .catch(function(response) {
          console.log(response);
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $auth.setToken(response.data.token);
          $scope.isAuthenticated();
          $scope.user = {};
          $('#login-modal').modal('hide');
          $location.path('/profile');
        })
        .catch(function(response) {
          console.log(response);
        });
    };

    //close modal when continue as guest
    $scope.closeModal = function() {
      $('#login-modal').modal('hide');
    };

    $scope.logout = function() {
      $auth.logout()
        .then(function() {
          $auth.removeToken();
          $scope.currentUser = null;
          $location.path('/');
        });
    };


    //FACEBOOK
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
        toastr.success('You have successfully signed in with ' + provider + '!');
        console.log('auth.cu is: ', Auth.currentUser);
        $scope.currentUser = Auth.currentUser();
        $scope.user = $scope.currentUser;
        console.log('navbar currentuser is: ', $scope.currentUser);
        $('#login-modal').modal('hide');
        $location.path('/profile'); 
      })
      .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            toastr.error(error.data.message, error.status);
          } else {
            toastr.error(error);
          }
        });
    };
    
  }]);
