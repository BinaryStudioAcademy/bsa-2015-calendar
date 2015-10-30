var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q', '$uibModal', 'socketService'];

function DayViewController(DailyCalendarService, $timeout, $q, $uibModal, socketService) {

	var vm = this;

	vm.computedEvents = [];

	vm.showDay = function(step) {
		var date = new Date(vm.selectedDate);

		date.setDate(
			step === 1 ?
				date.getDate() + 1
					:
				date.getDate() - 1
		);

		vm.selectedDate = date;
	};

	vm.showDate = function() {
		console.log(vm.selectedDate);
	};

	vm.toggleModal = function() {
		vm.modalShown = !vm.modalShown;
	};

	vm.rangeForEvents = function(num) {
		return new Array(num);
	};

	vm.showTodayEvents = function() {
		console.log(vm.todayEvents);
	};

	vm.getEventsByStart = function(index) {
		var eventArr = vm.todayEvents.filter(function (event) {
			var date = new Date(event.start);
			return date.getHours() === index;
		});
		return eventArr;
	};

	vm.dropEventInfo = function(selDate) {

		var newEventDate = selDate || new Date();
		newEventDate.setHours(0);
		newEventDate.setMinutes(0);

		vm.event.title = '';
		vm.event.description = '';
		vm.event.start = newEventDate;
		vm.event.end = newEventDate;
		vm.event.devices = [];
		vm.event.users = [];
		vm.event.room = undefined;
		vm.event.isPrivate = false;
		vm.event.type = undefined;
		vm.event.price = null;
	};

	vm.showCloseModal = function() {
		vm.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'templates/dailyCalendar/editEventTemplate.html',
			controller: 'ModalController',
			controllerAs: 'ModalCtrl',
			bindToController: true,
			resolve: {
				event: function () {
					return vm.event;
				},
				rooms: function () {
					return vm.availableRooms;
				},
				devices: function () {
					return vm.availableInventory;
				},
				users: function () {
					return vm.users;
				},
				selectedDate: function () {
					return vm.selectedDate;
				},
				eventTypes: function () {
					return vm.eventTypes;
				},
				todayEvents: function () {
					return vm.todayEvents;
				},
			}
		});

		vm.modalInstance.result.then(function () {
			mapTimeStamps(vm.timeStamps, vm.todayEvents);
			mapEventsByStartTime(vm.timeStamps);
			// vm.dropEventInfo(vm.selectedDate);
			console.log(vm.eventsByStart);
		});
	};

	init();

	function init() {

		vm.timeStamps = DailyCalendarService.getTimeStamps();
		var todayDate = new Date();

		vm.selectedDate = vm.selectedDate || todayDate;
		vm.eventSelected = false;
		vm.modalShown = false;
		vm.sidebarStyle = true;
		vm.todayEvents = [];
		vm.event = {};

		//will be pulled from server 
		getRooms();
		getInventory();
		getUsers();
		getAllEvents();
		getEventTypes();
		
	}

	function getRooms() {
		DailyCalendarService.getAllRooms()
			.$promise.then(
				function(response) {
					console.log('success Total rooms: ', response.length);
					vm.availableRooms = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function getInventory() {
		DailyCalendarService.getAllDevices()
			.$promise.then(
				function(response) {
					console.log('success Inventory items: ', response.length);
					vm.availableInventory = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function getUsers() {
		DailyCalendarService.getAllUsers()
			.$promise.then(
				function(response) {
					console.log('success Number of Users: ', response.length);
					vm.users = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function getEventTypes() {
		DailyCalendarService.getAllEventTypes()
			.$promise.then(
				function(response) {
					console.log('success Current number of types: ', response.length);
					vm.eventTypes = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function getAllEvents() {
		DailyCalendarService.getAllEvents()
			.$promise.then(
				function(response) {
					console.log('success Number of Events: ', response.length);
					vm.allEvents = response;

					filterEventsByTodayDate();

					mapTimeStamps(vm.timeStamps, vm.todayEvents);

					mapEventsByStartTime(vm.timeStamps);
					console.log(vm.eventsByStart);
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function filterEventsByTodayDate() {
		vm.todayEvents = vm.allEvents.filter(function(event) {
			if(event.start) {
				var date = new Date(event.start);
				return date.getDate() === vm.selectedDate.getDate();
			}
		});
	}

	function mapEventsByStartTime(timeSts) {
		vm.eventsByStart = [];
		for (var i=0; i<timeSts.length; i+=1) {
			var rowEventArr = vm.todayEvents.filter(function (event) {
				var date;
				if(typeof event.start !== 'object') {
					console.log('event with time string' + event.start);
					date = new Date(event.start);
					return date.getHours() === i;
				} else {
					console.log('event with time obj' + event.start.toString());
					date = new Date(event.start.toString());
					console.log(date.getHours());
					return date.getHours() === i;
				}
				
			});
			vm.eventsByStart.push(rowEventArr);
		}
	}

	function mapTimeStamps(timeSts, events) {
		var i,
			counter;

		for (i=0; i<timeSts.length; i+=1) {
			counter = 0;
			events.forEach(function (elem) {
				var evHour = new Date(elem.start).getHours();
				if (i===evHour) {
					counter+=1;
				}
			});
			if (counter > 0) {
				timeSts[i].hasEvents = true;
				timeSts[i].totalEvents = counter;
			} else {
				timeSts[i].hasEvents = false;
				timeSts[i].totalEvents = 0;
			}
		}
	}

	//TODO: implement example approach to API calls
	// function getLatestCurrencyRateByCode(code, callback){
	// 		var fxRatesResource = $resource(appConfig.apiUrl + 'metadata/fx/:code', {code: code}, null);

	// 		if (currencies[code]){
	// 			return $q.resolve(currencies[code]);
	// 		} else {

	// 			return fxRatesResource.get().$promise.then(function(res){
	// 				currencies[code] = res;
	// 				return res;
	// 			}, function(error, status){
	// 				return $q.reject(error);
	// 			});	
	// 		}
	// 	}
}