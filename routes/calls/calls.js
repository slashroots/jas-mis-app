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
/**
*
* Creates a call type based on the body of the
* POST request
* @param req
* @param res
*
**/
exports.createCallType = function(req, res){
	if(common.isAdmin(req, res)){
		new CallType(req.body).save(function(err){
			if(err){
				common.handleDBError(err, res);
			}else{
				res.send(call_type);
			}
		});
	}
};
/**
*
* Gets all call types
* @param req
* @param res
*
**/
exports.getCallTypes = function(req, res){
	if(common.isAuthenticated(req, res)){
		CallType.find()
			//.populate('us_user_id')
			.exec(function(err, list){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(list);
				}
		});
	}
};

