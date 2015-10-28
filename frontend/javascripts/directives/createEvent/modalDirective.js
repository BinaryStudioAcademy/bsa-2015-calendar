angular
	.module('calendar-app')
	.directive('modal', modalDirective);

modalDirective.$inject = ['DailyCalendarService', 'DayViewController'];

function modalDirective(DailyCalendarService, DayViewController, $timeout) {

	return {
	    templateUrl: 'templates/directives/createEvent/modalDirectiveTemplate.html',
	    restrict: 'E',
	    replace:true,
	    scope: true,
	    controller: modalController,
	    link: function(scope, element, attrs) {

	    	DayViewController.showDate();

	        scope.$watch(attrs.visible, function(value){
					if(value === true) {
						$(element).modal('show');
					} else {
						$(element).modal('hide');
					}
		        });

		        $(element).on('shown.bs.modal', function(){
		        	scope.$parent[attrs.visible] = true;
		        });

		        $(element).on('hidden.bs.modal', function(){
		        	scope.$parent[attrs.visible] = false;
		        });
	    }
	};

	function modalController($scope, $timeout, $element) {

		$scope.event = {};
		dropEventInfo($scope.newEventDate);
		$scope.formSuccess = false;

		$scope.selectConfigDevices = {
			buttonDefaultText: 'Select devices',
			enableSearch: true,
			scrollableHeight: '200px', 
			scrollable: true,
			displayProp: 'title',
			idProp: '_id',
			externalIdProp: '',
		};
		$scope.selectConfigUsers = {
			buttonDefaultText: 'Add people to event', 
			enableSearch: true, 
			smartButtonMaxItems: 3, 
			scrollableHeight: '200px', 
			scrollable: true,
			displayProp: 'name',
			idProp: '_id',
			externalIdProp: '',
		};

		$scope.selectEventType = function(type) {
			$scope.event.type = type;
		};

		$scope.selectRoom = function(title) {
			$scope.event.room = title;
		};

		$scope.showEvent = function() {
			console.log($scope.event);
		};

		$scope.submitEvent = function(event, newEventForm, date) {
			DailyCalendarService.configureEventData(date, event);
				if(newEventForm.$valid) {
					console.log('form is valid!');
					DailyCalendarService.saveEvent(event)
						.$promise.then(

							function(response) {

								$scope.formSuccess = true;
								dropEventInfo();
								console.log('success', response);

								$timeout(function() {
									$element.modal('hide');
									$scope.formSuccess = false;
								}, 2500);
							},

							function(response) {
								console.log('failure', response);
							}	
						);
				}
		};

		function dropEventInfo(selDate) {

			$scope.event.title = '';
			$scope.event.description = '';
			$scope.event.start = selDate;
			$scope.event.end = selDate;
			$scope.event.devices = [];
			$scope.event.users = [];
			$scope.event.room = null;
			$scope.event.isPrivate = false;
			$scope.event.type = '';
			$scope.event.price = null;
		}
	}
}