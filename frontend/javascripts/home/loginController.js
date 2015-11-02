/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$state', 'alertify', 'LoginService', 'AuthService', 'GoogleAuthService'];

function LoginController($state, alertify, LoginService, AuthService, GoogleAuthService) {
    var vm = this;

    vm.googleLoginCode = "";

    vm.googleSignUp = function () {
        console.log(GoogleAuthService);
        GoogleAuthService.getLoginCode().then(function (code) {
            vm.googleLoginCode = code;
        });
    };

    vm.signOut = function () {
        LoginService.signOut();
        $state.go('signIn');
    };

    vm.signIn = function () {
        var userInfo = {
            username: vm.user.username,
            password: vm.user.password
        };

        LoginService.signIn(userInfo)
            .then(function (response) {
                console.log('RESPONSE: ', response);
                if (response.data.user) {
                    AuthService.setUser(response.data.user);

                    $state.go('calendar.dayView');
                } else {
                    alertify.error('Wrong username or password');
                }

            })
            .then(function (response) {
                if (response) {
                    console.log(response);
                    alertify.error('Error');
                }
            });

        vm.user.username = '';
        vm.user.password = '';

        vm.signInForm.$setPristine();
        vm.signInForm.$setUntouched();
    };

    vm.signUp = function () {
        var userInfo = {
            username: vm.user.newUsername,
            name: vm.user.newUsername,
            password: vm.user.newPassword,
            email: vm.user.newEmail,
            googleCode: vm.googleLoginCode
        };

        console.log('in signup');

        LoginService.signUp(userInfo)
            .then(function (response) {
                console.log('RESPONSE: ', response);
                $state.go('calendar.dayView');
                alertify.success('registered successfully');

            })
            .then(function (response) {
                if (response) {
                    console.log(response);
                    alertify.error('Error');
                }
            });

        vm.user.newUsername = '';
        vm.user.newEmail = '';
        vm.user.newPassword = '';
        vm.user.newPasswordConfirm = '';

        vm.signUpForm.$setPristine();
        vm.signUpForm.$setUntouched();
    };
}