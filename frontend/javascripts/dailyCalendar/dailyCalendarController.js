var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService'];
function DayViewController(DailyCalendarService) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = Date.now();
	var date1 = new Date(2015, 9, 9, 8);
	var date2 = new Date(2015, 9, 9, 13);
	
	vm.selectedDate = todayDate;
	vm.eventSelected = false;
	vm.modalShown = false;
	vm.sidebarStyle = true;

	//will be pulled from server 
	vm.eventTypes = ['Basic', 'Leisure', 'Private'];
	vm.availableRooms = ['Room 1', 'Room 2', 'Room 3'];

	vm.availableInventory = [
		{id: 1, label: 'Notebook HP'}, 
		{id: 2, label: 'Macbook'}, 
		{id: 3, label: 'Ball'}, 
		{id: 4, label: 'Pizzayollo'}
	];
	vm.users = [
		{id: 1, label: 'Alex'},
		{id: 2, label: 'Max'},
		{id: 3, label: 'John'},
		{id: 4, label: 'Zina'},
		{id: 5, label: 'Vasea'},
		{id: 6, label: 'Vanea'}
	];

	vm.event = vm.event || {};
	vm.event.devices = [];
	vm.event.users = [];
	vm.selectConfigDevices = {buttonDefaultText: 'Select devices'};
	vm.selectConfigUsers = {
			buttonDefaultText: 'Add people to event', 
			enableSearch: true, 
			smartButtonMaxItems: 4, 
			scrollableHeight: '200px', 
			scrollable: true
	};

	//TODO: service to get this org data
	// vm.eventOrgResources = EventResourcesService.getEventResources();

	//END of todo

	vm.selectEventType = function(type) {
		vm.event.type = type;
	};
	
	vm.toggleModal = function() {
		vm.modalShown = !vm.modalShown;
	};

	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};

	vm.submitEvent = function(event, newEventForm, date) {
		DailyCalendarService.configureEventData(date, event);
		if(newEventForm.$valid) {
			console.log('form is valid!');
			DailyCalendarService.saveEvent(event)
				.$promise.then(
					function(response) {
						console.log('success', response);
					},
					function(response) {
						console.log('failure', response);
					}	
				);
		}
	};
}