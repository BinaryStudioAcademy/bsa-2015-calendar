var app = require('../app');

app.service('scheduleService', scheduleService);

scheduleService.$inject = ['$rootScope', 'helpEventService'];

function scheduleService($rootScope,  helpEventService) {
	var vm = this;

	init();

	function init(){
		vm.scheduleType = 'event';
	}

	vm.sheduleChanged = function(scheduleItemType, scheduleItemId){
		vm.scheduleType = scheduleItemType;
		vm.sheduleItemId = scheduleItemId;
		console.log(scheduleItemType, scheduleItemId);
		$rootScope.$broadcast('scheduleTypeChanged');
	};

	vm.getType = function(){
		return vm.scheduleType;
	};

	vm.getItemId = function(){
		return vm.sheduleItemId;
	};
}
