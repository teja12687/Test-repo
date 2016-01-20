(function(){
  'use strict';

  angular
    .module('cmsApp.cp')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('contentProvider', {
        url: '/cp',
        templateUrl: 'app/cp/cp.html',
        controller: 'ContentProviderCtrl',
        authenticate: true
      })
      .state('cpDetails', {
        url: '/cp/:id',
        templateUrl: 'app/cp/cpdetails.html',
        controller: 'CPDetailsCtrl',
        authenticate: true
      });
  }
  
  

})();
