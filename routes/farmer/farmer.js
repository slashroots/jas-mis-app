/**
 * Created by matjames007 on 4/28/15.
 */

var model = require('../../models/db');

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
 * Retrieves all farmers based on the criteria given in the
 * request parameters.
 *
 * TODO: Need to ensure that this uses the request params!
 *
 * @param req
 * @param res
 */
exports.getFarmers = function(req, res) {
    model.Farmer.find(req.params, function(err, list) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};

/**
 * This function attempts to create the farmer based on the body of
 * the web service request.  MongoDB handles the validation of info.
 * @param req
 * @param res
 */
exports.createFarmer = function(req, res) {
    var farmer = new model.Farmer(req.body);
    farmer.save(function(err) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(farmer);
        }
    })
};

/**
 * Attempts to retrieve document based on the document _id.
 * @param req
 * @param res
 */
exports.getFarmerById = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(item) {
                res.send(item);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    })
};

/**
 * Attempt to update/upsert farmer given an id in the req.params
 * @param req
 * @param res
 */
exports.updateFarmerById = function(req, res) {
    model.Farmer.update({_id: req.params.id}, req.body, function(err, response) {
        if(err) {
            handleDBError(err, res);
        } else {
            //check if any document got modified
            if(response.nModified != 0) {
                res.send(response);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    })
};