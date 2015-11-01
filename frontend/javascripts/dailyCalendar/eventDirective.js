angular
	.module('calendar-app')
	.directive('dayViewEvent', DayViewEvent);

DayViewEvent.$inject = ['$timeout'];

function DayViewEvent($timeout) {

	var directive = {
		restrict: 'E',
		replace: true,
		scope: {
			event: '=',
			table: '@',
			eventsInRow: '=',
			index: '@',
		},
		templateUrl: 'templates/dailyCalendar/eventDirectiveTemplate.html',
		controller: eventController,
		controllerAs: 'eventCtrl',
		bindToController: true,
		link: function($scope, $element, $attrs) {

			// $element.on('mousedown', function(e) {

			// 	var containerTop = 56;
			// 	var self = this;
			// 	var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
			// 	self.style.zIndex = '10';
			// 	var coords = getCoords(self);
			// 	console.log(coords);
			// 	// self.getElementsByClassName('resize-block')[0].style.display = 'none';

			// 	function getCoords(elem) {
			// 		var box = elem.getBoundingClientRect();

			// 		return {
			// 			top: box.top + pageYOffset,
			// 			left: box.left + pageXOffset
			// 		};
			// 	}

			// 	function mouseAway(){
			// 		self.removeEventListener('mousemove', trackMouse);
			// 		self.removeEventListener('mouseup', mouseAway);
			// 		self.removeEventListener('mouseleave', mouseAway);
			// 		// self.getElementsByClassName('resize-block')[0].style.display = 'block';
			// 		self.style.zIndex = '1';
			// 		var zeroDate = new Date();
			// 		zeroDate.setHours(0, 0, 0, 0);
			// 		var todaysMilSec = 86400000 * (Number(self.style.top.split('px')[0]) - containerTop) / 888;
			// 		var newStart = new Date(zeroDate.getTime() + todaysMilSec);
			// 		newStart.setSeconds(0);
			// 		newStart.setMilliseconds(0);
			// 		var newEnd = new Date(newStart.getTime() + (new Date($scope.event.end) - new Date($scope.event.start)));
			// 		alert('newStart: ' + newStart + ';\nnewEnd: ' + newEnd);
			// 		var newElement = {
			// 			start: newStart,
			// 			end: newEnd
			// 		};
			// 		DailyCalendarService.updateEvent(self.id, newElement);
			// 	}


			// 	function trackMouse(e){
			// 		var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
			// 		var topValue = self.style.top.split('px');
			// 		topValue = Number(topValue[0]);

			// 		// if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) > Number(self.style.top.split('px')[0]))
			// 		// 	if (Number(self.style.top.split('px')[0]) < ((containerTop + 888 - Number(self.style.height.split('px')[0])).toPrecision(3))){
			// 		// 		self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';
			// 		// 	}

			// 		// if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) < Number(self.style.top.split('px')[0]))
			// 		// 	if (Number(self.style.top.split('px')[0]) > containerTop)
			// 		// 		self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';

			// 		// if (Number(self.style.top.split('px')[0]) < containerTop)
			// 		// 	self.style.top = containerTop + 'px';

			// 		// if (Number(self.style.top.split('px')[0]) > ((containerTop + 888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
			// 		// 	self.style.top = containerTop + 888 - Number(self.style.height.split('px')[0]).toPrecision(3) + 'px';

			// 		self.style.top = changedMouseY;
			// 	}

			// 	self.addEventListener('mousemove', trackMouse);
			// 	self.addEventListener('mouseup', mouseAway);
			// 	self.addEventListener('mouseleave', mouseAway);

			// });
		},
	};

	return directive;

	function eventController($scope, $element, $attrs) {
		var vm = this;

		vm.tableSel = $attrs.table;

		vm.COLORS = [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		];

		vm.rowHeight = calcRowHeight(vm.tableSel);
		vm.eventCellHeight = calcEventCellHeight(vm.rowHeight);
		vm.rowWidth = calcRowWidth(vm.tableSel);
		vm.findById = findById;

		vm.offsetCell = 0.04 * vm.rowWidth;
		vm.eventCellWidth = 0.2 * vm.rowWidth;

		$element.css('height', vm.eventCellHeight);
		$element.css('width', vm.eventCellWidth);
		$element.css('left', vm.offsetCell + (vm.index - 1) * (vm.eventCellWidth + vm.offsetCell));
		$element.css('background', vm.COLORS[getRandomInt(0, vm.COLORS.length)]);

		function findById(array, criteria) {
			for(var i = 0; i < array.length; i++)
				if(array[i]._id == criteria)
					return array[i];
			return {};
		}

		function calcRowHeight(tableSelector) {
			var tableRow = $('' + tableSelector + ' tr');
			return tableRow.outerHeight();
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		function calcRowWidth() {
			var tableCell = $(vm.tableSel + ' tr td.eventCell');
			return tableCell.outerWidth();
		}

		function calcEventCellHeight(rowHeight) {
			var timeStart = new Date(vm.event.start);
			var timeEnd = new Date(vm.event.end);

			var diff = Math.floor(timeEnd.getTime() - timeStart.getTime());
			var difInMin = diff / 60000;

			var oneMinHeight = rowHeight / 60;

			return oneMinHeight*difInMin;
		}
	}
}