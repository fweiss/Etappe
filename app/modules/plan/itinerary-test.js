describe('domain itinerary', function() {
    var Itinerary;
    var Trip;
    var Waypoint;
    var Nexus;
    var Stop;
    beforeEach(module('plan'));
    beforeEach(inject(function (_itinerary_, _trip_, _waypoint_, nexus, stop) {
        Itinerary = _itinerary_;
        Trip = _trip_;
        Waypoint = _waypoint_;
        Nexus = nexus;
        Stop = stop;
    }));
    var trip;
    var w1;
    var w2;
    var w3;
    beforeEach(function() {
        w1 = Waypoint.createWaypoint('w1', 21, 31);
        w2 = Waypoint.createWaypoint('w2', 22, 32);
        w3 = Waypoint.createWaypoint('w3', 23, 33);
        trip = Trip.createTrip(w1, w2);
    });
    describe('create', function() {
        describe('validation error', function() {
            var e1 = new Error('createItinerary: trip is required');
            it('should require trip', function() {
                expect(function() { Itinerary.createItinerary(); }).toThrow(e1);
            });
        });
        describe('value', function() {
            var itinerary;
            beforeEach(function() {
                itinerary = Itinerary.createItinerary(trip);
            });
            it('has trip', function() {
                expect(itinerary.getTrip()).toBe(trip);
            });
            it('can create with segments', function() {
                // FIXME use Segment
                var segments = [ { originNexus: { name: 'n1' }, destinationNexus: {}, rides: [] }];
                var itinerary = Itinerary.createItinerary(trip, segments);
                expect(itinerary.getSegments()[0].originNexus.name).toEqual('n1');
            });
            xit('error when trip waypoints do not match segments', function() {
                var e1 = new Error('createItinerary: segments to not match trip waypoints');


            });
            it('has empty span', function() {
                expect(itinerary.getSpan().spanStart).toEqual(0);
                expect(itinerary.getSpan().spanEnd).toEqual(0);
            });
            it('can set span', function() {
                itinerary.setSpan(1, 2);
                expect(itinerary.getSpan().spanStart).toEqual(1);
                expect(itinerary.getSpan().spanEnd).toEqual(2);
            });
        });
    });
    describe('segments', function() {
        // it cannot have zero segments
        it('should have two segments for one inner waypoint', function() {
            trip.setInnerWaypoints([ w3 ]);
            var itinerary = Itinerary.createItinerary(trip);
            expect(itinerary.getSegments().length).toBe(2);
        });
        it('should have segment with empty rides', function() {
            var itinerary = Itinerary.createItinerary(trip);
            expect(itinerary.getSegments()[0].getRides().length).toBe(0);
        });
    });
    describe('create segments from nexuses', function() {
        var method = 'createSegmentsFromNexuses: ';
        describe('validation error', function() {
            it('when no nexuses given', function() {
                var e = new Error('createSegmentsFromNexuses: nexuses must be given');
                expect(function() { Itinerary.createSegmentsFromNexuses(); }).toThrow(e);
            });
            it('when nexuses not Array type', function() {
                var e = new Error('createSegmentsFromNexuses: nexuses must be Array type');
                expect(function() { Itinerary.createSegmentsFromNexuses('string'); }).toThrow(e);
            });
            it('when nexuses less than 2', function() {
                var e = new Error('createSegmentsFromNexuses: nexus count must be 2 or more')
                expect(function() { Itinerary.createSegmentsFromNexuses([ {} ]); }).toThrow(e);
            });
            it('when nexuses not Nexus type', function() {
                var e = new Error('createSegmentsFromNexuses: nexuses must be Nexus type')
                expect(function() { Itinerary.createSegmentsFromNexuses([ {}, {} ]); }).toThrow(e);
            });
            it('when duplicated adjacent', function() {
                var n1 = Nexus.createFromWaypoint(w1);
                var n2 = Nexus.createFromWaypoint(w2);
                var e = new Error(method + 'adjacent nexus must not be duplicate');
                expect(function() { Itinerary.createSegmentsFromNexuses([ n1, n2, n2 ]); }).toThrow(e);
            });
        });
        describe('values', function() {
            var n1;
            var n2;
            var n3;
            beforeEach(function() {
                n1 = Nexus.createFromWaypoint(w1);
                n2 = Nexus.createFromWaypoint(w2);
                n3 = Nexus.createFromWaypoint(w3);
            });
            it('has one segment of type Segment', function() {
                var segments = Itinerary.createSegmentsFromNexuses([ n1, n2 ]);
                expect(segments[0].constructor.name).toEqual('Segment');
            });
            it('has two segment', function() {
                var segments = Itinerary.createSegmentsFromNexuses([ n1, n2, n3 ]);
                expect(segments.length).toEqual(2);
            });
            describe('agencies', function() {
                it('are from matching stops', function() {
                    n1.addStop(Stop.createStop('n1', 'a', 'r', 'i1', 1, 2));
                    n2.addStop(Stop.createStop('n2', 'a', 'r', 'i2', 3, 4));
                    var segments = Itinerary.createSegmentsFromNexuses([ n1, n2 ]);
                    var segment = segments[0];
                    expect(segment.getAgencies().length).toEqual(1);
                    expect(segment.getAgencies()[0]).toEqual('a');
                });
            });
        });
    });
});
