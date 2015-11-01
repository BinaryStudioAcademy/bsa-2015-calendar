var app = require('../app');

app.controller('editEventWeekController', editEventWeekController);

editEventWeekController.$inject = ['$rootScope', '$scope', 'weekEventService', '$timeout', '$modalInstance', 'rooms', 'devices', 'users', 'selectedDate', 'eventTypes'];

function editEventWeekController($rootScope, $scope, weekEventService, $timeout, $modalInstance, rooms, devices, users, selectedDate, eventTypes) {

	var vm = this;

	vm.formSuccess = false;
	vm.event = {};
	vm.rooms = rooms;
	vm.devices = devices;
	vm.users = users;
	vm.selectedDate = selectedDate;
	console.log(selectedDate);
	vm.eventTypes = eventTypes;

	dropEventInfo(vm.selectedDate);

	vm.submitModal = function() {
		submitEvent(vm.event);
		//$scope.$broadcast('eventsUpdated');
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
	};

	vm.selectRoom = function(title) {
		vm.event.room = title;
	};

	function submitEvent(event) {
		console.log('submiting an event...');
		weekEventService.saveEvent(event)
			.$promise.then(

				function(response) {
					$rootScope.$broadcast('eventAdd', response);
					vm.formSuccess = true;
					dropEventInfo();
					console.log('success', response);

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