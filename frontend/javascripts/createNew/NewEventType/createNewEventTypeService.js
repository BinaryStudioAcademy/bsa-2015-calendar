var app = require('../../app');

app.factory('createNewEventTypeService', createNewEventTypeService);
createNewEventTypeService.$inject = ['$resource', '$http', 'Globals'];

function createNewEventTypeService($resource, $http, Globals) {
    dbEventTypesUrl = Globals.baseUrl + '/api/eventType/:id';
    var dbEventTypes = $resource(dbEventTypesUrl, null, {
        update: { method: 'put'},
        delete: { method: 'delete'}
    });

    var icons = [
        { css: null, name: 'None' },
        { css: 'fa fa-users', name: 'Meeting' },
        { css: 'fa fa-microphone', name: 'Speech' },        
        { css: 'fa fa-line-chart', name: 'Line chart' },
        { css: 'fa fa-plane', name: 'Plane' },
        { css: 'fa fa-birthday-cake', name: 'Birthay Cake' },
        { css: 'fa fa-code', name: 'Code' },
        { css: 'fa fa-cogs', name: 'Cogs' },
        { css: 'fa fa-film', name: 'Film' },
        { css: 'fa fa-television', name: 'Television' },
        { css: 'fa fa-pie-chart', name: 'Pie chart' },
        { css: 'fa fa-music', name: 'Music' },
        { css: 'fa fa-graduation-cap', name: 'Education' },
        { css: 'fa fa-futbol-o', name: 'Football' },
        { css: 'fa fa-coffee', name: 'Coffee' },
        { css: 'fa fa-bicycle', name: 'Bicycle' },
        { css: 'fa fa-heart', name: 'Heart' },
        { css: 'fa fa-beer', name: 'Beer' }
    ];

    function getIcons() {
        return icons;
    }


    var publicEvTypesUrl = Globals.baseUrl + '/api/eventTypePublicAndByOwner';
    var dbPublicEventTypesByOwner = $resource(publicEvTypesUrl, {});
    
    function getEventTypes() {
        return dbEventTypes.query();
    }

    function getEventTypesPublicByOwner() {
        return dbPublicEventTypesByOwner.query();
    }

    function saveEventType(newEventType) {
        return dbEventTypes.save(newEventType);
    }

    function updateEventType(eventType) {
        return dbEventTypes.update({id: eventType._id}, eventType);
    }

    function deleteEventType(eventType) {
        return dbEventTypes.delete({id: eventType._id});
    }

    return {
        getEventTypes: getEventTypes,
        getEventTypesPublicByOwner: getEventTypesPublicByOwner,
        saveEventType: saveEventType,
        updateEventType: updateEventType,
        deleteEventType: deleteEventType,
        getIcons: getIcons
    };
}