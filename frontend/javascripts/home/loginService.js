/**
 * Created by Vitalii Kalchuk on 14.10.2015.
 */
var app = require('../app'),
    baseUrl = 'http://localhost:3080/';

app.service('LoginService', function ($http) {

    this.signIn = function (userInfo) {
        return $http({
            url: baseUrl + 'api/login',
            method: 'POST',
            data: userInfo,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.signUp = function (userInfo) {
        return $http({
            url: baseUrl + 'api/register',
            method: 'POST',
            data: userInfo,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.logOut = function(){
        return $http({
            url: baseUrl + 'api/logout',
            method: 'GET',
        });
    };

});