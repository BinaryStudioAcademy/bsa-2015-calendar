
var app = require('../app');

app.controller('BinaryAuthController', BinaryAuthController);

BinaryAuthController.$inject = ['$scope', '$state', '$resource', 'alertify','LoginService', 'AuthService', 'GoogleAuthService', 'BinaryAuthService'];

function BinaryAuthController($scope, $state, $resource, alertify, LoginService, AuthService, GoogleAuthService, BinaryAuthService) {
    var vm = this;

     vm.googleLoginCode = "";

    vm.googleSignUp = function () {
        console.log(GoogleAuthService);
        GoogleAuthService.getLoginCode().then(function (code) {
            vm.googleLoginCode = code;
        });
    };
    vm.user = BinaryAuthService.user;
    console.log(vm.user);


    var validate = function(userInfo){
        return {
            id : userInfo._id,
            name : userInfo.name,
            username : userInfo.username,
            events : userInfo.events,
            groups : userInfo.groups
        };
    };
    console.log(validate(vm.user));
    vm.signUp = function () {
            vm.user.name = $scope.user.newUsername;
            vm.user.username = $scope.user.newUsername;
            vm.user.googleCode= $scope.googleLoginCode;
            vm.user.password = vm.user.role;
            console.log('RESPONSE: ', vm.user);
             LoginService.signUp(vm.user).then(function(res){
             });
                
                $scope.user.newUsername = '';
               
                $scope.signUpForm.$setPristine();
                $scope.signUpForm.$setUntouched();
                LoginService.signIn(vm.user).then(function(res){
                    AuthService.setUser(res.data.user);
                });
                $state.go('calendar.dayView');
                alertify.success('registered successfully');

          
        };
}