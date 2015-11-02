var app = require('./app');

app.factory('AuthService', [function(){

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

        return service;
}]);