/**
 * Created by matjames007 on 11/11/15.
 */
var request = require('supertest');
var app = require('../app');
var common_route = require("./common/test-common-route");
var farmer_route = require("./farmer/test-farmer-route");

describe('JAS Marketing Information Center', function() {
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

    describe('API Endpoints', function() {
        common_route.runTest(agent);
        farmer_route.runTest(agent);
    });
});