var app = require('../app');

app.controller('DayViewController', DayViewController);

DayViewController.$inject = ['DailyCalendarService', '$timeout', '$q', '$uibModal', 'socketService', '$rootScope'];

function DayViewController(DailyCalendarService, $timeout, $q, $uibModal, socketService, $rootScope) {

	var vm = this;
	
	vm.timeStamps = DailyCalendarService.getTimeStamps();
	var COLORS = [
		'#e21400', '#91580f', '#f8a700', '#f78b00',
		'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
		'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
		];
	var todayDate = new Date();
	vm.computedEvents = [];
	vm.selectedDate = vm.selectedDate || todayDate;
	vm.eventSelected = false;

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	vm.showDay = function(step) {
		var date = new Date(vm.selectedDate);

		date.setDate(
			step === 1 ?
				date.getDate() + 1
					:
				date.getDate() - 1
		);

		
		var children = $('.day-event-blocks');
		for(var i = 0; i < children.length; i++){
			var id = children[i].id;
			document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		}
		vm.computedEvents = [];
		vm.selectedDate = date;

		filterEventsByTodayDate();

		console.log(vm.todayEvents);

		mapEvents();

	};

	vm.rangeForEvents = function(num) {
		return new Array(num);
	};

	vm.getEventsByStart = function(index) {
		var eventArr = vm.todayEvents.filter(function (event) {
			var date = new Date(event.start);
			return date.getHours() === index;
		});
		return eventArr;
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


	// function gets array of event objects and return the one with _id == criteria
	function findById(array, criteria) {
		for(var i = 0; i < array.length; i++)
			if(array[i]._id == criteria)
				return array[i];
		return {};
	}

	// gets all the events that corrspond to the rodays date
	function mapEvents(){
		console.log('mapping');
		//computing top and height values for all geted events
		for(var i = 0; i < vm.todayEvents.length; i++) {
			// temp - object to save top and height values for further event displaying
			var temp = {};
			var eventEnd = new Date(vm.todayEvents[i].end);
			var eventStart = new Date(vm.todayEvents[i].start);
			temp.eventAsItIs = vm.todayEvents[i];
			// calculate height value(888 is the height of the table; 86400000 amount of milliseconds in the 24 hours)
			temp.heightVal = 888 * (eventEnd.getTime() - eventStart.getTime()) / 86400000;

			var now = vm.selectedDate;
			now.setHours(0,0,0,0);
			// calculate top value as difference between event start and beginning of the day
			temp.topVal = 888 * (eventStart.getTime() - now.getTime()) / 86400000;
			// save computed values to the array
			vm.computedEvents.push(temp);
			console.log('counting values');
		}
		console.log('vm.computedEvents: ' + vm.computedEvents.length);
		//creating and appending blocks which display events for today
		for(var c = 0; c < vm.computedEvents.length; c++) {

			// block is the div which represents the whole event
			// resizeBlock is a little block in the bottom of event block which is created for resizeing event
			// paragraph - small block which appears on event hover and contain title of the event
			var block = document.createElement('div');
			var resizeBlock = document.createElement('div');
			var paragraph = document.createElement('div');

			// setting content, class as styles for paragraph
			paragraph.innerHTML = vm.computedEvents[c].eventAsItIs.title;
			paragraph.className = 'event-info';
			paragraph.style.width = '85%';
			paragraph.style.float = 'right';	
			paragraph.style.opacity = '1';
			paragraph.style.color = 'black';
			paragraph.style.display = 'none';

			// setting computed top and height values for event block, and id so in the future we could use it for updating dates
			block.className = 'day-event-blocks';
			block.style.height = vm.computedEvents[c].heightVal.toPrecision(3) + 'px';
			block.style.top = vm.computedEvents[c].topVal.toPrecision(4) + 'px';
			block.id = vm.computedEvents[c].eventAsItIs._id;
			block.style.background = COLORS[getRandomInt(0, COLORS.length)];
			
			// setting styles for resize block
			resizeBlock.style.width = '100%';
			resizeBlock.style.bottom = '-7px';
			resizeBlock.style.height = '14px';
			resizeBlock.style.cursor = 's-resize';
			resizeBlock.style.zIndex = '11';
			resizeBlock.style.position = 'absolute';
			resizeBlock.className = 'resize-block';

			// appending paragraph and resize block inside event block and appending it to tha table of hours
			block.appendChild(paragraph);
			block.appendChild(resizeBlock);
			document.getElementById('day-events-place').appendChild(block);
		}

		// take all the events displayed
		var blocks = document.getElementsByClassName('day-event-blocks');
		// and in the loop put for all of the event listeners for 'mousedown' event
		for(var k = 0; k < blocks.length; k++) {
			blocks[k].addEventListener('mousedown', function(e) {
				var self = this;
				// get Y value of the mouse 
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
				// set block z-index to 10 so it is upper than others and you can't touch them whil dragging
				self.style.zIndex = '10';
				// set resize block display to none so it can't do any problens for us while drugging
				self.getElementsByClassName('resize-block')[0].style.display = 'none';

				// function which is called when mouse leave the event block on dragging, or simply drops it
				function mouseAway(){
					// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
					self.removeEventListener('mousemove', trackMouse);
					self.removeEventListener('mouseup', mouseAway);
					self.removeEventListener('mouseleave', mouseAway);
					// return resize block to normal view
					self.getElementsByClassName('resize-block')[0].style.display = 'block';
					// put event block to the same levels as others
					self.style.zIndex = '0';

					// create date that is equal to the beginnig of the day
					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					// calculate amount of milliseconds that is between the beginning of the day and new event start
					var todaysMilSec = 86400000 * (Number(self.style.top.split('px')[0])) / 888;

					// if the amount of millisecond can't be divided by five minutes we cut eat so it can be
					if(todaysMilSec % 300000 !== 0)
						todaysMilSec -= todaysMilSec % 300000;

					// set top property of the event block to the new values which can bi divided by 5 minutes
					self.style.top =  888 * todaysMilSec / 86400000 + 'px';
					// create newStart date which will be sent to the server after event drop
					var newStart = new Date(zeroDate.getTime() + todaysMilSec);
					// set seconds and milliseconds of the event to 0
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);
					// get event from the array to calculate its true duration
					var thisEvent = findById(vm.todayEvents, self.id);
					// calculating events end by the sum of start and calculated duration
					var newEnd = new Date(newStart.getTime() + (new Date(thisEvent.end) - new Date(thisEvent.start)));
					alert('newStart: ' + newStart + ';\nnewEnd: ' + newEnd);
					//object to send to the server for update
					var newElement = {
						start: newStart,
						end: newEnd
					};
					// send new dates to the server for uodating
					DailyCalendarService.updateEvent(self.id, newElement);
				}


				// function to track mouse y coordinate changes
				function trackMouse(e){
					// y coordinate of the moue after moving
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
					// current top value of the event blocks converted to number
					var topValue = self.style.top.split('px');
					topValue = Number(topValue[0]);

					// if mouse moved down
					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) > Number(self.style.top.split('px')[0]))
						// if event didn't reach the bottom of the table and we can asign it new top value which is bigger than previous
						// de facto, we move can move block down
						if (Number(self.style.top.split('px')[0]) < ((888 - Number(self.style.height.split('px')[0])).toPrecision(3))){
							// and we do it
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';
						}

					// if mouse moved up
					if ((topValue + ((topValue + changedMouseY) - (topValue + mouseY))) < Number(self.style.top.split('px')[0]))
						// if event didn't reach the top of the table and we can asign top value smaller than previous
						// de facte, we can move block up
						if (Number(self.style.top.split('px')[0]) > 0)
							// and we do it
							self.style.top = topValue + ((topValue + changedMouseY) - (topValue + mouseY))  + 'px';

					// if block is moved upper than upper boundary we move it to possible top value
					// other words if someone moved mouse very fast and it it's top value became -10px
					if (Number(self.style.top.split('px')[0]) < 0)
						// we set it to 0
						self.style.top = '0px';

					// if block is moved lower than lower boundary we move it to possible top value
					// other words if someone moved mouse very fast and it it's top value became 900px
					if (Number(self.style.top.split('px')[0]) > ((888 - Number(self.style.height.split('px')[0])).toPrecision(3)))
						// we set it to the (height of the table - height of the event) possible top value
						self.style.top = 888 - Number(self.style.height.split('px')[0]).toPrecision(3) + 'px';
				}

				// add event listeners while dragging for tracking mouse and updating dates if mouse leave block or mouse is up
				self.addEventListener('mousemove', trackMouse);
				self.addEventListener('mouseup', mouseAway);
				self.addEventListener('mouseleave', mouseAway);
			});
			// add event listener which move block with the title of the event on the block when you hover the event block
			blocks[k].addEventListener('mouseover', function(){
				this.getElementsByClassName('event-info')[0].style.marginTop = '-' + this.getElementsByClassName('event-info')[0].offsetHeight + 'px';
			});
		}

		// get an array of all the resize blocks
		var resizeBlocks = document.getElementsByClassName('resize-block');
		// in the loop put an event listener for each on mousedown event and handle event on capture event
		for(var n = 0; n < resizeBlocks.length; n++) {
			resizeBlocks[n].addEventListener('mousedown', function(e) {
				// stop continueing event handling
				// if comment next line the block can bu drugged while resizing
				e.stopPropagation();

				var self = this;
				// remember parent of the resize block(the event block) so we can update dates after resizing
				var parent = self.parentNode;
				// y coordinate of the mouse
				var mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;

				// method that handles when you leave resize block or make mouseup
				function resizeMouseAway() {
					// remove event listeners for tracking mousemove, mouseleave and mouseup so it would not track the mouse after we drop the block
					self.removeEventListener('mousemove', resizeTrackMouse);
					self.removeEventListener('mouseup', resizeMouseAway);
					self.removeEventListener('mouseleave', resizeMouseAway);

					// calculating the newStart date
					var zeroDate = new Date();
					zeroDate.setHours(0, 0, 0, 0);
					var todaysMilSec = 86400000 * (Number(parent.style.top.split('px')[0])) / 888;
					var newStart = new Date(zeroDate.getTime() + todaysMilSec);
					newStart.setSeconds(0);
					newStart.setMilliseconds(0);

					// calculating new height for the block after resizing
					var newHeight = 86400000 * Number(parent.style.height.split('px')[0]) / 888;
					// if now the duration of the event(height of the block) can't be divided by 5 minutes, make it dividible
					if(newHeight % 300000 !== 0) newHeight -= newHeight % 300000;
					// if duration is 10 minutes make it 15 minutes, cause 10 is too short
					if(newHeight === 600000) newHeight += 300000;
					// set the height of the corrsponding event block to the new duration
					parent.style.height = 888 * newHeight / 86400000 + 'px';
					// calculate new event end on the base of start and duration
					var newEnd = new Date(newStart.getTime() + newHeight);
					// remove seconds and mls
					newEnd.setSeconds(0);
					newEnd.setMilliseconds(0);
					alert('newStart: ' + newStart + ';\nnewEnd: ' + newEnd);
					// create object to send to the server with new dates
					var newElement = {
						start: newStart,
						end: newEnd
					};
					// update dates for event
					DailyCalendarService.updateEvent(parent.id, newElement);
				}

				// function which tracks mouse position and changes dynamically the height of the event block
				function resizeTrackMouse(e) {
					// new mouse y coordinate
					var changedMouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
					// if we move down
					if(changedMouseY > mouseY)
						// and it is still possible to increase the height of the event block
						if(Number(parent.style.height.split('px')[0]) + Number(parent.style.top.split('px')[0]) < 888)
							// we increase it
							parent.style.height = Number(parent.style.height.split('px')[0]) + changedMouseY - mouseY + 'px';

					// if we move up
					if(changedMouseY < mouseY)
						// and height is still bigger than one quarter of the hour(15 minutes)
						if(Number(parent.style.height.split('px')[0]) > 888 / 4 / 24)
							// we set new height to the event block
							parent.style.height = Number(parent.style.height.split('px')[0]) - mouseY + changedMouseY + 'px';
				}
				// add event listeners to the resize blocks whicl resizing
				self.addEventListener('mousemove', resizeTrackMouse);
				self.addEventListener('mouseup', resizeMouseAway);
				self.addEventListener('mouseleave', resizeMouseAway);
			}, true);
		}
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
					}
				);
		}

		function getInventory() {
			DailyCalendarService.getAllDevices()
				.$promise.then(
					function(response) {
						console.log('success Inventory items: ', response.length);
						vm.availableInventory = response;
					},
					function(response) {
						console.log('failure', response);
					}
				);
		}

		function getUsers() {
			DailyCalendarService.getAllUsers()
				.$promise.then(
					function(response) {
						console.log('success Number of Users: ', response.length);
						vm.users = response;
					},
					function(response) {
						console.log('failure', response);
					}
				);
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

					filterEventsByTodayDate();

					mapEvents();
				},
				function(response) {
					console.log('failure', response);
				}
			);
	}

	function filterEventsByTodayDate() {
		console.log('filter');
		vm.todayEvents = vm.allEvents.filter(function(event) {
			console.log(event);
			if(event.start) {
				var date = new Date(event.start);
				console.log(date.getDate());
				console.log(vm.selectedDate.getDate());
				return date.getDate() === vm.selectedDate.getDate();
			}
		});
	}

	function mapTimeStamps(timeSts, events) {
		var i,
			counter;

		for (i=0; i<timeSts.length; i+=1) {
			counter = 0;
			events.forEach(function (elem) {
				var evHour = new Date(elem.start).getHours();
				if (i===evHour) {
					counter+=1;
				}
			});
			if (counter > 0) {
				timeSts[i].hasEvents = true;
				timeSts[i].totalEvents = counter;
			} else {
				timeSts[i].hasEvents = false;
				timeSts[i].totalEvents = 0;
			}
		}
	}





	var flagsInDaily = [];

  $rootScope.$on('flagFromCalendar', function (event, agrs) {			//pull vm.flag from $rootScope.$broadcast
      var flagsFromCalendar = agrs.messege;
      console.log('flags from dailyCalendarController $rootScope.$on', flagsFromCalendar);
      flagsInDaily.length = 0;																		// rewriting flagsInDaily
			for (var i = 0; i < flagsFromCalendar.length; i++) {		
		      flagsInDaily.push(flagsFromCalendar[i]);
			}
  });


	vm.selectTypeEvent = function(event){														// if return true event show, if false event not show
		// console.log('oll flags in daily from Calendar', flagsInDaily);		
		for (var i = 0; i < flagsInDaily.length; i++) {		
			if (event.type == flagsInDaily[i]) return true;
		}
	};

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
	function showWorkHours() {
		
	}

	init();

	function init() {
		showWorkHours();
		getRooms();
		getInventory();
		getUsers();
		getAllEvents();
		getEventTypes();
	}
}