angular
	.module('calendar-app')
	.controller('ModalController', ModalController);

ModalController.$inject = ['$uibModalInstance'];

function ModalController() {

	var vm = this;

	vm.submitModal = function() {
		$uibModalInstance.close();
		console.log('Modal submited');
	};

	vm.closeModal = function() {
		$uibModalInstance.dismiss();
		console.log('Modal closed');
	};
}