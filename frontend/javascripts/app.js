var app = angular.module('calendar-app', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate'])
	.config(['$stateProvider', '$urlRouterProvider','$resourceProvider', '$httpProvider', '$locationProvider', 
		function($stateProvider, $urlRouterProvider, $resourceProvider, $httpProvider, $locationProvider) {
			$urlRouterProvider.otherwise('/');
			$stateProvider
				.state('home',{
					url: '',
					templateUrl: './templates/layout/layout.html',
					controller: 'LayoutController',
					controllerAs: 'LayoutCtrl',
					redirectTo: 'home.start'
				})
				.state('home.start', {
					url: '/',
					templateUrl: './templates/home/homepage.html',
				});
		}
	]);

app.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
		if (to.redirectTo) {
			evt.preventDefault();
			$state.go(to.redirectTo, params);
		}
	});
}]);

module.exports = app;
