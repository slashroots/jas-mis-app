/**
 * Created by matjames007 on 5/14/15.
 */
var model = require('../../models/db');
var common = require('../common/common');
var Address = model.Address;
var Parish = model.Parish;
var Farmer = model.Farmer;
var Buyer = model.Buyer;
var Transaction = model.Transaction;

exports.searchTransaction = function(req, res) {
    Transaction.find(req.query)
        .populate('bu_buyer fr_farmer')
        .exec(function(err, list) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};

exports.createTransaction = function(req, res) {
    var trans = new Transaction(req.body);
    trans.save(function(err, transaction) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(transaction);
        }
    });
};