var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q'];

function DayViewController(DailyCalendarService, $timeout) {

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

	vm.toggleModal = function() {
		vm.modalShown = !vm.modalShown;
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
		vm.eventTypes = ['Basic', 'Leisure', 'Private'];
		getRooms();
		getInventory();
		getUsers();
		getAllEvents();

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

	function getAllEvents() {
		DailyCalendarService.getAllEvents()
			.$promise.then(
				function(response) {
					console.log('success Number of Events: ', response.length);
					vm.allEvents = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
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