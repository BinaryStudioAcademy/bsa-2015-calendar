var app = require('../app');

app.controller('editEventMonthController', editEventMonthController);

editEventMonthController.$inject = ['socketService', 'alertify', 'helpEventService', '$rootScope', '$scope', '$timeout', '$modalInstance', 'selectedDate'];

function editEventMonthController(socketService, alertify, helpEventService, $rootScope, $scope, $timeout, $modalInstance, selectedDate) {

	var vm = this;

	vm.activeTab = function(tab){
		if(tab === 'plan'){
			vm.isPlan = true;
		} else {
			vm.isPlan = false;
		}
		console.log('isPlan', vm.isPlan);
	};

	vm.weekDays = [
		{ name: 'Mo', selected: false },
		{ name: 'Tu', selected: false },
		{ name: 'We', selected: false },
		{ name: 'Th', selected: false },
		{ name: 'Fr', selected: false },
		{ name: 'Sa', selected: false },
		{ name: 'Su', selected: false }
	];

	vm.planIntervals = [];

	vm.computeIntervals = function(selectedDay){
		var selectIndex = vm.weekDays.indexOf(selectedDay);
		console.log('selectIndex', selectIndex);

		var startDay = vm.plan.timeStart.getDay() - 1;
		if(startDay === -1) {
			startDay = 6;
		}
		console.log('start day', startDay);

		if(!vm.planRoom && selectedDay){
			if(selectedDay.name != vm.weekDays[startDay].name){
				alertify.error('Please choose a room for your events');
				selectedDay.selected = false;
				return;				
			}
		}

		vm.weekDays[startDay].selected = true;

		var currentDay, i;
		vm.planIntervals = [];

		if(startDay === 0){
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

		console.log(vm.planIntervals);
		if(vm.planIntervals.length){
			vm.plan.intervals = [];
			vm.plan.rooms = [];
			for(i = 0; i < vm.planIntervals.length; i++){
				if(vm.planRoom){
					vm.plan.rooms.push(vm.planRoom._id);
				}
				vm.plan.intervals.push(86400000 * vm.planIntervals[i]);
			}
			console.log('plan intervals: ', vm.plan.intervals);
		}


	};

	vm.isPlan = false;
	vm.formSuccess = false;
	vm.event = {};
	vm.plan = {};

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

	vm.selectedDate = selectedDate;

	dropEventInfo(vm.selectedDate);

	vm.submitModal = function() {
		console.log('is plan', vm.isPlan);
		if(vm.isPlan){
			submitPlan(vm.plan);
		} else{
			submitEvent(vm.event);		
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

	vm.selectEventType = function(type) {
		vm.event.type = type['_id'];
		vm.eventType = type.title;
	};

	vm.selectPlanType = function(type){
		vm.plan.type = type['_id'];
		vm.planType = type.title;
	};

	vm.selectRoom = function(title) {
		vm.event.room = title;
	};

	vm.selectPlanRoom = function(title){
		console.log(title);
		vm.planRoom = title;
	};

	function submitEvent(event) {
		console.log('submiting an event...');

		helpEventService.saveEvent(event).then(function(response) {
           	vm.formSuccess = true;
			dropEventInfo();
			console.log('success', response);

			socketService.emit('add event', { event : response });	
			$rootScope.$broadcast('eventAdded', response);

			$timeout(function() {
				$modalInstance.close();
				vm.formSuccess = false;
			}, 1500);
        });
	}

	function submitPlan(plan){
		console.log('submiting plan');
		plan.dateStart = new Date(plan.timeStart);
		plan.dateEnd = new Date(plan.dateStart);
		plan.dateEnd.setFullYear(2016);

		console.log('plan', plan);

		helpEventService.savePlan(plan).then(function(response) {
           	vm.formSuccess = true;
			dropEventInfo();
			console.log('success', response);

			socketService.emit('add plan', { planEvents : response });	
			$rootScope.$broadcast('planAdded', response);

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

		vm.plan.title = '';
		vm.plan.description = '';
		vm.plan.timeStart = newEventDate;
		vm.plan.timeEnd = newEventDate;
		vm.plan.devices = [];
		vm.plan.users = [];
		vm.plan.rooms = [];
		vm.plan.isPrivate = false;
		vm.plan.type = undefined;
		vm.plan.price = undefined;

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

		vm.computeIntervals();
	}
}