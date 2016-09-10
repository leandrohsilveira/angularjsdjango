(function() {
    'use strict';

    angular
        .module('sampleApp', [
            'ui.router',
			'ngMessages',
			'ngMaterial'
        ])

		.config(InterpolatorProviderConfig)
		.config(ThemeProviderConfig);

		InterpolatorProviderConfig.$inject = ['$interpolateProvider'];

		function InterpolatorProviderConfig($interpolateProvider) {
			$interpolateProvider.startSymbol('@{');
			$interpolateProvider.endSymbol('}');
		}

		ThemeProviderConfig.$inject = ['$mdThemingProvider'];

		function ThemeProviderConfig($mdThemingProvider) {
			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('deep-orange')
				.warnPalette('red');
		}

})();
