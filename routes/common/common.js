/**
 * Created by matjames007 on 4/29/15.
 */
var model = require('../../models/db');
var Address = model.Address;
var Parish = model.Parish;
var Farmer = model.Farmer;
var Buyer = model.Buyer;


/**
 * This is a generic helper function for MongoDB errors
 * that occur during searching/creating/updating a document.
 * @param err
 * @param res
 */
handleDBError = function(err, res) {
    if(err.name == "ValidationError") {
        res.status(400);
        res.send(err);
    } else if(err.name == "CastError") {
        res.status(400);
        res.send(err);
    } else {
        res.status(500);
        res.send(err);
    }
};

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
 * This function always expects the searchTerm Parameter!
 * @param req
 * @param res
 */
exports.searchAll = function(req, res) {
    if("searchTerms" in req.query) {
        var list = req.query.searchTerms.toUpperCase().split(" ");
        Farmer.find({
            $or: [
                {fa_first_name: {$in: list}},
                {fa_last_name: {$in: list}},
                {fa_jas_number: {$in: list}}
            ]
        }).populate('ad_address').limit(10)
            .exec(function (err, farmers) {
                if (err) {
                    handleDBError(err, res);
                } else {
                    Buyer.find({
                        $or: [
                            {bu_buyer_name: {$in: list}},
                            {bu_email: {$in: list}}
                        ]
                    }).populate('ad_address').limit(10)
                        .exec(function(err2, buyers) {
                            if(err2) {
                                handleDBError(err, res);
                            } else {
                                var result = {
                                    'farmers': farmers,
                                    'buyers': buyers
                                };
                                res.send(result);
                            }
                        })
                }
            });
    } else {
        res.send({farmers:[],buyers:[],transaction:[], calls:[]});
    }
};