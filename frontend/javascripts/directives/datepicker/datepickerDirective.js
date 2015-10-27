angular
    .module('calendar-app')
    .directive('datePicker', function () {

        return {
            restrict: "E",
            templateUrl: "templates/directives/datepicker/datepickerTemplate.html",
            controller: function($scope, datepickerService) {
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
                    // $scope.element.val(($scope.calendar.month + 1) + "/" + day + "/" +  $scope.calendar.year);
                    var that = this;

                    that.$apply(function () {
                        that.selectedDate = new Date($scope.calendar.year, $scope.calendar.month, day);
                        console.log($scope.selectedDate);
                        that.showDatePicker = false;
                    });
                    // $scope.selectedDate = new Date($scope.calendar.year, $scope.calendar.month, day);
                    // $scope.showDatePicker = false;
                    
                };

            },

            link: function(scope, element, attrs, controller) {

                var forElement = angular.element("#" + attrs.for);
                scope.element = forElement;

                if (attrs.moveRelRight) {
                    console.log(attrs.moveRelRight);
                    alert(true);
                    element.css({ 'left': attrs.moveRelRight });
                }

                forElement.on('focus', function() {
                    scope.$apply(function() { 
                        console.log(scope.sidebarStyle);
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