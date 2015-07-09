var express = require('express');
var router = express.Router();
var Demand = require('../models/db').Demand;
var Buyer = require('../models/db').Buyer;
var Commodity = require('../models/db').Commodity;
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'JASMIC' });
});

router.get('/report/buyer_report', function(req, res, next){
	Demand.findById(req.query.demand_id)
            .populate('cr_crop bu_buyer')
            .exec(function (err, demand) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    Commodity.find({
                    $and: [
                        {co_until: {$gte: demand.de_posting_date}},
                        {co_availability_date: {$lte: demand.de_until}}
                    ],
                    cr_crop: demand.cr_crop
                }).populate('cr_crop fa_farmer bu_buyer ad_address')
                    .sort({co_quantity: 'desc'})
                    .exec(function (err2, list) {
                        if (err2) {
                            common.handleDBError(err2, list);
                        } else {
                        	var matched_commodities = getMatchCommodities(list, req.query.comm_id);
                        	var total_prices = getTotalPrices(list, req.query.comm_id);
                        	console.log(matched_commodities);
                            res.render('report', 
                            	{	title: 'Report',
                            	 	buyer_info: demand, 
                            	 	supply_amount: req.query.supply_amount,
                            	 	supply_value: req.query.supply_value,
                            	 	commodities: matched_commodities,
                            	 	prices: total_prices
                            	 });
                        }
                    });
                }
            });	
});

function getMatchCommodities(list, commodity_ids){
	var matched_commodities = [];	
	list.forEach(function(list_item){
		if(commodity_ids.toString() === list_item._id.toString()){
			matched_commodities.push(list_item);
		}
	});
	return matched_commodities;
}

function getTotalPrices(list, commodity_ids){
	var total_prices = [];
	list.forEach(function(list_item){
		if(commodity_ids.toString() === list_item._id.toString()){
			total_prices.push((list_item.co_quantity * list_item.co_price));
		}
	});
	return total_prices;
}

router.post('/report/buyer_report', function(req, res, next){
	console.log('Post done success' + req.body.demand_id);
	res.render('report', {title: 'Report'});
});



module.exports = router;
