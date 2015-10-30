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
                .state('signIn', {
                    url: '/signIn',
                    templateUrl: './templates/home/signIn.html',
                    controller: 'LoginController',
                    auth: false
                })
                .state('signUp', {
                    url: '/signUp',
                    templateUrl: './templates/home/signUp.html',
                    controller: 'LoginController',
                    auth: false
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
                    url: '/monthView',
                    templateUrl: './templates/monthCalendar/monthCalendar.html',
                    controller: '',
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
            console.log('event has been added');
            alertify.log('Event has been created');
        }); 

        socket.on('update event notification', function(event){
            alertify.log('Event has been updated');
        });
        
        socket.on('delete event notification', function(event){
            alertify.log('Event has been deleted');
        });                                    

        return socket;
    }])
    .factory('AuthService', [function(){

        var service = {};
        var userInfo = null;

        service.getUser = function(){
            return userInfo;
        };

        service.setUser = function(user){
            userInfo = user;
        };

        return service;
    }]);

app.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
		if (to.redirectTo) {
			evt.preventDefault();
			$state.go(to.redirectTo, params);
		}

        console.log('STATECHANGE!');
        console.log(AuthService.getUser());

        if(to.auth && !AuthService.getUser()){
            evt.preventDefault();
            $state.transitionTo('signIn');          
        }
	});
}]);

module.exports = app;
