var Demand = require('../../models/db').Demand,
  Buyer = require('../../models/db').Buyer,
  Commodity = require('../../models/db').Commodity,
  Report = require('../../models/db').Report,
  Crop = require('../../models/db').Crop,
  Address = require('../../models/db').Address,
  moment = require('moment'),
  common = require('../common/common');

/**
 * Creates a report based on a list of demands and commodities that have
 * been used in the creation of a transaction.
 * @param req
 * @param res
 */
exports.createReport = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var report = new Report(req.body);
        report.re_report_date = moment();
        report.save(function(err, item) {
            console.log(err);
            if(err) {
                common.handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Find a report based on specified query parameters.
 * @param req
 * @param res
 */
exports.searchReports = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Report.find(req.query)
            .sort({re_report_date: -1})
            .populate('de_demand us_user co_commodities.fa_farmer')
            .exec(function (err, list) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(list);
                }
            });
    }
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
    var addresses = [];
    if(common.isAuthenticated(req, res)) {
        Report.findById(req.params.id)
            .populate('de_demand us_user co_commodities.fa_farmer')
            .exec(function (err, item) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                      for(var i = 0; i<item.co_commodities.length;i++){
                          Address.findById(item.co_commodities[i].fa_farmer.ad_address, function(err, address){
                            addresses.push(address);
                          });
                      }
                      Buyer.findById(item.de_demand.bu_buyer, function (err2, buyer) {
                        if (err2) {
                            common.handleDBError(err2, res);
                        } else {
                            Crop.findById(item.de_demand.cr_crop, function (err3, crop) {
                                if (err3) {
                                    common.handleDBError(err3, res);
                                } else {
                                    item.de_demand.cr_crop = crop;
                                    item.de_demand.bu_buyer = buyer;
                                    var matched_commodities = item.co_commodities,
                                        total_prices = getTotalPrices(item.co_commodities),
                                        crop_avail_dates = getCropAvailabilityDates(item.co_commodities),
                                        supply_amount = getTotalSupply(item.co_commodities),
                                        supply_value = getTotalValue(item.co_commodities);
                                    res.render('report',
                                        {
                                            title: 'Report',
                                            buyer_info: item.de_demand,
                                            supply_amount: supply_amount,
                                            supply_value: supply_value,
                                            commodities: matched_commodities,
                                            prices: total_prices,
                                            report_date: moment(item.re_report_date).format('MMMM DD YYYY hh:mm a'),
                                            crop_dates: crop_avail_dates,
                                            us_user: req.user,
                                            image_paths: setImageSrcPaths(req.query.email_report),
                                            addresses: addresses
                                        });
                                }
                            });
                        }
                    });

                }
            })
    }
};
/**
 * Sets the buyer report image paths based on how the report will be rendered
 * @param {Boolean} email_report Determine if the report should be rendered to the browser or emailed
 * @return {Object} paths 
 */
function setImageSrcPaths(email_report){
  var paths = { logo: '/images/report-icons/jas_logo_knockout-01.png',
                produce: '/images/report-icons/icons_crop.svg',
                variety: '/images/report-icons/icons_variety.svg',
                demand: '/images/report-icons/icons_amount.svg',
                supply: '/images/report-icons/icons_total_supply.svg',
                value: '/images/report-icons/icons_prince.svg',
                calendar: '/images/report-icons/icons_date_posted.svg',
                unit_price: '/images/report-icons/icons_unit_price.svg',
                address_pin: '/images/report-icons/icons_address_pin.svg',
                phone: '/images/report-icons/icons_phone.svg',
                email: '/images/report-icons/icons_email.svg'
              };
  if(email_report === 'true'){
      paths = {logo:'cid:logo',
              produce: 'cid:produce',
              variety: 'cid:variety',
              demand: 'cid:demand',
              supply:'cid:supply',
              value:'cid:value',
              calendar: 'cid:calendar',
              unit_price: 'cid:unit_price',
              address_pin: 'cid:address_pin',
              phone: 'cid:phone',
              email: 'cid:email'};
  }
  return paths;
}
/**
 * Calculates the total supply to be displayed in the buyer report
 * @param  {Object} commodities
 * @return {String} total_supply
 */
function getTotalSupply(commodities){
  var total_supply = 0;
  commodities.forEach(function(list_item){
      total_supply += list_item.co_quantity;
  });
  return total_supply;
}
/**
 * Calculates the total value to be displayed in the buyer report
 * @param  {Object} commodities
 * @return {String} total_value
 */
function getTotalValue(commodities){
  var total_value = 0;
  commodities.forEach(function(list_item){
      total_value += (list_item.co_quantity * list_item.co_price);
  });
  return total_value;
}
/**
 * Extracts and formats crop availability dates
 * @param  {Object} commodities
 * @return {[String]} crop_expiry_dates
 */
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
