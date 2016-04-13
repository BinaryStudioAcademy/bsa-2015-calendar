var app = require('../app');

app.controller('editEventController', editEventController);

editEventController.$inject = ['crudEvEventService', 'socketService', 'alertify', 'helpEventService', 'AuthService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'eventBody', 'viewType', 'rooms', 'devices', 'users', 'eventTypes'];

function editEventController(crudEvEventService, socketService, alertify, helpEventService, AuthService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, eventBody, viewType, rooms, devices, users, eventTypes) {

	var vm = this;

	var loggedUserId = AuthService.getUser().id;
	if (!localStorage["userlist"+loggedUserId]) {
		localStorage.setItem("userlist"+loggedUserId, '[]');
	}
	if (!localUsersArr) {
		var localUsersArr = [];
	}

	function init(){
		vm.currentUserId = AuthService.getUser().id;

		vm.form = [];
		vm.form.devices = [];
		vm.form.users = [];

		vm.rooms = rooms;
		vm.devices = devices;
		vm.users = getUpdateUsers(users);

		vm.users = vm.users.filter(function(user) {
			return user._id !== vm.currentUserId;
		});

		console.log('vm.users', vm.users);

		vm.eventTypes = eventTypes;

		vm.selectedDate = selectedDate;
		vm.viewType = viewType;
		vm.eventBody = eventBody;

		console.log('eventBody', eventBody);
		initEvent();


	}

	init();

	function initEvent(){
		vm.event = {};
		vm.event.users = [];
		// vm.event.devices = [];
		// vm.event.room = {};
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

		if(vm.eventBody.room){
			vm.form.room = {};
			for (i = 0; i < vm.rooms.length; i++){
				if(vm.eventBody.room == vm.rooms[i]._id) {
					vm.form.room._id = vm.rooms[i]._id;
					vm.form.room.title = vm.rooms[i].title;
					break;
				}
			}
		}

		if (vm.eventBody.devices){
			vm.form.devices = [];
			for (j = 0; j < vm.eventBody.devices.length; j++){
				for (k = 0; k < vm.devices.length; k++){
					if(vm.eventBody.devices[j] == vm.devices[k]._id) {
						vm.form.devices.push({_id: vm.devices[k]._id, title: vm.devices[k].title});
						break;
					}
				}
			}
		}

		if (vm.eventBody.users){
			vm.form.users = [];
			for (var j = 0; j < vm.eventBody.users.length; j++){
				for (var k = 0; k < vm.users.length; k++){
					var user = vm.users[k];



					if(vm.eventBody.users[j] == user._id && vm.currentUserId !== user._id) {

						console.log('user id', user._id);
						console.log('AuthService.getUser()._id', vm.currentUserId);

						vm.form.users.push({ _id: user._id, name: user.name });
						break;
					}
				}
			}

			console.log('vm.form.users', vm.form.users);
			console.log('vm.users', vm.users);
		}

		console.log('body', vm.eventBody);
		if (vm.eventBody.type._id){
			console.log('types', vm.eventBody.type._id, vm.eventTypes);	
			for (i = 0; i < vm.eventTypes.length; i++){
				if(vm.eventBody.type._id == vm.eventTypes[i]._id) {
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
			// smartButtonMaxItems: 3, 
			scrollableHeight: '200px', 
			scrollable: true,
			displayProp: 'name',
			idProp: '_id',
			externalIdProp: '',
		};
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

		//console.log('vm.event after editing = ', vm.event.title, vm.event.description, vm.event.start, vm.event.end);
		var event = {};
		event.title = vm.event.title;
		event.description = vm.event.description;
		if (vm.event.isPrivate !== undefined){
				event.isPrivate = vm.event.isPrivate;
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
			updateLocalArr(event.users);
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

	vm.selectEventRoom = function(room) {
		vm.form.room = room;
	};

	vm.isUserOwner = function() {
		return vm.currentUserId === vm.eventBody.ownerId;
	};

	vm.submitDelete = function(){
		console.log('deleting an event...');

		helpEventService.deleteEvent(vm.eventBody._id).then(function(response) {
			if(response.status == 200 || response.status == 201){
				//socketService.emit('edit event', { event : response.data });	
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


	vm.submitEdit = function() {

		// vm.event._id = vm.eventBody._id;
		vm.event.type = vm.event.type._id;

		if(!vm.event.isPrivate)	{
			if(vm.form.room) {
				vm.event.room = vm.form.room._id;

				console.log('vm.event.room', vm.event.room);
			} else {
				vm.event.room = null;				
			}

			if(vm.form.devices.length) {
				vm.event.devices = vm.form.devices.map(function(device) {
					return device._id;
				});
			} else {
				vm.event.devices = null;
			}

			if(vm.form.users.length) {
				vm.event.users = vm.form.users.map(function(user) {
					return user._id;
				});
			} else {
				vm.event.users = [];
			}
			
			if(!vm.event.devices && !vm.event.users.length && !vm.event.room) {
			vm.event.isPrivate = true;
			}
		
		}  else {
			vm.event.room = null;
			vm.event.devices = null;
			vm.event.users = [];

		}

		vm.event.users.push(vm.currentUserId);


		console.log('submiting an event...', vm.event);

		// console.log(vm.event._id);
		helpEventService.updateEvent(vm.eventBody._id, vm.event).then(function(response) {
           	
			if(response.status == 200 || response.status == 201){
				vm.eventSuccess = true;
				console.log('success edit', response.status);
				//socketService.emit('edit event', { event : response });	
				console.log(response.data);
				crudEvEventService.editedEventBroadcast(vm.selectedDate, vm.eventBody, response.data, vm.viewType);

				// $timeout(function() {
					$modalInstance.close();
					vm.eventSuccess = false;
				// }, 1500);
			} else {
				vm.editingError = true;
				return;
			}
        });
	};


	function updateLocalArr(userArr) {

		if (userArr.length > 0) {
			for (var i=0; i < userArr.length; i++) {
				var index;
				for (var y=0; y < localUsersArr.length; y++) {
					if (_.isEqual(userArr[i], localUsersArr[y])) {
						index = y;
						break;
					}
				}
				localUsersArr.splice(index, 1);
			}
			for (var u=0; u < userArr.length; u++) {
				localUsersArr.unshift(userArr[u]);
			}
			localStorage["userlist"+loggedUserId] = JSON.stringify(localUsersArr);
		}
	}

	function getUpdateUsers(data) {
		localUsersArr = JSON.parse(localStorage.getItem("userlist"+loggedUserId));
		//left only id and name fields
		var usersArr = _.map(data, function(item) {return _.pick(item, '_id', 'name');});
		//add to local array new users from sever
		_.each(usersArr, function(userArrObj) {
			var localUsersArrObj = _.find(localUsersArr, function(localUsersArrObj) {
				return userArrObj['_id'] === localUsersArrObj['_id'];
			});
			if (!localUsersArrObj) {
				localUsersArr.push(userArrObj);
			}
		});
		//delete from local deleted users
		var delUsers = [];
		_.each(localUsersArr, function(localUserArrObj) {
			var usersArrObj = _.find(usersArr, function(usersArrObj) {
				return usersArrObj['_id'] === localUserArrObj['_id'];
			});
			if (!usersArrObj) {
				delUsers.push(localUserArrObj);
			}
		});
		_.each(delUsers, function(delItem) {
			_.remove(localUsersArr, function(item) {
				return item['_id'] === delItem['_id'];
			});
		});

        return localUsersArr;
	}
}