var app = require('../app');

app.controller('ModalController', ModalController);

ModalController.$inject = ['alertify', 'DailyCalendarService', 'socketService', '$timeout', '$modalInstance', 'allEvents', 'rooms', 'devices', 'users', 'selectedDate', 'eventTypes'];

function ModalController(alertify, DailyCalendarService, socketService, $timeout, $modalInstance, allEvents, rooms, devices, users, selectedDate, eventTypes) {

	var vm = this;

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

	vm.todayIndex = selectedDate.getDay() - 1;
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
	vm.planStartDate = new Date(selectedDate);
	vm.planEndDate = new Date(selectedDate);
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
	vm.rooms = rooms;
	vm.devices = devices;
	vm.users = users;
	vm.selectedDate = selectedDate;
	vm.eventTypes = eventTypes;
	vm.allEvents = allEvents;

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

	vm.selectFormType = function(type){
		vm.form.type = type;
	};

	vm.selectFormRoom = function(room){
		vm.form.room = room;
		vm.computeIntervals();
	};

	function submitEvent(event) {
		console.log('submiting an event...');
		DailyCalendarService.saveEvent(event)
			.$promise.then(

				function(response) {

					vm.formSuccess = true;
					dropEventInfo();
					console.log('success', response);

					socketService.emit('add event', { event : event });	

					$timeout(function() {
						$modalInstance.close();
						vm.formSuccess = false;
					}, 1500);
				},

				function(response) {
					console.log('failure', response);
				}	
			);
	}

	function submitPlan(plan){
		console.log('submiting plan');

		console.log('plan', plan);

		DailyCalendarService.savePlan(plan)
			.$promise.then(
				function(response) {

					vm.formSuccess = true;
					dropEventInfo();
					console.log('success', response);

					socketService.emit('add plan', { plan : plan });	
					
					$timeout(function() {
						$modalInstance.close();
						vm.formSuccess = false;
					}, 1500);
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

		vm.form.timeStart = newEventDate;
		vm.form.timeEnd = newEventDate;

		vm.form.users = [];
		vm.form.devices = [];

		vm.changeStartDate();
	}
}