var app = require('../app'),
    moment = require('moment');

app.controller("MonthController", function ($scope) {
    //$scope.day = moment();

    $scope.maxEventNameLength = 18;
    $scope.maxDisplayEventsNumber = 3;

    $scope.showEventDetails = function (event) {
        console.log(event.name);
        console.log(event.date.format('DD/MM/YYYY'));
    };

    $scope.showAllDayEvents = function (day) {
        console.log(day.events);
    };
});