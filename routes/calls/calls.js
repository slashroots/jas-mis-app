var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLog;

exports.getCallsByUserId = function(req, res){
	console.log(req.params.id);
	res.end();
}

exports.createCall = function(req, res){
	console.log(req.body);
	var call_log = new CallLog(req.body);
	console.log("=====");
	console.log(call_log);
	res.send(call_log);
}