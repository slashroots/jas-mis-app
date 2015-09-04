/**
 * Created by matjames007 on 6/2/15.
 *
 * TODO: Documentation needed throughtout this file!
 *
 */

var model = require('../../models/db');
var common = require('../common/common');
var Supplier = model.Supplier;
var Address = model.Address;
var Input = model.Input;
var InputType = model.InputType;


/**
 * Retrieves all suppliers based on the criteria given in the
 * request parameters.
 *
 * @param req
 * @param res
 */
exports.findSuppliers = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query = req.query;
        console.log(query);
        Supplier.find(query)
            .exec(function (err, docs) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(docs);
                }
            });

    }
};
/**
 * Retrieves all suppliers
 * @param req
 * @param res
 */

exports.getSuppliers = function(req, res){
  if(common.isAdmin(req, res)){
      Supplier.find(function(err, suppliers){
         if(err){
             common.handleDBError(err,res);
         } else{
             res.send(suppliers);
         }
      });
  };
};

/**
 * Creates a supplier based on the request body.
 * @param req
 * @param res
 */
exports.createSupplier = function(req, res) {
    if(common.isAdmin(req, res)) {
        var supplier = new Supplier(req.body);
        supplier.save(function (err2) {
            if (err2) {
                common.handleDBError(err2, res);
            } else {
                res.send(supplier);
            }
        });
    }
};

/**
 * Retrieves a supplier based on the provided
 * id in the parameter body labeled `id`
 * @param req
 * @param res
 */
exports.getSupplierById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Supplier.findById(req.params.id)
            .exec(function (err, item) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(item);
                }
            });
    }
};
/**
 *  Updates a supplier by id found in the url
 *  and request body.
 * @param req
 * @param res
 */
exports.updateSupplierById = function(req, res){
    if(common.isAdmin(req, res)){
        Supplier.findByIdAndUpdate(req.params.id, req.body, function(err, result){
           if(err || !result){
               common.handleDBError(err, res);
           }else{
               res.send(result);
           }
        });
    };
};

/**
 * Creates an input based on the supplier id
 * found in the request body.
 * @param req
 * @param res
 */
exports.createInput = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var input = new Input(req.body);
        input.save(function (err, result) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(result);
            }
        });
    }
};

exports.createInputType = function(req, res) {
    if(common.isAdmin(req, res)) {
        var inputtype = new InputType(req.body);
        inputtype.save(function (err, result) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(result);
            }
        });
    }
};

exports.getInputsById = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        Input.findById(req.params.id).populate('su_supplier un_price_unit it_input_type')
            .exec(function (err, input) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(input);
                }
            });
    }
};

exports.searchInputs = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        var query;
        if ("searchTerms" in req.query) {
            var list = common.regexSearchTermCreator(req.query.searchTerms.split(" "));
            query = {
                $or: [
                    {ip_input_name: {$in: list}},
                    {ip_description: {$in: list}},
                    {ip_brand: {$in: list}},
                    {ip_discount_terms: {$in: list}}
                ]
            };
        } else {
            query = req.query;
        }
        Input.find(query).populate('su_supplier un_price_unit it_input_type')
            .exec(function (err, inputs) {
                if (err) {
                    common.handleDBError(err, res);
                } else {
                    res.send(inputs);
                }
            });
    }
};

exports.getInputTypes = function(req, res) {
    if(common.isAuthenticated(req, res)) {
        InputType.find(req.query, function (err, types) {
            if (err) {
                common.handleDBError(err, res);
            } else {
                res.send(types);
            }
        });
    }
};