/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', function ($scope, LoginService) {

    $scope.signIn = function () {
        var userInfo = {
            username: $scope.user.username,
            password: $scope.user.password
        };

        LoginService.signIn(userInfo);

        $scope.user.username = '';
        $scope.user.password = '';

        $scope.signInForm.$setPristine();
        $scope.signInForm.$setUntouched();
    };

    $scope.signUp = function () {
        var userInfo = {
            username: $scope.user.newUsername,
            name: $scope.user.newUsername,
            password: $scope.user.newPassword,
            email: $scope.user.newEmail
        };

        LoginService.signUp(userInfo);

        $scope.user.newUsername = '';
        $scope.user.newEmail = '';
        $scope.user.newPassword = '';
        $scope.user.newPasswordConfirm = '';

        $scope.signUpForm.$setPristine();
        $scope.signUpForm.$setUntouched();
    };
});