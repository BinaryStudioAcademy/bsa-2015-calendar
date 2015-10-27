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
		for(var i = 0; i < vm.events.length; i++) {
			var temp = {};
			var eventEnd = new Date(vm.events[i].end);
			var eventStart = new Date(vm.events[i].start);
			temp.eventAsItIs = vm.events[i];

			// 888 is the height of the table; 86400000 amount of milliseconds in the 24 hours
			temp.heightVal = 888 * (eventEnd.getTime() - eventStart.getTime()) / 86400000;
			var now = new Date();
			now.setHours(0,0,0,0);
			temp.topVal = 888 * (eventStart.getTime() - now.getTime()) / 86400000;
			vm.computedEvents.push(temp);
		}

		//creating and appending events
		for(var c = 0; c < vm.computedEvents.length; c++) {
			var block = document.createElement('div');
			block.className = 'day-event-blocks';
			block.style.height = vm.computedEvents[c].heightVal.toPrecision(3) + 'px';
			block.style.top = vm.computedEvents[c].topVal.toPrecision(4) + 'px';
			block.innerHTML = vm.computedEvents[c].eventAsItIs.title;
			block.id = vm.computedEvents[c].eventAsItIs._id;
			document.getElementById('day-events-place').appendChild(block);
		}
		var blocks = document.getElementsByClassName('day-event-blocks');
		for(var k = 0; k < blocks.length; k++) {
			blocks[k].addEventListener('mousedown', function(e) {
				var self = this;
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
				self.style.zIndex = '10';

				function trackMouse(e){
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
					var topValue = self.style.top.split('px');
					topValue = Number(topValue[0]);
					console.log(Number(self.style.top.split('px')[0]));
					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) > Number(self.style.top.split('px')[0]))
						if (Number(self.style.top.split('px')[0]) < ((888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';
					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) < Number(self.style.top.split('px')[0]))
						if (Number(self.style.top.split('px')[0]) > 0)
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';
					if (Number(self.style.top.split('px')[0]) < 0)
						self.style.top = '0px';
					if (Number(self.style.top.split('px')[0]) > ((888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
						self.style.top = 888 - Number(self.style.height.split('px')[0]).toPrecision(3) + 'px';
					self.addEventListener('mouseup', function() {
						self.removeEventListener('mousemove', trackMouse);
						self.style.zIndex = '0';
						var zeroDate = new Date();
						zeroDate.setHours(0, 0, 0, 0);
						var todaysMilSec = 86400000 * Number(self.style.top.split('px')[0]) / 888;
						var durationMilSec = 86400000 * Number(self.style.height.split('px')[0]) / 888;
						var newElement = {
							start: new Date(zeroDate.getTime() + todaysMilSec),
							end: new Date(zeroDate.getTime() + todaysMilSec + durationMilSec)
						}
						DailyCalendarService.updateEvent(self.id, newElement);
					});
					self.addEventListener('mouseleave', function() {
						self.removeEventListener('mousemove', trackMouse);
						self.style.zIndex = '0';
						var zeroDate = new Date();
						zeroDate.setHours(0, 0, 0, 0);
						var todaysMilSec = 86400000 * Number(self.style.top.split('px')[0]) / 888;
						var durationMilSec = 86400000 * Number(self.style.height.split('px')[0]) / 888;
						var newElement = {
							start: new Date(zeroDate.getTime() + todaysMilSec),
							end: new Date(zeroDate.getTime() + todaysMilSec + durationMilSec)
						}
						DailyCalendarService.updateEvent(self.id, newElement);
					});
				}

				self.addEventListener('mousemove', trackMouse);
				self.addEventListener('mouseup', function() {
						self.removeEventListener('mousemove', trackMouse);
						self.style.zIndex = '0';
						var zeroDate = new Date();
						zeroDate.setHours(0, 0, 0, 0);
						var todaysMilSec = 86400000 * Number(self.style.top.split('px')[0]) / 888;
						var durationMilSec = 86400000 * Number(self.style.height.split('px')[0]) / 888;
						var newElement = {
							start: new Date(zeroDate.getTime() + todaysMilSec),
							end: new Date(zeroDate.getTime() + todaysMilSec + durationMilSec)
						}
						DailyCalendarService.updateEvent(self.id, newElement);
				});
				self.addEventListener('mouseleave', function() {
						self.removeEventListener('mousemove', trackMouse);
						self.style.zIndex = '0';
						var zeroDate = new Date();
						zeroDate.setHours(0, 0, 0, 0);
						var todaysMilSec = 86400000 * Number(self.style.top.split('px')[0]) / 888;
						var durationMilSec = 86400000 * Number(self.style.height.split('px')[0]) / 888;
						var newElement = {
							start: new Date(zeroDate.getTime() + todaysMilSec),
							end: new Date(zeroDate.getTime() + todaysMilSec + durationMilSec)
						}
						DailyCalendarService.updateEvent(self.id, newElement);
				});
			});
		}
	});

	vm.toggleEventInfo = function() {
		vm.eventSelected = !vm.eventSelected;
	};
}