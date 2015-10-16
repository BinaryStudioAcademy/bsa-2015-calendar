var app = require('../app');
/*var repository = require('../../../backend/repositories/eventRepository');
var mongoose = require('mongoose');
var async = require('async');
var casual = require('casual');*/
app.factory('EventsCalendarService',  ['$resource', EventsCalendarService]);

EventsCalendarService.$inject = ['$resource'];

function EventsCalendarService($resource) {
	/*repository.add({title: 'title1', description: 'description1', start: new Date(), end: new Date()});
	repository.add({title: 'title2', description: 'description2', start: new Date(), end: new Date()});
	repository.add({title: 'title3', description: 'description3', start: new Date(), end: new Date()});*/
	function getEvents(){
		var Events = $resource('api/event/', {});
		return Events.get({});
	}

	return {
		getEvents: getEvents
	};
}