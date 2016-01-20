(function() {

  'use strict';

  angular
    .module('cmsApp.cp')
    .controller('ContentProviderCtrl', ContentProviderCtrl);

  ContentProviderCtrl.$inject = ['$scope','CpService','FileService','$state'];

  function ContentProviderCtrl($scope, CpService, FileService,$state) {
     var list, 
          pageIndex = 0,
          pageSize = 10000,
          totalRowCount = pageSize;
    
    $scope.counts = {};      

    $scope.gridOptions = {
        rowData: null,
        columnDefs: GetColumnDefs(),
        rowHeight: 50,
        ready: function(){
          init();
        },
        rowClicked : gotoDetails
    };
   $scope.loading=false;
   $scope.search = function(){
     init();
   }
   
   function gotoDetails(data) {
     $state.go('cpDetails', { "id": data.data.id});
   }
   
    function init(){
      
      
      CpService.getContentProviders(pageSize, pageIndex, $scope.searchText)
              .then(function(result){

                  $scope.gridOptions.rowData = result.data.list;
                  $scope.gridOptions.api.onNewRows();
                  
                  var activeList = result.data.list.where(function(data){
                    return data.Status=="Active"
                  }) 
                  
                  var onBoardList = result.data.list.where(function(data){
                    return data.Status=="OnBoarding"
                  }) 
                  
                  var inactiveList = result.data.list.where(function(data){
                    return data.Status=="InActive"
                  }) 
                  console.log(activeList.length)
                  
                  $scope.counts.active =  activeList.length;
                  $scope.counts.onboard =  onBoardList.length;
                  $scope.counts.inactive =  inactiveList.length;

                  $scope.loading = false;
                  
              })
              .catch();
    };

    $scope.Export = function() {
      var text = JSON.stringify(list);
      FileService.writeText("providers.json", text); 
    }

    function GetColumnDefs() {
      var params = [
        {headerName: ' ',field: 'Status',width: 4 + '%', suppressMenu: true, 
          cellRenderer: function(params) {
            //console.log(params);
            return '<span class="status-'+ params.value.toLowerCase() +'"></span>';
        }},
        {headerName: 'Provider ID', field: 'Id', width: 16 + '%', suppressMenu: true},
        {headerName: 'Provider Name', field: 'Name', width: 19 + '%', suppressMenu: true},
        {headerName: 'Content Group', field: 'ContentGroupName', width: 11 + '%', suppressMenu: true},
        {headerName: 'Content Type', field: 'ContentType', width: 10 + '%', suppressMenu: true},
        {headerName: 'Product Type', field: 'ProductType', width: 10 + '%', suppressMenu: true},
        {headerName: 'Storefront', field: 'Storefront', width: 8 + '%', suppressMenu: true},
        {headerName: 'Landing Pad', field: 'LandingPad', width: 10 + '%', suppressMenu: true},
        {headerName: 'Default Workflow', field: 'DefaultWorkflow', width: 12 + '%', suppressMenu: true},
      ];
      return params;
    }
    
    function sortAndFilter(allOfTheData, sortModel, filterModel) {
        return sortData(sortModel, allOfTheData);
    }

    function sortData(sortModel, data) {
        var sortPresent = sortModel && sortModel.length > 0;
        if (!sortPresent) {
            return data;
        }
        // do an in memory sort of the data, across all the fields
        var resultOfSort = data.slice();
        resultOfSort.sort(function(a,b) {
            for (var k = 0; k<sortModel.length; k++) {
                var sortColModel = sortModel[k];
                var valueA = a[sortColModel.field];
                var valueB = b[sortColModel.field];
                // this filter didn't find a difference, move onto the next one
                if (valueA==valueB) {
                    continue;
                }
                var sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
                if (valueA > valueB) {
                    return sortDirection;
                } else {
                    return sortDirection * -1;
                }
            }
            // no filters found a difference
            return 0;
        });
        return resultOfSort;
    }
  }

})();