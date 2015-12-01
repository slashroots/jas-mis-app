/**
 * Created by matjames007 on 11/30/15.
 */
/**
 * Created by matjames007 on 11/11/15.
 */
var should_http = require('should-http'),
    should = require('should'),
    db = require('../../models/db'),
    moment = require('moment');

/**
 * This represents all the REST-based tests for the farmer entities on the platform
 * via the exposed endpoints
 */
exports.runTest = function(agent) {
    describe('Farmer Endpoints', function() {

        /**
         * Check if this returns appropriate response when the mandatory fields are missing
         * from the post request.
         */
        it('should return 400 error - incorrect formatting', function(done) {
            /**
             * No mandatory fields are present in this object.  This should
             * be invalid!
             */
            var new_farmer = {
                desc: "unit description"
            };

            agent
                .post('/farmer')
                .send(new_farmer)
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    /**
                     * The error must always have a message and a
                     * list of the conflicting fields (contained in
                     * the errors array)
                     */
                    should.exist(res.body.message);
                    should.exist(res.body.errors);
                    res.should.have.status(400);
                    done();
                });
        });
        /**
         * Creates a new farmer as a test and removes it and all dependencies after
         * a successful test.
         */
        it('should create a new farmer - and respond with status 200', function(done) {
            /**
             * Address is a mandatory field in the farmer object!
             */
            var new_address = {
                ad_address1: "2 Test Script Avenue",
                pa_parish: "St. Testing"
            };
            agent
                .post('/common/address')
                .send(new_address)
                .end(function(err, res1) {
                    if(err) {
                        throw err;
                    }
                    var new_farmer = {
                        fa_jas_number: "0000000000000",
                        fa_first_name: "Freddy",
                        fa_last_name: "Krueger",
                        fa_gender: "M",
                        fa_dob: Date.now(),
                        fa_government_id: "AA23928",
                        ad_address: res1.body._id,
                        fa_deceased: false
                    };
                    agent
                        .post('/farmer')
                        .send(new_farmer)
                        // end handles the response
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }

                            /**
                             * Just deleting the test objects!
                             */
                            db.Address.remove({_id: res1.body._id}, function(err, r) {
                                db.Farmer.remove({_id: res.body._id}, function(err, r) {
                                    /**
                                     * Examine the response of the web service
                                     * and ensure correct responses.
                                     */
                                    res.should.have.status(200);
                                    should(res.body.fa_jas_number).be.a.String();
                                    should.exist(res.body._id);
                                    should.equal(new_farmer.fa_first_name, res.body.fa_first_name, "Data Integrity Check Failed");
                                    should.equal(new_farmer.fa_last_name, res.body.fa_last_name,  "Data Integrity Check Failed");
                                    should.equal(new_farmer.fa_gender, res.body.fa_gender, "Data Integrity Check Failed");
                                    should.equal(moment(new Date(new_farmer.fa_dob)).toISOString(),res.body.fa_dob, "Data Integrity Check Failed");
                                    done();
                                });
                            });


                        });


                });
        });
        it('should list all farmers on the platform', function(done){
            agent
                .get('/farmers')
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });

    });
};

