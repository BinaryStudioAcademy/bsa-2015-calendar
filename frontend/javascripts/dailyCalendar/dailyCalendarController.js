var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q', '$uibModal', 'socketService', '$rootScope'];

function DayViewController(DailyCalendarService, $timeout, $q, $uibModal, socketService, $rootScope) {

	var vm = this;

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

	vm.getEventsByStart = function(index) {
		var eventArr = vm.todayEvents.filter(function (event) {
			var date = new Date(event.start);
			return date.getHours() === index;
		});
		return eventArr;
	};

	vm.showCloseModal = function() {
		vm.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'templates/dailyCalendar/editEventTemplate.html',
			controller: 'ModalController',
			controllerAs: 'ModalCtrl',
			bindToController: true,
			resolve: {
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
			}
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
					console.log(vm.todayEvents);

					mapTimeStamps(vm.timeStamps, vm.todayEvents);
					
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





	var flagsInDaily = [];

  $rootScope.$on('flagFromCalendar', function (event, agrs) {			//pull vm.flag from $rootScope.$broadcast
      var flagsFromCalendar = agrs.messege;
      console.log('flags from dailyCalendarController $rootScope.$on', flagsFromCalendar);
      flagsInDaily.length = 0;																		// rewriting flagsInDaily
			for (var i = 0; i < flagsFromCalendar.length; i++) {		
		      flagsInDaily.push(flagsFromCalendar[i]);
			}
  });


	vm.selectTypeEvent = function(event){														// if return true event show, if false event not show
		// console.log('oll flags in daily from Calendar', flagsInDaily);		
		for (var i = 0; i < flagsInDaily.length; i++) {		
			if (event.type == flagsInDaily[i]) return true;
		}
	};










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