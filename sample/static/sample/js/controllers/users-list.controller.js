(function() {
    'use strict';

    angular
        .module('sampleApp')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$http', '$location', '$mdToast'];

    /* @ngInject */
    function UsersListController($http, $location, $mdToast) {
      var vm = this;
  		vm.users = [];
  		vm.count = 0;
  		vm.page = 1;
  		vm.limit = 10;
  		vm.loadMore = loadMore;
  		vm.canLoadMore = canLoadMore;
      vm.changeLimit = changeLimit;
      vm.name = null;
      vm.search = search

      activate();

      function activate() {
        vm.limit = $location.search().l;
  			load();
      }

      function changeLimit(limit) {
        vm.users = [];
        vm.page = 1;
        vm.limit = limit;
        load();
      }

      function search() {
        vm.users = [];
        vm.page = 1;
        load();
      }

  		function load() {
        var params = {
          p: vm.page,
          l: vm.limit
        };
        if(vm.name) {
          params.name = vm.name
        }
        return $http.get('api/users', {
  			  params: params
  			})
  			.then(success)
  			.catch(error);
  		}

  		function canLoadMore() {
  			return vm.page * vm.limit < vm.count;
  		}

  		function loadMore() {
  			if(canLoadMore()) {
  				vm.page++;
  				load();
  			}
  		}

  		function success(resolve) {
  			var result = resolve.data.result;
  			for (var i = 0; i < result.length; i++) {
  				var user = result[i];
  				vm.users.push(user);
  			}
  			vm.count = resolve.data.count;
  			return resolve.data;
  		}

  		function error(reject) {
  			console.error(reject);
  			$mdToast.simple().textContent("Ops! An error ocurred!");
  		}
    }
})();
