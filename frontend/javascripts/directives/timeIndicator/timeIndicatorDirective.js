angular
	.module('calendar-app')
	.directive('timeIndicator', TimeIndicator);

	TimeIndicator.$inject = ['$interval'];

	function TimeIndicator($interval) {

		return {
			restrict: 'EA',
			replace: true,
			templateUrl: "templates/directives/timeIndicator/timeIndicatorTemplate.html",
			scope: {
				table: '@'
			},
			controller: timeIndicatorController,
			link: function($scope, $element, $attrs) {

				var tableSel = $attrs.table;
				var rowHeight = $scope.calcRowHeight(tableSel);
				var borderWidth = $scope.calcPosition(tableSel);
				
				$scope.moveIndicator($element, rowHeight);
				
				$scope.changePosition($element, rowHeight);
			}
		};

		function timeIndicatorController($scope, $interval) {
			
			$scope.calcRowHeight = calcRowHeight;
			$scope.calcPosition = calcPosition;
			$scope.moveIndicator = moveIndicator;
			$scope.changePosition = changePosition;

			function changePosition(element, rowHeight) {

				$interval(function() {
					$scope.moveIndicator(element, rowHeight);
				}, 60000);
			}

			function calcRowHeight(tableSelector) {
				return $('' + tableSelector + ' tr').outerHeight();
			}
			
			function calcPosition(rowHeight) {

				var today = new Date();
				var currentHour = today.getHours();
				var currentMinutes = today.getMinutes();
				var oneMinHeight = rowHeight / 60;
				var newPosY = currentHour * rowHeight + (oneMinHeight * currentMinutes) + 'px';
				return newPosY;
			}
			
			function moveIndicator(element, rowHeight) {
				var newPos = $scope.calcPosition(rowHeight);
				element.css('top', newPos);
			}
		}
	}