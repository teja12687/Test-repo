(function(){
  'use strict';

  angular
    .module('cmsApp.jobs')
    .directive('timelapse', timeLapse);

  function timeLapse($interval) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        start: '=',
        timer: '&'
      },
      template: '<span>{{timer}}</span>',
      link: function(scope, element, attrs) {

        function pad(data){
          if (data.toString().length==1){
            return '0'+data;
          }

          return data;
        }

        function calculateLapseTime() {

          var startDate = new Date(scope.start);
          var endDate = new Date();

          var seconds = Math.floor((endDate - (startDate))/1000);
          var minutes = Math.floor(seconds/60);
          var hours = Math.floor(minutes/60);
          var days = Math.floor(hours/24);

          hours = pad(hours-(days*24));
          minutes = pad(minutes-(days*24*60)-(hours*60));
          seconds = pad(seconds-(days*24*60*60)-(hours*60*60)-(minutes*60));

          scope.timer = hours + ':' + minutes + ':' + seconds;
        }

        calculateLapseTime();

        $interval(function(){

          calculateLapseTime();

        }, 1000);
      }
    }

  }

})();
