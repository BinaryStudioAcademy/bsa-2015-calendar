var app = require('../app');

app.controller('tutorialController', tutorialController);

tutorialController.$inject = ['$document', 'AuthService', '$rootScope', '$scope', '$timeout', '$modalInstance', '$resource', 'openedViewIndex'];

function tutorialController($document, AuthService, $rootScope, $scope, $timeout, $modalInstance, $resource, openedViewIndex) {

	var vm = this;

	vm.tutorialTexts = [{
		text: 'Use double click to create event and right click to change event',
		img: '/img/1.png'
	}, {
		text: 'Event should have title, type and lasts more than 15 min. You can create public and recurring events',
		img: '/img/2.png'
	}, {
		text: 'Every event has specific type. You can create custom event types. Default types is basic, general, google and holiday',
		img: '/img/3.png'
	}, {
		text: 'To create recurring events you should choose start and end date, and set desired days of week',
		img: '/img/4.png'
	}, {
		text: 'Right click on the event to change event data. To change duration and start/end time you can drag and resize event block with left click',
		img: '/img/5.png'
	}, {
		text: 'Use double click to create event and right click to change event',
		img: '/img/6.png'
	}, {
		text: 'Use double click to create event and right click to change event',
		img: '/img/7.png'
	}, {
		text: 'Use double click to create event and right click to change event',
		img: '/img/8.png'
	}, {
		text: 'Use double click to create event and right click to change event. To move to specific month view click on the month name',
		img: '/img/9.png'
	}];
	vm.currentText = openedViewIndex || 0;
	vm.tutorialFinished = false;

	console.log('tutorialController');

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