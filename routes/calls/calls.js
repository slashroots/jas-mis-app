var common = require('../common/common');
var model = require('../../models/db');
var CallLog = model.CallLog;
var CallType = model.CallType;
/**
 * Search calls by query parameters. 
 * Each call is populated with a farmer 
 * object referenced by the cc_entity_id.
 * @param req
 * @param res
 */
exports.searchCalls = function(req, res){
	if(common.isAuthenticated(req, res)) {
		CallLog.find(req.query)
			.populate('cc_entity_id ct_call_type')
			.exec(function(err, list){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(list);
				}
			});
	}
};
/**
 * Creates a call based on the body of the
 * POST request
 *
 * @param req
 * @param res
 */
exports.createCall = function(req, res){
	if(common.isAuthenticated(req, res)) {
		var call_type = new CallType(req.body.call_type);
		call_type.save(function(err){
			var call = new CallLog(req.body);
			call.ct_call_type = call_type._id;
			call.save(function(err){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(call);
				}
			})
		});
	}
};