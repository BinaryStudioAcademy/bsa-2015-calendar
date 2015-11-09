var app = require('../app');

app.controller('tutorialController', tutorialController);

tutorialController.$inject = ['AuthService', '$rootScope', '$scope', '$timeout', '$modalInstance', '$resource', 'openedViewIndex'];

function tutorialController(AuthService, $rootScope, $scope, $timeout, $modalInstance, $resource, openedViewIndex) {

	var vm = this;

	vm.tutorialTexts = ['DAY VIEW INFO TUTORIAL', 'WEEK VIEW INFO TUTORIAL', 'MONTH VIEW INFO TUTORIAL', 'LOOOOOOOOOOOOOOOOOONG TEEEEEEEEEEEEXT LOOOOOOOOOOOOOOOOOONG TEEEEEEEEEEEEXT LOOOOOOOOOOOOOOOOOONG TEEEEEEEEEEEEXT LOOOOOOOOOOOOOOOOOONG TEEEEEEEEEEEEXT YEAR VIEW INFO TUTORIAL', 'FINAL TEXT'];
	vm.currentText = openedViewIndex || 0;
	vm.tutorialFinished = false;

	console.log('tutorialController');

	vm.closeModal = function() {
		$modalInstance.dismiss();
		console.log('Modal closed');
	};

	vm.changeTextRight = function() {
		if(vm.currentText < vm.tutorialTexts.length - 1) {
			vm.currentText++;
		}
	};

	vm.changeTextLeft = function() {
		if(vm.currentText > 0) {
			vm.currentText--;
		}
	};

	vm.completeTutorial = function () {
		var user = AuthService.getUser();
		var resourceCmplTutr = $resource('/api/user/completeTutorial/:id', {id:'@id'},{
			'update': { method:'PUT' }
		});
		resourceCmplTutr.update({id:user.id}, JSON.stringify({completed: true}));

		user.completedTutorial = true;
		AuthService.setUser(user);

		$modalInstance.dismiss();
	};

}