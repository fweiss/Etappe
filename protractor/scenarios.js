describe('carrier select', function() {
    var PROMPT = 1; // to account for the prompt option in select
    beforeEach(function() {
        // using mountebank here
        browser.addMockModule('sfmuni.config', function() {
            angular.module('sfmuni.config', {})
                .value('config', { baseUrl: 'http://localhost:4545' });
        });
        var flow = protractor.promise.controlFlow();
        flow.execute(mountebank);
        browser.get('http://localhost:8080/app/index.html');
    });
    afterEach(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    it('should prompt to select carrier', function() {
        expect(element(by.model('carrierSelect')).$('option:checked').getText()).toEqual('Choose a carrier');
    });
    it('should have available carriers', function() {
        expect(element(by.model('carrierSelect')).all(by.tagName('option')).count()).toEqual(2 + PROMPT);
    });
    it('should disable origin selection', function() {
        expect(element(by.model('originNexusSelect')).isEnabled()).toBe(false);
    });
    it('should disable destination selection', function() {
        expect(element(by.model('destinationNexusSelect')).isEnabled()).toBe(false);
    });

    describe('available stops', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
        });
        it('should show origin nexus', function() {
            expect(element(by.model('originNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
        it('should show destination nexus', function() {
            expect(element(by.model('destinationNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
    });

    describe('selected origin and destination', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
            element(by.cssContainingText('#originNexusSelect option', '16th St and Mission')).click();
            element(by.cssContainingText('#destinationNexusSelect option', '16th St and Harrison')).click();
        });
        xit('should show available routes', function() {
            expect(element(by.model('availableRoutes')).getText()).toBe('55 16th');
        });
        it('should show available rides', function() {
            expect(element(by.binding('rideList')).getText()).toBeGreaterThan(0);
        })
        describe('saving a plan', function() {
            var savedPlan;
           browser.addMockModule('plan.save', function() {
                angular.module('plan.save', {})
                    .service('save', function($window) {
                        return {
                            save: function(plan) {
                                savedPlan = plan;
                            }
                        }
                    });
            });
            xit('should save plan', function() {
                element(by.css('#savePlan')).click();
                expect(savedPlan).toEqual({ origin: '16th st and Mission'});
            });
        });
    });
    function mountebank() {
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
});

