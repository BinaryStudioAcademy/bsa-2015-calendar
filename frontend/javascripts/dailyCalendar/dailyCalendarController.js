var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService'];

function DayViewController(DailyCalendarService) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = new Date();
	vm.computedEvents = [];
	vm.selectedDate = todayDate;
	vm.eventSelected = false;
	DailyCalendarService.getTodaysEvents().then(function(data){
		vm.events = data;
		//computing top and height values for events
		for(var i = 0; i < vm.events.length; i++){
			var temp = {};
			var eventEnd = new Date(vm.events[i].end);
			var eventStart = new Date(vm.events[i].start);
			temp.eventAsItIs = vm.events[i];
			temp.heightVal = 888 * (eventEnd.getTime() - eventStart.getTime()) / 86400000;// 888 is the height of the table; 86400000 amount of milliseconds in the 24 hours
			var now = new Date();
			now.setHours(0,0,0,0);
			temp.topVal = 888 * (eventStart.getTime() - now.getTime()) / 86400000;
			vm.computedEvents.push(temp);
		}
		//creating and appending events
		for(var c = 0; c < vm.computedEvents.length; c++){
			var block = document.createElement('div');
			block.className = 'day-event-blocks';
			block.style.height = vm.computedEvents[c].heightVal.toPrecision(3) + 'px';
			block.style.top = vm.computedEvents[c].topVal.toPrecision(4) + 'px';
			block.innerHTML = vm.computedEvents[c].eventAsItIs.title;
			document.getElementById('day-events-place').appendChild(block);
		}
	});

	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};
}