/**
 * Application email functionality.
 * Created by: tremainekb on 10/08/2015
 */
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var common = require('../common/common');
var Email = require('../../models/db').Email;

/**
 * Sends an email using SendGrid API based on the body of the
 * request.
 * @param req
 * @param res
 */
exports.sendEmail = function(req, res){
  if(common.isAuthenticated(req, res)){
      var email = new sendgrid.Email(req.body),
          footer_text = '<br/>This document is an indicative demand match of a buyer\'s demand and a farmer\'s supply and does not'+
                         ' represent a binding agreement between  a buyer and a farmer(s).'+
                         '<br/><p>You are receiving this email because you are a registered user of JASMIC,'+
                         ' a service of Jamaica Agricultural Society (JAS).</p>';
      email.setFrom(process.env.REPLY_TO);
      email.addFile({cid: 'logo', path:'./public/images/report-icons/jas_logo_knockout-01.png'});
      email.addFile({cid: 'produce', path:'./public/images/report-icons/icons_crop.png'});
      email.addFile({cid: 'variety', path:'./public/images/report-icons/icons_variety.png'});
      email.addFile({cid: 'demand', path:'./public/images/report-icons/icons_amount.png'});
      email.addFile({cid: 'supply', path:'./public/images/report-icons/icons_total_supply.png'});
      email.addFile({cid: 'value', path:'./public/images/report-icons/icons_prince.png'});
      email.addFile({cid: 'calendar', path:'./public/images/report-icons/icons_date_posted.png'});
      email.addFile({cid: 'unit_price', path:'./public/images/report-icons/icons_unit_price.png'});
      email.addFile({cid: 'address_pin', path:'./public/images/report-icons/icons_address_pin.png'});
      email.addFile({cid: 'phone', path:'./public/images/report-icons/icons_phone.png'});
      email.addFile({cid: 'email', path:'./public/images/report-icons/icons_email.png'});
      email.setHtml(req.body.report_body);
      email.addFilter('footer', 'text/html', footer_text);
      sendgrid.send(email, function(err, json){
        if(err){
            common.handleEmailError(err, res);
        }else{
          res.send({message: 'Email Sent Successfully'});
        }
      });
  }
};
/**
 * TODO - Determine queries on endpoint.
 * @param req
 * @param res
 */
exports.getEmails = function(req, res){

};
