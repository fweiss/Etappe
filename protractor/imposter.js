/**
 * Imposter is a nodejs wrapper for mountebank to make protractor test fixtures.
 *
 * The main pattern is a builder which provides an addStub() method.
 * This method takes two arguments:
 * * a query which becomes a mountebank equals predicate
 * * a body which becomes a mountebank JSON response wrapped with a 200 status and a cors header
 *
 * The put() method *puts* the built mountebank imposter and wraps it with a protractor promise.
 *
 * In protractor, you'll need to put all this in a beforeEach and to ensure the imposter is registered
 * before the test scenarios are run, use the flow.execute() method like this:
 *
 * / var flow = protractor.promise.controlFlow();
 * / flow.execute(function() { imposter.post() });
 *
 */
function Imposter() {
    this.options = {};
    this.options.url = 'http://localhost:2525/imposters';
    this.options.method = 'PUT';
    this.options.headers = { 'Content-type': 'application/json' };
    this.options.json = true;
    this.options.body = {
        imposters: [
            {
                port: 4545,
                protocol: 'http',
                stubs: []
            }
        ]
    };
}
Imposter.prototype.addStub = function(query, body) {
    var headers = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };
    var stub = {
        predicates: [
            {
                equals: {
                    query: query
                }
            }
        ],
        responses: [
            {
                is: {
                    status: 200,
                    headers: headers,
                    body: body
                }
            }
        ]};
    this.options.body.imposters[0].stubs.push(stub);
    return this;
};
Imposter.prototype.put = function() {
    var request = require('request');
    var defer = protractor.promise.defer();
    request.put(this.options, function(error, message, body) {
        if (error || message.statusCode >= 400) {
            defer.reject({
                error : error,
                message : message
            });
        } else {
            defer.fulfill(message);
        }
    });
    return defer.promise;
};

module.exports = Imposter;

