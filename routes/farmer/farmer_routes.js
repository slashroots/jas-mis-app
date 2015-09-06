/**
 * Created by matjames007 on 4/28/15.
 */

var express = require('express');
var Farmer = require('./farmer');
var router = express.Router();

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
router.put('/farmer/:id/farm/:farm_id', Farmer.updateFarmById);

router.post('/farmer/:id/commodity', Farmer.addCommodity);
router.get('/farmer/:id/commodities', Farmer.getCommodities);
router.put('/farmer/:id/commodity/:commodity_id', Farmer.editCommodity);
router.get('/farmers/current_commodities', Farmer.searchCurrentCommodities);

router.get('/commodity/:id/match', Farmer.findCommodityMatch);

/**

 * Manipulate info about Membership for a specific farmer
 */
router.post('/membershiptype', Farmer.createMembershipType);
router.get('/membershiptypes', Farmer.getMembershipTypes);
router.get('/farmer/:id/membership/active', Farmer.getActiveMembership);
router.post('/farmer/:id/membership', Farmer.createMembership);
router.get('/farmer/:id/memberships', Farmer.getMembershipByFarmer);
router.put('/farmer/:id/membership/:member_id', Farmer.updateMembership);

/**
 * Manipulate info about Comment for a specific farmer
 */
router.get('/farmer/:id/comments', Farmer.getCommentsForFarmer);
router.post('/farmer/:id/comment', Farmer.createFarmerComment);

/**
 * TODO:  Need to create endpoints for Transactions, Commodity, Disputes
 * TODO:  replace dummy function with actual controller logic
 */

router.post('/farmers', Farmer.batchCreateFarmers);
router.post('/branches', Farmer.batchCreateBranches);
router.get('/branches', Farmer.getBranches);

module.exports = router;
//mongodb://localhost/jas-mis-app
//