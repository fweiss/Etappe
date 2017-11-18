//      http://nathanleclaire.com/blog/2014/04/12/unit-testing-services-in-angularjs-for-fun-and-for-profit/
"use strict";

describe('feed sfmuni', function() {
    var baseUrl = 'http://webservices.nextbus.com/service/publicXMLFeed';
    var SfMuni;
    var httpBackend;
    var rootScope;
    var Nexus;
    var Waypoint;
    var Stop;
    var Segment;
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    function mockBackend(command, route, xml) {
        // kind of a hack, since all xml strings need to be properly encoded
        var encoded = String(xml).replace(/&/g, '&amp;');
        var query = '?a=sf-muni&command=' + command + (route ? '&r=' + route : '');
        httpBackend.whenGET(baseUrl + query).respond(encoded);
    }

    beforeEach(module('agencies', 'plan'));
    beforeEach(inject(function(_sfMuni_, $httpBackend, $rootScope, nexus, waypoint, stop, segment) {
        SfMuni = _sfMuni_;
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        Nexus = nexus;
        Waypoint = waypoint;
        Stop = stop;
        Segment = segment;
    }));
    describe('parser', function() {
        it('should accept special characters', function () {
            var xml = '<body><route><stop title="16th & Potrero"></stop><direction><stop></stop></direction></route></body>';
            mockBackend('routeConfig', 55, xml);
            SfMuni.getStopsForRoute('55').then(function (response) {
                var stops = response.data;
                expect(stops.length).toBe(1);
                var stop = stops[0];
                expect(stop.name).toBe('16th & Potrero');
            });
            httpBackend.flush();
        });
    });
    describe('stops', function() {
        // route > (stop, direction > stop)
        var xml;
        beforeEach(function() {
            xml = '<body><route><stop tag="2345" title="16th and Mission" stopId="12345"></stop><stop title="16th and Potrero"></stop><direction><stop></stop></direction></route></body>';
        });
        it('should get stops for route', function() {
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig&r=55').respond(xml);
            SfMuni.getStopsForRoute('55').then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
                var stop0 = stops[0];
                expect(stop0.name).toBe('16th and Mission');
                expect(stop0.stopId).toBe('12345');
                expect(stop0.stopTag).toBe('2345');
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
        // this doesn't really work because it drops stopIds
        xit('should remove duplicates', function() {
            var xml2 = '<body><route tag="33"><stop title="16th and Mission" stopId="12345" lat="1.2" lon="2.3"></stop><stop title="16th and Mission" stopId="12346" lat="1.2" lon="2.3"></stop><stop title="16th and Mission" stopId="12345" lat="1.2" lon="2.3"></stop></route></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml2);
            SfMuni.getAllStops().then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(2);
            });
            httpBackend.flush();
        });
        it('details', function() {
            var xml = '<body><route tag="55"><stop title="16th and Mission" tag="2345" stopId="12345" lat="12.2" lon="21.1"></stop></route></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml);
            SfMuni.getAllStops().then(function(response) {
                var stops = response.data;
                expect(stops.length).toBe(1);
                var stop = stops[0];
                expect(stop.getName()).toBe('16th and Mission');
                expect(stop.getAgencyId()).toBe('sfmuni');
                expect(stop.getRouteId()).toBe('55');
                expect(stop.getStopId()).toBe('12345');
                expect(stop.getLat()).toBe(12.2);
                expect(stop.getLon()).toBe(21.1);
                expect(stop.getStopTag()).toEqual('2345');
            });
            httpBackend.flush();
        });
        // FIXME add lat lon parse errors
        xit('should get allstops', function() {
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
        describe('nexuses', function() {
            it('should get all', function() {
                var xml1 = '<body><route tag="T"><stop title="16th and Mission" stopId="12345" lat="1" lon="2"></stop><stop title="16th and Mission" stopId="12346" lat="1" lon="2"></stop><stop title="16th and Mission" stopId="12345" lat="1" lon="2"></stop></route></body>';
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml1);
                SfMuni.getAllNexus().then(function(response) {
                    var nexus = response.data;
                    expect(nexus['16th and Mission']).toBeTruthy();
                    expect(nexus['16th and Mission'].stops.length).toBe(3);
                    var stop = nexus['16th and Mission'].stops[0];
                    expect(stop.getStopId()).toBe('12345');
                });
                httpBackend.flush();
            });
            it('should get with route, direction, tag', function() {
                var xml1 = '<body><route tag="F"><stop tag="2345" title="16th and Mission" stopId="12345" lat="1" lon="2"></stop></route></body>';
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml1);
                SfMuni.getAllNexus().then(function(response) {
                    var nexus = response.data;
                    expect(nexus['16th and Mission']).toBeTruthy();
                    expect(nexus['16th and Mission'].name).toBe('16th and Mission');
                    expect(nexus['16th and Mission'].stops.length).toBe(1);
                    var stop = nexus['16th and Mission'].stops[0];
                    expect(stop.getStopId()).toBe('12345');
                    expect(stop.getRouteId()).toBe('F');
                    expect(stop.getStopTag()).toBe('2345');
                });
                httpBackend.flush();
            });
            // parse '&'
            it('should merge stops for permuted intersection', function() {
                // FIXME allow &
                var xml1 = '<body><route tag="F"><stop tag="2345" title="16th & Mission" stopId="12345" lat="1" lon="2"></stop></route><route tag="G"><stop tag="2345" title="Mission & 16th" stopId="12345" lat="1" lon="2"></stop></route></body>';
                //httpBackend.whenGET(baseUrl + '?a=sf-muni&command=routeConfig').respond(xml1);
                mockBackend('routeConfig', null, xml1);
                SfMuni.getAllNexus().then(function(response) {
                    var nexus = response.data;
                    expect(Object.keys(nexus).length).toBe(1);
                    expect(nexus['16th & Mission']).toBeTruthy();
                    var n = nexus['16th & Mission'];
                    expect(n.stops.length).toBe(2);
                });
                httpBackend.flush();
            });
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
            xmlOrigin = '<body><predictions routeTag="55" routeTitle="foo"><direction>'
                + prediction(2356, 11, '6596789')
                + prediction(4444, 22, '6596789')
                + '</direction></predictions></body>';
            xmlDestination = '<body><predictions routeTag="55" routeTitle="foo"><direction>'
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
                expect(ride0.getAgencyId()).toBe('sf-muni');
                expect(ride0.getRouteId()).toEqual('55');
                expect(ride0.getVehicleId()).toBe('2356');
                expect(ride0.getStartTime() / round).toBeCloseTo(addMinutes(now, 11) / round, 0);
                expect(ride0.getEndTime() / round).toBeCloseTo(addMinutes(now, 22) / round, 0);
            });
            httpBackend.flush();
        });
        it('should get for multistops', function() {
            var now = new Date();
            var predictionXml = '<body><predictions routeTag="N"><direction>' + prediction('4444', 0, '55555') + '</direction></predictions>'
                + '<predictions routeTag="J"><direction><prediction></prediction></direction></predictions></body>';
            httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictionsForMultiStops&stops=N%7C2355&stops=J%7C5067').respond(predictionXml);
            var stop1 = Stop.createStop('s1', 'a1', 'N', '12355', 1, 1);
            stop1.setStopTag('2355');
            var stop2 = Stop.createStop('s2', 'a1', 'J', '15067', 1, 2);
            stop2.setStopTag('5067');
            //SfMun>i.getPredictionsForMultiStops([ { route: 'N', stopTag: '2355'}, { route: 'J', stopTag: '5067' } ]).then(function(response) {
            SfMuni.getPredictionsForMultiStops([ stop1, stop2 ]).then(function(response) {
                var predictions = response.data;
                expect(predictions.length).toBe(2);
                var p0 = predictions[0];
                expect(p0.vehicle).toBe('4444');
                expect(p0.tripTag).toBe('55555');
                expect(p0.time / round).toBeCloseTo(addMinutes(now, 0) / round, 0);
                expect(p0.route).toBe('N');
                var p1 = predictions[1];
                expect(p1.route).toBe('J');
            });
            httpBackend.flush();
        });
        describe('rides', function() {
            var superSegment;
            beforeEach(function() {
                var w1 = Waypoint.createWaypoint('w1', 1, 2);
                var w2 = Waypoint.createWaypoint('w2', 1, 2);
                // todo agencyid defined
                var s1 = Stop.createStop('stop1', 'sfmuni', 'R1', 'SID2222', 1, 2);
                s1.setStopTag('ST1');
                var originNexus = Nexus.createFromWaypoint(w1);
                originNexus.addStop(s1);
                var s2 = Stop.createStop('stop1', 'sfmuni', 'R1', 'SID2222', 1, 2);
                s2.setStopTag('ST2');
                var destinationNexus = Nexus.createFromWaypoint(w1);
                destinationNexus.addStop(s2);

                superSegment = Segment.createSegment(originNexus, destinationNexus);

            });
            it('should get rides between two stops and correctly match vehicles by time', function() {
                epochMilliSeconds = now.getTime();
                xmlOrigin = '<body><predictions routeTag="55"><direction>'
                    + prediction(2356, 11, '6596789')
                    + prediction(2356, 44, '6596789')
                    + '</direction></predictions></body>';
                xmlDestination = '<body><predictions routeTag="55"><direction>'
                    + prediction(2356, 22, '6596789')
                    + prediction(2356, 33, '6596790')
                    + '</direction></predictions></body>';
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=3293').respond(xmlOrigin);
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictions&stopId=7324').respond(xmlDestination);
                SfMuni.getRides('3293', '7324').then(function(response) {
                    var rides = response.data;
                    expect(rides.length).toEqual(1);
                    var ride0 = rides[0];
                    expect(ride0.constructor.name).toEqual('Ride');
                    expect(ride0.getStartTime() / round).toBeCloseTo(addMinutes(now, 11) / round, 0);
                    expect(ride0.getEndTime() / round).toBeCloseTo(addMinutes(now, 22) / round, 0);
                    expect(ride0.getAgencyId()).toBe('sf-muni');
                    expect(ride0.getVehicleId()).toBe('2356');
                });
                httpBackend.flush();
            });
            it('should error for no stops', function() {
                var originNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w1', 1, 2));
                var destinationNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w2', 1, 3));
                expect(function() {
                    SfMuni.getRidesForSegment(Segment.createSegment(originNexus, destinationNexus));
                }).toThrow(new Error('segment does not specify any stops'));
            });
            // needs $http.interrceptors
            xit('should error for backend error', function() {
                var xml = '<body copyright="All data copyright San Francisco Muni 2016.">'
                    + '<Error shouldRetry="false">The stop \'NA|\' was invalid because it did not contain a route, optional dir, and stop tag</Error>'
                + '</body>';
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictionsForMultiStops&stops=r1%7C').respond(xml);
                var originNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w1', 1, 2));
                var destinationNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w2', 1, 3));
                originNexus.addStop(Stop.createStop('s1', 'bart', 'r1', 'i1', 1, 1));
                destinationNexus.addStop(Stop.createStop('s2', 'bart', 'r1', 'i2', 1, 1));
                var segment = Segment.createSegment(originNexus, destinationNexus);
                expect(function() {
                    SfMuni.getRidesForSegment(segment);
                }).toThrow(new Error('sfmuni api error'));
                httpBackend.flush();
            });
            it('error for no sfmuni origin stops', function() {
                var originNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w1', 1, 2));
                var destinationNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w2', 1, 3));
                var segment = Segment.createSegment(originNexus, destinationNexus);
                segment.getOriginNexus().addStop(Stop.createStop('s1', 'bart', 'r1', 'i1', 1, 1));
                segment.getDestinationNexus().addStop(Stop.createStop('s2', 'sfmuni', 'r1', 'i2', 1, 1));
                expect(function() {
                    SfMuni.getRidesForSegment(segment);
                }).toThrow(new Error('segment does not specify any stops'));
            });
            it('error for no sfmuni destination stops', function() {
                var originNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w1', 1, 2));
                var destinationNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w2', 1, 3));
                var segment = Segment.createSegment(originNexus, destinationNexus);
                segment.getOriginNexus().addStop(Stop.createStop('s1', 'sfmuni', 'r1', 'i1', 1, 1));
                segment.getDestinationNexus().addStop(Stop.createStop('s2', 'bart', 'r1', 'i2', 1, 1));
                expect(function() {
                    SfMuni.getRidesForSegment(segment);
                }).toThrow(new Error('segment does not specify any stops'));
            });
            it('should get a ride for multi stops', function() {
                var originXml = '<body><predictions routeTag="N"><direction>' + prediction('4444', 0, '44444') + '</direction></predictions></body>';
                var destinationXml = '<body><predictions routeTag="N"><direction>' + prediction('4444', 10, '44444') + '</direction></predictions></body>';
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictionsForMultiStops&stops=N%7C2222').respond(originXml);
                httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictionsForMultiStops&stops=N%7C3333').respond(destinationXml);

                var originNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w1', 1, 2));
                var stop1 = Stop.createStop('s1', 'sfmuni', 'N', '2222', 1, 1);
                stop1.setStopTag('2222');
                originNexus.addStop(stop1);
                var destinationNexus = Nexus.createFromWaypoint(Waypoint.createWaypoint('w2', 1, 3));
                var stop2 = Stop.createStop('s2', 'sfmuni', 'N', '3333', 1, 2);
                stop2.setStopTag('3333');
                destinationNexus.addStop(stop2);
                //var segment = { originWaypoint: { name: 'w1', stops: [ { route: 'N', stopTag: '2222' }]}, destinationWaypoint: { name: 'w2', stops: [ { route: 'N', stopTag: '3333' }]}};
                var segment = Segment.createSegment(originNexus, destinationNexus);
                SfMuni.getRidesForSegment(segment).then(function(response) {
                    var rides = response.data;
                    expect(rides.length).toBe(1);
                    // maybe need to test data here, but ought to unit test getRidesForSegmentPredictions()
                });
//                rootScope.$apply(); // is this only needed when there's no $httBackend calls?
                httpBackend.flush();
            });
            it('should not be duplicate', function() {
                // observed that the muni predictions are duplicated, route 37, but it's the prediction time off by seconds
                function whenGetPredictionsForMultiStops(stops) {
                    return httpBackend.whenGET(baseUrl + '?a=sf-muni&command=predictionsForMultiStops&stops=' + stops.replace('|', '%7C'));
                }

                function predictionsForRoute(routeTag, predictions) {
                    var xb = new XB();
                    var direction = xb.wrap('body')
                        .wrap('predictions', { routeTag: routeTag})
                        .wrap('direction');
                    _.each(predictions, function(prediction) {
                        direction.wrap('prediction', prediction);
                    });
                    return xb.build();
                }

                function offsetTimeMinutes(offsetMinutes) {
                    return (epochMilliSeconds + offsetMinutes * 60000);
                }

                whenGetPredictionsForMultiStops('R1|ST1').respond(predictionsForRoute('R1', [
                    { vehicle: '4444', tripTag: '44444', epochTime: offsetTimeMinutes(0) },
                    { vehicle: '4444', tripTag: '44444', epochTime: offsetTimeMinutes(0.5) }
                ]));
                whenGetPredictionsForMultiStops('R1|ST2').respond(predictionsForRoute('R1', [
                    { vehicle: '4444', tripTag: '44444', epochTime: offsetTimeMinutes(10000) }
                ]));

                SfMuni.getRidesForSegment(superSegment).then(function(response) {
                    var rides = response.data;
                    expect(rides.length).toBe(1);
                });
                httpBackend.flush();
            });
        });
        // yuck this is just to patch sfmuni duplicate predictions
        describe('duplicate filter', function() {
            var previousPrediction;
            var nextPrediction;
            beforeEach(function() {
                previousPrediction = { vehicle: '', time: 0 };
                nextPrediction = { vehicle: 'v1', time: 1 * 60 * 1000 };
            });
            it('does initial', function() {
                var duplicate = SfMuni.duplicatenPredictionFilter(nextPrediction, previousPrediction);
                expect(duplicate).toBeFalsy();
                expect(previousPrediction.vehicle).toBe('v1');
            });
            it('distinct vehicle', function() {
                previousPrediction.vehicle = 'v2';
                var duplicate = SfMuni.duplicatenPredictionFilter(nextPrediction, previousPrediction);
                expect(duplicate).toBeFalsy();
                expect(previousPrediction.vehicle).toBe('v1');
            });
            it('distinct time', function() {
                var previousPrediction = { vehicle: 'v1', time: 2 * 60 * 1000 };
                var duplicate = SfMuni.duplicatenPredictionFilter(nextPrediction, previousPrediction);
                expect(duplicate).toBeFalsy();
                expect(previousPrediction.vehicle).toBe('v1');

            });
            it('merge time', function() {
                var previousPrediction = { vehicle: 'v1', time: 0.5 * 60 * 1000 };
                var duplicate = SfMuni.duplicatenPredictionFilter(nextPrediction, previousPrediction);
                expect(duplicate).toBeTruthy();
                expect(previousPrediction.vehicle).toBe('v1');

            });
        });
    });
    describe('utilities', function() {
        describe('permute stop streets', function() {
            describe('with &', function() {
                it('should match', function() {
                    var title = SfMuni.unPermuteStopTitle('x & y');
                    expect(title).toBe('x & y');
                });
                it('should flip', function() {
                    var title = SfMuni.unPermuteStopTitle('y & x');
                    expect(title).toBe('x & y');
                });
            });
        });
    });
});