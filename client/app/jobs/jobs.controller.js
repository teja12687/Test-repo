(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .controller('JobsCtrl', JobsCtrl);

  JobsCtrl.$inject = ['JobsService', 'JobsModel', '$state','FileService'];

  function JobsCtrl(JobsService, JobsModel, $state, FileService) {
    var self = this;

    self.pageSize=25;
    self.pageIndex=0;
    self.filter="running,failed";
    self.jobs=null;
    self.pageSizes = [25, 50, 75, 100];
    self.filterStatus = "filter";
    self.searchText="";
    self.failedCnt = 0;
    self.runningCnt = 0;
    self.jobsCount;
    self.currentView = "Current Orders";
    self.orderView = "All Orders";
    self.loading = false;
    self.changePageSize = changePageSize;
    self.applyfilter = applyfilter;
    self.changePage = changePage;
    self.showDetails = showDetails;
    self.search = search;
    self.Export = Export;
    self.gridOptions = {
        enableServerSideSorting: false,
        enableSorting: true,
        enableServerSideFilter: false,
        rowData: null,
        enableColResize: true,
        enableFilter: true,
        rowSelection: 'single',
        rowDeselection: true,
        pageSize : self.pageSize,
        columnDefs: GetColumnDefs(),
        rowClicked : gotoDetails,
        rowHeight: 50,
        ready: function(){
          init();
        }
    };
    
    function GetColumnDefs() {
      //suppressMenu: true,
      var params = [
        {headerName: 'Status', field: 'orderStatusCode', width: 4 + '%',cellRenderer: function(params) {
            return '<span class="status-'+ params.value +'"></span>';
        }},
        {headerName: 'Package Name', field: 'packageName', width: 12 + '%'},
        {headerName: 'Title Name', field: 'titleName', width: 12 + '%'},
        {headerName: 'Title Asset ID', field: 'titleAssetID', width: 12 + '%'},
        {headerName: 'Provider ID', field: 'providerName', width: 12 + '%'},
        {headerName: 'Work Unit', field: 'currentTask', width: 12 + '%'},
        {headerName: 'WU Run Time', field: 'taskExecutionTime', width: 12 + '%'},
        {headerName: 'Operation', field: 'operation', width: 12 + '%'},
        {headerName: 'License Start', field: 'licenseStart', width: 12 + '%'}
        
      ];
      return params;
    }
    
    function initJobs() {
       JobsService.getJobs(1,0,"","")
              .then(function(response) {
                var jobs = new JobsModel.jobs(response.data);
                self.jobsCount = jobs.count;
                loadJobs();
        })
    }

    function init() {
      initJobs()
    }
    
    function gotoDetails(data) {
       console.log(data);
       $state.go('jobDetail', { "id": data.data.orderid});
     }
    
    function Export() {
      var text = JSON.stringify(self.jobs);
      FileService.writeText("jobs.json", text); 
    }
    
    function loadJobs() {
        self.loading = true;
        var dataSource = {
          pageSize: self.pageSize,
          rowCount : self.jobsCount,
          overflowSize: self.pageSize,
          maxConcurrentRequests: 2,
          maxPagesInCache: 2,
          getRows: function (params) {
            var pindex = params.startRow / self.pageSize;
            JobsService.getJobs(self.pageSize,pindex,self.filter,"")
              .then(function(response) {
                self.jobs = new JobsModel.jobs(response.data);
                self.pageIndex++;
                self.loading = false;
              params.successCallback(self.jobs.items);
              
            })
            .catch();
          }
      };
      self.gridOptions.api.setDatasource(dataSource);  
      self.gridOptions.api.onNewRows(); 
    }

    function changePageSize(size){
      //console.log(size);
      self.pageSize = size;
      loadJobs()
    }

    function onPageSizeChanged(){
      loadJobs()
    }  

    function changePage(){
      loadJobs();
    }

    function showDetails(id){
      $state.go('jobDetail', {id : id});
    }

    function applyfilter(filter){

      self.pageIndex=1;

      if(filter == "All Orders" || filter == "Current Orders"){

        if(filter == 'All Orders'){
          self.filter = "";
          self.currentView = 'All Orders';
          self.orderView = 'Current Orders';

        }
        if(filter == 'Current Orders'){
          self.filter = "running,failed";
          self.currentView = 'Current Orders';
          self.orderView = 'All Orders';
        }
        self.filterStatus = "filter";
        self.searchText = "";
      }
      else {
        self.filter = filter;
        if(filter=='running,failed'){
          self.filterStatus="filter";
        }
        else {
          self.filterStatus=filter;
        }
      }

      init()
    }

    function search(){
      JobsService.getJobs(self.pageSize,self.pageIndex-1,self.filter, self.searchText)
        .then(function(response) {
          self.jobs = new JobsModel.jobs(response.data);
        })
        .catch();
    }

  }



})();
