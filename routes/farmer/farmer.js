/**
 * This is intended to enable any logic/control for
 * any operations on a farmer.  All functions here
 * are used by endpoints in the farmer_routes.js
 * file and must ensure that appropriate validations
 * are done.
 *
 * Created by matjames007 on 4/28/15.
 */

var model = require('../../models/db'),
 common = require('../common/common'),
 Commodity = model.Commodity,
 Demand = model.Demand,
 Branch = model.Branch,
 Membership = model.Membership;
/**
 * This is a generic helper function for MongoDB errors
 * that occur during searching/creating/updating a document.
 * @param err
 * @param res
 */
handleDBError = function(err, res) {
    if(err.name == "ValidationError") {
        res.status(400);
        res.send(err);
    } else if(err.name == "CastError") {
        res.status(400);
        res.send(err);
    } else {
        res.status(500);
        res.send(err);
    }
};

/**
 * Retrieves all farmers based on the criteria given in the
 * request parameters. If the parameter "searchTerms" is present
 * in the req.query object then it will do a match to facilitate
 * the search engine of the front end application.
 *
 * TODO: Need to ensure that this uses the request params!
 *
 * @param req
 * @param res
 */
exports.getFarmers = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query;
        if ("searchTerms" in req.query) {
            var list = common.regexSearchTermCreator(req.query.searchTerms.split(" "));
            query = {
                $or: [
                    {fa_first_name: {$in: list}},
                    {fa_last_name: {$in: list}},
                    {fa_jas_number: {$in: list}}
                ]
            };
        } else {
            query = req.query;
        }

        model.Farmer.find(query)
            .populate('ad_address fr_farms.di_district')
            .exec(function (err, farmers) {
                if (err || !farmers) {
                    handleDBError(err, res);
                } else {
                    res.send(farmers);
                }
            });
    }
};

/**
 * This function attempts to create the farmer based on the body of
 * the web service request.  MongoDB handles the validation of info.
 * @param req
 * @param res
 */
exports.createFarmer = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var farmer = new model.Farmer(req.body);
        farmer.save(function (err) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(farmer);
            }
        });
    }
};

/**
 * Attempts to retrieve document based on the document _id.
 * @param req
 * @param res
 */
exports.getFarmerById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
      var fields_to_exclude = '';
      if(req.user.ut_user_type != "Administrator"){
         fields_to_exclude = '-fa_government_id';
      }
        model.Farmer.findById(req.params.id)
            .populate('ad_address fr_farms.di_district')
            .select(fields_to_exclude)
            .exec(function (err, farmer) {
                if (err || !farmer) {
                    handleDBError(err, res);
                } else {
                    res.send(farmer);
                }
            });
    }
};
/**
 * Attempt to update farmer given an id in the req.params
 * @param req
 * @param res
 */
exports.updateFarmerById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.Farmer.update({_id: req.params.id}, req.body, function (err, response) {
            if (err) {
                handleDBError(err, res);
            } else {
                //update the address
                model.Address.update({_id: req.body.ad_address._id}, req.body.ad_address,
                    function (err2, response2) {
                        if (err2) {
                            handleDBError(err, res);
                        } else {
                            res.send(req.body);
                        }
                    });
            }
        });
    }
};

/**
 * Retrieves all farms based on a farmer's id.
 * @param req
 * @param res
 */
exports.getFarmsByFarmerId = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.Farmer.findById(req.params.id, function (err, item) {
            if (err) {
                handleDBError(err, res);
            } else {
                if (item == null) {
                    res.status(404);
                    res.send("Farmer Not Found");
                } else {
                    res.send(item.fr_farms);
                }
            }
        });
    }
};

/**
 * Create a farm based on the farmer's ID.
 * @param req
 * @param res
 */
exports.createFarm = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.Farmer.findById(req.params.id, function (err, farmer) {
            if (err) {
                handleDBError(err, res);
            } else {
                if (farmer == null) {
                    res.status(404);
                    res.send("Farmer Not Found");
                } else {
                    var farm = new model.Farm(req.body);
                    farmer.fr_farms.push(farm);
                    farmer.save(function (err3, result) {
                        if (err3) {
                            handleDBError(err3, res);
                        } else {
                            res.send(result);
                        }
                    });
                }
            }
        });
    }
};

/**
 * Adds a commodity and associates by the farmer's ID.
 * @param req
 * @param res
 */
exports.addCommodity = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var com = new Commodity(req.body);
        com.fa_farmer = req.params.id;
        com.save(function (err, item) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Get commodities by farmer id.
 *
 * @param req
 * @param res
 */
exports.getCommodities = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Commodity.find({fa_farmer: req.params.id})
            .populate('fa_farmer cr_crop')
            .exec(function (err, list) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(list);
                }
            });
    }
};

/**
 * Edits a commodity based on commodity's id.
 * @param req
 * @param res
 */
exports.editCommodity = function(req, res) {
   if(common.isAuthenticated(res, req)){
       Commodity.update({_id:req.params.comID}, req.body, function(err, response){
           if(err || response.nModified != 0){
               common.handleDBError(err, res);
           }else{
               res.send(response);
           }
       });
   }
};

/**
 * Function really only requires the farm_id to be in the parameter
 * and does a query based on only this parameter.  The function
 * itself just searches based on the id for the farm then updates the
 * farm with the information in the request body.  Should be used for
 * PUT requests.
 *
 * @param req
 * @param res
 */
exports.updateFarmById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.Farm.update({_id: req.params.farm_id}, req.body, function (err, response) {
            if (err) {
                handleDBError(err, res);
            } else {
                //check if any document got modified
                if (response.nModified != 0) {
                    res.send(response);
                } else {
                    res.status(404);
                    res.send({error: "Not Found"});
                }
            }
        });
    }
};

/**
 * Allows for a comment to be created based on a given farmer.
 * Requires a id of the farmer to be passed as a parameter in
 * the request.
 *
 * @param req
 * @param res
 */
exports.createFarmerComment = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var comment = new model.Comment(req.body);
        model.Farmer.findById(req.params.id, function(err, item) {
            if(err) {
                handleDBError(err, res);
            } else if(item == null) {
                res.status(404);
                res.send({error: "Farmer Not Found"});
            } else {
                item.ct_comments.push(comment);
                item.save(function(err2, result) {
                    if(err2) {
                        handleDBError(err2, res);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    }
};

/**
 * Retrieves the comments on a particular farmer based on the id
 * submitted in the parameters inside the request.
 *
 * @param req
 * @param res
 */
exports.getCommentsForFarmer = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.Farmer.findById(req.params.id, function (err, item) {
            if (err) {
                handleDBError(err, res);
            } else {
                if (item == null) {
                    res.status(404);
                    res.send("Farmer Not Found");
                } else {
                    res.send(item.ct_comments);
                }
            }
        });
    }
};

/**
 * Creates a new membership record and associates it with a
 * particular farmer.  The database should ensure validation.
 *
 *
 * @param req
 * @param res
 */
exports.createMembership = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var membership = new model.Membership(req.body);
        membership.save(function (err2, result) {
            if (err2) {
                handleDBError(err2, res);
            } else {
                res.send(result);
            }
        });
    }
};

/**
 * Retrieve Membership details by Farmer ID
 * @param req
 * @param res
 */
exports.getMembershipByFarmer = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Membership.find({fa_farmer: req.params.id}).populate('fa_farmer mt_type_id br_branch_id')
            .sort({mi_expiration: 'desc'})
            .exec(function (err, list) {
                if (err) {
                    handleDBError(err, res);
                } else {
                    res.send(list);
                }
            });
    }
};

/**
 * This function looks for a farmer's active membership record and
 * sends it.  If there is none then it returns an empty record.
 * This function requires the farmer's record _id to be sent in
 * req.params
 *
 * TODO: This is unchecked!  This should also be documented!
 *
 * @param req
 * @param res
 */
exports.getActiveMembership = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Membership.find({fa_farmer: req.params.id}, function (err, mRecords) {
            if (err) {
                handleDBError(err, res);
            } else {
                var items = [];
                var current_date = Date.now();
                for (var m in mRecords) {
                    if ((current_date >= m.mi_start) & (current_date <= m.mi_expiration)) {
                        items.push(m);
                    }
                }

                if (items.length > 0) {
                    /**
                     * There is a possibility that there are multiple
                     * items coming back because there can be more than
                     * one membership record created for one period of time.
                     *
                     * We therefore would require the record last created.
                     */
                    var max = new Date(0); //start this value at the minimum date
                    var v;
                    for (i in items) {
                        if (i.mi_date_updated > max) {
                            max = i.mi_date_updated;
                            v = i;
                        }
                    }
                    res.send(v);
                } else {
                    res.send({});
                }

            }
        });
    }
};

/**
 * Allows for updating of a membership record. Based on a Farmer ID and a
 * Membership ID.
 *
 * TODO: Test this function!!!!
 *
 * @param req
 * @param res
 */
exports.updateMembership = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Membership.updateById(req.params.member_id, req.body, function (err, changes) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(changes);
            }
        });
    }
};

/**
 * Create New Membership Type. Validation done by DB.
 * @param req
 * @param res
 */
exports.createMembershipType = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var mt = new model.MembershipType(req.body);
        mt.save(function (err, item) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(item);
            }
        });
    }
};

/**
 * Retrieve all membership types.
 *
 * @param req
 * @param res
 */
exports.getMembershipTypes = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        model.MembershipType.find(req.query, function (err, list) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(list);
            }
        });
    }
};

/**
 * TODO: Move these transform functions outta here!
 */

/**
 * Attempts to import farmers in a batch using a json object.
 * This has a request body restriction of 50MB!
 *
 * This will first do a lookup of all parishes and a specific
 * membership type
 *
 * @param req
 * @param res
 */
exports.batchCreateFarmers = function(req, res) {

    //TODO: Lookup of membership types and parishes
    model.MembershipType.findOne({mt_type_name: "Direct"}, function(err, directType) {
        if(err) {
            handleDBError(err, res);
        } else {
            model.Parish.find(function(err2, parishes) {
                if(err2) {
                    handleDBError(err2, res);
                } else {
                    model.MembershipType.findOne({mt_type_name: "Branch"}, function(err3, branchType) {
                        if(err3) {
                            handleDBError(err3, res);
                        } else {
                            Branch.find({}).populate('pa_parish').exec(function(err, branches) {
                                if(err) {
                                    handleDBError(err, res);
                                } else {
                                    performTransform(directType, branchType,
                                        parishes, branches, req, res);
                                }
                            });

                        }

                    });
                }
            });
        }
    });
};

/**
 * Create Branches in a batched way.
 *
 * @param req
 * @param res
 */
exports.batchCreateBranches = function(req, res) {
    function getParishId(code, list) {
        for(var p in list) {
            if(code == list[p].pa_parish_code) {
                return list[p]._id;
            }
        }
    };

    var all_branches = [];
    var branch;
    model.Parish.find({}, function(err, list) {

        if(err) {
            handleDBError(err, res);
        } else {
            for(var i in req.body) {
                branch = new Branch({
                    br_branch_name: req.body[i]["Branch Name"],
                    pa_parish: getParishId(req.body[i]["Parish Code"], list)
                });

                all_branches.push(branch);
            }
            Branch.create(all_branches, function(err) {
                res.send(err);
            });
        }
    });
};

/**
 * Sends the branches to the requester based on his query.
 * @param req
 * @param res
 */
exports.getBranches = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Branch.find(req.query).populate('pa_parish').exec(function (err, list) {
            if (err) {
                handleDBError(err, res);
            } else {
                res.send(list);
            }
        });
    }
};

/**
 * Does the transform from information supplied in the request
 * body to match that of this application schema.
 *
 * @param directType
 * @param branchType
 * @param parishes
 * @param branches
 * @param res
 */
function performTransform(directType, branchType, parishes, branches, req, res) {
    var farmer;
    var farm_address;
    var mailing_address;
    var membership;
    var all_membership = [];
    var d;
    var addresses = [];
    var allfarmers = [];

    for(var f in req.body) {
        try{
            d = Date.parse(req.body[f]["D.O.B"]);
        } catch(e) {
            d = null;
        }

        farmer = new model.Farmer({
            fa_first_name: req.body[f]["First Name"],
            fa_middle_name: req.body[f]["Middle"],
            fa_last_name: req.body[f]["Last Name"],
            fa_gender: req.body[f]["Gender"],
            fa_contact: req.body[f]["Contact Number"],
            fa_contact2: req.body[f]["Office Number"],
            fa_email: req.body[f]["Email Address"],
            fa_deceased: false
        });
        if(d != null) {
            farmer.fa_dob = d;
        }

        if(req.body[f]["Mailing Address"] != "") {
            mailing_address = new model.Address({
                ad_address1: req.body[f]["Mailing Address"],
                pa_parish: lookupParish(req.body[f]["Parish code"], parishes),
                ad_country: "Jamaica"
            });
            addresses.push(mailing_address);
        }
        if(req.body[f]["Farmers Address"] != "") {
            farm_address = new model.Address({
                ad_address1: req.body[f]["Farmers Address"],
                pa_parish: lookupParish(req.body[f]["Parish code"], parishes),
                ad_country: "Jamaica"
            });
            addresses.push(farm_address);
        }

        farmer.ad_address= (mailing_address != null) ? mailing_address._id : (farm_address != null) ? farm_address._id : null
        farmer.fa_sub_sector= req.body[f]["Subsector"];
        farmer.fa_jas_number = req.body[f]["Parish code"]
        + req.body[f]["Expiry Year"]
        + req.body[f]["Member Number"];

        var histories = ["2006-2007","2007-2008","2008-2009", "2009-2010", "2010-2011","2011-2012",
            "2012-2013", "2013-2014", "2014-2015", "2015-2016","2016-2017"];
        for(y in histories) {
            //TODO: Create Membership and Farm Information
            if (req.body[f][histories[y]] == "A") {
                membership = new model.Membership({
                    mi_jas_number: req.body[f]["Parish code"]
                    + req.body[f]["Expiry Year"]
                    + req.body[f]["Member Number"],
                    mi_start: new Date("4/1/" + histories[y].split("-")[0]),
                    mi_expiration: new Date("3/31/"+ histories[y].split("-")[1]),
                    mt_type_id: (req.body[f]["Branch"] == "DIRECT MEMBER") ? directType._id: branchType._id,
                    mi_due_owed: (req.body[f]["Branch"] == "DIRECT MEMBER") ? 1000: 200,
                    mi_due_paid: (req.body[f]["Branch"] == "DIRECT MEMBER") ? 1000: 200,
                    br_branch_id: (req.body[f]["Branch"] == "DIRECT MEMBER") ? null:
                        lookupBranch(req.body[f]["Branch"], req.body[f]["Parish code"], branches),
                    fa_farmer: farmer._id
                });
                all_membership.push(membership);
            }
        }

        //TODO: Push information into the farmer object
        allfarmers.push(farmer);
        mailing_address = null;
        farm_address = null;
    }

    /**
     * THIS IS VERY INEFFICIENT BUT IT IS THE ONLY WAY TO GET THIS
     * DONE!
     */
    model.Address.create(addresses, function(err,list) {
        model.Farmer.create(allfarmers, function(err2, list2) {
            model.Membership.create(all_membership, function(err3) {
                res.send(err3);
            });
        })
    });

};

/**
 * Find and return Demands who's dates intersect with that of
 * the commodity.  Also must be matching based on the crop type.  Return
 * that list sorted (asc) by the quantity.
 * @param req
 * @param res
 */
exports.findCommodityMatch = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Commodity.findById(req.params.id, function (err, commodity) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                Demand.find({
                    $and: [
                        {de_posting_date: {$lte: commodity.co_until}},
                        {de_until: {$gte: commodity.co_availability_date}}
                    ],
                    cr_crop: commodity.cr_crop
                }).populate('cr_crop bu_buyer')
                    .sort({de_quantity: 'ascending'})
                    .exec(function (err2, list) {
                        if (err2) {
                            common.handleDBError(err2, list);
                        } else {
                            res.send(list);
                        }
                    });
            }
        });
    }
};

/**
 * Finds all the commodies that haven't expired.
 * @param req
 * @param res
 */
exports.searchCurrentCommodities = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var curr_date = Date.now();

        if (req.query.amount) {
            Commodity.find({co_until: {$gte: curr_date}})
                .populate('cr_crop fa_farmer')
                .limit(req.query.amount)
                .sort('co_availability_date fa_farmer.fa_first_name')
                .exec(function (err, list) {
                    if (err) {
                        common.handleDBError(err, res);
                    } else {
                        res.send(list);
                    }
                });
        } else {
            Commodity.find({co_until: {$gte: curr_date}})
                .populate('cr_crop fa_farmer')
                .sort('co_availability_date fa_farmer.fa_first_name')
                .exec(function (err, list) {
                    if (err) {
                        common.handleDBError(err, res);
                    } else {
                        res.send(list);
                    }
                });
        }
    }
};

/**
 * Inefficient function to lookup parish by parish code
 * and return the _id value.
 * @param code
 * @param parishes
 * @returns {*|id|_id|{$nin}|{type, auto}}
 */
function lookupParish(code, parishes) {
    for(p in parishes) {
        if(parishes[p].pa_parish_code == code) {
            return parishes[p].pa_parish_name;
        }
    }
}

/**
 * Inefficient function to search for branch by the branchName and
 * parish and return the _id value.
 * @param branchName
 * @param parish
 * @param list
 */
function lookupBranch(branchName, parishCode, list) {
    for(var i in list) {
        if(parishCode == list[i].pa_parish.pa_parish_code) {
            if(branchName == list[i].br_branch_name) {
                return list[i]._id;
            }
        }
    }
}
