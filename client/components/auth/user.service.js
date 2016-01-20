(function() {
  'use strict';

    function userService($resource) {
      return $resource('/api/v1/users/:id', { id: '@_id' }, {
        get: {
            method: 'GET',
            params: { id:'me' }
          }
        }
      );
    }

  angular
    .module('cmsApp')
    .factory('User', ['$resource', userService]);

}());
