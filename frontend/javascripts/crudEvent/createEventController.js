var app = require('../app');

app.controller('createEventController', createEventController);


createEventController.$inject = ['AuthService', 'crudEvEventService', 'socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'viewType', 'rooms', 'devices', 'users', 'eventTypes'];

function createEventController(AuthService, crudEvEventService, socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, viewType, rooms, devices, users, eventTypes) {

	var vm = this;
	//set userList in localStorage if not exists
	var loggedUserId = AuthService.getUser().id;
	if (!localStorage["userlist"+loggedUserId]) {
		localStorage.setItem("userlist"+loggedUserId, '[]');

	}
	if (!localUsersArr) {
		var localUsersArr = [];
	}
	
	vm.rooms = rooms;
	vm.devices = devices;
	vm.users = getUpdateUsers(users);
	vm.eventTypes = eventTypes;

	console.log('createEvCtrl');
	console.log(selectedDate);

	vm.selectedDateMoment = selectedDate;
	vm.selectedDate = new Date(selectedDate.format("DD MMM YYYY HH:mm:ss"));

	vm.viewType = viewType;
	vm.isStartDPopened = false;
	vm.isEndDPopened = false;
	vm.dpFormat = "dd MMMM yyyy";

	vm.openDP = function(dp){
		if(dp === 'start'){
			vm.isStartDPopened = !vm.isStartDPopened;
		} else{
			vm.isEndDPopened = !vm.isEndDPopened;
		}
		
	};

	vm.todayIndex = vm.selectedDate.getDay() - 1;
	if(vm.todayIndex === -1){
		vm.todayIndex = 6;
	}


	vm.weekDays = [
		{ name: 'Mo', selected: false },
		{ name: 'Tu', selected: false },
		{ name: 'We', selected: false },
		{ name: 'Th', selected: false },
		{ name: 'Fr', selected: false },
		{ name: 'Sa', selected: false },
		{ name: 'Su', selected: false }
	];

	vm.weekDays[vm.todayIndex].selected = true;	

	vm.changeStartDate = function(){
		vm.todayIndex = vm.planStartDate.getDay() - 1;
		if(vm.todayIndex === -1){
			vm.todayIndex = 6;
		}

		vm.computeIntervals();
	};	

	vm.getSelectedDays = function(){
		return vm.weekDays.filter(function(item){
			return item.selected;
		});
	};

	vm.planIntervals = [];

	vm.minDate = new Date();
	vm.planStartDate = new Date(vm.selectedDate);
	vm.planEndDate = new Date(vm.selectedDate);
	//vm.planEndDate.setYear(vm.planEndDate.getFullYear() + 1);
	vm.planFirstEventStart = new Date();

	vm.computeIntervals = function(selectedDay){
		console.log('>>>>>> COMPUTING INTERVALS');
		console.log('week days', vm.weekDays);
		var currentDay, i;
		var selectIndex = vm.weekDays.indexOf(selectedDay); //
		console.log('selectIndex', selectIndex);



		console.log('today index', vm.todayIndex);

		var startDay;
		vm.startDate = new Date();

		if(vm.weekDays[vm.todayIndex].selected){
			startDay = vm.todayIndex;
			vm.startDate = new Date(vm.planStartDate);
		}		

		if(startDay === undefined){
			for(i = vm.todayIndex + 1; i<7; i++){
				if(vm.weekDays[i].selected){					
					startDay = i;
					vm.startDate.setDate(vm.planStartDate.getDate() + (i - vm.todayIndex));
					break;
				}
			}
		}

		if(startDay === undefined){
			for(i = 0; i < vm.todayIndex; i++){
				if(vm.weekDays[i].selected){
					startDay = i;
					vm.startDate.setDate(vm.planStartDate.getDate() + 7 - (vm.todayIndex - i));
					break;
				}
			}
		}

		console.log('start day index', startDay);
		console.log('start date', vm.startDate);

		vm.planIntervals = [];

		if(startDay === undefined){

		}else if(startDay === 0){
			currentDay = 0;
			for(i = 1; i < 7; i++){
				if(vm.weekDays[i].selected){					
					vm.planIntervals.push(i - currentDay);
					currentDay = i;
				}
			}
			if(vm.planIntervals.length)
				vm.planIntervals.push(7 - currentDay);
		} else if(startDay === 6){
			currentDay = 0;
			for(i = 0; i < 6; i++){
				if(vm.weekDays[i].selected){
					if(vm.planIntervals.length === 0){
						vm.planIntervals.push(i - currentDay + 1);
					} else{
						vm.planIntervals.push(i - currentDay);
					}

					currentDay = i;					
				}
			}

			if(vm.planIntervals.length)
				vm.planIntervals.push(6 - currentDay);

		} else {
			currentDay = startDay;
			// console.log('current day', currentDay);
			//console.log('weekDays: ', vm.weekDays);

			for(i = currentDay + 1; i < 7; i++){
				if(vm.weekDays[i].selected){
					vm.planIntervals.push(i - currentDay);
					currentDay = i;
				}
			}

			var daysToEndOfWeek = 6 - currentDay;
			var isDayOnPreviousWeek = true;

			for(i = 0; i < startDay; i++){
				if(vm.weekDays[i].selected){
					if(isDayOnPreviousWeek){
						vm.planIntervals.push(i + daysToEndOfWeek + 1);
						isDayOnPreviousWeek = false;
						currentDay = i;
					} else{
						vm.planIntervals.push(i - currentDay);
						currentDay = i;
						console.log('i', i);
						console.log('current day', currentDay);
					}					
				}
			}

			if(vm.planIntervals.length){
				if(currentDay > startDay){
					vm.planIntervals.push(6 - currentDay + startDay + 1);
				} else {
					vm.planIntervals.push(startDay - currentDay);
				}
			}
		}

		if(startDay !== undefined && !vm.planIntervals.length) vm.planIntervals = [7];

		console.log('plan intervals', vm.planIntervals);
		if(vm.planIntervals.length){
			vm.form.intervals = [];
			vm.form.rooms = [];
			for(i = 0; i < vm.planIntervals.length; i++){

				if(vm.form.room){
					vm.form.rooms.push(vm.form.room['_id']);
				}

				vm.form.intervals.push(86400000 * vm.planIntervals[i]);
			}
			console.log('plan intervals: ', vm.form.intervals);
		}


	};

	vm.formSuccess = false;
	vm.form = {};
	vm.form.users = [];
	vm.form.devices = [];
	vm.form.timeStart = vm.selectedDate;
	console.log('START', vm.form.timeStart );
	vm.form.timeEnd = vm.selectedDate;
	console.log('END', vm.form.timeEnd);

	//dropEventInfo(vm.selectedDate);

	vm.submitModal = function() {

		console.log('form title', vm.form.title);

		vm.form.isValid = true;
		var user = AuthService.getUser();

		if(!vm.form.title){
			vm.form.titleError = true;
			vm.form.isValid = false;
		} else{
			vm.form.titleError = false;
		}

		if(!vm.planIntervals.length && vm.isPlan){
			vm.form.intervalsError = true;
			vm.form.isValid = false;
		} else {
			vm.form.intervalsError = false;
		}

		if(!vm.form.type){
			vm.form.typeError = true;
			vm.form.isValid = false;
		} else {
			vm.form.typeError = false;
		}

		if(vm.form.startTime > vm.form.endTime){
			vm.form.isValid = false;
		}

		if(!vm.form.isValid){
			return;
		}

		if(vm.isPlan){ //plan
			var plan = {};
			plan.ownerId = user.id;
			plan.title = vm.form.title;
			plan.description = vm.form.description;
			plan.isPrivate = true;

			plan.dateStart = new Date(vm.startDate);
			plan.dateStart.setHours(vm.form.timeStart.getHours());
			plan.dateStart.setMinutes(vm.form.timeStart.getMinutes());

			plan.timeStart = new Date(plan.dateStart);

			plan.timeEnd = new Date(plan.dateStart);
			plan.timeEnd.setHours(vm.form.timeEnd.getHours());
			plan.timeEnd.setMinutes(vm.form.timeEnd.getMinutes());

			plan.dateEnd = vm.planEndDate;
			plan.dateEnd.setHours(vm.form.timeEnd.getHours());
			plan.dateEnd.setMinutes(vm.form.timeEnd.getMinutes());

			plan.intervals = vm.form.intervals;

			plan.type = vm.form.type['_id'];


			if(vm.isPublic){
				plan.isPrivate = false;
				if(vm.form.price) plan.price = vm.form.price;
				if(vm.form.rooms.length) plan.rooms = vm.form.rooms;
				if(vm.form.devices.length) plan.devices = vm.form.devices;
				if(vm.form.users.length){
					plan.users = vm.form.users;
					event.users.push({_id:user.id, name:user.name});
					console.log('users in plan', plan.users);
				}
				updateLocalArr(vm.form.users);
				console.log(vm.form.users);
			}

			console.log('SUBMITTING PLAN >>>>>', plan);
			submitPlan(plan);
		} else{ //event
			var event = {};
			event.ownerId = user.id;
			event.title = vm.form.title;
			event.description = vm.form.description;
			event.isPrivate = true;
			event.start = vm.form.timeStart;
			event.end = vm.form.timeEnd;
			event.type = vm.form.type['_id'];
			if(vm.isPublic){
				event.isPrivate = false;
				if(vm.form.price) event.price = vm.form.price;
				if(vm.form.rooms.length) event.room = vm.form.room['_id'];
				if(vm.form.devices.length) event.devices = vm.form.devices;
				if(vm.form.users.length) {
					event.users = vm.form.users;
					event.users.push({_id:user.id, name:user.name});
					console.log('users in event', event.users);
				}
				updateLocalArr(vm.form.users);
			}
			console.log('SUBMITTING EVENT >>>>>', event);
			submitEvent(event);
		}

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

	vm.checkDuration = function(){
		start = new Date(vm.form.timeStart);
        end = new Date(vm.form.timeEnd);
		diff = end - start;
		if (diff < 900000){
			vm.timeError = true;
		} else {
			vm.timeError = false;
		}
	};

	vm.selectFormType = function(type){
		vm.form.type = type;
	};

	vm.selectFormRoom = function(room){
		vm.form.room = room;
		vm.computeIntervals();
	};

	function submitEvent(event) {
		console.log('submiting an event...');
		
		helpEventService.saveEvent(event).then(function(response) {
           	if(response.status == 200 || response.status == 201){
	           	vm.formSuccess = true;
				dropEventInfo();
				console.log('success', response.status);

				socketService.emit('add event', { event : response.data });	
				//$rootScope.$broadcast('eventAdded' + vm.viewType, data);
				console.log(vm.viewType);
				crudEvEventService.addedEventBroadcast(vm.selectedDateMoment, response.data, vm.viewType);

				$timeout(function() {
					$modalInstance.close();
					vm.formSuccess = false;
				}, 1500);
			} else {
								console.log('err');
				vm.submitEventError = true;
				return;
			}
        });
	}


	function submitPlan(plan){
		helpEventService.savePlan(plan).then(function(response) {
			if(response.status == 200 || response.status == 201){
	           	vm.formSuccess = true;
				dropEventInfo();
				console.log('success', response.status);


				socketService.emit('add plan', { planEvents : response.data });	
				//$rootScope.$broadcast('planAdded', data);
				crudEvEventService.addedPlanBroadcast(vm.selectedDateMoment, response.data, vm.viewType);

				$timeout(function() {
					$modalInstance.close();
					vm.formSuccess = false;
				}, 1500);
			} else {
				console.log('err');
				vm.submitPlanError = true;
				return;
			}
        });
	}

	function dropEventInfo(selDate) {

		var newEventDate = selDate || new Date();
		newEventDate.setHours(0);
		newEventDate.setMinutes(0);

		vm.form.timeStart = newEventDate;
		vm.form.timeEnd = newEventDate;
		vm.form.users = [];
		vm.form.devices = [];

		vm.changeStartDate();
	}


	function updateLocalArr(userArr) {
		if (userArr.length > 0) {
			for (var i=0; i < userArr.length; i++) {
				if (userArr[i]['_id'] !== loggedUserId) {
					var index;
					for (var y=0; y < localUsersArr.length; y++) {
						if (userArr[i]['_id'] === localUsersArr[y]['_id']) {
							index = y;
							break;
						}
					}
					localUsersArr.splice(index, 1);
				}
			}
			for (var u=0; u < userArr.length; u++) {
				if (userArr[u]['_id'] !== loggedUserId) {
					localUsersArr.unshift(userArr[u]);
				}
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
			if (localUserArrObj['_id'] == loggedUserId) {
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

