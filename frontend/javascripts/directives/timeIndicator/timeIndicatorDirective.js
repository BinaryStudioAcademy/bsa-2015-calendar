angular
	.module('calendar-app')
	.directive('timeIndicator', TimeIndicator);

	TimeIndicator.$inject = ['$interval', '$timeout'];

	function TimeIndicator($interval, $timeout) {

		return {
			restrict: 'EA',
			replace: true,
			templateUrl: "templates/directives/timeIndicator/timeIndicatorTemplate.html",
			scope: {
				table: '@',
			},
			controller: timeIndicatorController,
			link: function($scope, $element, $attrs) {
				$timeout(function () {

					$scope.rowHeight = $scope.calcRowHeight($scope.tableSel);
					$scope.moveIndicator($element, $scope.rowHeight);	
					$scope.changePosition($element, $scope.rowHeight);

				}, 0);
			}
		};

		function timeIndicatorController($scope, $interval, $attrs) {
			
			$scope.calcRowHeight = calcRowHeight;
			$scope.calcPosition = calcPosition;
			$scope.moveIndicator = moveIndicator;
			$scope.changePosition = changePosition;
			$scope.tableSel = $attrs.table;

			function changePosition(element, rowHeight) {

				$interval(function() {
					$scope.moveIndicator(element, rowHeight);
				}, 60000);
			}

			function calcRowHeight(tableSelector) {
				var table = $('' + tableSelector + ' tr');
				return table.outerHeight();
			}
			
			function calcPosition(rowHeight) {

				if(!rowHeight) {
					rowHeight = $scope.calcRowHeight($scope.tableSel);
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
				var newPos = $scope.calcPosition(rowHeight);
				element.css('top', newPos);
			}
		}
	}