var app = require('../../app');

app.controller('NavDirectiveController', NavDirectiveController);
NavDirectiveController.$inject = ['NavDirectiveService'];


function NavDirectiveController(NavDirectiveService) {
	var vm = this;

	vm.days = NavDirectiveService.getDays();
}