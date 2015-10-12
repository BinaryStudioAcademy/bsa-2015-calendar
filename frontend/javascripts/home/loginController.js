/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', function ($scope) {
    $scope.isVisible = true;
    $scope.showHide = function () {
        $scope.isVisible = $scope.isVisible ? false : true;
    };
});