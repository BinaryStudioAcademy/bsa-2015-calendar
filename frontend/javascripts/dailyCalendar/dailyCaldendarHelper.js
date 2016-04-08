var app = require('../app');

app.service('dailyCalendarHelper', dailyCalendarHelper);

dailyCalendarHelper.$inject = ['helpEventService'];

function dailyCalendarHelper(helpEventService) { 
 	var vm = this;
 	vm.todayEvents = null;
 	vm.computedEvents = [];
 	vm.groups = [];

 	var viewProps = {
		calendarHeight: 888,
		msInDay: 86400000,
		msIn5Min: 300000,
		msIn10Min: 600000

		//viewProps.msInDay
	};

 vm.sortEventsToGroups = function(events) {

		vm.groups = []; 
		//var grouppsCount = [];

		for(i = 0; i < events.length; i++){
			if(!vm.groups[events[i].conflictGroup]){
				vm.groups[events[i].conflictGroup] = 1;
			} else{
				vm.groups[events[i].conflictGroup]++;
			}

		}
		console.log('groups count', vm.groups);

		for(i = 0; i < events.length; i++){
			events[i].eventsInGroupCount = vm.groups[events[i].conflictGroup];
			// console.log('');
			// console.log('title', vm.computedEvents[i].eventAsItIs.title);
			// console.log('group: ', vm.computedEvents[i].conflictGroup);
			// console.log('divide by: ', vm.computedEvents[i].conflicts);
			// console.log('events in group: ', vm.computedEvents[i].eventsInGroupCount);
		}

		return vm.groups;

		//console.log('comp', vm.computedEvents);
		//console.log('filt', vm.todayEvents);
 };

 vm.addMouseDownEventListeners = function(blocks) {
	for(var k = 0; k < blocks.length; k++) {
		blocks[k].addEventListener('mousedown', function(e) {
			var self = this;
			// get Y value of the mouse 
			self.mouseY = e.offsetY === undefined ? e.layerY : e.offsetY;
			// set block z-index to 10 so it is upper than others and you can't touch them whil dragging
			self.style.zIndex = '10';
			// set resize block display to none so it can't do any problens for us while drugging
			

			if (e.button == 2){
				crudEvEventService.editingBroadcast(new Date(), vm.findById(vm.todayEvents, self.id), 'DayView');
				//e.stopPropagation();
				//e.preventDefault();
				return false;
			} else {
				// add event listeners while dragging for tracking mouse and updating dates if mouse leave block or mouse is up
				self.addEventListener.apply(self, ['mousemove', vm.trackMouse]);
				self.addEventListener.apply(self, ['mouseup', vm.mouseAway]);
				self.addEventListener.apply(self, ['mouseleave', vm.mouseAway]);
			}

		});
		// add event listener which move block with the title of the event on the block when you hover the event block
		blocks[k].addEventListener('mouseover', function(){
			this.getElementsByClassName('event-info')[0].style.marginTop = '-' + this.getElementsByClassName('event-info')[0].offsetHeight + 'px';
		});
	}

	//return blocks;

 };

 vm.findEventsInConflict = function(events, selectedDate) {
 		vm.todayEvents = events;
 		vm.computedEvents = [];

		for(i = 0; i < vm.todayEvents.length; i++){
			vm.todayEvents[i].conflictGroup = undefined;
		}

		//computing top and height values for all geted events
		for (var i = 0; i < vm.todayEvents.length; i++) {
			// temp - object to save top and height values for further event displaying
			var temp = {};
			var eventEnd = new Date(vm.todayEvents[i].end);
			var eventStart = new Date(vm.todayEvents[i].start);
			temp.eventAsItIs = vm.todayEvents[i];
			//temp.group = vm.todayEvents[i].group;
			// calculate height value(888 is the height of the table; 86400000 amount of milliseconds in the 24 hours)
			temp.heightVal = viewProps.calendarHeight * (eventEnd.getTime() - eventStart.getTime()) / viewProps.msInDay;

			var now = selectedDate;
			now.setHours(0,0,0,0);
			// calculate top value as difference between event start and beginning of the day
			temp.topVal = viewProps.calendarHeight * (eventStart.getTime() - now.getTime()) / viewProps.msInDay;
			// save computed values to the array

			temp.conflicts = 0;

			var conflictGroup = 1;
			var isInConflict = false;

			//temp.indexGroup = i;
			for (var x = 0; x < vm.todayEvents.length; x++){
				var range1 = moment().range(moment(vm.todayEvents[x].start), moment(vm.todayEvents[x].end));
				var range2 = moment().range(moment(temp.eventAsItIs.start), moment(temp.eventAsItIs.end));
        		//console.log(range1, range2);
            	if (range2.contains(moment(vm.todayEvents[x].end)) || range2.contains(moment(vm.todayEvents[x].start)) || range1.contains(moment(temp.eventAsItIs.start)) || range1.contains(moment(temp.eventAsItIs.end))){
            		isInConflict = true;
            		if(temp.conflictGroup && !vm.todayEvents[x].conflictGroup){
            			vm.todayEvents[x].conflictGroup = temp.conflictGroup;
            		}
             		if(!temp.conflictGroup && vm.todayEvents[x].conflictGroup){
            			temp.conflictGroup = vm.todayEvents[x].conflictGroup;
            		} 
            		if(!temp.conflictGroup && !vm.todayEvents[x].conflictGroup){
            			//conflictGroup++;
            			vm.todayEvents[x].conflictGroup = conflictGroup;
            			temp.conflictGroup = conflictGroup;
            		}

            		temp.conflicts++;
            	} else{
            		//if(isInConflict){
            			isInConflict = false;
            			conflictGroup++;
            		//}
            	}
			}

			vm.computedEvents.push(temp);
		}

		return vm.computedEvents;
 };

 vm.generateEventsBlocks = function(events) {
 		var currentGroup;
		var currentGroupCounter = [];

		var eventsBlocks = [];



		//creating and appending blocks which display events for today
		for(var c = 0; c < events.length; c++) {

			// block is the div which represents the whole event
			// resizeBlock is a little block in the bottom of event block which is created for resizeing event
			// paragraph - small block which appears on event hover and contain title of the event
			var eventBlock = document.createElement('div');
			var resizeBottom = document.createElement('div');
			var resizeTop = document.createElement('div');
			var eventTitle = document.createElement('div');
			var icon = document.createElement('div');

			// setting content, class as styles for paragraph
			//paragraph.innerHTML = events[c].eventAsItIs.description;
			eventTitle.className = 'event-info';
			eventTitle.style.width = '80%';
			eventTitle.style.float = 'left';	
			eventTitle.style.opacity = '1';
			eventTitle.style.color = 'black';
			eventTitle.style.display = 'none';

			// setting computed top and height values for event block, and id so in the future we could use it for updating dates
			eventBlock.className = 'day-event-blocks';
			eventBlock.innerHTML = events[c].eventAsItIs.title;
			eventBlock.style['font-weight'] = 900;
			eventBlock.style['text-align'] = 'center';
			eventBlock.style['font-color'] = 'black';
			var tmpWidth = 93/events[c].eventsInGroupCount;

			var event = events[c];

			if(!currentGroupCounter[event.conflictGroup]){
				//currentGroup = event.conflictGroup;
				currentGroupCounter[event.conflictGroup] = 1;
			} else{
				currentGroupCounter[event.conflictGroup]++;
			}
			
			var tmpLeft = currentGroupCounter[event.conflictGroup]*tmpWidth - (tmpWidth);

			eventBlock.style['margin-left'] = '7%';
			eventBlock.style.left = tmpLeft + '%'; 
			eventBlock.style.width = tmpWidth + '%';
			eventBlock.style.height = events[c].heightVal.toPrecision(3) + 'px';
			eventBlock.style.top = events[c].topVal.toPrecision(4) + 'px';
			eventBlock.id = events[c].eventAsItIs._id;
			if(events[c].eventAsItIs.type.color){
				eventBlock.style.background = events[c].eventAsItIs.type.color;
			} else {
				eventBlock.style.background = 'grey';
			}

			if(events[c].eventAsItIs.type.icon){
				icon.className = events[c].eventAsItIs.type.icon.css;
				icon.style.width = '10%';
				icon.style.float = 'left';
				eventBlock.appendChild(icon);
			}			
			// setting styles for resize block

			var resizeBlocksStyle = {
				width: '100%',
				height: '10px',
				cursor: 's-resize',
				zIndex: '11',
				position: 'absolute'
			};

			for(var prop in resizeBlocksStyle) {
				resizeBottom.style[prop] = resizeBlocksStyle[prop];
				resizeTop.style[prop] = resizeBlocksStyle[prop];
			}

			resizeBottom.style.bottom = '-5px';
			resizeBottom.className = 'resize-block';

			resizeTop.style.top = '-5px';
			resizeTop.className = 'resize-block-top';

			// appending eventTitle and resize block inside event block and appending it to the table of hours
			eventBlock.appendChild(eventTitle);
			eventBlock.appendChild(resizeBottom);
			eventBlock.appendChild(resizeTop);
			eventsBlocks.push(eventBlock);
			//document.getElementById('day-events-place').appendChild(block);
		}

		return eventsBlocks;
 };


}