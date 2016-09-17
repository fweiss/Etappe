describe('domain itinerary', function() {
    var Itinerary;
    var Trip;
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (_itinerary_, _trip_, _waypoint_) {
        Itinerary = _itinerary_;
        Trip = _trip_;
        Waypoint = _waypoint_;
    }));
    var trip;
    var w1;
    var w2;
    var w3;
    beforeEach(function() {
        w1 = Waypoint.createWaypoint('w1', 21, 31);
        w2 = Waypoint.createWaypoint('w2', 22, 32);
        w2 = Waypoint.createWaypoint('w3', 23, 33);
        trip = Trip.createTrip(w1, w2);
   });
    describe('creation', function() {
        describe('validation', function() {
            var e1 = new Error('createItinerary: trip is required');
            it('should require trip', function() {
                expect(function() { Itinerary.createItinerary(); }).toThrow(e1);
            });
        });
        it('should have trip', function() {
            var itinerary = Itinerary.createItinerary(trip);
            expect(itinerary.getTrip()).toBe(trip);
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
            expect(itinerary.getSegments()[0].rides.length).toBe(0);
        });
    });
});
