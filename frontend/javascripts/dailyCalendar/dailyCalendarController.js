var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q', '$uibModal'];

function DayViewController(DailyCalendarService, $timeout, $q, $uibModal) {
	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var todayDate = new Date();
	vm.computedEvents = [];
	vm.selectedDate = todayDate;
	vm.eventSelected = false;

	function findById(array, criteria) {
		for(var i = 0; i < array.length; i++)
			if(array[i]._id == criteria)
				return array[i];
		return {};
	}

	DailyCalendarService.getTodaysEvents().then(function(data){
		vm.events = data;
		var containerTop = 56;

		//computing top and height values for events
		for(var i = 0; i < vm.events.length; i++) {
			var temp = {};
			var eventEnd = new Date(vm.events[i].end);
			var eventStart = new Date(vm.events[i].start);
			temp.eventAsItIs = vm.events[i];
			// 888 is the height of the table; 86400000 amount of milliseconds in the 24 hours
			temp.heightVal = 888 * (eventEnd.getTime() - eventStart.getTime()) / 86400000;
			var now = new Date();
			now.setHours(0,0,0,0);
			temp.topVal = 888 * (eventStart.getTime() - now.getTime()) / 86400000 + containerTop;
			vm.computedEvents.push(temp);
		}

		//creating and appending events
		for(var c = 0; c < vm.computedEvents.length; c++) {
			var block = document.createElement('div');
			var resizeBlock = document.createElement('div');
			var paragraph = document.createElement('div');

			paragraph.innerHTML = vm.computedEvents[c].eventAsItIs.title;
			paragraph.style.width = '85%';
			paragraph.style.float = 'right';

			block.className = 'day-event-blocks';
			block.style.height = vm.computedEvents[c].heightVal.toPrecision(3) + 'px';
			block.style.top = vm.computedEvents[c].topVal.toPrecision(4) + 'px';
			block.id = vm.computedEvents[c].eventAsItIs._id;
			
			resizeBlock.style.width = '100%';
			resizeBlock.style.bottom = '-7px';
			resizeBlock.style.height = '14px';
			resizeBlock.style.cursor = 's-resize';
			resizeBlock.style.zIndex = '11';
			resizeBlock.style.position = 'absolute';
			resizeBlock.className = 'resize-block';

			block.appendChild(paragraph);
			block.appendChild(resizeBlock);
			document.getElementById('day-events-place').appendChild(block);
		}

		var blocks = document.getElementsByClassName('day-event-blocks');

		for(var k = 0; k < blocks.length; k++) {
			blocks[k].addEventListener('mousedown', function(e) {
				var self = this;
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
				self.style.zIndex = '10';
				self.getElementsByClassName('resize-block')[0].style.display = 'none';

				function mouseAway(){
					self.removeEventListener('mousemove', trackMouse);
					self.removeEventListener('mouseup', mouseAway);
					self.removeEventListener('mouseleave', mouseAway);
					self.getElementsByClassName('resize-block')[0].style.display = 'block';
					self.style.zIndex = '0';
					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					var todaysMilSec = 86400000 * (Number(self.style.top.split('px')[0]) - containerTop) / 888;
					var newStart = new Date(zeroDate.getTime() + todaysMilSec);
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);
					var thisEvent = findById(vm.events, self.id);
					var newEnd = new Date(newStart.getTime() + (new Date(thisEvent.end) - new Date(thisEvent.start)));
					alert('newStart: ' + newStart + ';\nnewEnd: ' + newEnd);
					var newElement = {
						start: newStart,
						end: newEnd
					};
					DailyCalendarService.updateEvent(self.id, newElement);
				}


				function trackMouse(e){
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
					var topValue = self.style.top.split('px');
					topValue = Number(topValue[0]);

					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) > Number(self.style.top.split('px')[0]))
						if (Number(self.style.top.split('px')[0]) < ((containerTop + 888 - Number(self.style.height.split('px')[0])).toPrecision(3))){
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';
						}

					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) < Number(self.style.top.split('px')[0]))
						if (Number(self.style.top.split('px')[0]) > containerTop)
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';

					if (Number(self.style.top.split('px')[0]) < containerTop)
						self.style.top = containerTop + 'px';

					if (Number(self.style.top.split('px')[0]) > ((containerTop + 888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
						self.style.top = containerTop + 888 - Number(self.style.height.split('px')[0]).toPrecision(3) + 'px';
				}

				self.addEventListener('mousemove', trackMouse);
				self.addEventListener('mouseup', mouseAway);
				self.addEventListener('mouseleave', mouseAway);
			});
		}

		var resizeBlocks = document.getElementsByClassName('resize-block');

		for(var n = 0; n < resizeBlocks.length; n++) {
			resizeBlocks[n].addEventListener('mousedown', function(e) {
				e.stopPropagation();

				var self = this;
				var parent = self.parentNode;
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

				function resizeMouseAway() {
					self.removeEventListener('mousemove', resizeTrackMouse);
					self.removeEventListener('mouseup', resizeMouseAway);
					self.removeEventListener('mouseleave', resizeMouseAway);

					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					var todaysMilSec = 86400000 * (Number(parent.style.top.split('px')[0]) - containerTop) / 888;
					var newStart = new Date(zeroDate.getTime() + todaysMilSec);
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);
					var newEnd = new Date(newStart.getTime() + 86400000 * Number(parent.style.height.split('px')[0]) / 888);
					newEnd.setSeconds(0);
					newEnd.setMilliseconds(0);
					alert('newStart: ' + newStart + ';\nnewEnd: ' + newEnd);
					var newElement = {
						start: newStart,
						end: newEnd
					};
					DailyCalendarService.updateEvent(parent.id, newElement);
				}

				function resizeTrackMouse(e) {
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
					
					if(changedMouseY > mouseY)
						if(Number(parent.style.height.split('px')[0]) + Number(parent.style.top.split('px')[0]) < containerTop + 888)
							parent.style.height = Number(parent.style.height.split('px')[0]) + changedMouseY - mouseY + 'px';

					if(changedMouseY < mouseY)
						if(Number(parent.style.height.split('px')[0]) > 888 / 4 / 24)
							parent.style.height = Number(parent.style.height.split('px')[0]) - mouseY + changedMouseY + 'px';
				}
				self.addEventListener('mousemove', resizeTrackMouse);
				self.addEventListener('mouseup', resizeMouseAway);
				self.addEventListener('mouseleave', resizeMouseAway);
			}, true);
		}
	});

	vm.showDay = function(step) {
		var date = new Date(vm.selectedDate);

		date.setDate(
			step === 1 ?
				date.getDate() + 1
					:
				date.getDate() - 1
		);

		vm.selectedDate = date;
	};

	vm.showDate = function() {
		console.log(vm.selectedDate);
	};

	vm.toggleModal = function() {
		vm.modalShown = !vm.modalShown;
	};

	vm.showCloseModal = function() {
		vm.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'templates/dailyCalendar/editEventTemplate.html',
			controller: 'ModalController',
			controllerAs: 'ModalCtrl',
			bindToController: true,
			resolve: {
				rooms: function () {
					return vm.availableRooms;
				},
				devices: function () {
					return vm.availableInventory;
				},
				users: function () {
					return vm.users;
				},
				selectedDate: function () {
					return vm.selectedDate;
				},
				eventTypes: function () {
					return vm.eventTypes;
				},
			}
		});
	};

	init();

	function init() {

		vm.timeStamps = DailyCalendarService.getTimeStamps();
		var todayDate = new Date();

		vm.selectedDate = vm.selectedDate || todayDate;
		vm.eventSelected = false;
		vm.modalShown = false;
		vm.sidebarStyle = true;

		//will be pulled from server 
		getRooms();
		getInventory();
		getUsers();
		getAllEvents();
		getEventTypes();
	}

	function getRooms() {
		DailyCalendarService.getAllRooms()
			.$promise.then(
				function(response) {
					console.log('success Total rooms: ', response.length);
					vm.availableRooms = response;
				},
				function(response) {
					console.log('failure', response);
				});
	}

	function getEventTypes() {
		DailyCalendarService.getAllEventTypes()
			.$promise.then(
				function(response) {
					console.log('success Current number of types: ', response.length);
					vm.eventTypes = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function getAllEvents() {
		DailyCalendarService.getAllEvents()
			.$promise.then(
				function(response) {
					console.log('success Number of Events: ', response.length);
					vm.allEvents = response;
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	//TODO: implement example approach to API calls
	// function getLatestCurrencyRateByCode(code, callback){
	// 		var fxRatesResource = $resource(appConfig.apiUrl + 'metadata/fx/:code', {code: code}, null);

	// 		if (currencies[code]){
	// 			return $q.resolve(currencies[code]);
	// 		} else {

	// 			return fxRatesResource.get().$promise.then(function(res){
	// 				currencies[code] = res;
	// 				return res;
	// 			}, function(error, status){
	// 				return $q.reject(error);
	// 			});	
	// 		}
	// 	}
	
}

app.directive('afterRender', ['$timeout', function ($timeout) {
	var def = {
		restrict: 'A',
		terminal: true,
		transclude: false,
		link: function (scope, element, attrs) {
			$timeout(scope.$eval(attrs.afterRender), 0);
		}
	};
	return def;
}]);
