(function() {
    'use strict';

    angular
        .module('sampleApp')
		.config(RouterConfig);

	RouterConfig.$inject = ['$stateProvider', '$urlRouterProvider']

	function RouterConfig($stateProvider, $urlRouterProvider) {

		$stateProvider
			// .state('index', {
			// 	url: '/',
			// 	templateUrl: 'template/index.html',
			// 	controller: 'SampleController as vm',
			// })
			.state('app', {
				abstract: true,
				templateUrl: 'template/app.html'
			})
			.state('app.users', {
				parent: 'app',
				url: '/users',
				templateUrl: 'template/users-list.html',
				controller: 'UsersListController as vm',
				params: {
					page: 1,
					limit: 2
				}
			});

		$urlRouterProvider.otherwise('/app/users');
	}

})();
