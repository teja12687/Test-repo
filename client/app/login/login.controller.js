(function(){
  'use strict';

  angular
    .module('cmsApp.login')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$location','$window','authService'];

  function LoginCtrl ($location, $window,authService) {
    var self = this;

    self.user = {};
    self.errors = {};
    self.submitted = false;
    self.loading = false;

    self.login = login;
    self.loginOauth = loginOauth;

    function login(form){
      self.submitted = true;
      self.loading = true;

      if(form.$valid) {
        authService.login({
          email: self.user.email,
          password: self.user.password
        })
        .then( function() {
          self.loading = false;
          // Logged in, redirect to home
          $location.path('/jobs');
        })
        .catch( function(err) {
          self.errors.failed = true;
          self.loading = false;
          if(err.message === undefined){
            self.errors.other = "System Error";
          }else{
            self.errors.other = err.message;
          }
        });
      }
    }

    function loginOauth(provider){
      $window.location.href = '/auth/' + provider;
    }
  }

})();


