var app = angular.module('calendar-app', ['ui.router', /*'ngAlertify', 'btford.socket-io', */'ngResource', 'ui.bootstrap', 'ngAnimate'/*, 'angularjs-dropdown-multiselect'*/])
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
                    controllerAs: 'dvCtrl'
                })
                .state('calendar.weekView', {
                    url: '/weekView',
                    templateUrl: './templates/weekCalendar/weekCalendarTemplate.html',
                    controller: 'WeekViewController',
                    controllerAs: 'wCtrl',
                })               
                .state('calendar.monthView', {
                    url: '/monthView',
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
                })
                .state('calendar.createNewEventType', {
                    url: '/createNewEventType',
                    templateUrl: './templates/createNew/NewEventType/createNewEventTypeTemplate.html',
                    controller: 'createNewEventTypeController',
                    controllerAs: 'cnetCtrl',
                })
				.state('calendar.yearView', {
					url: '/yearView',
					templateUrl: './templates/yearCalendar/yearCalendarTemplate.html',
					controller: 'yearCalendarController',
					controllerAs: 'YCtrl',
				});
		}
	]).factory('socketService', ['socketFactory', 'alertify', function(socketFactory, alertify){
        var socket = socketFactory();

        socket.on('add device notification', function(device){

            console.log(device);
            console.log('SOCKETIO: NEW DEVICE');
            alertify.log("New device has been added");
        });

        socket.on('update device notification', function(device){
            console.log(device);
            alertify.log("Device has been updated");
        });

        socket.on('delete device notification', function(device){
            alertify.log("Device has been deleted");
        });

        socket.on('add room notification', function(room){
            alertify.log('New room has been added');
        });

        socket.on('update room notification', function(room){
            alertify.log('Romm has been updated');
        });

        socket.on('delete room notification', function(room){
            alertify.log('Room has been deleted');
        });

        socket.on('add event notification', function(event){
            alertify.log('Event has been created');
        }); 

        socket.on('update event notification', function(event){
            alertify.log('Event has been updated');
        });
        
        socket.on('delete event notification', function(event){
            alertify.log('Event has been deleted');
        });                                    

        return socket;
    }]);

app.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
		if (to.redirectTo) {
			evt.preventDefault();
			$state.go(to.redirectTo, params);
		}
	});
}]);

module.exports = app;
