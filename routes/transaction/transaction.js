/**
 * Created by matjames007 on 5/14/15.
 */
var model = require('../../models/db');
var common = require('../common/common');
var Transaction = model.Transaction,
    Commodity = model.Commodity;

/**
 * There are four possible states for a transaction
 * Pending - Just opened. The starting point of the FSM
 * Completed - Transaction has been successfully completed
 * Waiting - Awaiting more information/inspection etc
 * Failed - Failed transaction between a farmer and a buyer
 */

/**
 * Searches for all transactions based on the query submitted
 * in the request.
 *
 * @param req
 * @param res
 */
exports.searchTransaction = function(req, res) {
    Transaction.find(req.query)
        .populate('bu_buyer fr_farmer co_commodity cr_crop de_demand')
        .exec(function(err, list) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};

/**
 * Searches for all open transactions.
 *
 * @param req
 * @param res
 */
exports.searchOpenTransaction = function(req, res) {
    var query = req.query;
    query['$or'] = [{tr_status: 'Pending'},
        {tr_status: 'Waiting'}, {tr_status: 'Completed'}, {tr_status: 'Failed'}];
    Transaction.find(query)
        .populate('bu_buyer fr_farmer co_commodity cr_crop de_demand')
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
 * with the contents of the request body. The function also
 * updates a commodity's sold status. This function
 * sends the result of the modification.
 * @param req
 * @param res
 */
exports.updateTransactionById = function(req, res) {
    Transaction.findByIdAndUpdate({_id: req.params.id}, req.body, function(err, result) {
        if(err) {
            common.handleDBError(err, res);
        } else {
            Commodity.findByIdAndUpdate(req.body.co_commodity._id, { $set: { co_sold: req.body.co_sold }}, function(err, commodity){
               if(err || !commodity){
                   common.handleDBError(err, res);
               }else{
                   res.send(result);
               }
            });
        }
    })
};
