/**
 * Created by matjames007 on 4/29/15.
 */
var model = require('../../models/db');
var Address = model.Address;
var Parish = model.Parish;
var Farmer = model.Farmer;
var Buyer = model.Buyer;
var Unit = model.Unit;
var Demand = model.Demand;
var Crop = model.Crop;
var Commodity = model.Commodity;

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
    var parish = new Parish(req.body);
    parish.save(function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(item);
        }
    });
};

/**
 * Get All Parishes stored in the DB
 * @param req
 * @param res
 */
exports.getParishes = function(req, res) {
    Parish.find(req.query).sort('-pa_parish_code').exec( function(err, items) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(items);
        }
    });
};

/**
 * Search for an address by an id supplied in the params.
 *
 * @param req
 * @param res
 */
exports.getAddressById = function(req, res) {
    Address.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(item);
        }
    })
};

/**
 * Update and address given the ID in the request parameter and
 * the fields in the request body.
 *
 * @param req
 * @param res
 */
exports.updateAddressById = function(req, res) {
    Address.update({_id: req.params.id}, req.body, function(err, status) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(status.nModified != 0) {
                res.send(status);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    });
};

/**
 * This function always expects the searchTerm Parameter! It searches for the following entities:
 * farmers, buyers, crops (and their demands and commodities).  It searches for the best matches
 * of various entity attributes.
 * @param req
 * @param res
 */
exports.searchAll = function(req, res) {
    if("searchTerms" in req.query) {
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
                        .exec(function(err2, buyers) {
                            if(err2) {
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
                                    .exec(function(crop_error, crops) {
                                        if(crop_error) {
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
                                                            co_until: {$gte: curr_date}
                                                        }).populate('cr_crop fa_farmer')
                                                            .limit(10)
                                                            .sort('co_posting_date fa_farmer.fa_last_name')
                                                            .exec(function (com_error, commodities) {
                                                                if(com_error) {
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
        this.handleDBError({name: 'Not Found'}, res);
    }
};



/**
 * Captures the units and stores it to mongo.  Mongo does the validation.
 * @param req
 * @param res
 */
exports.createUnit = function(req, res) {
    var unit = new Unit(req.body);
    unit.save(function(err) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(unit);
        }
    })
};

/**
 * Retrieves the units allows for search based on req.query.
 * @param req
 * @param res
 */
exports.findUnits = function(req, res) {
    Unit.find(req.query, function(err, list) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(list);
        }
    });
};