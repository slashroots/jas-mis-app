/**
 * This is intended to enable any logic/control for
 * any operations on a buyer.  All functions here
 * are used by endpoints in the buyer_routes.js
 * file and must ensure that appropriate validations
 * are done.
 *
 * Created by matjames007 on 5/12/15.
 */
var common = require('../common/common');
var model = require('../../models/db');
var Buyer = model.Buyer;
var BuyerType = model.BuyerType;
var Representative = model.Representative;
var Demand = model.Demand;
var Commodity = model.Commodity;


/**
 * Retrieves all buyers based on the criteria given in the
 * request parameters. If the parameter "searchTerms" is present
 * in the req.query object then it will do a match to facilitate
 * the search engine of the front end application.
 *
 * TODO: Need to ensure that this uses the request params!
 *
 * @param req
 * @param res
 */
exports.getBuyers = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query;
        if ("searchTerms" in req.query) {
            var list = common.regexSearchTermCreator(req.query.searchTerms.toUpperCase().split(" "));
            query = {
                $or: [
                    {bu_buyer_name: {$in: list}},
                    {bu_phone: {$in: list}},
                    {bu_email: {$in: list}}
                ]
            };
        } else {
            query = req.query;
        }

        Buyer.find(query)
            .populate('ad_address bt_buyer_type')
            .exec(function (err, docs) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(docs);
                }
            });
    }
};

/**
 * This function attempts to create the buyer based on the body of
 * the web service request.  MongoDB handles the validation of info.
 * @param req
 * @param res
 */
exports.createBuyer = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        console.log(req.body);
        var address = new model.Address(req.body.ad_address);
        address.save(function (err) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                var buyer = new Buyer(req.body);
                buyer.ad_address = address._id;
                buyer.save(function (err2) {
                    if (err2) {
                        common.handleDBError(err2, res);
                    } else {
                        res.send(buyer);
                    }
                })
            }
        });
    }
};

/**
 * Attempts to retrieve document based on the document _id.
 * @param req
 * @param res
 */
exports.getBuyerById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Buyer.findById(req.params.id)
            .populate('ad_address bt_buyer_type')
            .exec(function (err, item) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    if (item) {
                        res.send(item);
                    } else {
                        res.status(404);
                        res.send({error: "Not Found"});
                    }
                }
            });
    }
};


/**
 * Attempt to update buyer given an id in the req.params
 *
 * TODO: How do I handle the updating of a buyer_type?
 *
 * @param req
 * @param res
 */
exports.updateBuyerById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Buyer.update({_id: req.params.id}, req.body, function (err, response) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                //update the address
                model.Address.update({_id: req.body.ad_address._id}, req.body.ad_address,
                    function (err2, response2) {
                        if (err2) {
                            common.handleDBError(err2, res);
                        } else {
                            res.send(req.body);
                        }
                    });
            }
        });
    }
};

/**
 * Create New Buyer Type. Validation done by DB.
 * @param req
 * @param res
 */
exports.createBuyerType = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var bt = new BuyerType(req.body);
        bt.save(function (err, item) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Retrieve all buyer types.
 *
 * @param req
 * @param res
 */
exports.getBuyerTypes = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        BuyerType.find(req.query, function (err, list) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(list);
            }
        });
    }
};

/**
 * A representative can be added to a particular company.
 * This function pushes a new rep into the buyer object.
 * @param req
 * @param res
 */
exports.addNewRep = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var rep = new Representative(req.body);
        Buyer.findById(req.params.id, function (err, buyer) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                buyer.re_representatives.push(rep);
                buyer.save(function (err2) {
                    if (err2) {
                        common.handleDBError(err2, res);
                    } else {
                        res.send(buyer);
                    }
                })
            }
        });
    }
};

/**
 * Adds a new demand to the buyer object.  Returns the buyer
 * object to the requester.
 *
 * @param req
 * @param res
 */
exports.addNewDemand = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var demand = new Demand(req.body);
        demand.bu_buyer = req.params.id;
        demand.save(function (err, item) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Retrieve buyer's demands.
 * @param req
 * @param res
 */
exports.getDemands = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Demand.find({bu_buyer: req.params.id})
            .populate('cr_crop bu_buyer')
            .exec(function (err, list) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(list);
                }
            });
    }
};

/**
 * Finds all the demands that haven't yet expired.
 * @param req
 * @param res
 */
exports.searchCurrentDemands = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var curr_date = Date.now();

        if (req.query.amount) {
            Demand.find({de_until: {$gte: curr_date}})
                .populate('cr_crop bu_buyer')
                .limit(req.query.amount)
                .sort('de_posting_date bu_buyer.bu_buyer_name')
                .exec(function (err, list) {
                    if (err) {
                        common.handleDBError(err, res);
                    } else {
                        res.send(list);
                    }
                });
        } else {
            Demand.find({de_until: {$gte: curr_date}})
                .populate('cr_crop bu_buyer')
                .sort('de_posting_date bu_buyer.bu_buyer_name')
                .exec(function (err, list) {
                    if (err) {
                        common.handleDBError(err, res);
                    } else {
                        res.send(list);
                    }
                });
        }
    }
};

/**
 * Find and return Commodities who's dates intersect with that of
 * the demand.  Also must be matching based on the crop type.  Return
 * that list sorted (desc) by the quantity.
 * @param req
 * @param res
 */
exports.findDemandMatch = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Demand.findById(req.params.id, function (err, demand) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                Commodity.find({
                    $and: [
                        {co_sold: false},
                        {co_until: {$gte: demand.de_posting_date}},
                        {co_availability_date: {$lte: demand.de_until}}
                    ],
                    cr_crop: demand.cr_crop
                }).populate('cr_crop fa_farmer')
                    .sort({co_quantity: 'desc'})
                    .exec(function (err2, list) {
                        if (err2) {
                            common.handleDBError(err2, list);
                        } else {
                            res.send(list);
                        }
                    });
            }
        });
    }
};

/**
 * This function finds the demand by id and populates the
 * associated buyer and crop.
 *
 * @param req
 * @param res
 */
exports.getDemand = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Demand.findById(req.params.id)
            .populate('cr_crop bu_buyer')
            .exec(function (err, demand) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(demand);
                }
            });
    }
};