var app = require('../app');

app.directive('calendarDirective', calendarDirective);

calendarDirective.$inject = ['helpEventService'];

function calendarDirective($animate, $timeout, $uibModal) {
    return {
        restrict: 'A',
        templateUrl: 'templates/yearCalendar/monthTemplate.html',
        scope: {
            calendar: '=',
            monthNum: '@'
        },

        link: function ($scope, element, attr) {
            //console.log($scope.calendar.year);

            $scope.$watch('calendar', function(calendar) {
                var monthObj = calendar.months[$scope.monthNum];
                $scope.weeks = [];
                
                //leading empty cells for first week
                var week = [];
                var firstDay = monthObj[0].weekDay;
                if (firstDay === 0) {firstDay = 7;}
                for (var i=1; i<(firstDay); i++) {
                        week.push(' ');
                }

                var monthLenght = monthObj.length;
                for (var y=0; y < monthLenght; y++) { 
                    week.push(monthObj[y]);
                    if (monthObj[y].weekDay === 0) {
                        $scope.weeks.push(week);
                        week = [];
                    }
                }
                $scope.weeks.push(week); //add last week

                $animate.enter(element.children('.year-month-table'), element); 
            }, true);   
        },

        controller: function($scope, helpEventService) {
            console.log($scope);

            $scope.availableRooms = getRooms();
            $scope.availableInventory = getInventory();
            $scope.users = getUsers();
            $scope.eventTypes = getEventTypes();


            $scope.showCloseModal = function(month, dayDate) {
                $scope.selectedDate = new Date($scope.calendar.year, month, dayDate);
                console.log('selectedDate');
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/yearCalendar/editEventYearTemplate.html',
                    controller: 'editEventYearController',
                    controllerAs: 'evYearCtrl',
                    bindToController: true,
                    resolve: {
                        rooms: function () {
                            return $scope.availableRooms;
                        },
                        devices: function () {
                            return $scope.availableInventory;
                        },
                        users: function () {
                            return $scope.users;
                        },
                        eventTypes: function () {
                            return $scope.eventTypes;
                        },
                    }
                });
            };

            function getRooms() {
                helpEventService.getAllRooms()
                    .$promise.then(
                        function(response) {
                            console.log('success Total rooms: ', response.length);
                            $scope.availableRooms = response;
                        },
                        function(response) {
                            console.log('failure', response);
                        }
                    );
            }

            function getInventory() {
                helpEventService.getAllDevices()
                    .$promise.then(
                        function(response) {
                            console.log('success Inventory items: ', response.length);
                            $scope.availableInventory = response;
                        },
                        function(response) {
                            console.log('failure', response);
                        }
                    );
            }

            function getUsers() {
                helpEventService.getAllUsers()
                    .$promise.then(
                        function(response) {
                            console.log('success Number of Users: ', response.length);
                            $scope.users = response;
                        },
                        function(response) {
                            console.log('failure', response);
                        }
                    );
            }

            function getEventTypes() {
                helpEventService.getAllEventTypes()
                    .$promise.then(
                        function(response) {
                            console.log('success Current number of types: ', response.length);
                            $scope.eventTypes = response;
                        },
                        function(response) {
                            console.log('failure', response);
                        }
                    );
            }

        }
    };
}
