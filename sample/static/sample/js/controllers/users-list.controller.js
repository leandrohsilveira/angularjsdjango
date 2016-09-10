(function() {
    'use strict';

    angular
        .module('sampleApp')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$http', '$stateParams', '$mdToast'];

    /* @ngInject */
    function UsersListController($http, $stateParams, $mdToast) {
        var vm = this;
		vm.users = [];
		vm.count = 0;
		vm.page = 1;
		vm.limit = 3;
		vm.loadMore = loadMore;
		vm.canLoadMore = canLoadMore;

        activate();

        function activate() {
			vm.page = $stateParams.page;
			vm.limit = $stateParams.limit;

			load();
        }

		function load() {
			return $http.get('api/users', {
				params: {
					page: vm.page,
					limit: vm.limit
				}
			})
			.then(success)
			.catch(error);;
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
			console.log(resolve);
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
