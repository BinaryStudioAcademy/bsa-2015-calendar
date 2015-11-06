var app = require('../app');

app.controller('createEventController', createEventController);

createEventController.$inject = ['AuthService', 'crudEvEventService', 'socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'viewType'];

function createEventController(AuthService, crudEvEventService, socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, viewType) {

	var vm = this;

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

	helpEventService.getRooms().then(function(data) {
            if (data !== null){
                vm.rooms = data;
            }
        });

    helpEventService.getDevices().then(function(data) {
        if (data !== null){
            vm.devices = data;
        }
    });

    helpEventService.getUsers().then(function(data) {
        if (data !== null){
            vm.users = data;
        }
    });

    helpEventService.getEventTypes().then(function(data) {
        if (data !== null){
            vm.eventTypes = data;
        }
    });

	dropEventInfo(vm.selectedDate);

	vm.submitModal = function() {

		console.log('form title', vm.form.title);

		vm.form.isValid = true;

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
			plan.ownerId = AuthService.getUser().id;
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
				if(vm.form.users.length) plan.users = vm.form.users;
			}

			console.log('SUBMITTING PLAN >>>>>', plan);
			submitPlan(plan);
		} else{ //event
			var event = {};
			event.ownerId = AuthService.getUser().id;
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
				if(vm.form.users.length) event.users = vm.form.users;
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
           	vm.formSuccess = true;
			dropEventInfo();
			console.log('success', response);

			socketService.emit('add event', { event : response });	
			//$rootScope.$broadcast('eventAdded' + vm.viewType, response);
			console.log(vm.viewType);
			crudEvEventService.addedEventBroadcast(vm.selectedDateMoment, response, vm.viewType);

			$timeout(function() {
				$modalInstance.close();
				vm.formSuccess = false;
			}, 1500);
        });
	}


	function submitPlan(plan){
		helpEventService.savePlan(plan).then(function(response) {
           	vm.formSuccess = true;
			dropEventInfo();
			console.log('success', response);

			socketService.emit('add plan', { planEvents : response });	
			//$rootScope.$broadcast('planAdded', response);
			crudEvEventService.addedPlanBroadcast(vm.selectedDateMoment, response, vm.viewType);

			$timeout(function() {
				$modalInstance.close();
				vm.formSuccess = false;
			}, 1500);
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
}

// var app = require('../app');

// app.controller('createEventController', createEventController);

// createEventController.$inject = ['crudEvEventService', 'socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate', 'viewType'];

// function createEventController(crudEvEventService, socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate, viewType) {
//	console.log('createEvCtrl');
// 	console.log(selectedDate);
// 	var vm = this;

// 	vm.activeTab = function(tab){
// 		if(tab === 'plan'){
// 			vm.isPlan = true;
// 		} else {
// 			vm.isPlan = false;
// 		}
// 		console.log('isPlan', vm.isPlan);
// 	};

// 	vm.weekDays = [
// 		{ name: 'Mo', selected: false },
// 		{ name: 'Tu', selected: false },
// 		{ name: 'We', selected: false },
// 		{ name: 'Th', selected: false },
// 		{ name: 'Fr', selected: false },
// 		{ name: 'Sa', selected: false },
// 		{ name: 'Su', selected: false }
// 	];

// 	vm.planIntervals = [];

// 	vm.computeIntervals = function(selectedDay){
// 		var selectIndex = vm.weekDays.indexOf(selectedDay);
// 		console.log('selectIndex', selectIndex);

// 		var startDay = vm.plan.timeStart.getDay() - 1;
// 		if(startDay === -1) {
// 			startDay = 6;
// 		}
// 		console.log('start day', startDay);

// 		if(!vm.planRoom && selectedDay){
// 			if(selectedDay.name != vm.weekDays[startDay].name){
// 				alertify.error('Please choose a room for your events');
// 				selectedDay.selected = false;
// 				return;				
// 			}
// 		}

// 		vm.weekDays[startDay].selected = true;

// 		var currentDay, i;
// 		vm.planIntervals = [];

// 		if(startDay === 0){
// 			currentDay = 0;
// 			for(i = 1; i < 7; i++){
// 				if(vm.weekDays[i].selected){					
// 					vm.planIntervals.push(i - currentDay);
// 					currentDay = i;
// 				}
// 			}
// 			if(vm.planIntervals.length)
// 				vm.planIntervals.push(7 - currentDay);
// 		} else if(startDay === 6){
// 			currentDay = 0;
// 			for(i = 0; i < 6; i++){
// 				if(vm.weekDays[i].selected){
// 					if(vm.planIntervals.length === 0){
// 						vm.planIntervals.push(i - currentDay + 1);
// 					} else{
// 						vm.planIntervals.push(i - currentDay);
// 					}

// 					currentDay = i;					
// 				}
// 			}

// 			if(vm.planIntervals.length)
// 				vm.planIntervals.push(6 - currentDay);

// 		} else {
// 			currentDay = startDay;
// 			for(i = currentDay + 1; i < 7; i++){
// 				if(vm.weekDays[i].selected){
// 					vm.planIntervals.push(i - currentDay);
// 					currentDay = i;
// 				}
// 			}

// 			var daysToEndOfWeek = 6 - currentDay;
// 			var isDayOnPreviousWeek = true;

// 			for(i = 0; i < startDay; i++){
// 				if(vm.weekDays[i].selected){
// 					if(isDayOnPreviousWeek){
// 						vm.planIntervals.push(i + daysToEndOfWeek + 1);
// 						isDayOnPreviousWeek = false;
// 						currentDay = i;
// 					} else{
// 						vm.planIntervals.push(i - currentDay);
// 						currentDay = i;
// 						console.log('i', i);
// 						console.log('current day', currentDay);
// 					}					
// 				}
// 			}

// 			if(vm.planIntervals.length){
// 				if(currentDay > startDay){
// 					vm.planIntervals.push(6 - currentDay + startDay + 1);
// 				} else {
// 					vm.planIntervals.push(startDay - currentDay);
// 				}
// 			}
// 		}

// 		console.log(vm.planIntervals);
// 		if(vm.planIntervals.length){
// 			vm.plan.intervals = [];
// 			vm.plan.rooms = [];
// 			for(i = 0; i < vm.planIntervals.length; i++){
// 				if(vm.planRoom){
// 					vm.plan.rooms.push(vm.planRoom._id);
// 				}
// 				vm.plan.intervals.push(86400000 * vm.planIntervals[i]);
// 			}
// 			console.log('plan intervals: ', vm.plan.intervals);
// 		}


// 	};
// 	vm.selectedDate = selectedDate;
// 	vm.viewType = viewType;
// 	vm.isPlan = false;
// 	vm.formSuccess = false;
// 	vm.event = {};
// 	vm.plan = {};

// 	helpEventService.getRooms().then(function(data) {
//             if (data !== null){
//                 vm.rooms = data;
//             }
//         });

//     helpEventService.getDevices().then(function(data) {
//         if (data !== null){
//             vm.devices = data;
//         }
//     });

//     helpEventService.getUsers().then(function(data) {
//         if (data !== null){
//             vm.users = data;
//         }
//     });

//     helpEventService.getEventTypes().then(function(data) {
//         if (data !== null){
//             vm.eventTypes = data;
//         }
//     });


// 	dropEventInfo(vm.selectedDate);

// 	vm.submitModal = function() {
// 		console.log('is plan', vm.isPlan);
// 		if(vm.isPlan){
// 			submitPlan(vm.plan);
// 		} else{
// 			submitEvent(vm.event);		
// 		}
// 		console.log('Modal submited');	
// 	};

// 	vm.closeModal = function() {
// 		$modalInstance.dismiss();
// 		console.log('Modal closed');
// 	};

// 	vm.selectConfigDevices = {
// 		buttonDefaultText: 'Select devices',
// 		enableSearch: true,
// 		scrollableHeight: '200px', 
// 		scrollable: true,
// 		displayProp: 'title',
// 		idProp: '_id',
// 		externalIdProp: '',
// 	};
// 	vm.selectConfigUsers = {
// 		buttonDefaultText: 'Add people to event', 
// 		enableSearch: true, 
// 		smartButtonMaxItems: 3, 
// 		scrollableHeight: '200px', 
// 		scrollable: true,
// 		displayProp: 'name',
// 		idProp: '_id',
// 		externalIdProp: '',
// 	};

// 	vm.selectEventType = function(type) {
// 		vm.event.type = type['_id'];
// 		vm.eventType = type.title;
// 	};

// 	vm.selectPlanType = function(type){
// 		vm.plan.type = type['_id'];
// 		vm.planType = type.title;
// 	};

// 	vm.selectRoom = function(title) {
// 		vm.event.room = title;
// 	};

// 	vm.selectPlanRoom = function(title){
// 		console.log(title);
// 		vm.planRoom = title;
// 	};

// 	function submitEvent(event) {
// 		console.log('submiting an event...');

// 		helpEventService.saveEvent(event).then(function(response) {
//            	vm.formSuccess = true;
// 			dropEventInfo();
// 			console.log('success', response);

// 			socketService.emit('add event', { event : response });	
// 			//$rootScope.$broadcast('eventAdded' + vm.viewType, response);
// 			console.log(vm.viewType);
// 			crudEvEventService.addedEventBroadcast(vm.selectedDate, response, vm.viewType);

// 			$timeout(function() {
// 				$modalInstance.close();
// 				vm.formSuccess = false;
// 			}, 1500);
//         });
// 	}

// 	function submitPlan(plan){
// 		console.log('submiting plan');
// 		plan.dateStart = new Date(plan.timeStart);
// 		plan.dateEnd = new Date(plan.dateStart);
// 		plan.dateEnd.setFullYear(2016);

// 		console.log('plan', plan);

// 		helpEventService.savePlan(plan).then(function(response) {
//            	vm.formSuccess = true;
// 			dropEventInfo();
// 			console.log('success', response);

// 			socketService.emit('add plan', { planEvents : response });	
// 			//$rootScope.$broadcast('planAdded', response);
// 			crudEvEventService.addedPlanBroadcast(vm.selectedDate, response, vm.viewType);

// 			$timeout(function() {
// 				$modalInstance.close();
// 				vm.formSuccess = false;
// 			}, 1500);
//         });
// 	}

// 	function dropEventInfo(selDate) {
// 		var newEventDate = new Date();
// 		if (selDate){
// 			newEventDate = new Date(selDate.format("DD MMM YYYY HH:mm:ss"));
// 		}
// 		newEventDate.setHours(0);
// 		newEventDate.setMinutes(0);

// 		vm.plan.title = '';
// 		vm.plan.description = '';
// 		vm.plan.timeStart = newEventDate;
// 		vm.plan.timeEnd = newEventDate;
// 		vm.plan.devices = [];
// 		vm.plan.users = [];
// 		vm.plan.rooms = [];
// 		vm.plan.isPrivate = false;
// 		vm.plan.type = undefined;
// 		vm.plan.price = undefined;

// 		vm.event.title = '';
// 		vm.event.description = '';
// 		vm.event.start = newEventDate;
// 		vm.event.end = newEventDate;
// 		vm.event.devices = [];
// 		vm.event.users = [];
// 		vm.event.room = undefined;
// 		vm.event.isPrivate = false;
// 		vm.event.type = undefined;
// 		vm.event.price = undefined;

// 		vm.computeIntervals();
// 	}
// }