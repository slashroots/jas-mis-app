/**
 * Created by matjames007 on 5/14/15.
 */
var model = require('../../models/db');
var common = require('../common/common');
var Transaction = model.Transaction;

/**
 * Searches for all transactions based on the query submitted
 * in the request.
 *
 * @param req
 * @param res
 */
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

/**
 * Creates a Transaction based on the contents of the
 * request body
 * @param req
 * @param res
 */
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

/**
 * Based on the unique identifier of the transaction we modify
 * with the contents of the request body.  This function
 * sends the result of the modification.
 * @param req
 * @param res
 */
exports.updateTransactionById = function(req, res) {
    Transaction.update({_id: req.params.id}, req.body, function(err, result) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(result);
        }
    })
};