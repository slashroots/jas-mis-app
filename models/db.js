/**
 * Created by matjames007 on 4/27/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * TODO: Need to make the .connect method read from env variables for heroku
 */
mongoose.connect('mongodb://localhost/jas-mis-app');

/**
 *  These are the schema for the entire application
 *  This will also be used as a validation point.
 */
var UnitSchema = new Schema({
    un_unit_name: {type: String, required: true, unique: true},
    un_unit_desc: String
});
var CommentSchema = new Schema({
    us_user_id: {type: Schema.Types.ObjectId, required: true},
    ct_date: {type: Date, default: Date.now()},
    ct_message: {type: String, required: true}
});
var CropSchema = new Schema({
    cr_crop_name: {type: String, required: true},
    cr_crop_variety: String,
    cr_crop_mature_date: Date,
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
    pa_parish: {required: true, type: Schema.Types.ObjectId},
    ad_country: {type: String, required: true}
});
var RoleSchema = new Schema({
    ro_start_date: {type: Date, default: Date.now()},
    ro_end_date: Date,
    fa_farmer: Schema.Types.ObjectId
});
var BranchSchema = new Schema({
    br_branch_name: String,
    ad_address: Schema.Types.ObjectId,
    br_branch_description: String,
    br_contact: String,
    ro_president_id: [RoleSchema],
    ro_v_president_id: [RoleSchema],
    ro_secretary_id: [RoleSchema],
    ro_tresurer_id: [RoleSchema],
    ro_absrep_id: [RoleSchema]
});
var MembershipSchema = new Schema({
    mi_jas_number: {type: String, required: true},
    mi_start: {type: Date, required: true},
    mi_expiration: {type: Date, required: true},
    mt_type_id: {type: Schema.Types.ObjectId, required: true},
    br_branch_id: Schema.Types.ObjectId,
    ad_address_id: {type: Schema.Types.ObjectId, required: true},
    mi_date_updated: {type: Date, default: Date.now()},
    mi_due_owed: {type: Number, required: true},
    mi_due_paid: {type: Number, required: true},
    mi_sub_sector: String
});
var FarmSchema = new Schema({
    fr_district_id: String,
    fr_extension_id: String,
    ad_address_id: {type: Schema.Types.ObjectId, required: true},
    fr_size: {type: Number, required: true}
});
var CommoditySchema = new Schema({
    cr_crop: {type: Schema.Types.ObjectId, required: true},
    fr_farm: Schema.Types.ObjectId,
    co_quantity: {type: Number, required: true},
    un_quantity_unit: {type: Schema.Types.ObjectId, required: true},
    co_expiration_date: Date,
    co_quality: String,
    co_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.Mixed, required: true},
    co_posting_date: {type: Date, default: Date.now()},
    co_payment_preference: String,
    co_availability_date: Date,
    co_notes: String,
    co_recurring: String,
    co_until: Date,
    co_parent_id: Schema.Types.ObjectId,
    ct_comments: [CommentSchema]
});
var DemandSchema = new Schema({
    cr_crop: {type: Schema.Types.ObjectId, required: true},
    de_quantity: {type: Number, required: true},
    un_quantity_unit: {type: Schema.Types.ObjectId, required: true},
    de_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.ObjectId, required: true},
    de_quality: String,
    de_fulfillment_date: Date,
    de_expiration_period: Number,
    de_posting_date: {type: Date, default: Date.now()},
    co_until: Date,
    de_payment_terms: {type: String, required: true},
    de_recurring: String,
    de_parent_id: Schema.Types.ObjectId,
    ct_comments: [CommentSchema]
});
var TransactionSchema = new Schema({
    bu_buyer_id: Schema.Types.ObjectId,
    fr_farmer_id: Schema.Types.ObjectId,
    tr_quantity: {type: Number, required: false},
    tr_value: {type: Number, required: false},
    tr_date: Date,
    tr_date_created: {type: Date, default: Date.now()},
    tr_status: {type:String, required: true},
    us_user_id: Schema.Types.ObjectId,
    tr_note: String,
    de_demand: Schema.Types.ObjectId,
    co_commodity: Schema.Types.ObjectId,
    ct_comments: [CommentSchema]
});
var FarmerSchema = new Schema({
    fa_first_name: {type: String, required: true},
    fa_middle_name: String,
    fa_last_name: {type: String, required: true},
    fa_dob: Date,
    fa_government_id: String,
    fa_rada_id: String,
    fa_contact: String,
    //fa_picture:
    deceased: {type: Boolean, required: true},
    mi_membership: [MembershipSchema],
    fr_farms: [FarmSchema],
    ct_comments: [CommentSchema],
    co_commodities: [CommoditySchema],
    in_integrity: Schema.Types.ObjectId
});
var CallTypeSchema = new Schema({
    us_user_id: {type: Schema.Types.ObjectId, required: true},
    ct_date: {type: Date, default: Date.now()},
    ct_message: {type: String, required: true}
});
var CallLogSchema = new Schema({
    cc_caller_id: String,
    cc_entity_type: String,
    cc_entity_id: Schema.Types.ObjectId,
    ct_call_type: Schema.Types.ObjectId,
    cc_date: Date,
    cc_duration: Number,
    cc_quality: Number,
    cc_note: String,
    us_user_id: Schema.Types.ObjectId,
    cc_incoming: Boolean
});
var BuyerTypeSchema = new Schema({
    bt_buyer_type_name: {type: String, required: true, unique: true},
    bt_buyer_type_desc: String
});
var BuyerSchema = new Schema({
    bu_buyer_name: {type: String, required: true, unique: true},
    bt_buyer_type: Schema.Types.ObjectId,
    bu_phone: String,
    bu_email: String,
    bu_payment_terms: String,
    ad_address: Schema.Types.ObjectId,
    ct_comments: [CommentSchema],
    in_integrity: Schema.Types.ObjectId,
    de_demands: [DemandSchema]
});
var InputTypeSchema = new Schema({
    it_input_type_desc: {type: String, required: true},
    it_input_type_name: {type: String, required: true}
});
var InputSchema = new Schema({
    ip_input_name: {type: String, required: true},
    ip_description: String,
    ip_last_updated: {type: Date, default: Date.now()},
    ip_price: {type: Number, required: true},
    un_price_unit: {type: Schema.Types.ObjectId, required: true},
    it_input_type: {type: Schema.Types.ObjectId, required: true},
    ip_brand: String,
    ip_jas_discounted: String,
    ip_discount_terms: String
});
var SupplierSchema = new Schema({
    su_supplier_name: {type: String, required: true, unique: true},
    su_description: String,
    ad_address: {type: Schema.Types.ObjectId, required: true, unique: true},
    ip_inputs: [InputSchema]
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
var IntegritySchema = new Schema({
    in_entity_id: {type: Schema.Types.ObjectId, required: true, unique: true},
    in_rank: {required: true, type: Number},
    in_entity_type: {type: String, required: true}
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
var UserTypeSchema = new Schema({
    ut_user_type_name: {type: String, required: true},
    ut_user_type_desc: {type: String, required: true}
});
var UserSchema = new Schema({
    us_user_first_name: {type: String, required: true},
    us_user_last_name: {type: String, required: true},
    ut_user_type: {type: Schema.Types.ObjectId, required: true},
    us_email_address: String,
    us_contact: String,
    us_user_creation_date: {type: Date, default: Date.now()}
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
var Crop = mongoose.model('Crop', CropSchema);

/**
 * Membership Types example: Direct/Branch/Life Member/Affiliate
 * @type {Model|*}
 */
var MembershipType = mongoose.model('MembershipType', MembershipTypeSchema);

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
var Branch = mongoose.model('Branch', BranchSchema);

/**
 * This model is used to capture a membership record in the JAS
 * @type {Model|*}
 */
exports.Membership = mongoose.model('Membership',MembershipSchema);

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
var Unit = mongoose.model('Unit', UnitSchema);

/**
 * This captures the various commodities that are seeking markets
 * @type {Model|*}
 */
var Commodity = mongoose.model('Commodity', CommoditySchema);

/**
 * These are the various Demands needed by buyers on the JAS platform
 * @type {Model|*}
 */
var Demand = mongoose.model('Demand', DemandSchema);

var CallType = mongoose.model('CallType', CallTypeSchema);

var CallLog = mongoose.model('CallLog', CallLogSchema);

var Transaction = mongoose.model('Transaction', TransactionSchema);

var Dispute = mongoose.model('Dispute', DisputeSchema);

var Event = mongoose.model('Event', EventSchema);

var User = mongoose.model('User', UserSchema);

var UserType = mongoose.model('UserType', UserTypeSchema);

var Audit = mongoose.model('Audit', AuditSchema);

var Buyer = mongoose.model('Buyer', BuyerSchema);

var BuyerType = mongoose.model('BuyerType', BuyerTypeSchema);

var Integrity = mongoose.model('Integrity', IntegritySchema);

exports.Comment = mongoose.model('Comment', CommentSchema);

var Supplier = mongoose.model('Supplier', SupplierSchema);

var Input = mongoose.model('Input', InputSchema);

var InputType = mongoose.model('InputType', InputTypeSchema);
