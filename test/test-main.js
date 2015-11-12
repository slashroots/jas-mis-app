/**
 * Created by matjames007 on 11/11/15.
 */
var should = require('should-http');
var request = require('supertest');
var db = require('../models/db');
var app = require('../app');


describe('Common Endpoints', function() {
    var agent = request.agent(app);

    /**
     * First simulate a login to the API.  By using the agent it stores the session cookie for
     * subsequent requests.  Please note that this uses the default username and password used
     * to setup the project.
     */
    before(function(done) {
        agent
            .post('/login')
            .send({
                username: process.env.DEFAULT_USER,
                password: process.env.DEFAULT_PASS
            })
            .end(function(err,res) {
                done();
            });
    });

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
            var new_unit = {
                un_unit_name: "m",
                un_unit_desc: "Metres",
                un_unit_conversion: "1",
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
                    // this is should.js syntax, very clear
                    res.should.have.status(200);
                    /**
                     * Just deleting the test object!
                     */
                    db.Unit.remove({_id: res.body._id}, function(err, res) {
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