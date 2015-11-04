angular
	.module('calendar-app')
	.directive('timeIndicator', TimeIndicator);

	TimeIndicator.$inject = ['$interval', '$timeout', '$location', '$anchorScroll'];

	function TimeIndicator($interval, $timeout, $location, $anchorScroll) {

		return {
			restrict: 'EA',
			replace: true,
			templateUrl: "templates/directives/timeIndicator/timeIndicatorTemplate.html",
			scope: {
				table: '@',
			},
			controller: timeIndicatorController,
			controllerAs: 'timeIndCtrl',
			bindToController: true,
			link: function(scope, element, attrs, timeIndCtrl) {

				$timeout(function () {

					timeIndCtrl.rowHeight = timeIndCtrl.calcRowHeight(timeIndCtrl.tableSel);
					timeIndCtrl.moveIndicator(element, timeIndCtrl.rowHeight);	
					timeIndCtrl.changePosition(element, timeIndCtrl.rowHeight);
					// $scope.goToIndicator($element);

				}, 0);
			}
		};

		function timeIndicatorController($scope, $interval, $attrs) {

			var vm = this;
			
			vm.calcRowHeight = calcRowHeight;
			vm.calcPosition = calcPosition;
			vm.moveIndicator = moveIndicator;
			vm.changePosition = changePosition;
			vm.goToIndicator = goToIndicator;
			vm.tableSel = $attrs.table;

			function goToIndicator() {
				$location.hash('time-indicator');
				$anchorScroll();
			}

			function changePosition(element, rowHeight) {

				$interval(function() {
					vm.moveIndicator(element, rowHeight);
				}, 60000);
			}

			function calcRowHeight(tableSelector) {
				var table = $('' + tableSelector + ' tr');
				return table.outerHeight();
			}
			
			function calcPosition(rowHeight) {

				if(!rowHeight) {
					rowHeight = vm.calcRowHeight(vm.tableSel);
				}

				var today = new Date();
				var currentHour = today.getHours();
				var currentMinutes = today.getMinutes();
				var oneMinHeight = rowHeight / 60;
				var newPosY = currentHour * rowHeight + (oneMinHeight * currentMinutes) + 'px';
				console.log(newPosY);
				return newPosY;
			}
			
			function moveIndicator(element, rowHeight) {
				var newPos = vm.calcPosition(rowHeight);
				element.css('top', newPos);
			}
		}
	}