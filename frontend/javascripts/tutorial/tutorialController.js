var app = require('../app');

app.controller('tutorialController', tutorialController);

tutorialController.$inject = ['Globals', '$document', 'AuthService', '$rootScope', '$scope', '$timeout', '$modalInstance', '$resource', 'openedViewIndex'];

function tutorialController(Globals, $document, AuthService, $rootScope, $scope, $timeout, $modalInstance, $resource, openedViewIndex) {

	var vm = this;



	function init() {
		vm.tutorialTexts = Globals.tutorialTexts;
		vm.currentText = openedViewIndex || 0;
		vm.tutorialFinished = false;		
	}


	$document.bind("keydown", function(event) {
		//console.log(event.keyCode);
		if (event.keyCode == 37) {
			vm.changeTextByKeyBoardLeft();
		}
		if (event.keyCode == 39) {
			vm.changeTextByKeyBoardRight();
		}
		if (event.keyCode == 27) {
			vm.closeModal();
		}
	});

	vm.closeModal = function() {
		//$document.unbind("keydown");
		$modalInstance.dismiss();
		console.log('Modal closed');
	};

	vm.changeTextRight = function() {
		if(vm.currentText < vm.tutorialTexts.length - 1) {
			vm.currentText++;
			console.log(vm.currentText);
		}
	};

	vm.changeTextLeft = function() {
		if(vm.currentText > 0) {
			vm.currentText--;
			console.log(vm.currentText);
		}
	};

	vm.changeTextByKeyBoardRight = function() {
		if(vm.currentText < vm.tutorialTexts.length - 1) {
			vm.currentText++;
			console.log(vm.currentText);
			$scope.$digest();
		}
	};

	vm.changeTextByKeyBoardLeft = function() {
		if(vm.currentText > 0) {
			vm.currentText--;
			console.log(vm.currentText);
			$scope.$digest();
		}
	};

	vm.completeTutorial = function () {
		var user = AuthService.getUser();
		if(!user.completedTutorial){
			var resourceCmplTutr = $resource('/api/user/completeTutorial/:id', {id:'@id'},{
				'update': { method:'PUT' }
			});
			resourceCmplTutr.update({id:user.id}, JSON.stringify({completed: true}));

			user.completedTutorial = true;
			AuthService.setUser(user);
		}
		//$document.unbind("keydown");
		$modalInstance.dismiss();
	};

}