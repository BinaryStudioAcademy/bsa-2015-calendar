angular
    .module('calendar-app')
    .directive('datePicker', function () {

        return {
            restrict: "E",
            templateUrl: "templates/directives/datepicker/datepickerTemplate.html",
            controller: function($scope, datepickerService, $timeout) {
                $scope.showDatePicker = false;

                $scope.calendar = {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                    monthName: datepickerService.getMonthName(new Date().getMonth())
                };

                $scope.days = datepickerService.getCalendarDays(new Date().getFullYear(), new Date().getMonth());

                $scope.nextMonth = function () {
                    datepickerService.incrementCalendarMonth($scope.calendar);
                    $scope.calendar.monthName = datepickerService.getMonthName($scope.calendar.month);
                    $scope.days = datepickerService.getCalendarDays($scope.calendar.year, $scope.calendar.month);
                };

                $scope.previousMonth = function () {
                    datepickerService.decrementCalendarMonth($scope.calendar);
                    $scope.calendar.monthName = datepickerService.getMonthName($scope.calendar.month);
                    $scope.days = datepickerService.getCalendarDays($scope.calendar.year, $scope.calendar.month);
                };

                $scope.nextYear = function () {
                    $scope.calendar.year++;
                    $scope.days = datepickerService.getCalendarDays($scope.calendar.year, $scope.calendar.month);
                };

                $scope.previousYear = function () {
                    $scope.calendar.year--;
                    $scope.days = datepickerService.getCalendarDays($scope.calendar.year, $scope.calendar.month);
                };

                $scope.selectDate = function (day) {
                    var newDate = new Date($scope.calendar.year, $scope.calendar.month, day);
                    $timeout(function() {
                        $scope.selectedDate = newDate;
                        console.log($scope.selectedDate);
                        $scope.showDatePicker = false; 
                    }, 0);             
                };

            },

            link: function(scope, element, attrs, controller) {

                var forElement = angular.element("#" + attrs.for);
                scope.element = forElement;

                forElement.on('focus', function() {
                    scope.$apply(function() {
                        scope.showDatePicker = true;
                    });  
                });

                angular.element("body").on('click', function() { 
                    scope.$apply( function() { 
                        scope.showDatePicker = false; 
                    });
                });

                forElement.on('click', function(event) { 
                    event.stopPropagation();
                });

                angular.element(".calendar-nav").on('click', function(event) { 
                    event.stopPropagation();
                });
            }
        };
});