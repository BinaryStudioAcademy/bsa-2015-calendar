var app = require('../app');

app.controller('editEventController', editEventController);

editEventController.$inject = ['crudEvEventService', 'socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'eventBody', 'viewType', 'rooms', 'devices', 'users', 'eventTypes'];

function editEventController(crudEvEventService, socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, eventBody, viewType, rooms, devices, users, eventTypes) {

	var vm = this;


	function init(){

		vm.rooms = rooms;
		vm.devices = devices;
		vm.users = users;
		vm.eventTypes = eventTypes;

		vm.selectedDate = selectedDate;
		vm.viewType = viewType;
		vm.eventBody = eventBody;

		console.log(eventBody);

		initEvent();

		function initEvent(){
			vm.event = {};
			vm.event.users = [];
			vm.event.devices = [];
			vm.event.room = {};
			vm.event.type = {};
			vm.event.start = vm.eventBody.start;
			vm.event.end = vm.eventBody.end;
			vm.event.title = vm.eventBody.title;
			vm.event.description = vm.eventBody.description;

			if (vm.eventBody.isPrivate !== undefined){
				vm.event.isPrivate = vm.eventBody.isPrivate;
			}

			if(vm.eventBody.price){
				vm.event.price = vm.eventBody.price;
			}

			if (vm.eventBody.room){
				for (i = 0; i < vm.rooms.length; i++){
					if(vm.eventBody.room == vm.rooms[i]._id) {
						vm.event.room._id = vm.rooms[i]._id;
						vm.event.room.title = vm.rooms[i].title;
						break;
					}
				}
			}

			if (vm.eventBody.devices){
				for (j = 0; j < vm.eventBody.devices.length; j++){
					for (k = 0; k < vm.devices.length; k++){
						if(vm.eventBody.devices[j] == vm.devices[k]._id) {
							vm.event.devices.push({_id: vm.devices[k]._id, title: vm.devices[k].title});
							break;
						}
					}
				}
			}

			if (vm.eventBody.users){
				for (var j = 0; j < vm.eventBody.users.length; j++){
					for (var k = 0; k < vm.users.length; k++){
						if(vm.eventBody.users[j] == vm.users[k]._id) {
							vm.event.users.push({_id: vm.users[k]._id, title: vm.users[k].title});
							break;
						}
					}
				}
			}
			console.log('body', vm.eventBody);
			if (vm.eventBody.type){
				for (i = 0; i < vm.eventTypes.length; i++){
					if(vm.eventBody.type == vm.eventTypes[i]._id) {
						vm.event.type._id = vm.eventTypes[i]._id;
						vm.event.type.title = vm.eventTypes[i].title;
						break;
					}
				}
			} 


			

			console.log('vm.event = ' ,vm.event);

			vm.eventSuccess = false;

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
	}

	vm.checkDuration = function(){
		start = new Date(vm.event.start);
        end = new Date(vm.event.end);
		diff = end - start;
		if (diff < 900000){
			vm.timeError = true;
		} else {
			vm.timeError = false;
		}
	};

	vm.editEvent = function() {
	
		console.log('editing');

		console.log('vm.event after editing = ', vm.event.title, vm.event.description, vm.event.start, vm.event.end);
		var event = {};
		event.title = vm.event.title;
		event.description = vm.event.description;
		if (vm.event.isPrivate !== undefined){
				event.isPrivate = vm.eventBody.isPrivate;
		}
		event.start = vm.event.start;
		event.end = vm.event.end;
		if (vm.event.type) event.type = vm.event.type._id;
		if (vm.event.price) event.price = vm.event.price;
		if (vm.event.room) event.room = vm.event.room._id;
		
		if(vm.event.devices.length){
			event.devices = [];
			for (i = 0; i < vm.event.devices.length; i++){
				event.devices[i] = vm.event.devices[i]._id;
			}
		} 
		if(vm.event.users.length){
			event.users = [];
			for (i = 0; i < vm.event.users.length; i++){
				event.users[i] = vm.event.users[i]._id;
			}
		}
		console.log('call submiting event to submit = ', event);
		vm.submitEdit(event);	
	};

	vm.closeModal = function() {
		$modalInstance.dismiss();
		console.log('Modal closed');
	};


	vm.selectEventType = function(type) {
		vm.event.type._id = type._id;
		vm.event.type.title = type.title;
	};


	vm.selectRoom = function(room) {
		vm.event.room._id = room._id;
		vm.event.room.title = room.title;
	};

	vm.submitDelete = function(){
		console.log('deleting an event...');

		helpEventService.deleteEvent(vm.eventBody._id).then(function(response) {
			console.log('success delete', response);
			if(response.status == 200 || response.status == 201){
				//socketService.emit('edit event', { event : response });	

				// тип селектеддейт проверить!
				crudEvEventService.deletedEventBroadcast(vm.selectedDate, vm.eventBody, vm.viewType);

				$timeout(function() {
					$modalInstance.close();
					vm.eventSuccess = false;
				}, 1500);
			} else {
				vm.deletingError = true;
				return;
			}
        });
	};


	vm.submitEdit = function(event) {
		console.log('submiting an event...');
		helpEventService.updateEvent(vm.eventBody._id, event).then(function(response) {
           	
			if(response.status == 200 || response.status == 201){
				vm.eventSuccess = true;
				dropEventInfo();
				console.log('success edit', response);
				//socketService.emit('edit event', { event : response });	
				// тип селектеддейт проверить!

				crudEvEventService.editedEventBroadcast(vm.selectedDate, vm.eventBody, response, vm.viewType);

				$timeout(function() {
					$modalInstance.close();
					vm.eventSuccess = false;
				}, 1500);
			} else {
				vm.editingError = true;
				return;
			}
        });
	};

	init();

	function dropEventInfo(selDate) {

		var newEventDate = new Date();
		if (selDate){
			newEventDate = new Date(selDate.format("DD MMM YYYY HH:mm:ss"));
		}
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