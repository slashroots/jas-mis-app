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
  sendEmail(req.body, res);
  // if(common.isAuthenticated(req, res)){
  //     var email = new sendgrid.Email(req.body);
  //     email.setFrom(process.env.REPLY_TO);
  //     email.addFile({cid: 'logo', path:'./public/images/report-icons/jas_logo_knockout-01.png'});
  //     email.addFile({cid: 'produce', path:'./public/images/report-icons/icons_crop.png'});
  //     email.addFile({cid: 'variety', path:'./public/images/report-icons/icons_variety.png'});
  //     email.addFile({cid: 'demand', path:'./public/images/report-icons/icons_amount.png'});
  //     email.addFile({cid: 'supply', path:'./public/images/report-icons/icons_total_supply.png'});
  //     email.addFile({cid: 'value', path:'./public/images/report-icons/icons_prince.png'});
  //     email.addFile({cid: 'calendar', path:'./public/images/report-icons/icons_date_posted.png'});
  //     email.addFile({cid: 'unit_price', path:'./public/images/report-icons/icons_unit_price.png'});
  //     email.addFile({cid: 'address_pin', path:'./public/images/report-icons/icons_address_pin.png'});
  //     email.addFile({cid: 'phone', path:'./public/images/report-icons/icons_phone.png'});
  //     email.addFile({cid: 'email', path:'./public/images/report-icons/icons_email.png'});
  //     email.setHtml(req.body.report_body);
  //     sendgrid.send(email, function(err, json){
  //       if(err){
  //           common.handleEmailError(err, res);
  //       }else{
  //         res.send({message: 'Email Sent Successfully'});
  //       }
  //     });
  // }
};
/**
 * TODO - Determine queries on endpoint.
 * @param req
 * @param res
 */
exports.getEmails = function(req, res){

};

function sendEmail(params, res){
  var email_body = "", subject = "";
  if(params.email_type === "new_user_registration"){
    email_body = '<h1>Welcome to JASMIC!</h1><p>We are happy you\'re here.</p>' +
                     '<p>Please await further instructions from your system administrator.</p>';
    subject = "Welcome to JASMIC";
  }else if(params.email_type === "new_user_approval"){
    email_body = '<h1>Account Approved!</h1><p>You are now able to access JASMIC.</p>' +
                     '<p>Please click <a href="http://www.w3schools.com">Visit W3Schools.com!</a> and provide your username and password to gain access.</p>';
    subject = "User Approval Completed";
  }else{

  }
  delete params.email_type;
  var email = new sendgrid.Email(params);
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
};
