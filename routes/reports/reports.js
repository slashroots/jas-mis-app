var Demand = require('../../models/db').Demand;
var Buyer = require('../../models/db').Buyer;
var Commodity = require('../../models/db').Commodity;
var Report = require('../../models/db').Report;
var Crop = require('../../models/db').Crop;
var moment = require('moment');
var common = require('../common/common');


/**
 * Creates a report based on a list of demands and commodities that have
 * been used in the creation of a transaction.
 * @param req
 * @param res
 */
exports.createReport = function(req, res) {
    var report = new Report(req.body);
    report.save(function(err, item) {
        console.log(err);
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(item);
        }
    });
};

/**
 * Find a report based on specified query parameters.
 * @param req
 * @param res
 */
exports.searchReports = function(req, res) {
    Report.find(req.query, function(err, list) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};

/**
 * This path allows for the rendering of a report based on the provided id
 * of the report stored on the db.
 *
 * TODO: Incomplete
 *
 * @param req
 * @param res
 */
exports.renderReport = function(req, res) {
    Report.findById(req.params.id)
        .populate('de_demand us_user co_commodities.fa_farmer')
        .exec(function(err, item) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            Buyer.findById(item.de_demand.bu_buyer, function(err2, buyer) {
                if(err2) {
                    common.handleDBError(err2, res);
                } else {
                    Crop.findById(item.de_demand.cr_crop, function(err3, crop) {
                        if(err3) {
                            common.handleDBError(err3, res);
                        } else {
                            item.de_demand.cr_crop = crop;
                            item.de_demand.bu_buyer = buyer;
                            var matched_commodities = item.co_commodities;
                            var total_prices = getTotalPrices(item.co_commodities);
                            var crop_avail_dates = getCropAvailabilityDates(item.co_commodities);
                            res.render('report',
                                {	title: 'Report',
                                    buyer_info: item.de_demand,
                                    supply_amount: 0, //TODO: revist this and calculate
                                    supply_value: 0, //TODO: revist this and calculate
                                    commodities: matched_commodities,
                                    prices: total_prices,
                                    report_date: moment(item.re_report_date).format('MMMM DD YYYY hh:mm a'),
                                    crop_dates: crop_avail_dates,
                                    us_user: req.user
                                });
                        }
                    });
                }
            });

        }
    })
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