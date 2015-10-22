/**
 * Created by matjames007 on 5/12/15.
 */

var express = require('express');
var Buyer = require('./buyer');
var router = express.Router();

/**
 * End Points relevant to Buyers
 */
router.get('/buyers', Buyer.getBuyers);
router.post('/buyer', Buyer.createBuyer);
router.get('/buyer/:id', Buyer.getBuyerById);
router.put('/buyer/:id', Buyer.updateBuyerById);

router.post('/buyer/:id/rep', Buyer.addNewRep);
router.put('/buyer/:id/rep/:rep_id', Buyer.editRep);

router.post('/buyer/:id/demand', Buyer.addNewDemand);
router.get('/buyer/:id/demands', Buyer.getDemands);
router.get('/buyers/current_demands', Buyer.searchCurrentDemands);
router.put('/buyer/:id/demand/:demand_id', Buyer.editDemand);

router.get('/demand/:id/match', Buyer.findDemandMatch);
router.get('/demand/:id', Buyer.getDemand);

/**
 * End Points for manipulating a buyer type
 */
router.get('/buyertypes', Buyer.getBuyerTypes);
router.post('/buyertype', Buyer.createBuyerType);
router.put('/buyertype/:id', dummyStub);

module.exports = router;


/**
 * TODO: Replace stub with actual references to functions
 * @param req
 * @param res
 */
function dummyStub(req, res) {
    res.end({info: "unimplemented"});
}