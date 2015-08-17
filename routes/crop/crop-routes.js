/**
 * Created by matjames007 on 5/14/15.
 */
var express = require('express');
var Crop = require('./crop');
var router = express.Router();

dummyfunction = function(req, res) {
    res.send("Not Implemented");
};

/**
 * End Points relevant to Crop
 */
router.get('/crops', Crop.findCrops);
router.post('/crops', Crop.batchUpdate);
router.post('/crop', Crop.createCrop);
router.put('/crop/:id', Crop.updateCropById);

module.exports = router;