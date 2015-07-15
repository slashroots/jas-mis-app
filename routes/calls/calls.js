var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLogSchema;

exports.getCallsByUserId = function(req, res){
	console.log(req.body);
}

exports.createCall = function(req, res){
	console.log(req.body);
}