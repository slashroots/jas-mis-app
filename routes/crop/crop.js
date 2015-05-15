/**
 * Created by matjames007 on 5/14/15.
 */
var model = require('../../models/db');
var common = require('../common/common');
var Crop = model.Crop;

/**
 * Retrieve all crops based on query in the request.
 * @param req
 * @param res
 */
exports.findCrops = function(req, res) {
    Crop.find(req.query)
        .exec(function(err, list) {
            if(err) {
                common.handleDBError(err, res);
            } else {
                res.send(list);
            }
        })
};


/**
 * Create a crop based on the contents of the request body.
 * @param req
 * @param res
 */
exports.createCrop = function(req, res) {
    var crop = new Crop(req.body);
    crop.save(function(err, c) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(c);
        }
    });
};

/**
 * Based on the unique identifier of the crop we modify the
 * crop with the contents of the request body.  This function
 * sends the result of the modification.
 * @param req
 * @param res
 */
exports.updateCropById = function(req, res) {
    Crop.update({_id: req.params.id}, req.body, function(err, result) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(result);
        }
    })
};