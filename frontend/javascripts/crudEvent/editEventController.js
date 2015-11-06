var app = require('../app');

app.controller('editEventController', editEventController);

editEventController.$inject = ['crudEvEventService', 'socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'eventBody', 'viewType', 'rooms', 'devices', 'users', 'eventTypes'];

function editEventController(crudEvEventService, socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, eventBody, viewType, rooms, devices, users, eventTypes) {

	var vm = this;


	function init(){

		vm.weekDays = [
			{ name: 'Mo', selected: false },
			{ name: 'Tu', selected: false },
			{ name: 'We', selected: false },
			{ name: 'Th', selected: false },
			{ name: 'Fr', selected: false },
			{ name: 'Sa', selected: false },
			{ name: 'Su', selected: false }
		];


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

			if (vm.eventBody.eventType){
				for (i = 0; i < vm.eventType.length; i++){
					if(vm.eventBody.eventType == vm.eventType[i]._id) {
						vm.event.eventType._id = vm.eventType[i]._id;
						vm.event.eventType.title = vm.eventType[i].title;
						break;
					}
				}
			}

			console.log('vm.event = ' ,vm.event);

			vm.eventSuccess = false;

			//dropEventInfo(vm.selectedDate);

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

	vm.editEvent = function() {
	
		
		vm.event.isValid = true;

		if(!vm.event.title){
			vm.event.titleError = true;
			vm.event.isValid = false;
		} else{
			vm.event.titleError = false;
		}

		if(!vm.event.type){
			vm.event.typeError = true;
			vm.event.isValid = false;
		} else {
			vm.event.typeError = false;
		}

		if(vm.event.startTime > vm.event.endTime){
			vm.event.isValid = false;
		}

		if(!vm.event.isValid){
			return;
		}

		var event = {};
		event.title = vm.event.title;
		event.description = vm.event.description;
		if (vm.event.isPrivate !== undefined){
				event.isPrivate = vm.eventBody.isPrivate;
		}
		event.start = vm.event.timeStart;
		event.end = vm.event.timeEnd;
		event.type = vm.event.type._id;
		if(vm.event.price) event.price = vm.event.price;
		if(vm.event.room) event.room = vm.event.room._id;
		
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

		vm.submitEdit(event);		
		
		console.log('Modal submited');	
	};

	vm.closeModal = function() {
		$modalInstance.dismiss();
		console.log('Modal closed');
	};


	vm.selectEventType = function(type) {
		vm.event.type = type['_id'];
		vm.eventType = type.title;
	};


	vm.selectRoom = function(title) {
		vm.event.room = title;
	};

	vm.submitDelete = function(){
		console.log('deleting an event...');

		helpEventService.deleteEvent(vm.eventBody._id).then(function(response) {
			console.log('success delete', response);

			//socketService.emit('edit event', { event : response });	

			// тип селектеддейт проверить!!!!!!!!!!!!!!!!!!!!!!!
			crudEvEventService.deletedEventBroadcast(vm.selectedDate, vm.eventBody, vm.viewType);

			$timeout(function() {
				$modalInstance.close();
				vm.eventSuccess = false;
			}, 1500);
        });
	};


	vm.submitEdit = function(event) {
		console.log('submiting an event...');
		helpEventService.saveEvent(event).then(function(response) {
           	vm.eventSuccess = true;
			dropEventInfo();
			console.log('success edit', response);

			//socketService.emit('edit event', { event : response });	

			// тип селектеддейт проверить!!!!!!!!!!!!!!!!!!!!!!!
			crudEvEventService.editedEventBroadcast(vm.selectedDate, vm.eventBody, response, vm.viewType);

			$timeout(function() {
				$modalInstance.close();
				vm.eventSuccess = false;
			}, 1500);
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