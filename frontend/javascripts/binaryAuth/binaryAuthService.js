var app = require('../app');
var baseUrl = 'http://localhost:3080/';

app.factory('BinaryAuthService', ['$http' ,function ($http) {
	var service = {
		user : {},
		newUser : {}
	};

	service.getTokenData = function(){
		return $http.get('/api/binary').success(function(data){
			angular.copy(data , service.user);
		})
		.error(function(data,status){
			console.log('No token User', status, data);
	
		});
	};

	service.register = function(user){
		return $http.post('/api/register' , user ).success(function(data){
			angular.copy(data, service.newUser);
			console.log(data);
		});
	};

	return service;
  
}]);