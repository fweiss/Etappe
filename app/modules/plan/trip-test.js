describe('domain trip', function() {
    var Trip;
    beforeEach(module('plan'));
    beforeEach(inject(function(_trip_) {
        Trip = _trip_;
    }));
    describe('creation', function() {
        var trip;
        beforeEach(function() {
            trip = Trip.createTrip('o', 'd');
        });
        it
        it('error if origin not given', function() {
            var e1 = new Error('createTrip: must specify origin');
            expect(function() { Trip.createTrip(); }).toThrow(e1);
        });
        it('error if destination not given', function() {
            var e1 = new Error('createTrip: must specify destination');
            expect(function() { Trip.createTrip('origin'); }).toThrow(e1);
        });
        it('has initial origin', function() {
            expect(trip.getOrigin()).toEqual('o');
        });
        it('has initial destination', function() {
            expect(trip.getDestination()).toEqual('d');
        });
        it('has no initial inner waypoints', function() {
            expect(trip.getInnerWaypoints()).toEqual([]);
        });
        describe('name', function() {
            it('has generated name', function() {
                expect(trip.getName()).toMatch('Trip1')
;           });
            it('has unique generated name', function() {
                var trip2 = Trip.createTrip('o', 'd');
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
            trip = Trip.createTrip('o', 'd');
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
    });
});
