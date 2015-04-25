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
Imposter.prototype.post = function() {
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

