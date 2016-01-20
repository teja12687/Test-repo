(function(){
  'use strict';

  angular.module('cmsApp', [
    'cmsApp.header',
    'cmsApp.core',
    'cmsApp.login',
    'cmsApp.users',
    'cmsApp.dashboard',
    'cmsApp.jobs',
    'cmsApp.cp'
  ])

  .config(config)
  .factory('authInterceptor',authInterceptor)
  .run(appRun);

  function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
    $urlRouterProvider
      .otherwise('/jobs');
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('authInterceptor');
  }

  function authInterceptor($rootScope, $q, $cookieStore, $location){
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }

  function appRun($rootScope, $location, authService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      authService.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  }

})();
