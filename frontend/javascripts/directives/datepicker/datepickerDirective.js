angular
    .module('calendar-app')
    .directive('datePicker', function () {

        return {
            restrict: "E",
            templateUrl: "templates/directives/datepicker/datepickerTemplate.html",
            controller: datepickerController,
            controllerAs: 'datePickerCtrl',
            bindToController: true,

            link: function(scope, element, attrs, datePickerCtrl) {

                var forElement = angular.element("#" + attrs.for);
                scope.element = forElement;

                forElement.on('focus', function() {
                    scope.$apply(function() {
                        datePickerCtrl.showDatePicker = true;
                    });  
                });

                angular.element("body").on('click', function() { 
                    scope.$apply( function() { 
                        datePickerCtrl.showDatePicker = false; 
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

        function datepickerController(datepickerService, $timeout) {

                var vm = this;

                vm.showDatePicker = false;

                vm.calendar = {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                    monthName: datepickerService.getMonthName(new Date().getMonth())
                };

                vm.days = datepickerService.getCalendarDays(new Date().getFullYear(), new Date().getMonth());

                vm.nextMonth = function () {
                    datepickerService.incrementCalendarMonth(vm.calendar);
                    vm.calendar.monthName = datepickerService.getMonthName(vm.calendar.month);
                    vm.days = datepickerService.getCalendarDays(vm.calendar.year, vm.calendar.month);
                };

                vm.previousMonth = function () {
                    datepickerService.decrementCalendarMonth(vm.calendar);
                    vm.calendar.monthName = datepickerService.getMonthName(vm.calendar.month);
                    vm.days = datepickerService.getCalendarDays(vm.calendar.year, vm.calendar.month);
                };

                vm.nextYear = function () {
                    vm.calendar.year++;
                    vm.days = datepickerService.getCalendarDays(vm.calendar.year, vm.calendar.month);
                };

                vm.previousYear = function () {
                    vm.calendar.year--;
                    vm.days = datepickerService.getCalendarDays(vm.calendar.year, vm.calendar.month);
                };

                vm.selectDate = function (day) {
                    var newDate = new Date(vm.calendar.year, vm.calendar.month, day);
                    vm.selectedDate = newDate;
                    console.log(vm.selectedDate);
                    vm.showDatePicker = false;           
                };

            }
    });
