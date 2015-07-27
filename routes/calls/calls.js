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
			.exec(function(err, list){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(list);
				}
			});
	}
};

//exports.searchCalls = function(req, res){
//	if(common.isAuthenticated(req, res)) {
//
//	}
//};
/**
 * Creates a call based on the body of the
 * POST request
 *
 * @param req
 * @param res
 */
exports.createCall = function(req, res){
	if(common.isAuthenticated(req, res)) {
		switch(req.body.cc_entity_type)
		{
			case 'farmer': Farmer.findById(req.body.cc_entity_id, function(err, farmer){
							if(err || !farmer){
								common.handleDBError(err, res);
							}else{
								var call_log = new CallLog(req.body);
								farmer.calls.push(call_log._id);
								farmer.save(function(err){
									if(err){
										common.handleDBError(err, res);
									}else{
										res.send(call_log);
									}
								});
							}
						});
				break;
			case 'buyer': Buyer.findById(req.body.cc_entity_id, function(err, buyer){
							if(err || !buyer){
								common.handleDBError(err, res);
							}else{
								var call_log = new CallLog(req.body);
								buyer.calls.push(call_log._id);
								buyer.save(function(err){
									if(err){
										common.handleDBError(err, res);
									}else{
										res.send(call_log);
									}
								});
							}
						});
				break;
			case 'other': new CallLog(req.body).save(function(err){
								if(err){
									common.handleDBError(err, res);
								}else{
									res.send(call_log);
								}
							});
				break;
			default: console.log('Error');
				break;
		}//end of switch
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
			.exec(function(err, list){
				if(err){
					common.handleDBError(err, res);
				}else{
					res.send(list);
				}
		});
	}
};
