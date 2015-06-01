/**
 * These are the common items that are shared amongst many
 * entities (example address and units)
 *
 * Created by matjames007 on 4/29/15.
 */

/**
 * Created by matjames007 on 4/28/15.
 */

var express = require('express');
var Common = require('./common');
var router = express.Router();

dummyfunction = function(req, res) {
    res.send("Not Implemented");
};

/**
 * End Points relevant to Common
 */
router.get('/address/:id', Common.getAddressById);
router.post('/address', Common.createAddress);
router.put('/address/:id', Common.updateAddressById);
router.post('/parish', Common.createParish);
router.get('/parishes', Common.getParishes);

router.get('/districts', Common.getDistricts);
router.post('/districts', Common.batchPushDistricts);

router.get('/search', Common.searchAll);

router.get('/units', Common.findUnits);
router.post('/unit', Common.createUnit);

module.exports = router;