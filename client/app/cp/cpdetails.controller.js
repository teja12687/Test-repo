(function() {

  'use strict';

  angular
    .module('cmsApp.cp')
    .controller('CPDetailsCtrl', CPDetailsCtrl);

  CPDetailsCtrl.$inject = ['$scope','CpService','$state'];

  function CPDetailsCtrl($scope, CpService,$state) {
    $scope.provider = {};
    
    $scope.getValue = function(option)  {
      console.log(option);
      if (option == 'active')
        return true;
      else  
        return false;  
        
    }
    
    
    function init(){
      CpService.getCPDetails($state.params.id)
          .then(function(result){
            $scope.provider = result.data;
            $scope.provider.Status = $scope.provider.Status.toLowerCase();
            $scope.provider.details = mapAttributes($scope.provider.AdditionalDetails)
            console.log($scope.provider);
          })
          .catch();
    };
    
    
    
    function mapAttributes(data){
      var arr = [];
      for(var x in data){
        
        var obj = {};
        if(x!="TargetPlatforms") {
          obj.name = x;
          obj.value = data[x]
          arr.push(obj);
        }
      }
      return arr;
    }
    
    init();
  }
  
  

})();