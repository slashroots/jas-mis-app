var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLog;

/**
 * Search calls by query parameters
 * @param req
 * @param res
 */
exports.searchCalls = function(req, res){
	if(common.isAuthenticated(req, res)) {
		CallLog.find(req.query, function(err, list) {
			if(err) {
				common.handleDBError(err, res);
			} else {
				res.send(list);
			}
		});
	}
};
/**
 * Create a call based on the body of the
 * POST request
 *
 * @param req
 * @param res
 */
exports.createCall = function(req, res){
	if(common.isAuthenticated(req, res)) {
		console.log(req.body);
		var call = new CallLog(req.body);
		call.save(function(err){
			if(err){
				common.handleDBError(err, res);
			}else{
				res.send(call);
			}
		});
	}
};