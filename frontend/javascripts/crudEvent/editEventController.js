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
			vm.event.type = {};

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
			if (vm.eventBody.eventType){
				for (i = 0; i < vm.eventType.length; i++){
					if(vm.eventBody.eventType == vm.eventType[i]._id) {
						vm.event.type._id = vm.eventType[i]._id;
						vm.event.type.title = vm.eventType[i].title;
						break;
					}
				}
			} 
			// var dtPickerStart = document.querySelectorAll('#startTime');
			// var dtPickerEnd = document.querySelectorAll('#endTime');
			// console.log(dtPickerStart,dtPickerEnd);
		 //    $(dtPickerStart).datetimepicker({
		 //        format: 'HH:mm',
		 //        pickDate: false,
		 //        pickSeconds: false,
		 //        pick12HourFormat: false            
		 //    });
		    // $(dtPickerEnd).datetimepicker({
		    //     format: 'HH:mm',
		    //     pickDate: false,
		    //     pickSeconds: false,
		    //     pick12HourFormat: false            
		    // });
   // 			var em = angular.element($('#startTime'));
   // 			console.log(em);
			// $('#startTime').timepicker({
   //              minuteStep: 1,
   //              template: 'modal',
   //              appendWidgetTo: 'body',
   //              showSeconds: true,
   //              showMeridian: false,
   //              defaultTime: false

			vm.event.start = vm.eventBody.start;
			vm.event.end = vm.eventBody.end;

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
		vm.event.isValid = true;

		// if(!vm.event.title){
		// 	vm.event.titleError = true;
		// 	vm.event.isValid = false;
		// } else{
		// 	vm.event.titleError = false;
		// }

		// if(!vm.event.type){
		// 	vm.event.typeError = true;
		// 	vm.event.isValid = false;
		// } else {
		// 	vm.event.typeError = false;
		// }

		// if(vm.event.startTime > vm.event.endTime){
		// 	vm.event.isValid = false;
		// }

		// if(!vm.event.isValid){
		// 	return;
		// }

		console.log('vm.event after editing', vm.event.title, vm.event.description, vm.event.start, vm.event.end);
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
		console.log('call subm', event);
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
		helpEventService.updateEvent(vm.eventBody._id, event).then(function(response) {
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