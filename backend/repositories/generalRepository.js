var Event = require('../schemas/eventSchema');
var Plan = require('../schemas/planSchema');


var Repository = function(){

};

Repository.prototype.add = function(data, callback){
	console.log('repository', data);
	var model = this.model;
	var newitem = new model(data);
	newitem.save(callback);
};

Repository.prototype.update = function(id, body, callback){
	var query = this.model.update({_id:id}, body);
	query.exec(callback);
};

Repository.prototype.delete = function(id, callback){
	var model = this.model;
	var query = model.remove({_id:id});
	query.exec(callback);
};

Repository.prototype.getAll = function(callback){
	var model = this.model;
	var query = model.find();
	query.exec(callback);
};

Repository.prototype.getById = function(id, callback){
	var model = this.model;
	var query = model.findOne({_id:id});
	query.exec(callback);
};

Repository.prototype.getByDateStart = function(date, callback){
	var model = this.model;
	var query = model.findOne({dateStart:date});
	query.exec(callback);
};

Repository.prototype.getByDateEnd = function(date, callback){
	var model = this.model;
	var query = model.findOne({dateEnd:date});
	query.exec(callback);
};

Repository.prototype.getByInterval = function(gteDate,lteDate, callback){
	var model = this.model;
	var query = model.find( {"start": {"$gte": gteDate, "$lte": lteDate}});
	query.exec(callback);
};

Repository.prototype.searchByTitle = function(title, callback){
	var model = this.model;
	var query = model.findOne({title:title});
	query.exec(callback);
};


module.exports = Repository;