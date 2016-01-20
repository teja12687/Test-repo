(function () {
  'use strict';

  angular
    .module('cmsApp.core')
    .factory('common', common);

  common.$inject = ['$location', '$q', '$rootScope', '$timeout'];

  function common($location, $q, $rootScope, $timeout) {

    //var throttles = {};

    var service = {
      // common angular dependencies
      $broadcast: $broadcast,
      $q: $q,
      $timeout: $timeout,
      // generic
      createSearchThrottle: createSearchThrottle,
      isNumber: isNumber,
      textContains: textContains
    };

    return service;

    function $broadcast() {
      return $rootScope.$broadcast.apply($rootScope, arguments);
    }

    function createSearchThrottle(viewmodel, list, filteredList, filter, delay) {
      // After a delay, search a viewmodel's list using
      // a filter function, and return a filteredList.

      // custom delay or use default
      delay = +delay || 300;
      // if only vm and list parameters were passed, set others by naming convention
      if (!filteredList) {
        // assuming list is named sessions, filteredList is filteredSessions
        filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
        // filter function is named sessionFilter
        filter = list + 'Filter'; // function in string form
      }

      // create the filtering function we will call from here
      var filterFn = function () {
        // translates to ...
        // vm.filteredSessions
        //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
        viewmodel[filteredList] = viewmodel[list].filter(function (item) {
          return viewmodel[filter](item);
        });
      };

      return (function () {
        // Wrapped in outer IIFE so we can use closure
        // over filterInputTimeout which references the timeout
        var filterInputTimeout;

        // return what becomes the 'applyFilter' function in the controller
        return function (searchNow) {
          if (filterInputTimeout) {
            $timeout.cancel(filterInputTimeout);
            filterInputTimeout = null;
          }
          if (searchNow || !delay) {
            filterFn();
          } else {
            filterInputTimeout = $timeout(filterFn, delay);
          }
        };
      })();
    }

    function isNumber(val) {
      // negative or positive
      return (/^[-]?\d+$/).test(val);
    }

    function textContains(text, searchText) {
      return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
    }

  }
  
  
  

})();
