/**
 * Created by Vitalii Kalchuk on 14.10.2015.
 */
var app = require('../app'),
    baseUrl = 'http://localhost:3080/';

app.service('LoginService', function ($http) {

    this.signIn = function (userInfo) {
        console.log(userInfo);

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
        console.log(userInfo);

        return $http({
            url: baseUrl + 'api/register',
            method: 'POST',
            data: '{"name":"' + userInfo.username + '","password":"' + userInfo.password + '","email":"' + userInfo.email + '","username":"' + userInfo.username + '"}',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

});