/**
 * Created by Vitalii Kalchuk on 12.10.2015.
 */
var app = require('../app');

app.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$state', '$resource', 'alertify','LoginService', 'AuthService', 'GoogleAuthService'];

function LoginController($scope, $state, $resource, alertify, LoginService, AuthService, GoogleAuthService) {
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
            username: $scope.user.username,
            password: $scope.user.password
        };

        LoginService.signIn(userInfo)
        .then(function (response) {
            console.log('RESPONSE: ', response);
            if (response.data.user) {
                AuthService.setUser(response.data.user);

                $scope.user.username = '';
                $scope.user.password = '';

                var resUser = $resource('/api/user/username/:username', {username: '@username'});
                resUser.get({username : response.data.user.username}, function(user) {
                    if(user.googleCode) {

                        console.log('loginCtrl');
                        GoogleAuthService.login(response.data.user.username);
                    }
                });

                $scope.signInForm.$setPristine();
                $scope.signInForm.$setUntouched();

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
    };

    vm.signUp = function () {
        var userInfo = {
            username: $scope.user.newUsername,
            name: $scope.user.newUsername,
            password: $scope.user.newPassword,
            email: $scope.user.newEmail,
            googleCode: $scope.googleLoginCode
        };

        console.log('in signup');

        LoginService.signUp(userInfo)
            .then(function (response) {
                console.log('RESPONSE: ', response);
                $scope.user.newUsername = '';
                $scope.user.newEmail = '';
                $scope.user.newPassword = '';
                $scope.user.newPasswordConfirm = '';

                $scope.signUpForm.$setPristine();
                $scope.signUpForm.$setUntouched();

                $state.go('calendar.dayView');
                alertify.success('registered successfully');

            })
            .then(function (response) {
                if (response) {
                    console.log(response);
                    alertify.error('Error');
                }
            });
    };
}