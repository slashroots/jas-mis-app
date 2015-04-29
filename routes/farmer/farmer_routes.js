/**
 * Created by matjames007 on 4/28/15.
 */

var express = require('express');
var Farmer = require('./farmer');
var router = express.Router();

dummyfunction = function(req, res) {
    res.send('not implemented');
};

/**
 * End Points relevant to Farmers
 */
router.get('/farmers', Farmer.getFarmers);
router.post('/farmer', Farmer.createFarmer);
router.get('/farmer/:id', Farmer.getFarmerById);
router.put('/farmer/:id', Farmer.updateFarmerById);

/**
 * Manipulate information about Farms for a specific farmer
 */
router.get('/farmer/:id/farms', Farmer.getFarmsByFarmerId);
router.post('/farmer/:id/farm', Farmer.createFarm);
router.put('/farm/:farm_id', Farmer.updateFarmById);

/**
 * Manipulate info about Membership for a specific farmer
 */
router.get('/farmer/:id/membership/active', dummyfunction);
router.post('/farmer/:id/membership', dummyfunction);
router.put('/farmer/:id/membership/:member_id', dummyfunction);

/**
 * Manipulate info about Comment for a specific farmer
 */
router.get('/farmer/:id/comments', Farmer.getCommentsForFarmer);
router.post('/farmer/:id/comment', Farmer.createFarmerComment);

/**
 * TODO:  Need to create endpoints for Transactions, Commodity, Disputes
 * TODO:  replace dummy function with actual controller logic
 */

module.exports = router;