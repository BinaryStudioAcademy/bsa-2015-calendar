var app = angular.module('calendar-app', ['ui.router', 'ngAlertify', 'btford.socket-io', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'angularjs-dropdown-multiselect'])
    .config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', '$httpProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $resourceProvider, $httpProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: './templates/layout/layout.html',
                    controller: 'LayoutController',
                    controllerAs: 'LayoutCtrl',
                    redirectTo: 'home.start',
                    auth: false
                })
                .state('home.start', {
                    url: '/',
                    templateUrl: './templates/home/homepage.html',
                    redirectTo: 'calendar.dayView',
                    auth: false
                })
                .state('calendar', {
                    url: '/calendar',
                    templateUrl: './templates/calendar/calendar.html',
                    controller: 'CalendarController',
                    controllerAs: 'calendarCtrl',
                    auth: false
                })
                .state('googleAuth', {
                    url: '/googleAuth',
                    templateUrl: './templates/googleapi/googleAuth.html',
                    controller: 'GoogleAuthController',
                    controllerAs: 'gaCtrl'
                })
                .state('signIn', {
                    url: '/signIn',
                    templateUrl: './templates/home/signIn.html',
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl',
                    auth: false
                })
                .state('signUp', {
                    url: '/signUp',
                    templateUrl: './templates/home/signUp.html',
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl',
                    auth: false
                })
                .state('calendar.eventsView', {
                    url: '/calendar/eventsView',
                    templateUrl: './templates/eventsCalendar/eventsCalendarTemplate.html',
                    controller: 'EventsViewController',
                    controllerAs: 'evCtrl'
                })
                .state('calendar.dayView', {
                    url: '/dayView',
                    templateUrl: './templates/dailyCalendar/dailyCalendarTemplate.html',
                    controller: 'DayViewController',
                    controllerAs: 'dvCtrl',
                    auth: true
                })
                .state('calendar.weekView', {
                    url: '/weekView',
                    templateUrl: './templates/weekCalendar/weekCalendarTemplate.html',
                    controller: 'WeekViewController',
                    controllerAs: 'wCtrl',
                    auth: true
                })               
                .state('calendar.monthView', {
                    url: '/monthView/:year/:month',
                    templateUrl: './templates/monthCalendar/monthCalendar.html',
                    controller: 'MonthController',
                    controllerAs: 'mCtrl',
                    auth: true
                })
                .state('calendar.createNewDevice', {
                    url: '/createNewDevice',
                    templateUrl: './templates/createNew/NewDevice/createNewDeviceTemplate.html',
                    controller: 'createNewDeviceController',
                    controllerAs: 'cndCtrl',
                    auth: true
                })      
                .state('calendar.createNewRoom', {
                    url: '/createNewRoom',
                    templateUrl: './templates/createNew/NewRoom/createNewRoomTemplate.html',
                    controller: 'createNewRoomController',
                    controllerAs: 'cnrCtrl',
                    auth: true
                })
                .state('calendar.createNewEventType', {
                    url: '/createNewEventType',
                    templateUrl: './templates/createNew/NewEventType/createNewEventTypeTemplate.html',
                    controller: 'createNewEventTypeController',
                    controllerAs: 'cnetCtrl',
                    auth: true
                })
				.state('calendar.yearView', {
					url: '/yearView',
					templateUrl: './templates/yearCalendar/yearCalendarTemplate.html',
					controller: 'yearCalendarController',
					controllerAs: 'YCtrl',
                    auth: true
				});
		}
	]);

app.run(['$rootScope', '$state', 'AuthService', '$anchorScroll', function($rootScope, $state, AuthService, $anchorScroll) {
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
		if (to.redirectTo) {
			evt.preventDefault();
			$state.go(to.redirectTo, params);
		}


        //console.log('STATECHANGE!');
        //console.log('AUTHService.getUser(): ', AuthService.getUser());

        
        if(to.auth && !AuthService.getUser()){
            evt.preventDefault();
            $state.transitionTo('signIn');          
        }
        
	});
    $anchorScroll.yOffset = 100;
}]);

module.exports = app;
