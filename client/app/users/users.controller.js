(function(){
  'use strict';

  angular
    .module('cmsApp.users')
    .controller('UsersCtrl', UsersCtrl);


  UsersCtrl.$inject = ['UserService','$modal','authService'];

  function UsersCtrl(UserService,modal,authService){

    var self = this;

    self.count = 0;
    self.users = [];
    self.pageSize = 10;
    self.currentPage = 0;
    self.newUser = false;
    self.showUserModal = false;
    self.selectedUser = null;
    self.searchText = '';
    self.getCurrentUser = authService.getCurrentUser;
    self.loggedInUser = false;
    self.groups = [{'name':'members','value':true}];

    self.nextPage = nextPage;
    self.addNewUser = addNewUser;
    self.cancelUser = cancelUser;
    self.deleteUser = deleteUser;
    self.searchUser = searchUser;
    self.keySearch = keySearch;
    self.saveUser = saveUser;
    self.viewUser = viewUser;
    self.open = open;

    var searchEnabled = false;

    init();
    function init(){
      UserService.getUsers(self.pageSize,self.currentPage)
        .then(function(response) {
            mapUsers(response);
        })
        .catch();
    }

    function nextPage(){
      self.currentPage++;
      init();
    }

    function addNewUser() {
      self.selectedUser = null;
      self.newUser = true;
      self.open();
    }

    function cancelUser(){
      resetSelectedUser();
    }

    function resetSelectedUser() {
      self.currentPage =0;
      self.count = 0;
      self.users = [];
      self.newUser = false;
      self.selectedUser = null;
    }

    function deleteUser(){
      UserService.deleteUser(self.selectedUser.id).then(function() {
        resetSelectedUser();
        init();
      })
        .catch();
    }

    function searchUser(){
      if(self.searchText !== '' ) {
        searchEnabled = true;
        self.currentPage = 0;
        UserService.searchUser(self.searchText)
          .then(function (response) {
            self.users = [];
            mapUsers(response);
          })
          .catch();
      }
    }

    function saveUser(){
      self.selectedUser.groups = [];
      for(var i = 0;i<self.groups.length;i++ ){
        if(self.groups[i].value){
          self.selectedUser.groups.push(self.groups[i].name);
        }
      }
      if (self.newUser){
        UserService.createUser(self.selectedUser)
          .then(function(data) {
            resetSelectedUser();
            init();

          })
          .catch();
      }
      else {
        UserService.updateUser(self.selectedUser)
          .then(function(data) {
            resetSelectedUser();
            init();
          })
          .catch();
      }
    }

    function viewUser(user){
      self.newUser = false;
      if(user.userName === self.getCurrentUser().userName){
        self.loggedInUser = true
      }
      else{
        self.loggedInUser = false
      }
      self.selectedUser = user;
      self.open();
    }

    function mapUsers(response){
      self.count = response.data.count;
      self.currentPage = response.data.currentPage;
      angular.forEach(response.data.users, function(item){
        var user = item;
        user.selectedGroups = '';
        if(user.groups !== undefined) {
          for (var k = 0; k < user.groups.length; k++) {
            if (user.selectedGroups !== '') {
              user.selectedGroups = user.selectedGroups + ',' + user.groups[k];
            }
            else {
              user.selectedGroups = user.groups[k];
            }
          }
        }
        else{
          user.groups =[];
          user.selectedGroups = 'No Groups';
        }

        self.users.push(user);
      });
    }

    function keySearch(){
      if(self.searchText === '' && searchEnabled){
        self.users=[];
        init();
      }
    }

    function open() {
      var modalInstance = modal.open({
        templateUrl: 'app/users/user-modal.html',
        controller: function(){
          this.selectedUser = self.selectedUser;
          this.loggedInUser = self.loggedInUser;
          this.newUser = self.newUser;
          this.cancel = function(){
            modalInstance.dismiss('cancel');
          };
          this.save = function(){
            self.selectedUser = this.selectedUser;
            self.saveUser();
            modalInstance.dismiss('cancel');
          };
          this.delete = function(){
            self.selectedUser = this.selectedUser;
            self.deleteUser();
            modalInstance.dismiss('cancel');
          };
        },
        controllerAs: 'UsersCtrl'
      });
    }

  }

})();


