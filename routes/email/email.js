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
  if(common.isAuthenticated(req, res)){
    var email = new sendgrid.Email(req.body);
    email.setFrom(process.env.REPLY_TO);
    sendgrid.send(email, function(err,json){
        if(err){
           common.handleEmailError(err, res);
        }else{
            res.send({message : 'Email Sent Successfully.'});
        }
    });
  });
};
/**
 * TODO - Determine queries on endpoint.
 * @param req
 * @param res
 */
exports.getEmails = function(req, res){

};
