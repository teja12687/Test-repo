(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .factory('JobsService', JobsService);

  JobsService.$inject = ['$http'];

  function JobsService($http){

    var service = {
      getJobs: getJobs,
      getJob:getJob,
      getFileData:getFileData
    };

    /******* implementations *********/

    function getJobs(pageSize,currentpage, filter, searchText) {
      return $http({method: 'GET', url: '/api/v1/jobs?pageSize='+pageSize+'&pageIndex='+currentpage + '&filter=' + filter + '&search=' + searchText}).
        success(function(response) {
          return response;
        }).
        error();
    }

    function getJob(jobid) {
      return $http({method: 'GET', url: '/api/v1/jobs/' + jobid }).
        success(function(response) {
          return response;
        }).
        error();
    }

    function getFileData(fileName) {
        return $http({method: 'GET', url: '/api/v1/jobs/readfile/' + fileName }).
          success(function(response) {
        	  console.log(response);
            return response;
          }).
          error();
      }
    
    return service;

  }

}());
