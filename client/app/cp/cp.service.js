(function () {
  angular.module('cmsApp.cp').service('CpService', CpService);
  CpService.inject = ['$http'];
  function CpService($http) {
    var self = this;
    
    self.getContentProviders= function(pageSize,currentpage, searchText, filter) {
      return $http({method: 'GET', url: '/api/v1/providers?pageSize='+pageSize+'&pageIndex='+currentpage + '&filter=' + filter + '&search=' + searchText}).
        then(function(response) {
          return response;
        });
    }
    
    self.getCPDetails= function(id) {
      return $http({method: 'GET', url: '/api/v1/providers/'+id}).
        then(function(response) {
          return response;
        });
    }
    
   /* self.getContentProviders = function() {
      return $http({method: 'GET', url: 'api/v1/providers'})
        .then(function(response) {
          //console.log("GET to /api/v1/cps returned data " + JSON.stringify(response));
        console.log(response);
          return response.data.list;
        });
    }*/
  }
})();
