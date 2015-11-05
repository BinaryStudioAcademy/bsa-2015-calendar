var app = require('./app');

app.factory('AuthService', ['$http', function($http){

        var baseUrl = 'http://localhost:3080/';

        var service = {};
        var userInfo = null;

        service.unSetUser = function(){
            localStorage.userInfo = null;
        };

        service.getUser = function(){
            //console.log('localstorage.userInfo: ', localStorage.userInfo);

            if(localStorage.userInfo){
                //console.log('JSON parse userinfo', JSON.parse(localStorage.userInfo));
                return JSON.parse(localStorage.userInfo);  
            }

            return null;

        };

        service.setUser = function(user){
            console.log(user);

            localStorage.userInfo = JSON.stringify(user);

            //console.log('SET localstorage.userinfo', localStorage.userInfo);
            userInfo = user;
        };

        service.checkAuth = function(){
            return $http({
                url: baseUrl + 'api/isAuth',
                method: 'POST',
            });
        };

        return service;
}]);