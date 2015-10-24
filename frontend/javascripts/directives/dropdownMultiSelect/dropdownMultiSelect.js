angular
	.module('calendar-app')
	.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            dropdownTitle: '@'
        },
        template: "<div class='btn-group' data-ng-class='{open: open}'>" +
        "<button class='btn btn-small'>{{dropdownTitle}}</button>" +
            "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropDown()'><span class='caret'></span></button>" +
            "<ul class='dropdown-menu scrollable-menu' aria-labelledby='dropdownMenu'>" +
            "<li><input type='checkbox' data-ng-change='checkAllClicked()' data-ng-model=checkAll> Check All</li>" +
            "<li class='divider'></li>" +
            "<li data-ng-repeat='option in options'> <input type='checkbox' data-ng-change='setSelectedItem(option.id)' ng-model='selectedItems[option.id]'>{{option.name}}</li>" +
            "</ul>" +
            "</div>",
        controller: function ($scope) {
            $scope.selectedItems = {};
            $scope.checkAll = false;

            $scope.openDropDown = function () {
                console.log('hi');
            };

            $scope.checkAllClicked = function () {
                if ($scope.checkAll) {
                    selectAll();
                } else {
                    deselectAll();
                }
            };

            function selectAll() {
                $scope.model = [];
                $scope.selectedItems = {};
                angular.forEach($scope.options, function (option) {
                    $scope.model.push(option.id);
                });
                angular.forEach($scope.model, function (id) {
                    $scope.selectedItems[id] = true;
                });
                console.log($scope.model);
            }

            function deselectAll() {
                $scope.model = [];
                $scope.selectedItems = {};
                console.log($scope.model);
            }

            $scope.setSelectedItem = function (id) {
                var filteredArray = [];
                if ($scope.selectedItems[id] === true) {
                    $scope.model.push(id);
                } else {
                    filteredArray = $scope.model.filter(function (value) {
                        return value != id;
                    });
                    $scope.model = filteredArray;
                    $scope.checkAll = false;
                }
                console.log(filteredArray);
                return false;
            };
        }
    };
});