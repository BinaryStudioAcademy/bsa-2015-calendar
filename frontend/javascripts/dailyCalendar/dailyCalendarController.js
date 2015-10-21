var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q'];
function DayViewController(DailyCalendarService, $timeout) {
	var vm = this;
	
	init();

	vm.selectEventType = function(type) {
		vm.event.type = type;
	};

	vm.selectRoom = function(title) {
		vm.event.room = title;
	};
	
	vm.toggleModal = function() {
		vm.modalShown = !vm.modalShown;
		vm.formSuccess = false;
	};

	// vm.toggleEventInfo = function() {
	// 	vm.eventSelected = !vm.eventSelected;
	// };

	vm.submitEvent = function(event, newEventForm, date) {
		DailyCalendarService.configureEventData(date, event);
		if(newEventForm.$valid) {
			console.log('form is valid!');
			DailyCalendarService.saveEvent(event)
				.$promise.then(

					function(response) {

						vm.formSuccess = true;
						dropEventInfo();
						console.log('success', response);

						$timeout(function() {
							vm.toggleModal();
						}, 2500);
					},

					function(response) {
						console.log('failure', response);
					}	
				);
		}
	};

	function init() {

		vm.timeStamps = DailyCalendarService.getTimeStamps();
		var todayDate = Date.now();
		var date1 = new Date(2015, 9, 9, 8);
		var date2 = new Date(2015, 9, 9, 13);
		
		vm.selectedDate = todayDate;
		vm.eventSelected = false;
		vm.modalShown = false;
		vm.sidebarStyle = true;
		vm.formSuccess = false;

		//will be pulled from server 
		vm.eventTypes = ['Basic', 'Leisure', 'Private'];
		vm.availableRooms = getRooms();
		vm.availableInventory = getInventory();
		vm.users = getUsers();

		vm.event = {};
		dropEventInfo();

		vm.selectConfigDevices = {
			buttonDefaultText: 'Select devices',
			enableSearch: true,
			scrollableHeight: '200px', 
			scrollable: true,
			displayProp: 'title',
			idProp: '_id',
			externalIdProp: '',
		};
		vm.selectConfigUsers = {
			buttonDefaultText: 'Add people to event', 
			enableSearch: true, 
			smartButtonMaxItems: 3, 
			scrollableHeight: '200px', 
			scrollable: true,
			displayProp: 'name',
			idProp: '_id',
			externalIdProp: '',
		};

	}

	function dropEventInfo() {

		vm.event.title = '';
		vm.event.description = '';
		vm.event.start = null;
		vm.event.end = null;
		vm.event.devices = [];
		vm.event.users = [];
		vm.event.room = null;
		vm.event.isPrivate = false;
		vm.event.type = '';
		vm.event.price = null;
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
}