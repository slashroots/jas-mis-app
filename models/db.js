/**
 * Created by matjames007 on 4/27/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/jas-mis-app');

var Farmer = mongoose.model('Farmer',
    {
        fa_first_name: String,
        fa_middle_name: String,
        fa_last_name: String,
        fa_dob: Date,
        fa_government_id: String,
        fa_rada_id: String,
        fa_contact: String,
        //fa_picture:
        deceased: Boolean,
        mi_membership: [Schema.Types.Mixed]
    });

var Crop = mongoose.model('Crop',
    {
        cr_crop_name: String,
        cr_crop_variety: String,
        cr_crop_mature_date: Date,
        cr_crop_avg_size: Number,
        cr_crop_planting_density_min: Number,
        cr_crop_planting_density_max: Number,
        cr_crop_season: String
    });

var MembershipType = mongoose.model('MembershipType',
    {
        mt_type_name: String,
        mt_type_desc: String
    });

var Parish = mongoose.model('Parish',
    {
        pa_parish_code: String,
        pa_parish_name: String
    });

var Address = mongoose.model('Address',
    {
        ad_address1: String,
        ad_address2: String,
        ad_latitude: Number,
        ad_longitude: Number,
        ad_city: String,
        pa_parish: Schema.Types.Mixed,
        ad_country: String
    });

var Role = mongoose.model('Role',
    {
        ro_start_date: {type: Date, default: Date.now()},
        ro_end_date: Date,
        fa_farmer: Schema.Types.Mixed
    });

var Branch = mongoose.model('Branch',
    {
        br_branch_name: String,
        ad_address: Schema.Types.Mixed,
        br_branch_description: String,
        br_contact: String,
        ro_president_id: [Schema.Types.Mixed],
        ro_v_president_id: [Schema.Types.Mixed],
        ro_secretary_id: [Schema.Types.Mixed],
        ro_tresurer_id: [Schema.Types.Mixed],
        ro_absrep_id: [Schema.Types.Mixed]
    });

var Membership = mongoose.model('Membership',
    {
        mi_jas_number: String,
        mi_start: Date,
        mi_expiration: Date,
        mt_type_id: Schema.Types.Mixed,
        br_branch_id: String,
        ad_address: Schema.Types.Mixed,
        mi_date_updated: {type: Date, default: Date.now()},
        mi_sub_sector: String
    });

var Farm = mongoose.model('Farm',
    {
        fr_district_id: String,
        fr_extension_id: String,
        ad_address_id: Schema.Types.Mixed,
        fr_size: Number
    });

var Unit = mongoose.model('Unit',
    {
        un_unit_name: String,
        un_unit_desc: String
    });

var Commodity = mongoose.model('Commodity',
    {
        cr_crop: Schema.Types.Mixed,
        fr_farm: Schema.Types.Mixed,
        bu_buyer: Schema.Types.Mixed,
        co_quantity: Number,
        un_quantity_unit: Schema.Types.Mixed,
        co_expiration_date: Date,
        co_quality: String,
        co_price: Number,
        un_price_unit: Schema.Types.Mixed,
        co_posting_date: {type: Date, default: Date.now()},
        co_payment_preference: String,
        co_availability_date: Date,
        co_notes: String,
        co_recurring: String,
        co_until: Date,
        co_parent_id: String //ideally this is a ID value... need to set the appropriate type here
    });

var Demand = mongoose.model('Demand',
    {
        cr_crop: Schema.Types.Mixed,
        bu_buyer: Schema.Types.Mixed,
        de_quantity: Number,
        un_quantity_unit: Schema.Types.Mixed,
        de_price: Number,
        un_price_unit: Schema.Types.Mixed,
        de_quality: String,
        de_fulfillment_date: Date,
        de_expiration_period: Number,
        de_posting_date: {type: Date, default: Date.now()},
        co_until: Date,
        de_payment_terms: String,
        de_recurring: String,
        de_parent_id: String //ideally this is a ID value... need to set the appropriate type here
    });

var CallType = mongoose.model('CallType',
    {
        ct_call_type_name: String,
        ct_call_type_desc: String
    });

var CallLog = mongoose.model('CallLog',
    {
        cc_caller_id: String,
        cc_entity_type: String,
        cc_entity_id: String,
        ct_call_type: Schema.Types.Mixed,
        cc_date: Date,
        cc_duration: Number,
        cc_quality: Number,
        cc_note: String,
        us_user_id: String,
        cc_incoming: Boolean
    });

var Transaction = mongoose.model('Transaction',
    {
        bu_buyer_id: String,
        fr_farmer_id: String,
        tr_quantity: Number,
        tr_value: Number,
        tr_date: Date,
        tr_date_created: {type: Date, default: Date.now()},
        tr_status: String,
        us_user_id: String,
        tr_note: String,
        de_demand: Schema.Types.Mixed,
        co_commodity: Schema.Types.Mixed
    });

var Dispute = mongoose.model('Dispute',
    {
        di_dispute_type: String,
        di_dispute_entity_type: String,
        di_dispute_description: String,
        di_dispute_entity: String,
        di_resolution_description: String,
        di_status: String,
        di_parent_id: String
    });

var Event = mongoose.model('Event',
    {
        ev_event_name: String,
        ev_event_description: String,
        us_user_id: String,
        ad_address: Schema.Types.Mixed,
        ev_cost: Number,
        ev_type_event: String,
        ev_host_info: String,
        ev_date: Date,
        ev_contact_details: String
    });

//
//us_user_id
//us_user_first_name
//us_user_last_name
//ut_user_type_id
//us_email_address
//us_contact
//us_user_creation_date
//
//
//ut_user_type_id
//ut_user_type_name
//ut_user_type_desc
//
//
//
//al_audit_id
//us_user_id
//al_table
//al_record_id
//au_before_commit
//au_after_commit
//au_date
//au_type
//
//
//bu_buyer_id
//bu_buyer_name
//bt_buyer_type_id
//bu_phone
//bu_email
//bu_payment_terms
//ad_address_id
//
//
//bt_buyer_type_id
//bt_buyer_type_name
//bt_buyer_type_desc
//
//
//in_integrity_id
//in_entity_id
//in_rank
//in_entity_type
//
//
//ct_comment_id
//ct_entity_id
//ct_type
//us_user_id
//ct_date
//ct_message
//
//
//su_supplier_id
//su_supplier_name
//su_description
//ad_address_id
//
//
//ip_input_id
//ip_input_name
//su_supplier_id
//ip_description
//ip_last_updated
//ip_price
//un_price_unit_id
//it_input_type_id
//ip_brand
//ip_jas_discounted
//ip_discount_terms
//
//
//it_input_type_id
//it_input_type_desc
//it_input_type_name