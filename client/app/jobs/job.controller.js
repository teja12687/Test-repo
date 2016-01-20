(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .controller('JobCtrl', JobCtrl);
//    .filter('highlight', function($sce) {
//
//    return function(task, phrase) {
//    	
//         return searchObj(task,phrase);
//    }
//    });

  JobCtrl.$inject = ['$scope','$sce','JobsService', 'JobsModel', '$state'];


  
  function JobCtrl($scope,$sce,JobsService, JobsModel, $state) {
    var self = this;
    self.orderid = $state.params.id;
    self.job = null;
    self.taskSearchText="";
    self.fileSearchText="";
    self.toolTipOrderTimes="";

    init();

    function init() {
      JobsService.getJob(self.orderid)
        .then(function(response) {
          self.job = new JobsModel.jobDetail(response.data);

          console.log(response.data);
          console.log(self.job);

          self.toolTipOrderTimes =  "Start: <br />" + response.data.orderStart + " UTC <br />End: <br />" + response.data.orderEnd + " UTC";


        })
        .catch();
    }
    
    $scope.readfile = function(filename){
    	 if (!filename) {
    		JobsService.getFileData(filename).
    		then(function(fdata){
    			$scope.fileData = fdata;
    		})
    	 }
    };
    
    $scope.highlight = function(text, search) {
	    if (!search) {
	        return $sce.trustAsHtml(text);
	    }
	    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
	};

  }


})();
