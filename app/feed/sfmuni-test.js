//      http://nathanleclaire.com/blog/2014/04/12/unit-testing-services-in-angularjs-for-fun-and-for-profit/
"use strict";

describe('sfmuni', function() {
    var baseUrl = 'http://webservices.nextbus.com/service/publicXMLFeed';
    var SfMuni;
    var httpBackend;
    var Plan;
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    beforeEach(module('agencies', 'etappe'));
    beforeEach(inject(function(_sfMuni_, $httpBackend, plan) {
        SfMuni = _sfMuni_;
        httpBackend = $httpBackend;
        Plan = plan;
    }));
    describe('stops', function() {
        // route > (stop, direction > stop)
        var xml;
        beforeEach(function() {
            xml = '<body><route><stop title="16th and Mission" stopId="12345"></stop><stop title="16th and Potrero"></stop><direction><stop></stop></direction></route></body>';
        });
        it('should get stops', function() {
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig&r=55').respond(xml);
            SfMuni.getStopsForRoute('55').then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
                var stop0 = stops[0];
                expect(stop0.name).toBe('16th and Mission');
                expect(stop0.stopId).toBe('12345');
            });
            httpBackend.flush();
        });
        it('should sort by name', function() {
            xml = '<body><route><stop title="16th and Mission" stopId="12345"></stop><stop title="16th and Harrison"></stop><direction><stop></stop></direction></route></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig&r=55').respond(xml);
            SfMuni.getStopsForRoute('55').then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
                var stop0 = stops[0];
                var stop1 = stops[1];
                expect(stop0.name).toBeLessThan(stop1.name);
            });
            httpBackend.flush();
        });
        it('should remove duplicates', function() {
            var xml2 = '<body><route><stop title="16th and Mission" stopId="12345"></stop><stop title="16th and Mission" stopId="12346"></stop><stop title="16th and Mission" stopId="12345"></stop></route></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml2);
            SfMuni.getAllStops().then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
            });
            httpBackend.flush();
        });
        it('should get allstops', function() {
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml);
            SfMuni.getAllStops().then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
                var stop0 = stops[0];
                expect(stop0.name).toBe('16th and Mission');
                expect(stop0.stopId).toBe('12345');
            });
            httpBackend.flush();
        });
    });
    describe('predictions', function() {
        var round = 10;
        var now;
        var epochMilliSeconds;
        var xmlOrigin;
        var xmlDestination;
        function prediction(vehicle, offsetMinutes, tripTag) {
            return '<prediction vehicle="' + vehicle + '" epochTime="' + (epochMilliSeconds + offsetMinutes * 60000) + '" tripTag="' + tripTag + '"></prediction>'
        }
        beforeEach(function() {
            now = new Date();
            epochMilliSeconds = now.getTime();
            xmlOrigin = '<body><predictions><direction routeTag="55">'
                + prediction(2356, 11, '6596789')
                + prediction(4444, 22, '6596789')
                + '</direction></predictions></body>';
            xmlDestination = '<body><predictions><direction routeTag="55">'
                + prediction(2356, 22, '6596789')
                + prediction(2357, 33, '6596789')
                + '</direction></predictions></body>';
        });
        it('should get predictions for stop id', function() {
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=13293').respond(xmlOrigin);
            SfMuni.getPredictionsForStopId('13293').then(function(response) {
                var predictions = response.data;
                expect(predictions.length).toEqual(2);
                var prediction0 = predictions[0];
                expect(prediction0.vehicle).toBe('2356');
                expect(prediction0.tripTag).toBe('6596789');
                expect(prediction0.time / round).toBeCloseTo(addMinutes(now, 11) / round);
                expect(prediction0.route).toBe('55');
            });
            httpBackend.flush();
        });
        it('should get rides between two stops', function() {
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=3293').respond(xmlOrigin);
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=7324').respond(xmlDestination);
            SfMuni.getRides('3293', '7324').then(function(response) {
                var rides = response.data;
                expect(rides.length).toEqual(1);
                var ride0 = rides[0];
                expect(ride0.startTime / round).toBeCloseTo(addMinutes(now, 11) / round, 0);
                expect(ride0.endTime / round).toBeCloseTo(addMinutes(now, 22) / round, 0);
                expect(ride0.agency).toBe('sf-muni');
                expect(ride0.vehicle).toBe('2356');
            });
            httpBackend.flush();
        });
        it('should get rides between two stops and correctly match vehicles by time', function() {
            epochMilliSeconds = now.getTime();
            xmlOrigin = '<body><predictions><direction routeTag="55">'
                + prediction(2356, 11, '6596789')
                + prediction(2356, 44, '6596789')
                + '</direction></predictions></body>';
            xmlDestination = '<body><predictions><direction routeTag="55">'
                + prediction(2356, 22, '6596789')
                + prediction(2356, 33, '6596790')
                + '</direction></predictions></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=3293').respond(xmlOrigin);
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=7324').respond(xmlDestination);
            SfMuni.getRides('3293', '7324').then(function(response) {
                var rides = response.data;
                expect(rides.length).toEqual(1);
                var ride0 = rides[0];
                expect(ride0.startTime / round).toBeCloseTo(addMinutes(now, 11) / round, 0);
                expect(ride0.endTime / round).toBeCloseTo(addMinutes(now, 22) / round, 0);
                expect(ride0.agency).toBe('sf-muni');
                expect(ride0.vehicle).toBe('2356');
            });
            httpBackend.flush();
        });
    });
});