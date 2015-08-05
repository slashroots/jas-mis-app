/**
 * Created by matjames007 on 6/2/15.
 */
/**
 * Created by matjames007 on 4/28/15.
 */

var express = require('express');
var Supplier = require('./supplier');
var router = express.Router();

/**
 * End Points relevant to Suppliers
 */
router.get('/suppliers', Supplier.findSuppliers);
router.get('/suppliers', Supplier.getSuppliers);
router.post('/supplier', Supplier.createSupplier);
router.get('/supplier/:id', Supplier.getSupplierById);
//router.put('/supplier/:id', Supplier.updateSupplierById);

/**
 * Manipulate information about Inputs for a specific Supplier
 *
 * TODO: Endpoints incomplete.  Update not implemented.
 */
router.get('/supplier/:id/inputs', Supplier.getInputsById);
router.post('/supplier/:id/input', Supplier.createInput);
router.get('/inputs', Supplier.searchInputs);
//router.put('/input', supplier.updateInput);

router.get('/inputtypes', Supplier.getInputTypes);
router.post('/inputtype', Supplier.createInputType);

module.exports = router;