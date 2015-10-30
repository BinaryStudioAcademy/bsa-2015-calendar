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
		},
	};

	return directive;

	function eventController($scope, $element, $attrs) {
		var vm = this;

		vm.tableSel = $attrs.table;

		vm.rowHeight = calcRowHeight(vm.tableSel);
		vm.eventCellHeight = calcEventCellHeight(vm.rowHeight);
		vm.rowWidth = calcRowWidth(vm.tableSel);

		vm.offsetCell = 0.04 * vm.rowWidth;
		vm.eventCellWidth = 0.2 * vm.rowWidth;

		$element.css('height', vm.eventCellHeight);
		$element.css('width', vm.eventCellWidth);
		$element.css('left', vm.offsetCell + (vm.index - 1) * (vm.eventCellWidth + vm.offsetCell));

		function calcRowHeight(tableSelector) {
			var tableRow = $('' + tableSelector + ' tr');
			return tableRow.outerHeight();
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