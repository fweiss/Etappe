describe('domain ride', function() {
    var Ride;

    beforeEach(module('plan'));
    beforeEach(inject(function(ride) {
        Ride = ride;
    }));

    describe('create', function() {
        describe('validation error', function() {
            it('when no agency', function() {
                var e1 = new Error('createRide: must specify agency');
                expect(function() { Ride.createRide(); }).toThrow(e1);
            });
            it('when no route id', function() {
                var e1 = new Error('createRide: must specify route id');
                expect(function() { Ride.createRide('a1'); }).toThrow(e1);
            });
            it('when no vehicle id', function() {
                var e1 = new Error('createRide: must specify vehicle id');
                expect(function() { Ride.createRide('a1', 'r2'); }).toThrow(e1);
            });
            it('when no start time', function() {
                var e1 = new Error('createRide: must specify start time');
                expect(function() { Ride.createRide('a1', 'r2', 'v3'); }).toThrow(e1);
            });
            it('when start time not Date type', function() {
                var e1 = new Error('createRide: start time is not Date type');
                expect(function() { Ride.createRide('a1', 'r2', 'v3', '12:00'); }).toThrow(e1);
            });
            it('when no end time', function() {
                var e1 = new Error('createRide: end time is not given');
                expect(function() { Ride.createRide('a1', 'r2', 'v3', new Date()); }).toThrow(e1);
            });
            it('when end time not Date type', function() {
                var e1 = new Error('createRide: end time is not Date type');
                expect(function() { Ride.createRide('a1', 'r2', 'v3', new Date(), '13:00'); }).toThrow(e1);
            });
        });
        describe('value', function() {
            var st = new Date();
            var et = new Date();
            var ride;
            beforeEach(function() {
                ride = Ride.createRide('a1', 'r2', 'v3', st, et)
            });
            it('has agency', function() {
                expect(ride.getAgency()).toEqual('a1');
            });
            it('has route id', function() {
                expect(ride.getRouteId()).toEqual('r2');
            });
            it('has vehicle id', function() {
                expect(ride.getVehicleId()).toEqual('v3');
            });
            it('has start time', function() {
                expect(ride.getStartTime()).toEqual(st);
            });
            it('has end time', function() {
                expect(ride.getEndTime()).toEqual(et);
            });
        });
    });

});