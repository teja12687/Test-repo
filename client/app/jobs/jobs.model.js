(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .factory('JobsModel', JobsModel);

  JobsModel.$inject = [];

  function JobsModel(){

    var model = {
      jobs: jobs,
      jobDetail : jobDetail
    };


    function jobs(data){

      var self = {};
      self.pages = data.pages;
      self.count = data.count;
      self.failed = data.failed;
      self.running = data.running;
      self.items = mapJobs(data.jobs);


      return self;

    }

    function mapJobs(data){
      var jobs = [];
      for(var i=0;i<data.length;i++){
        var job = jobDetail(data[i]);
        jobs.push(job);
      }
      return jobs;
    }

    function jobDetail(data){
      var self = {};
      self.orderid = data.orderId;
      self.orderStatusCode = data.orderStatusCode;
      self.providerId = data.providerId;
      self.providerName = data.providerName || data.providerId  || "Provider - Not Available";
      self.workFlowName = data.workflowName || data.workflowId || "Workflow - Not Available";
      self.workflowId = data.workflowId;
      self.currentTask = data.currentTask || "Current WU - Not Available";
      self.taskExecutionTime = calculateTaskExecutionTimme(data)
      self.orderStart = data.orderStart;
      self.packageName = data.packageName;
      self.titleName = data.titleName;
      self.titleAssetID = data.titleAssetID;
      self.operation = data.operation;
      self.licenseStart = data.licenseStart;
      self.IngestVer = data.IngestVer;
      self.Storefront = data.Storefront;
      
      self.runtime = mapRunTime(data);
      if (data.taskEvents && data.taskEvents.length >0 ) {
        self.tasks = mapTaskList(data.taskEvents);
      }
      if (data.landingPadInfo && data.landingPadInfo.length >0 ) {
        self.files = mapLandingPadList(data.landingPadInfo);
      }
      return self;
    }

    function taskDetail(data){
      var self = {};
      self.orderid = data.orderId;
      self.taskName = data.taskId;
      self.taskStatusCode = data.taskStatusCode;
      self.taskStart = data.taskStart;
      self.taskEnd = data.taskEnd;
      self.taskStatusDesc = data.taskStatusDesc;

      self.taskAttributes = mapAttributes(data);

      return self;
        
        consle.log(data);
    }

    function fileDetail(data){
      var self = {};
      self.orderid = data.orderId;
      self.fileName = data.fileName;
      self.fileType = data.fileType;
      self.fileSize = data.fileSize;
        
       
            if(self.fileSize < 1024){
            self.fileSize  = self.fileSize +'Bytes';
         }  
            
           
            else if(self.fileSize<1024){
                self.fileSize = self.fileSize.toFixed(2) + "Kb";
            }
            
         
       
      self.fileAttributes = mapAttributes(data);
      return self;
    }

    function mapAttributes(data){
      var arr = [];
      for(var x in data){
        var obj = {};
        obj.name = x;
        obj.value = data[x]

        arr.push(obj);
      }
      return arr;
    }

    function mapTaskList(data) {
      var tasks = []

      for(var i=0;i<data.length;i++){
        var task = taskDetail(data[i]);
        tasks.push(task);
      }
      return tasks;
    }

    function mapLandingPadList(data){
      var files = []

      for(var i=0;i<data.length;i++){
        var file = fileDetail(data[i]);
        files.push(file);
      }
      return files;
    }

    function mapRunTime(data){
      var runtime = "";
      if (data.orderStatusCode != 'running'){

        var startDate = new Date(data.orderStart);
        var endDate = new Date(data.orderEnd);

        var seconds = Math.floor((endDate - (startDate))/1000);
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);

        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

        runtime = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
       }

      return runtime;
    }
    
    function calculateTaskExecutionTimme(data) {

        var startDate = new Date(data.currentTaskStartTime);
        var endDate = new Date(data.currentTaskEndTime);

        var seconds = Math.floor((endDate - (startDate))/1000);
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);

        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

        var runtime =pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
        return runtime;
      }

    function pad(data){
      if (data.toString().length==1){
        return '0'+data;
      }

      return data;
    }

    return model
  }

}());


