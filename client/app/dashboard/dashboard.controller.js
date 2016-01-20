(function(){
  'use strict';

  angular
    .module('cmsApp.users')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['DashboardService'];

  function DashboardCtrl(DashboardService){

    var self = this;

    self.dashboard = null;
    self.categories = [];
    self.failed = [0,0,0,0,0,0,0,0,0,0];
    self.success = [0,0,0,0,0,0,0,0,0,0];

    self.chartConfig = {
      options: {
        chart: {
          type: 'spline'
        },
        exporting: {
          enabled : false
        },
        tooltip: {
          style: {
            backgroundColor: '#FCFFC5',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
          }
        }
      },
      series: [{
        name: 'Failed Attempts',
        data: self.failed
      }, {
        name: 'Success Attempts',
        data: self.success
      }],
      title: {
        text: 'Login Attempts'
      },
      xAxis: {
        categories: self.categories
      }
    };

    getDates();

    init();

    function getDates(){
      for(var i=9;i>=0;i--)
      {
        var newdate = new Date();
        newdate.setDate(newdate.getDate() -i);
        var date = newdate.getMonth()+1 + '/' + newdate.getDate()  + '/' + newdate.getFullYear();
        self.categories.push(date);

      }
    }

    function init(){
      return DashboardService.getDetails()
        .then(function(response) {
          angular.forEach(self.categories, function(category, i){
            var date = category.split('/');
            var selectedDate = response.data.first(
              // jshint eqeqeq:false
              function(e){return (e._id.month == date[0]) && (e._id.day == date[1]) && (e._id.year == date[2]);
              }
            );
            if(selectedDate){
              angular.forEach(selectedDate.entry,function(item){
                if(item.entry === 'Login Success'){
                  self.success[i] = item.count;
                }
                if(item.entry === 'Login Failure'){
                  self.failed[i] = item.count;}
              });
            }
          });
        })
        .catch();
    }

  }

})();


