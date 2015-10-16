var app = require('../app'),
    moment = require('moment');

app.controller("MonthController", function($scope) {
    $scope.day = moment();
});