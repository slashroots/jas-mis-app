var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLog;

exports.getCallsByUserId = function(req, res){
	console.log(req.params.id);
	res.end();
}

exports.createCall = function(req, res){
	console.log(req.body);
	var call = new CallLog(req.body);
	call.save(function(err){
		if(err){
			common.handleDBError(err, res);
		}else{
			res.send(call);
		}
	});
	// console.log("=====");
	// console.log(call_log);
	// res.send(call_log);
}