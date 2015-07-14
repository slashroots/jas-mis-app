var Demand = require('../../models/db').Demand;
var Buyer = require('../../models/db').Buyer;
var Commodity = require('../../models/db').Commodity;
var moment = require('moment');

exports.constructReport = function(req, res){
    Demand.findById(req.body.demand_id)
        .populate('cr_crop bu_buyer')
        .exec(function (err, demand) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                var matched_commodities = req.body.m_commodities;
                var total_prices = getTotalPrices(req.body.m_commodities);
                var crop_avail_dates = getCropAvailabilityDates(req.body.m_commodities);
                res.render('report',
                    {	title: 'Report',
                        buyer_info: demand,
                        supply_amount: 0, //TODO: revist this and calculate
                        supply_value: 0, //TODO: revist this and calculate
                        commodities: matched_commodities,
                        prices: total_prices,
                        report_date: moment().format('DD/MM/YY'),
                        crop_dates: crop_avail_dates
                    });
            }
        });
};

function getCropAvailabilityDates(commodities){
    var crop_expiry_dates = [];
    commodities.forEach(function(list_item){
        crop_expiry_dates.push(moment(list_item.co_availability_date).format('DD/MM/YY'));
        crop_expiry_dates.push(moment(list_item.co_until).format('DD/MM/YY'));
    });
    return crop_expiry_dates;
}

function getTotalPrices(commodities){
    var total_prices = [];
    commodities.forEach(function(list_item){
        total_prices.push((list_item.co_quantity * list_item.co_price));
    });
    return total_prices;
}