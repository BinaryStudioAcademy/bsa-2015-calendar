var app = require('../app');

app.controller('ModalController', ModalController);

ModalController.$inject = ['DailyCalendarService', 'socketService', '$timeout', '$modalInstance', 'dayViewObject'];

function ModalController(DailyCalendarService, socketService, $timeout, $modalInstance, dayViewObject) {

	var vm = this;

	vm.formSuccess = false;
	vm.event = dayViewObject.event;
	vm.rooms = dayViewObject.rooms;
	vm.devices = dayViewObject.devices;
	vm.users = dayViewObject.users;
	vm.selectedDate = dayViewObject.selectedDate;
	vm.eventTypes = dayViewObject.eventTypes;
	vm.allEvents = dayViewObject.allEvents;

	
	dropEventInfo(vm.selectedDate);

	vm.submitModal = function() {
		submitEvent(vm.event);
		console.log('Modal submited');
	};

	vm.closeModal = function() {
		$modalInstance.dismiss();
		console.log('Modal closed');
	};

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

	vm.selectEventType = function(type) {
		vm.event.type = type['_id'];
		vm.eventType = type.title;
	};

	vm.selectRoom = function(title) {
		vm.event.room = title;
	};

	function submitEvent(event) {
		console.log('submiting an event...');
		DailyCalendarService.saveEvent(event)
			.$promise.then(

				function(response) {

					vm.formSuccess = true;
					console.log('success', response);
					vm.allEvents.push(event);
					
					socketService.emit('add event', { event : event });	

					$timeout(function() {
						$modalInstance.close();
						vm.formSuccess = false;
					}, 2500);
				},

				function(response) {
					console.log('failure', response);
				}	
			);
	}

	function dropEventInfo(selDate) {

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
		vm.event.price = undefined;
	}
}