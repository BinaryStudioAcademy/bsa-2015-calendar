/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', function ($scope, $state, alertify, LoginService, AuthService) {

    $scope.signOut = function(){
        LoginService.signOut();
        $state.go('signIn');
    };

    $scope.signIn = function () {
        var userInfo = {
            username: $scope.user.username,
            password: $scope.user.password
        };

        LoginService.signIn(userInfo)
        .then(function(response){
            console.log('RESPONSE: ', response);
            if(response.data.user){
                AuthService.setUser(response.data.user);

                $state.go('calendar.dayView');               
            } else {
                alertify.error('Wrong username or password');
            }

        })
        .then(function(response){
            if(response){
                console.log(response);
                alertify.error('Error');
            }
        });

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