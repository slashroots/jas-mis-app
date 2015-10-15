/**
 * Created by matjames007 on 4/29/15.
 */
var model = require('../../models/db'),
 Address = model.Address,
 Parish = model.Parish,
 Farmer = model.Farmer,
 Buyer = model.Buyer,
 Unit = model.Unit,
 Demand = model.Demand,
 Crop = model.Crop,
 Commodity = model.Commodity,
 District = model.District,
 CallLog = model.CallLog,
 Transaction = model.Transaction,
 moment = require('moment');

/**
 *  Check if user is logged in.
 */
exports.isAuthenticated = function(req, res) {
    if(req.user) {
        return true;
    }
    res.status(401);
    res.send({error: 'Not Authenticated'});
    return false;
};

exports.isAdmin = function(req, res) {
    if(req.user) {
        if(req.user.ut_user_type == 'Administrator') {
            return true;
        }
    }
    res.status(401);
    res.send({error: 'Not authorized'});
    return false;
};

/**
 * This is a generic helper function for MongoDB errors
 * that occur during searching/creating/updating a document.
 *
 * TODO: move this into a util library
 *
 * @param err
 * @param res
 */
exports.handleDBError = function(err, res) {
    if(err) {
        if (err.name == "ValidationError") {
            res.status(400);
            res.send(err);
        } else if (err.name == "CastError") {
            res.status(400);
            res.send(err);
        } else if(err.name == "Not Found") {
            res.status(404);
            res.send(err);
        } else {
            res.status(500);
            res.send(err);
        }
    } else {
        res.status(500);
        res.send({error: 'Unknown Server Error'});
    }
};
/**
 * Handles errors encountered by sending email.
 * TODO - handle specific error messages better.
 * Note - The api docs seems lacking in this regard.
 * @param err
 * @param res
 */
exports.handleEmailError = function(err, res){
   if(err){
       res.status(500);
       res.send({error: 'Unknown Server Error'});
   }
};
regexSearchTermCreator = function (list) {
    regList = [];
    for(var i in list) {
        regList.push(new RegExp(list[i],'i'));
    }
    return regList;
};

exports.regexSearchTermCreator = regexSearchTermCreator;


/**
 * Allows for the creation of an address.  Takes information
 * from the request body and stores it directly to the DB.
 *
 * @param req
 * @param res
 */
exports.createAddress = function(req, res) {
    var address = new Address(req.body);
    address.save(function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(item);
        }
    });
};

/**
 * Allows for the creation of a Parish.  Takes information
 * from the request body and stores it directly to the DB.
 *
 * @param req
 * @param res
 */
exports.createParish = function(req, res) {
    if(exports.isAdmin(req, res)) {
        var parish = new Parish(req.body);
        parish.save(function (err, item) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Get All Parishes stored in the DB
 * @param req
 * @param res
 */
exports.getParishes = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        Parish.find(req.query).sort('-pa_parish_code').exec(function (err, items) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(items);
            }
        });
    }
};

/**
 * Search for an address by an id supplied in the params.
 *
 * @param req
 * @param res
 */
exports.getAddressById = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        Address.findById(req.params.id, function (err, item) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Update and address given the ID in the request parameter and
 * the fields in the request body.
 *
 * @param req
 * @param res
 */
exports.updateAddressById = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        Address.update({_id: req.params.id}, req.body, function (err, status) {
            if (err) {
                handleDBError(err, res);
            } else {
                if (status.nModified != 0) {
                    res.send(status);
                } else {
                    res.status(404);
                    res.send({error: "Not Found"});
                }
            }
        });
    }
};

/**
 * This function always expects the searchTerm Parameter! It searches for the following entities:
 * farmers, buyers, crops (and their demands and commodities).  It searches for the best matches
 * of various entity attributes.
 * @param req
 * @param res
 */
exports.searchAll = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        if ("searchTerms" in req.query) {
            /**
             * Creates a list of regular expression terms to search by
             */
            var list = regexSearchTermCreator(req.query.searchTerms.toUpperCase().split(" "));

            /**
             * First search attributes (first and last names and jas number) for any matches to
             * the regular expression
             */
            Farmer.find({
                $or: [
                    {fa_first_name: {$in: list}},
                    {fa_last_name: {$in: list}},
                    {fa_jas_number: {$in: list}}
                ]
            }).populate('ad_address').limit(10)
                .exec(function (err, farmers) {
                    if (err) {
                        this.handleDBError(err, res);
                    } else {

                        /**
                         * Search for buyers who's name, phone number and/or email matches the
                         * regex pattern in `list`
                         */
                        Buyer.find({
                            $or: [
                                {bu_buyer_name: {$in: list}},
                                {bu_phone: {$in: list}},
                                {bu_email: {$in: list}}
                            ]
                        }).populate('ad_address bt_buyer_type').limit(10)
                            .exec(function (err2, buyers) {
                                if (err2) {
                                    this.handleDBError(err, res);
                                } else {
                                    var curr_date = Date.now();

                                    /**
                                     * Search for all the crops who's name or variety matches
                                     * the regex pattern supplied
                                     */
                                    Crop.find({
                                        $or: [
                                            {cr_crop_name: {$in: list}},
                                            {cr_crop_variety: {$in: list}}
                                        ]
                                    }).select('_id')
                                        .exec(function (crop_error, crops) {
                                            if (crop_error) {
                                                this.handleDBError(crop_error, res);
                                            } else {

                                                /**
                                                 * Using the crops identified display their active
                                                 * demands based on today's date.
                                                 */
                                                Demand.find({
                                                    de_until: {$gte: curr_date},
                                                    $or: [
                                                        {cr_crop: {$in: crops}}
                                                    ]
                                                })
                                                    .populate('cr_crop bu_buyer')
                                                    .limit(10)
                                                    .sort('de_posting_date bu_buyer.bu_buyer_name')
                                                    .exec(function (err, demands) {
                                                        if (err) {
                                                            this.handleDBError(err, res);
                                                        } else {

                                                            /**
                                                             * Using the crops identified display their
                                                             * active Commodities based on today's date
                                                             */
                                                            Commodity.find({
                                                                co_until: {$gte: curr_date},
                                                                $or: [
                                                                    {cr_crop: {$in: crops}}
                                                                ]
                                                            }).populate('cr_crop fa_farmer')
                                                                .limit(10)
                                                                .sort('co_posting_date fa_farmer.fa_last_name')
                                                                .exec(function (com_error, commodities) {
                                                                    if (com_error) {
                                                                        this.handleDBError(com_error, res);
                                                                    } else {

                                                                        /**
                                                                         * Submit the matching entities to the
                                                                         * user.
                                                                         * @type {{farmers: *, buyers: *, demands: *, commodities: *}}
                                                                         */
                                                                        var result = {
                                                                            'farmers': farmers,
                                                                            'buyers': buyers,
                                                                            'demands': demands,
                                                                            'commodities': commodities
                                                                        };
                                                                        res.send(result);
                                                                    }
                                                                })
                                                        }
                                                    });
                                            }
                                        });
                                }
                            })
                    }
                });
        } else {
            res.send({});
        }
    }
};



/**
 * Captures the units and stores it to mongo.  Mongo does the validation.
 * @param req
 * @param res
 */
exports.createUnit = function(req, res) {
    if(exports.isAdmin(req, res)) {
        var unit = new Unit(req.body);
        unit.save(function (err) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(unit);
            }
        });
    }
};

/**
 * Retrieves the units allows for search based on req.query.
 * @param req
 * @param res
 */
exports.findUnits = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        Unit.find(req.query, function (err, list) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(list);
            }
        });
    }
};

/**
 * This allows a user to search for a district based on a given search parameter
 * called "beginsWith" otherwise it matches based on exact names.
 * @param req
 * @param res
 */
exports.getDistricts = function(req, res) {
    if(exports.isAuthenticated(req, res)) {
        var query = req.query;
        if ("beginsWith" in req.query) {
            query = {
                $or: [
                    {di_extension_name: new RegExp(req.query.beginsWith, 'i')},
                    {di_district_name: new RegExp(req.query.beginsWith, 'i')}
                ]
            };
        }
        District.find(query)
            .sort('di_extension_name')
            .exec(function (err, list) {
                if (err) {
                    handleDBError(err, res);
                } else {
                    res.send(list);
                }
            });
    }
};


/**
 * Quick and dirty batch import. Expects JSON array.
 * @param req
 * @param res
 */
exports.batchPushDistricts = function(req, res) {
    var districtsArray = [];

    for(i in req.body) {
        districtsArray.push(new District(req.body[i]));
    }
    District.create(districtsArray, function(err, list) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send("Success!");
        }
    })
};
/**
 * Generates the dashboard performance metrics from the database
 * by counting the number of calls, demands or transactions
 * made within a period of time.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
exports.getStats = function(req, res){
  var start_of_prev_week = moment().startOf('day').day(1).subtract(7, 'days'),
      last_week = moment().day(moment().day()).subtract(7, 'days'),
      current_week = moment().startOf('week'),
      today = moment(),
      prev_week_query = {$gte: start_of_prev_week.toDate(), $lt:last_week.toDate()},
      current_week_query = {$gte: current_week.toDate(), $lt:today.toDate()};
  CallLog.count({cc_date: prev_week_query}).exec(function(err, prev_call_count){
    if(err){
      handleDBError(err, res);
    }else{
      CallLog.count({cc_date: current_week_query}).exec(function(err, current_call_count){
        if(err){
          handleDBError(err, res);
        }else{
          Transaction
          .count({tr_status: 'Completed', tr_date_created: prev_week_query})
          .exec(function(err, prev_completed_trans_count){
            if(err){
              handleDBError(err, res);
            }else{
              Transaction
                .count({tr_status: 'Completed', tr_date_created: current_week_query})
                 .exec(function(err, current_completed_trans_count){
                    if(err){
                      handleDBError(err, res);
                    }else{
                      Transaction
                      .count({ $or: [{tr_status: 'Pending'}, {tr_status: 'Waiting'}]})
                      .and([{tr_date_created: prev_week_query}])
                      .exec(function(err, prev_pending_trans_count){
                        if(err){
                            handleDBError(err, res);
                        }else{
                          Transaction
                            .count({ $or: [{tr_status: 'Pending'}, {tr_status: 'Waiting'}]})
                            .and([{tr_date_created: current_week_query}])
                            .exec(function(err, current_pending_trans_count){
                              if(err){
                                handleDBError(err, res);
                              }else{
                                Demand.count({de_posting_date: prev_week_query})
                                      .exec(function(err, prev_demand_count){
                                        if(err){
                                          handleDBError(err, res);
                                        }else{
                                          Demand.count({de_posting_date: current_week_query})
                                                .exec(function(err, current_demand_count){
                                                  if(err){
                                                    handleDBError(err, res);
                                                  }else{
                                                    var stats = { demand: {current_week: current_demand_count,
                                                                            previous_week: prev_demand_count },
                                                                  pending_trans: {current_week: current_pending_trans_count,
                                                                                    previous_week: prev_pending_trans_count},
                                                                  completed_trans: { current_week: current_completed_trans_count,
                                                                                      previous_week: prev_completed_trans_count },
                                                                  call: { current_week: current_call_count,
                                                                          previous_week: prev_call_count }}//end of object

                                                   formatandSendStats(stats, res);
                                                  }
                                                })
                                        }
                                      })
                              }
                            })
                        }
                      })
                    }
                  });
            }
          });
        }
      });
    }
  });
}
/**
 * Determines if there has been any change week on week
 * for performance metrics.
 * @param  {[type]} stats Calculated performance metrics
 * @param  {[type]} res   [description]
 */
formatandSendStats = function(stats, res){
  stats.demand.changes = getStatisticChange(stats.demand.current_week, stats.demand.previous_week);
  stats.pending_trans.changes = getStatisticChange(stats.pending_trans.current_week, stats.pending_trans.previous_week);
  stats.completed_trans.changes = getStatisticChange(stats.completed_trans.current_week, stats.completed_trans.previous_week);
  stats.call.changes = getStatisticChange(stats.call.current_week, stats.call.previous_week);
  res.send(stats);
}
/**
 * Determines change in performance metrics. The function
 * attempts to return whether there is an increase, decrease or
 * no change in a performance metric.
 * @param  {[type]} current Current week's count of a particular metric
 * @param  {[type]} prev    Previous week's count of a particular metric
 */
getStatisticChange = function(current, prev){
  var stat_change = {};
  current === prev ? stat_change.change = "none" :
  current > prev ? stat_change.change = "increase" : stat_change.change = "decrease";
  stat_change.changed_by = Math.abs(current - prev);
  return stat_change;
}
