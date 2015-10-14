/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', function ($scope, LoginService) {
    $scope.isVisible = true;

    $scope.showHide = function () {
        $scope.isVisible = $scope.isVisible ? false : true;
    };

    $scope.signIn = function () {
        console.log($scope.user.email);
        console.log($scope.user.password);

        LoginService.signIn({username: $scope.user.email, password: $scope.user.password});

        $scope.user.email = '';
        $scope.user.password = '';

        $scope.signInForm.$setPristine();
        $scope.signInForm.$setUntouched();
    };

    $scope.signUp = function () {
        console.log($scope.user.newUsername);
        console.log($scope.user.newEmail);
        console.log($scope.user.newPassword);
        console.log($scope.user.newPasswordConfirm);

        var userInfo = {
            username: $scope.user.newUsername,
            password: $scope.user.newPassword
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