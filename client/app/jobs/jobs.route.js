(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('jobs', {
        url: '/jobs',
        templateUrl: 'app/jobs/jobs.html',
        authenticate: true,
        controller: 'JobsCtrl',
        controllerAs: 'JobsCtrl'
        
      })
      .state('jobDetail', {
        url: '/job/:id',
        templateUrl: 'app/jobs/jobDetails.html',
        controller: 'JobCtrl',
        controllerAs: 'JobCtrl',
        authenticate: true
      })
      .state('fallout', {
        url: '/fallout',
        templateUrl: 'app/jobs/fallout.html',
        controller: 'FalloutCtrl',
        controllerAs: 'FalloutCtrl',
        authenticate: true
      });
  }

})();
