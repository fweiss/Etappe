describe('domain trip', function() {
    var Trip;
    var Waypoint;
    var w1;
    var w2;
    var w3;
    beforeEach(module('plan'));
    beforeEach(inject(function(trip, waypoint) {
        Trip = trip;
        Waypoint = waypoint;
    }));
    beforeEach(function() {
        w1 = Waypoint.createWaypoint('w1', 1, 2);
        w2 = Waypoint.createWaypoint('w2', 1, 3);
        w3 = Waypoint.createWaypoint('w3', 1, 4);
    });
    describe('creation', function() {
        describe('validation', function() {
            it('error if origin not given', function() {
                var e1 = new Error('createTrip: must specify origin');
                expect(function() { Trip.createTrip(); }).toThrow(e1);
            });
            it('error if origin not waypoint type', function() {
                var e1 = new Error('createTrip: origin must be Waypoint type');
                expect(function() { Trip.createTrip({ }); }).toThrow(e1);
            });
            it('error if destination not given', function() {
                var e1 = new Error('createTrip: must specify destination');
                expect(function() { Trip.createTrip(w1); }).toThrow(e1);
            });
            it('error if destination not waypoint type', function() {
                var e1 = new Error('createTrip: destination must be Waypoint type');
                expect(function() { Trip.createTrip(w1, {}); }).toThrow(e1);
            });
        });
        describe('values', function() {
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
                });
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
    });
    describe('creation from waypoints', function() {
        //var w1 = Waypoint.createWaypoint('w1', 1, 2);
        describe('validation', function() {
            it('error when no waypoints list given', function() {
                var e = new Error('createFromWaypoints: waypoints must be an Array');
                expect(function() { Trip.createFromWaypoints(); }).toThrow(e);
            });
            it('error when waypoints list empty', function() {
                var e = new Error('createFromWaypoints: waypoints must have at least 2');
                expect(function() { Trip.createFromWaypoints([]); }).toThrow(e);
            });
            it('error when waypoints list single', function() {
                var e = new Error('createFromWaypoints: waypoints must have at least 2');
                expect(function() { Trip.createFromWaypoints([ {} ]); }).toThrow(e);
            });
            it('error when not Waypoint type', function() {
                var e = new Error('createFromWaypoints: waypoints must be type Waypoint');
                expect(function() { Trip.createFromWaypoints([ w1, {} ]); }).toThrow(e);
            })
        });
        describe('values', function() {
            var trip;
            var waypoints;
            beforeEach(function() {
                waypoints = [ w1, w2, w3 ];
                trip = Trip.createFromWaypoints(waypoints);
            });
            it('has copied waypoints', function() {
                expect(waypoints.length).toEqual(3);
            });
            it('has inner waypoints', function() {
                expect(trip.getInnerWaypoints()).toEqual([ w2 ]);
            });
            it('has initial origin', function() {
                expect(trip.getOrigin().getName()).toEqual('w1');
            });
            it('has initial destination', function() {
                expect(trip.getDestination().getName()).toEqual('w3');
            });
            it('has the waypoints', function() {
                expect(trip.getWaypoints()).toEqual([ w1, w2, w3 ]);
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
        xit('are immutable from setter', function() {
            var w1 = 'w1';
            trip.setInnerWaypoints([ w1 ]);
            w1 = 'x1';
            expect(trip.getInnerWaypoints()[0]).toEqual('w1');
        });
        xit('are immutable from getter', function() {
            trip.setInnerWaypoints([ 'w1' ]);
            trip.getInnerWaypoints()[0] = 'x1';
            expect(trip.getInnerWaypoints()[0]).toEqual('w1');
        });
        it('has all', function() {
            trip.setInnerWaypoints([ 'w1' ]);
            expect(trip.getWaypoints().length).toEqual(3);
        });
        // probably need Waypoint.copy() for this
        xit('type preserved by getter', function() {
            trip.setInnerWaypoints([ Waypoint.createWaypoint('w', 1, 2)]);
            var waypoint = trip.getInnerWaypoints()[0];
            expect(waypoint.constructor.name).toEqual('Waypoint');
        });
    });
});
