/**
 * Created by matjames007 on 4/28/15.
 */

var model = require('../../models/db');

exports.getFarmers = function(req, res) {
    model.Farmer.find(req.params, function(err, list) {
        if(err) {
            //TODO: do something intelligent
        } else {
            //TODO: respond appropriately with list
        }
    })
}