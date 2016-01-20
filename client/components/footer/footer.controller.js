(function(){
  'use strict';

  angular
    .module('cmsApp')
    .controller('FooterCtrl', FooterCtrl);

  FooterCtrl.$inject = ['authService'];

  function FooterCtrl (authService) {
    var self = this;
    self.isLoggedIn = authService.isLoggedIn;

    }
})();
