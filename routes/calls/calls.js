var common = require('../common/common'),
	model = require('../../models/db'),
	CallLog = model.CallLog,
	CallType = model.CallType,
	Farmer = model.Farmer,
	Buyer = model.Buyer;

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
			.populate('ct_call_type')
			.sort('-cc_date')
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
 * Routes call creation based on an
 * entity type.
 * @param req
 * @param res
 */
exports.createCall = function(req, res){
	if(common.isAuthenticated(req, res)) {
		var call_log = new CallLog(req.body);
		switch(req.body.cc_entity_type) {
			case 'farmer': createFarmerCall(res,call_log);
				break;
			case 'buyer': createBuyerCall(res, call_log);
				break;
			case 'other': createOtherCall(res, call_log);
				break;
			default: console.log('Error');
				break;
		}
	}
};
/**
 * Creates a call for a farmer based on the
 * body of the POST request.
 * @param res
 * @param call_log
 */
function createFarmerCall(res, call_log){
	Farmer.findById(call_log.cc_entity_id, function(err, farmer){
		if(err || !farmer){
			common.handleDBError(err, res);
		}else{
			farmer.calls.push(call_log._id);
			call_log.save(function(err){
				if(err){
					common.handleDBError(err, res);
				}else{
					farmer.save(function(err){
						if(err){
							common.handleDBError(err, res);
						}else{
							res.send(call_log);
						}
					});
				}
			});
		}
	});
}
/**
 * Creates call for a buyer based on body of
 * POST request.
 * @param res
 * @param call_log
 */
function createBuyerCall(res,call_log){
	Buyer.findById(call_log.cc_entity_id, function(err, buyer){
		if(err || !buyer){
			common.handleDBError(err, res);
		} else {
			buyer.calls.push(call_log._id);
			call_log.save(function(err){
				if(err){
					common.handleDBError(err, res);
				}else{
					buyer.save(function(err){
						if(err){
							common.handleDBError(err, res);
						}else{
							res.send(call_log);
						}
					});
				}
			});
		}
	});
}
/**
 * Creates a call for an entity other than
 * a farmer or buyer.
 * @param res
 * @param call_log
 */
function createOtherCall(res, call_log){
  call_log.save(function(err){
	 if(err){
		 common.handleDBError(err, res);
	 }else{
		 res.send(call_log);
	 }
  });
}
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
			.exec(function(err, list){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(list);
				}
			});
	}
};
