module.exports = function() {
    var request = require('request');
    var defer = protractor.promise.defer();
    var options = {};
    options.url = 'http://localhost:2525/imposters';
    options.method = 'PUT';
    options.headers = { 'Content-type': 'application/json' };
    options.json = true;
    var headers = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };
    options.body = {
        imposters: [
            {
                port: 4545,
                protocol: 'http',
                stubs: []
            }
        ]
    };
    function addStub(query, body) {
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
        options.body.imposters[0].stubs.push(stub);
    }
    addStub({ command: 'routeConfig' }, '<body>'
    + '<route tag="N">'
    + '<stop tag="5555" title="16th St and Mission" stopId="15555"></stop>'
    + '<stop tag="4444" title="16th St and Harrison" stopId="14444"></stop>'
    + '</route>'
    + '</body>');
    addStub({ command: 'predictionsForMultiStops', stops: 'N|4444'}, '<body><predictions routeTag="N"><direction><prediction epochTime="2222" vehicle="3333" tripTag="7777"></prediction></direction></predictions></body>');
    addStub({ command: 'predictionsForMultiStops', stops: 'N|5555' }, '<body><predictions routeTag="N"><direction><prediction epochTime="1111" vehicle="3333" tripTag="7777"></prediction></direction></predictions></body>');

    request.put(options, function(error, message, body) {
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
}
