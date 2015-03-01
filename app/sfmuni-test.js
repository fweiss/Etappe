//      http://nathanleclaire.com/blog/2014/04/12/unit-testing-services-in-angularjs-for-fun-and-for-profit/
"use strict";

describe('trial service test4', function() {
    var baseUrl = 'http://webservices.nextbus.com/service/publicXMLFeed';
    var SfMuni;
    var httpBackend;
    var Plan;
    beforeEach(module('agencies', 'etappe'));
    beforeEach(inject(function(_sfMuni_, $httpBackend, plan) {
        SfMuni = _sfMuni_;
        httpBackend = $httpBackend;
        Plan = plan;
    }));
    it('should get data', function() {
        var xml = '<body><route tag="aa" title="bb"><stop tag="xx" title="yy" shortTitle="zz"></stop></route></body>';
        httpBackend.whenGET(baseUrl).respond(xml);
        SfMuni.getData().then(function(response) {
            var routes = response.data;
            expect(routes.length).toEqual(1);
            expect(routes[0].id).toEqual('aa');
        });
        httpBackend.flush();
    });
    it('should get predictions', function() {
        var xml = '<body><predictions><direction></direction><direction></direction></predictions></body>';
        httpBackend.whenGET('http://webservices.nextbus.com/service/publicXMLFeed?a=sf-muni&command=predictions&r=55').respond(xml);
        SfMuni.getPredictions('55').then(function(response) {
            var predictions = response.data;
            expect(predictions.directions.length).toEqual(2);
        });
        httpBackend.flush();
    });
    // route > (stop, direction > stop)
    it('should get stops', function() {
        var xml = '<body><route><stop title="16th and Mission"></stop><stop title="16th and Potrero"></stop><direction><stop></stop></direction></route></body>';
        httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig&r=55').respond(xml);
        SfMuni.getStops('55').then(function(stops) {
            expect(stops.length).toBe(2);
            var stop0 = stops[0];
            expect(stop0.name).toBe('16th and Mission');
        });
        httpBackend.flush();
    });
});