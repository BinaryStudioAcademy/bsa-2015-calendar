var app = require('../app');

app.factory('helpEventService', helpEventService);

helpEventService.$inject = ['$resource', '$q', '$timeout', '$http', 'AuthService'];

function helpEventService($resource, $timeout, $q, $http, AuthService) {

/*
	var timeSatmps = [	{ time: '12am-7am'},
					            { time: '8am'},
					            { time: '9am'},
					            { time: '10am'},
					            { time: '11am'},
					            { time: '12pm'},
					            { time: '1pm'},
					            { time: '2pm'},
					            { time: '3pm'},
 					            { time: '4pm'},
 					            { time: '5pm'},
					            { time: '6pm'},
					            { time: '7pm'},
					            { time: '8pm'},
					            { time: '9pm-11pm'},
						          ];
						          */

	 var timeSatmps = [	{ time: '12am'}, 
	 				           	{ time: '1am'}, 
	 				           	{ time: '2am'},
	 							{ time: '3am'}, 
	 				            { time: '4am'}, 
	 				            { time: '5am'},
	 				            { time: '6am'},
	 				            { time: '7am'},
	 				            { time: '8am'},
	 				            { time: '9am'},
	 				            { time: '10am'},
	 				            { time: '11am'},
	 				            { time: '12pm'},
	 				            { time: '1pm'},
	 				            { time: '2pm'},
	 				            { time: '3pm'},
  					            { time: '4pm'},
  					            { time: '5pm'},
	 				            { time: '6pm'},
	 				            { time: '7pm'},
	 				            { time: '8pm'},
	 				            { time: '9pm'},
	 				            { time: '10pm'},
	 				            { time: '11pm'},
	 					        ];

	var days = [	{ name: 'Mon'}, 
		           	{ name: 'Tue'}, 
		           	{ name: 'Wed'},
					{ name: 'Thu'}, 
		            { name: 'Fri'}, 
		            { name: 'Sat'},
		            { name: 'Sun'},
		          ];

	var daysNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

	function getDaysNames(){
		return daysNames;
	}

	function getTimeStamps(){
		return timeSatmps;
	}


	function getDays(){
		return days;
	}


	function saveEvent(event) {
		var saveEventPromise = $http.post('api/event/', event)       
		.then(function (response) {
			console.log('adding event status: ', response.status);
			return response.data;
		}, function(reason) {
			return reason; 		
		});
		return saveEventPromise;
	}

	function updateEvent(eventId, eventBody) {
		var updateEventPromise = $http.put('api/event/' + eventId, eventBody)       
		.then(function (response) {
			console.log('updating event status: ', response.status);
			return response.data;
		}, function(reason) {
			return reason; 		
		});
		return updateEventPromise;
	}

	function deleteEvent(eventId) {
		var deleteEventPromise = $http.delete('api/event/' + eventId)       
		.then(function (response) {
			console.log('deleting event status: ', response.status);
			return response.data;
		}, function(reason) {
			return reason; 		
		});
		return deleteEventPromise;
	}

	function savePlan(plan) {
		var savePlanPromise = $http.post('api/plan/', plan)       
		.then(function (response) {
			console.log('adding plan status: ', response.status);
			return response.data;
		}, function(reason) {
			return reason; 		
		});
		return savePlanPromise;
	}

	function configureEventData(date, event) {

		var selDay = date.getDate();

		event.start.setDate(selDay);
		event.end.setDate(selDay);
	}

	
	function getAllEvents() {
		var allEventsPromise = $http.get('api/event/')       
		.then(function (response) {
			console.log('success Number of all events: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return allEventsPromise;
	}



	// так делать не надо, есть же пример ниже!!
	function getAllUserEvents(){
		return $http.get('api/eventPublicAndByOwner');
	}


	function getEvents(start, stop) {
		var eventsPromise = $http.get('api/eventByInterval/'+ (+start)+ '/'+ (+stop))       
		.then(function (response) {
			console.log('success Number of finded events: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return eventsPromise;
	}

	function getUserEvents(start, stop) {
		var loggedUserId = AuthService.getUser().id;
		var eventsPromise = $http.get('api/user/eventsByInterval/'+ loggedUserId+ '/' + (+start)+ '/'+ (+stop))       
		.then(function (response) {
			var eventsArr = response.data.events;
			console.log('success Number of finded events: ', eventsArr.length);
			return eventsArr;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found events');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return eventsPromise;
	}

	function getRooms(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var roomsPromise = $http.get('api/room'+ addStr)       
		.then(function (response) {
			 console.log('success Total rooms: items: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found rooms');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return roomsPromise;
	}

	function getDevices(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var devicesPromise = $http.get('api/device' + addStr)       
		.then(function (response) {
			console.log('success Total devices: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found devices');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return devicesPromise;
	}

	function getUsers(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var usersPromise = $http.get('api/user'+ addStr)       
		.then(function (response) {
			console.log('success Number of Users: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found users');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return usersPromise;
	}

	function getEventTypes(clipped) {
		var addStr = '/';
		if(!clipped){
			addStr = 'clipped/';
		} else {
			addStr = '/';
		}
		var typesPromise = $http.get('api/eventType'+ addStr)         
		.then(function (response) {
			console.log('success Current number of types: ', response.data.length);
			return response.data;
		}, function(reason) {
			if (reason.status == 404){
				console.log('not found types');
				return null;
			}
			else{
				return reason; 
			}			
		});
		return typesPromise;
	}


	function getEventTypesPublicByOwner() {
		return $http.get('api/eventTypePublicAndByOwner/')
				.then(function (response) {
					console.log('success Current number of types (public by owner): ', response.data.length);
					return response.data;
				}, function (reason) {
					if (reason.status == 404) {
						console.log('not found types');
						return null;
					}
					else {
						return reason;
					}
				});
	}

	return {
		getTimeStamps: getTimeStamps,
		getDays: getDays,
		getDaysNames: getDaysNames,
		configureEventData: configureEventData,
		saveEvent: saveEvent,
		updateEvent: updateEvent,
		deleteEvent: deleteEvent,
		savePlan: savePlan,
		getRooms: getRooms,
		getDevices: getDevices,
		getUsers: getUsers,
		getEvents: getEvents,
		getAllEvents: getAllEvents,
		getEventTypes: getEventTypes,
		getUserEvents: getUserEvents,
		getEventTypesPublicByOwner: getEventTypesPublicByOwner,
		getAllUserEvents: getAllUserEvents
	};
}