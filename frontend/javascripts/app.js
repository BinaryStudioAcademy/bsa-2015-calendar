
var app = angular.module('calendar-app', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'angularjs-dropdown-multiselect'])
    .config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', '$httpProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $resourceProvider, $httpProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: './templates/layout/layout.html',
                    controller: 'LayoutController',
                    controllerAs: 'LayoutCtrl',
                    redirectTo: 'home.start'
                })
                .state('home.start', {
                    url: '/',
                    templateUrl: './templates/home/homepage.html'
                })
                .state('calendar', {
                    url: '/calendar',
                    templateUrl: './templates/calendar/calendar.html',
                    controller: 'CalendarController',
                    controllerAs: 'calendarCtrl'
                })
                .state('signIn', {
                    url: '/signIn',
                    templateUrl: './templates/home/signIn.html',
                    controller: 'LoginController'
                })
                .state('signUp', {
                    url: '/signUp',
                    templateUrl: './templates/home/signUp.html',
                    controller: 'LoginController'
                })
                .state('calendar.dayView', {
                    url: '/calendar/dayView',
                    templateUrl: './templates/dailyCalendar/dailyCalendarTemplate.html',
                    controller: 'DayViewController',
                    controllerAs: 'dvCtrl'
                })
                .state('calendar.weekView', {
                    url: '/weekView',
                    templateUrl: './templates/weekCalendar/weekCalendarTemplate.html',
                    controller: 'WeekViewController',
                    controllerAs: 'wCtrl',
                })               
                .state('calendar.monthView', {
                    url: '/calendar/monthView',
                    templateUrl: './templates/monthCalendar/monthCalendar.html',
                    controller: ''
                })
                .state('calendar.createNewDevice', {
                    url: '/createNewDevice',
                    templateUrl: './templates/createNew/NewDevice/createNewDeviceTemplate.html',
                    controller: 'createNewDeviceController',
                    controllerAs: 'cndCtrl',
                })      
                .state('calendar.createNewRoom', {
                    url: '/createNewRoom',
                    templateUrl: './templates/createNew/NewRoom/createNewRoomTemplate.html',
                    controller: 'createNewRoomController',
                    controllerAs: 'cnrCtrl',
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
