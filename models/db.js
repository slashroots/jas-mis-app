/**
 * Created by matjames007 on 4/27/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGOLAB_URI);

/**
 *  These are the schema for the entire application
 *  This will also be used as a validation point.
 */
var UnitSchema = new Schema({
    un_unit_name: {type: String, required: true, unique: true},
    un_unit_desc: {type: String},
    un_unit_conversion: {type: Number, required: false}
});
var CommentSchema = new Schema({
    us_user_id: {type: Schema.Types.ObjectId, required: true},
    ct_date: {type: Date, default: Date.now()},
    ct_message: {type: String, required: true}
});
var CropSchema = new Schema({
    cr_crop_name: {type: String, required: true},
    cr_crop_variety: String,
    cr_crop_mature_weeks: Number,
    cr_crop_avg_size: Number,
    cr_crop_planting_density_min: Number,
    cr_crop_planting_density_max: Number,
    cr_crop_season: String
});
var MembershipTypeSchema = new Schema({
    mt_type_name: {type: String, required: true, unique: true},
    mt_type_desc: String
});
var ParishSchema = new Schema({
    pa_parish_code: {type: String, unique: true, required: true},
    pa_parish_name: {type: String, unique:true, required: true}
});
var AddressSchema = new Schema({
    ad_address1: {type: String, required: false},
    ad_address2: String,
    ad_latitude: Number,
    ad_longitude: Number,
    ad_city: String,
    pa_parish: {required: true, type: String},
    ad_country: {type: String, default: 'Jamaica', required: true}
});
var RoleSchema = new Schema({
    ro_start_date: {type: Date, default: Date.now()},
    ro_end_date: Date,
    fa_farmer: Schema.Types.ObjectId
});
var BranchSchema = new Schema({
    br_branch_name: String,
    pa_parish: {required: true, type: Schema.Types.ObjectId, ref: "Parish"},
    br_branch_description: String,
    br_contact: String,
    ro_president_id: [RoleSchema],
    ro_v_president_id: [RoleSchema],
    ro_secretary_id: [RoleSchema],
    ro_tresurer_id: [RoleSchema],
    ro_absrep_id: [RoleSchema]
});
var MembershipSchema = new Schema({
    fa_farmer: {type: Schema.Types.ObjectId, required: true, ref: 'Farmer'},
    mi_jas_number: {type: String, required: true},
    mi_start: {type: Date, required: true},
    mi_expiration: {type: Date, required: true},
    mt_type_id: {type: Schema.Types.ObjectId, required: true, ref: 'MembershipType'},
    br_branch_id: {type: Schema.Types.ObjectId, ref: 'Branch'},
    mi_date_updated: {type: Date, default: Date.now()},
    mi_due_owed: {type: Number, required: true},
    mi_due_paid: {type: Number, required: true}
});
var DistrictSchema = new Schema({
    di_parish_name: {type: String, required: true},
    di_extension_name: {type: String, required: true},
    di_district_name: {type: String, required: true, unique: true}
});
var FarmSchema = new Schema({
    fr_name: String,
    di_district: {type: Schema.Types.ObjectId, required: true, ref: 'District'},
    ad_address1: {type: String, required: false},
    ad_address2: String,
    ad_latitude: Number,
    ad_longitude: Number,
    ad_city: String,
    ad_country: {type: String, required: true, default: 'Jamaica'},
    fr_size: {type: Number, required: true}
});
var CommoditySchema = new Schema({
    fa_farmer: {type: Schema.Types.ObjectId, ref: 'Farmer', required: true},
    cr_crop: {type: Schema.Types.ObjectId, ref:'Crop', required: true},
    co_quantity: {type: Number, required: true},
    un_quantity_unit: {type: Schema.Types.Mixed, required: true},
    co_expiration_date: Date,
    co_quality: String,
    co_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.Mixed, required: true},
    co_posting_date: {type: Date, default: Date.now()},
    co_payment_preference: String,
    co_sold: {type: Boolean, default: false},
    co_availability_date: Date,
    co_notes: String,
    co_recurring: String,
    co_until: Date,
    co_parent_id: Schema.Types.ObjectId,
    ct_comments: [CommentSchema]
});
var DemandSchema = new Schema({
    bu_buyer: {type: Schema.Types.ObjectId, ref: 'Buyer', required: true},
    cr_crop: {type: Schema.Types.ObjectId, ref: 'Crop', required: true},
    de_quantity: {type: Number, required: true},
    un_quantity_unit: {type: Schema.Types.Mixed, required: true},
    de_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.Mixed, required: true},
    de_quality: String,
    de_expiration_period: Number,
    de_posting_date: {type: Date, default: Date.now()},
    de_until: { type: Date, required: true},
    de_payment_terms: {type: String, required: true},
    de_recurring: String,
    de_parent_id: Schema.Types.ObjectId,
    ct_comments: [CommentSchema],
    de_demand_met: {type: Boolean, default: false},
    de_unmet_amount: {type: Number, default: 0},
    de_met_amount: {type: Number, default: 0},
    de_notes: String
});
var TransactionSchema = new Schema({
    bu_buyer: {type: Schema.Types.ObjectId, required: true, ref: 'Buyer'},
    fr_farmer: {type: Schema.Types.ObjectId, required: true, ref: 'Farmer'},
    tr_quantity: {type: Number, required: false},
    tr_value: {type: Number, required: false},
    tr_date: Date,
    cr_crop: {type: Schema.Types.ObjectId, required: true, ref: 'Crop'},
    tr_date_created: {type: Date, default: Date.now()},
    tr_status: {type:String, required: true},
    us_user_id: Schema.Types.ObjectId,
    tr_note: String,
    de_demand: {type: Schema.Types.ObjectId, ref: 'Demand'},
    co_commodity: {type: Schema.Types.ObjectId, ref: 'Commodity'},
    ct_comments: [CommentSchema],
    co_sold: {type: Boolean, default: false}
});
TransactionSchema.index({de_demand: 1, co_commodity: 1}, {unique: true});
var FarmerSchema = new Schema({
    fa_jas_number: {type: String, unique: true},
    fa_first_name: {type: String, required: true},
    fa_middle_name: String,
    fa_last_name: {type: String, required: true},
    fa_gender: {type: String, required: true},
    fa_dob: Date,
    fa_government_id: String,
    fa_rada_id: String,
    fa_contact: String,
    fa_contact2: String,
    fa_email: String,
    ad_address: {type: Schema.Types.ObjectId, ref: 'Address', required: true},
    fa_deceased: {type: Boolean, required: true},
    fr_farms: [FarmSchema],
    ct_comments: [CommentSchema],
    in_integrity: Number,
    fa_sub_sector: String,
    calls: [{type: Schema.Types.ObjectId, ref: 'CallLog'}]
});
var CallTypeSchema = new Schema({
  ct_call_type_name: {type: String, required: true, unique: true},
  ct_call_type_desc: {type: String, required: true },
  ct_date: {type: Date, default: Date.now(), required: true},
  us_user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

var CallLogSchema = new Schema({
    cc_caller_id: String,
    cc_entity_type: String,
    cc_entity_id: Schema.Types.ObjectId,
    cc_entity_name: String,
    ct_call_type: {type: Schema.Types.ObjectId, ref: 'CallType'},
    cc_date: {type: Date},
    cc_note: {type: String, default: "-"},
    us_user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    cc_incoming: {type: Boolean, default: true}
});
var BuyerTypeSchema = new Schema({
    bt_buyer_type_name: {type: String, required: true, unique: true},
    bt_buyer_type_desc: String
});
var RepresentativeSchema = new Schema({
    re_name: {type: String, required: true},
    re_contact: {type: String, required: true},
    re_email: {type: String},
    re_crop: {type: String},
    re_security_question: {type: String, required: true},
    re_security_answer: {type: String, required: true}
});
var BuyerSchema = new Schema({
    bu_buyer_name: {type: String, required: true, unique: true},
    bt_buyer_type: {type: Schema.Types.ObjectId, required: true, ref: 'BuyerType'},
    bu_phone: String,
    bu_email: String,
    bu_payment_terms: String,
    bu_verified: {type: Boolean, required: true, default: false},
    ad_address: {type: Schema.Types.ObjectId, required: true, ref: 'Address'},
    ct_comments: [CommentSchema],
    in_integrity: Number,
    re_representatives: [RepresentativeSchema],
    calls: [{type: Schema.Types.ObjectId, ref: 'CallLog'}]
});
var InputTypeSchema = new Schema({
    it_input_type_desc: {type: String, required: true},
    it_input_type_name: {type: String, required: true}
});
var InputSchema = new Schema({
    su_supplier: {type: Schema.Types.ObjectId, required: true, ref: 'Supplier'},
    ip_input_name: {type: String, required: true},
    ip_description: String,
    ip_last_updated: {type: Date, default: Date.now()},
    ip_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.ObjectId, required: true, ref: 'Unit'},
    it_input_type: {type: Schema.Types.ObjectId, required: true, ref: 'InputType'},
    ip_brand: String,
    ip_jas_discounted: String,
    ip_discount_terms: String
});
var SupplierSchema = new Schema({
    su_supplier_name: {type: String, required: true, unique: true},
    su_description: String,
    su_contact: String,
    su_email: String,
    ad_address1: {type: String, required: false},
    ad_address2: String,
    ad_latitude: Number,
    ad_longitude: Number,
    ad_city: String,
    pa_parish: {required: true, type: String},
    ad_country: {type: String, default: 'Jamaica', required: true}
});
var DisputeSchema = new Schema({
    di_dispute_type: {type: String, required: true},
    di_dispute_entity_type: {type: String, required: true},
    di_dispute_description: {type: String, required: true},
    di_dispute_entity: {type: Schema.Types.ObjectId, required: true},
    di_resolution_description: String,
    di_status: {required: true, type: String},
    di_parent_id: Schema.Types.ObjectId,
    ct_comments: [CommentSchema]
});

var EventSchema = new Schema({
    ev_event_name: {type: String, required: true},
    ev_event_description: {type: String, required: true},
    us_user_id: {required: true, type: Schema.Types.ObjectId},
    ad_address: {required: true, type: Schema.Types.ObjectId},
    ev_cost: Number,
    ev_type_event: {type: String, required: true},
    ev_host_info: String,
    ev_date: {required: true, type: Date},
    ev_contact_details: String,
    ct_comments: [CommentSchema]
});
var AuditSchema = new Schema({
    us_user_id: {type: Schema.Types.ObjectId, required: true},
    al_table: String,
    al_record_id: Number,
    au_before_commit: String,
    au_after_commit: String,
    au_date: {type: Date, default: Date.now()},
    au_type: {type: String, required: true}
});
var UserSchema = new Schema({
    us_user_first_name: {type: String, required: true},
    us_user_last_name: {type: String, required: true},
    us_username: {type: String, unique: true},
    us_password: {type: String, required: true},
    ut_user_type: {type: String, required: true},
    us_email_address: {type: String, required: true},
    us_contact: {type: String, required: true},
    us_user_creation_date: {type: Date, default: Date.now()},
    us_state: {type: String, default: 'Pending'}
});

var ReportSchema = new Schema({
    re_report_date: {type: Date},
    de_demand: {type: Schema.Types.ObjectId, required: true, ref: 'Demand'},
    co_commodities: [CommoditySchema],
    us_user: {type: Schema.Types.ObjectId, required: false, ref: 'User'},
    re_report_name: {type:String, required: true}
});

var EmailTypeSchema = new Schema({
    et_email_type_name: {type: String, required: true},
    et_email_type_desc: {type: String, required: true}
});

var EmailSchema = new Schema({
    //et_email_type: {type: Schema.Types.ObjectId, required: true, ref:'EmailType'},
    em_to: {type: String, required: true},
    em_from: {type: String, required: true},
    em_subject: {type: String, required: true},
    em_body: {type: String, required: true},
    em_cc: {type: String},
    em_bcc: {type: String},
    em_date_sent:{type: String, required: true, default:Date.now()},
    em_attachments: {type: String} //path to file.
});


/**
 * Farmer model.  This model is made up of personal information as well as
 * membership information relevant to the JAS.  There are several records
 * of membership being captured.  The most recent membership record will
 * contain the most current information about address etc.
 *
 * The Farmer also has the ability to post his wares/commodities to the app.
 *
 * TODO: Implement quick functions for getting current member info.
 *
 * TODO: Implement binary store to capture picture(s) for farmers.
 * @type {Model|*}
 */
exports.Farmer = mongoose.model('Farmer', FarmerSchema);


/**
 * Crop Model.  This model contains pre-defined information on a particular
 * crop and/or variety.  This is intended to be populated based on info from
 * RADA and will be used to help determine/validate potential yields for a
 * farmer(s).
 *
 * @type {Model|*}
 */
exports.Crop = mongoose.model('Crop', CropSchema);

/**
 * Membership Types example: Direct/Branch/Life Member/Affiliate
 * @type {Model|*}
 */
exports.MembershipType = mongoose.model('MembershipType', MembershipTypeSchema);

/**
 * The Parish Model allows for backwards compatibility with the JAS
 * numbering convention for Parishes.  This will be used for the
 * generation of membership numbers.
 *
 * @type {Model|*}
 */
exports.Parish = mongoose.model('Parish', ParishSchema);

/**
 * The Address Model can be used for any entity for which there is a
 * need to capture location information.
 *
 * TODO: Need to change the latitude and longitude into a GeoJSON Field
 * @type {Model|*}
 */
exports.Address = mongoose.model('Address', AddressSchema);

/**
 * A role allows for the capturing of histories for a position in a
 * JAS branch.
 * @type {Model|*}
 */
var Role = mongoose.model('Role', RoleSchema);

/**
 * A structure to capture the various branches and their leadership.
 * @type {Model|*}
 */
exports.Branch = mongoose.model('Branch', BranchSchema);

/**
 * This model is used to capture a membership record in the JAS
 * @type {Model|*}
 */
exports.Membership = mongoose.model('Membership',MembershipSchema);

/**
 * These are districts and extensions as captured by RADA.
 * @type {Model|*}
 */
exports.District = mongoose.model('District', DistrictSchema);

/**
 * Structure captures the Farmer's Farms and their locations
 * @type {Model|*}
 */
exports.Farm = mongoose.model('Farm', FarmSchema);

/**
 * This structure captures the various Units used throughout the
 * application
 * @type {Model|*}
 */
exports.Unit = mongoose.model('Unit', UnitSchema);

/**
 * This captures the various commodities that are seeking markets
 * @type {Model|*}
 */
exports.Commodity = mongoose.model('Commodity', CommoditySchema);

/**
 * These are the various Demands needed by buyers on the JAS platform
 * @type {Model|*}
 */
exports.Demand = mongoose.model('Demand', DemandSchema);

exports.CallType = mongoose.model('CallType', CallTypeSchema);

exports.CallLog = mongoose.model('CallLog', CallLogSchema);

exports.Transaction = mongoose.model('Transaction', TransactionSchema);

var Dispute = mongoose.model('Dispute', DisputeSchema);

var Event = mongoose.model('Event', EventSchema);

exports.User = mongoose.model('User', UserSchema);

var Audit = mongoose.model('Audit', AuditSchema);

exports.Representative = mongoose.model('Representative', RepresentativeSchema);

exports.Buyer = mongoose.model('Buyer', BuyerSchema);

exports.BuyerType = mongoose.model('BuyerType', BuyerTypeSchema);

exports.Comment = mongoose.model('Comment', CommentSchema);

exports.Supplier = mongoose.model('Supplier', SupplierSchema);

exports.Input = mongoose.model('Input', InputSchema);

exports.InputType = mongoose.model('InputType', InputTypeSchema);

exports.Report = mongoose.model('Report', ReportSchema);

exports.Email = mongoose.model('Email', EmailSchema);

exports.EmailType = mongoose.model('EmailType', EmailTypeSchema);
