describe('domain trip', function() {
    var Trip;
    var Waypoint;
    var w1;
    var w2;
    beforeEach(module('plan'));
    beforeEach(inject(function(_trip_, _waypoint_) {
        Trip = _trip_;
        Waypoint = _waypoint_;

        w1 = Waypoint.createWaypoint('w1', 1, 2);
        w2 = Waypoint.createWaypoint('w2', 1, 3);
    }));
    describe('validation', function() {
        it('error if origin not given', function() {
            var e1 = new Error('createTrip: must specify origin');
            expect(function() { Trip.createTrip(); }).toThrow(e1);
        });
        xit('error if origin not waypoint type', function() {
            var e1 = new Error('createTrip: origin must be Waypoint type');
            expect(function() { Trip.createTrip({ }); }).toThrow(e1);
        });
        it('error if destination not given', function() {
            var e1 = new Error('createTrip: must specify destination');
            expect(function() { Trip.createTrip(w1); }).toThrow(e1);
        });
        xit('error if destination not waypoint type', function() {
            var e1 = new Error('createTrip: destination must be Waypoint type');
            expect(function() { Trip.createTrip(w1, {}); }).toThrow(e1);
        });
    });
    describe('creation', function() {
        var trip;
        beforeEach(function() {
            trip = Trip.createTrip(w1, w2);
        });
        it('has initial origin', function() {
            expect(trip.getOrigin().getName()).toEqual('w1');
        });
        it('has initial destination', function() {
            expect(trip.getDestination().getName()).toEqual('w2');
        });
        it('has no initial inner waypoints', function() {
            expect(trip.getInnerWaypoints()).toEqual([]);
        });
        describe('name', function() {
            it('has generated name', function() {
                expect(trip.getName()).toMatch('Trip1')
;           });
            it('has unique generated name', function() {
                var trip2 = Trip.createTrip(w1, w2);
                expect(trip.getName()).not.toEqual(trip2.getName());
            });
            it('can set name', function() {
                trip.setName('another trip');
                expect(trip.getName()).toEqual('another trip');
            });
        });
    });
    describe('waypoints', function() {
        var trip;
        beforeEach(function() {
            trip = Trip.createTrip(w1, w2);
            trip.setInnerWaypoints([ 'w1', 'w2' ]);
        });
        it('can be set', function() {
            expect(trip.getInnerWaypoints()).toEqual([ 'w1', 'w2' ]);
        });
        it('are immutable from setter', function() {
            var w1 = 'w1';
            trip.setInnerWaypoints([ w1 ]);
            w1 = 'x1';
            expect(trip.getInnerWaypoints()[0]).toEqual('w1');
        });
        it('are immutable from getter', function() {
            trip.setInnerWaypoints([ 'w1' ]);
            trip.getInnerWaypoints()[0] = 'x1';
            expect(trip.getInnerWaypoints()[0]).toEqual('w1');
        });
        it('has all', function() {
            trip.setInnerWaypoints([ 'w1' ]);
            expect(trip.getWaypoints().length).toEqual(3);
        });
        xit('type preserved by getter', function() {
            trip.setInnerWaypoints([ Waypoint.createWaypoint('w', 1, 2)]);
            var waypoint = trip.getInnerWaypoints()[0];
            //console.log(waypoint);
            expect(waypoint.constructor.name).toEqual('Waypoint');
        });
    });
});
