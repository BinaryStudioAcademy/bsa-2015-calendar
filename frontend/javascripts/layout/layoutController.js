var app = require('../app');

app.controller('LayoutController', LayoutController);

LayoutController.$inject = [];

function LayoutController(socketService) {
	var vm = this;
	
	vm.init = function(){

	};

	vm.init();
}