/**
 * Created by matjames007 on 11/11/15.
 */
var should_http = require('should-http');
var should = require('should');

var db = require('../../models/db');


exports.runTest = function(agent) {
    describe('Common Endpoints', function() {

        /**
         * This represents all the REST-based tests for the unit entities on the platform
         * via the exposed endpoints
         */
        describe('System Units', function() {

            /**
             * Check if this returns appropriate response when the mandatory fields are missing
             * from the post request.
             */
            it('should return 400 error - incorrect formatting', function(done) {
                var new_unit = {
                    un_unit_desc: "unit description"
                };

                agent
                    .post('/common/unit')
                    .send(new_unit)
                    // end handles the response
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }
                        // this is should.js syntax, very clear
                        res.should.have.status(400);
                        done();
                    });
            });
            /**
             * Creates a new unit as a test and removes it after.
             */
            it('should create a new unit - and respond with status 200', function(done) {
                this.timeout(10000);
                var new_unit = {
                    un_unit_name: "m",
                    un_unit_desc: "Metres",
                    un_unit_conversion: 1,
                    un_unit_class: "Length"
                };
                agent
                    .post('/common/unit')
                    .send(new_unit)
                    // end handles the response
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        /**
                         * Just deleting the test object!
                         */
                        db.Unit.remove({_id: res.body._id}, function(err, res) {
                            // this is should.js syntax, very clear
                            res.should.have.status(200);
                            should(res.body.un_unit_name).be.a.String();
                            should(res.body.un_unit_conversion).be.a.Number();
                            should.exist(res.body._id);
                            should.equal(new_unit.un_unit_name, res.body.un_unit_name, "Data Integrity Check Failed");
                            should.equal(new_unit.un_unit_desc, res.body.un_unit_desc, "Data Integrity Check Failed");
                            done();
                        });


                    });
            });
            it('should list all units on the platform', function(done){
                agent
                    .get('/common/units')
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
    });
};

