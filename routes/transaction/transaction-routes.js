/**
 * Created by matjames007 on 5/14/15.
 */
var express = require('express');
var Transaction = require('./transaction');
var router = express.Router();

dummyfunction = function(req, res) {
    res.send("Not Implemented");
};

/**
 * End Points relevant to Transactions
 */
router.get('/transactions', Transaction.searchTransaction);
router.get('/open_transactions', Transaction.searchOpenTransaction);
router.post('/transaction', Transaction.createTransaction);
router.put('/transaction/:id', Transaction.updateTransactionById);

module.exports = router;