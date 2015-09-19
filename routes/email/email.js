/**
 * Application email functionality.
 * Created by: tremainekb on 10/08/2015
 */
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var common = require('../common/common');
/**
 * Sends an email using SendGrid API based on the body of the
 * request.
 * @param req
 * @param res
 */
exports.sendEmail = function(req, res){
  routeEmailRequest(req.body, res, req);
};
/**
 * Routes email depending on email type
 * @param  {Object} email_params  Request body object
 * @param  {[type]} res          [description]
 * @param  {[type]} req          [description]
 */
function routeEmailRequest(email_params, res, req){
  var email_body = "", subject = "";
  if(email_params.email_type === "new_user_registration"){
    email_body = '<h1>Welcome to JASMIC!</h1><p>We are happy you\'re here.</p>' +
                     '<p>Please await further instructions from your system administrator.</p>';
    subject = "Welcome to JASMIC";
    sendEmail(email_params, subject, email_body, res)

  }else if(email_params.email_type === "new_user_approval"){
    email_body = '<h1>Account Approved!</h1><p>You are now able to access JASMIC.</p>' +
                     '<p>Please click <a href="http://www.w3schools.com">Visit W3Schools.com!</a> and provide your username and password to gain access.</p>';
    subject = "User Approval Completed";
    sendEmail(email_params, subject, email_body, res)

  }else if(email_params.email_type === "buyer_report"){
    sendBuyerReport(email_params, res, req)
  }
};
/**
 * Sends email based on body of request
 * @param  {[type]} email_params Request body
 * @param  {[type]} subject      Subject of email
 * @param  {[type]} email_body   Body of the email
 * @param  {[type]} res          [description]
 */
function sendEmail(email_params, subject, email_body, res){
  var email = new sendgrid.Email(email_params);
  email.setSubject(subject);
  email.setFrom(process.env.REPLY_TO);
  email.setHtml(email_body);
  sendgrid.send(email, function(err, json){
      if(err){
        common.handleEmailError(err, res);
      }else{
        res.send({message:'Email sent'});
      }
  });
}
/**
 * Sends a buyer report.
 * @param  {[type]} email_params Request body
 * @param  {[type]} res          [description]
 * @param  {[type]} req          [description]
 */
function sendBuyerReport(email_params, res, req){
  if(common.isAuthenticated(req, res)){
      var email = new sendgrid.Email(email_params),
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
      email.setHtml(email_params.report_body);
      email.addFilter('footer', 'text/html', footer_text);
      sendgrid.send(email, function(err, json){
        if(err){
            common.handleEmailError(err, res);
        }else{
          res.send({message: 'Email Sent Successfully'});
        }
      });
  }
}
