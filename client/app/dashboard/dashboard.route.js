(function(){
  'use strict';

  angular
    .module('cmsApp.dashboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'DashboardCtrl',
        authenticate: true
      });
  }

})();
