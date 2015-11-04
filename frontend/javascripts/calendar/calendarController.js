var app = require('../app');

app.controller('CalendarController', CalendarController);

// CalendarController.$inject

function CalendarController($state, LoginService, AuthService, $document, $uibModal) {
	var vm = this;
	
	var todayDate = Date.now();
	vm.selectedDate = todayDate;

	vm.logOut = function(){
		LoginService.logOut()
		.then(function(response){
			console.log('response data', response.data);
			if(response.data.unauthenticated){
				AuthService.unSetUser();
				console.log('signed out');
				// $state.go('signIn');
			}
		})
		.then(function(response){
            if(response){
                console.log(response);
                alertify.error('Error');
            }		
		});
	};

	$document.bind("keypress", function(event) {
		if (event.keyCode == 104) {
			$("#myModal").modal("show");
		}
		if (event.keyCode == 27) {
			$("#myModal").uibModal("hide");
		}
	});

}