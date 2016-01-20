(function(){
  'use strict';

  angular
    .module('cmsApp.dashboard')
    .factory('DashboardService',dashboardFactory);

  dashboardFactory.$inject = ['$http'];

  function dashboardFactory($http){

    var service = {
      getDetails:getDetails
    };

    return service;

    /******* implementations *********/

    function getDetails(){
      return $http.get('/api/v1/dashboard')
        .then(function(data){
          return data;
        })
        .catch(function(error){
          return error;
        });
    }

  }

})();
