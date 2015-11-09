var app = require('../app');

app.service('sheduleService', sheduleService);

sheduleService.$inject = ['$rootScope', 'helpEventService'];

function sheduleService($rootScope,  helpEventService) {
	vm.sheduleType = 'event';
}
