var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLogSchema;

exports.getCallsByUserId = function(req, res){
	console.log(req.params.id);
	res.end();
}

exports.createCall = function(req, res){
	console.log(req.body);
	res.end();
}