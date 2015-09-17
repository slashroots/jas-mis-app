/**
 * Endpoints created for application email management.
 * @type {*|exports|module.exports}
 */
var express = require('express');
var Email = require('./email');
var router = express.Router();

router.post('/email', Email.sendEmail);
router.get('/emails', Email.getEmails);
router.post('/email/new_user', Email.emailNewUser);

module.exports = router;
