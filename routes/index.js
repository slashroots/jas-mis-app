var express = require('express');
var router = express.Router();
var Demand = require('../models/db').Demand;
var Buyer = require('../models/db').Buyer;
var Commodity = require('../models/db').Commodity;
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'JASMIC' });
});

//get report page 
/**

	TODO:
	- Get Demand Details corresponding with demand id
	- Get Commodities details from corresponding commodities id

**/
router.get('/report/buyer_report', function(req, res, next){
	//console.log(req.query);
	var commodities = req.query.co;
	console.log(commodities);
	res.render('report', {title: 'Report'});
 		// Demand.findById(req.query.demand_id, function (err, demand) {
   //          if (err) {
   //              common.handleDBError(err, res);
   //          } else {
   //              Commodity.find({
   //                  $and: [
   //                      {co_until: {$gte: demand.de_posting_date}},
   //                      {co_availability_date: {$lte: demand.de_until}}
   //                  ],
   //                  cr_crop: demand.cr_crop
   //              }).populate('cr_crop fa_farmer')
   //                  .sort({co_quantity: 'desc'})
   //                  .exec(function (err2, list) {
   //                      if (err2) {
   //                          common.handleDBError(err2, list);
   //                      } else {
   //                          console.log(list);
   //                          res.render('report', {title: 'Report', demand_details: list	});
   //                      }
   //                  });
   //          }
   //      });

	
});

router.post('/report/buyer_report', function(req, res, next){
	console.log('Post done success' + req.body.demand_id);
	res.render('report', {title: 'Report'});
});



module.exports = router;
