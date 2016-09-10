(function() {
    'use strict';

    angular
        .module('sampleApp')
        .controller('AppSidenavController', AppSidenavController);

    AppSidenavController.$inject = ['$mdSidenav'];

    /* @ngInject */
    function AppSidenavController($mdSidenav) {
        var vm = this;
		vm.toggle = toggle;
		vm.sidenav = null;

        activate();

        function activate() {
			vm.sidenav = $mdSidenav('app-sidenav');
        }

		function toggle() {
			vm.sidenav.toggle();
		}
    }
})();
