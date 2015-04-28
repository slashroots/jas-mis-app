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
router.post('/farmer', dummyfunction);
router.get('/farmer/:id', dummyfunction);
router.put('/farmer/:id', dummyfunction);

/**
 * Manipulate information about Farms for a specific farmer
 */
router.get('/farmer/:id/farms', dummyfunction);
router.get('/farmer/:id/farm', dummyfunction);
router.post('/farmer/:id/farm', dummyfunction);
router.put('/farmer/:id/farm', dummyfunction);

/**
 * Manipulate info about Membership for a specific farmer
 */
router.get('/farmer/:id/membership/active', dummyfunction);
router.post('/farmer/:id/membership', dummyfunction);
router.put('/farmer/:id/membership/:member_id', dummyfunction);

/**
 * Manipulate info about Comment for a specific farmer
 */
router.get('/farmer/:id/comments', dummyfunction);
router.post('/farmer/:id/comment', dummyfunction);

/**
 * TODO:  Need to create endpoints for Transactions, Commodity, Disputes
 * TODO:  replace dummy function with actual controller logic
 */

module.exports = router;