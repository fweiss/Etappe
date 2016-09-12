describe('trip folder', function() {
    var TripFolder;
    var Trip;
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (_tripfolder_, _plan_, _waypoint_) {
        TripFolder = _tripfolder_;
        Trip = _plan_;
        Waypoint = _waypoint_;
    }));
    describe('deserialize', function() {
        var trip;
        beforeEach(function() {
            var data = { tripName: 'trip1', origin: 'o', destination: 'd', waypoints: [ { waypointName: 'mission', lat: 1, lon: 2, stops: [] } ] };
            trip = TripFolder.deserialize(data);
        });
        it('error on parsing', function() {
            var bad = [];
            var e1 = new Error('TripFolder: error deserializing data');
            expect(function() { TripFolder.deserialize(bad); }).toThrow(e1);
        });
        it('trip name', function() {
            expect(trip.getName()).toEqual('trip1');
        });
        it('origin', function() {
            expect(trip.getOrigin()).toEqual('o');
        });
        it('destination', function() {
            expect(trip.getDestination()).toEqual('d');
        });
        describe('waypoint', function() {
            var waypoint;
            beforeEach(function() {
                waypoint = trip.getInnerWaypoints()[0];
            });
            xit('it is a Waypoint', function() {
                console.log(waypoint.constructor.name);
                //expect(waypoint).toBeInstanceOf('Waypoint');
                //expect(waypoint).toEqual(jasmine.any(Waypoint.type()));
                expect(waypoint.constructor.name).toEqual('Waypoint');
            });
            it('has name', function() {
                expect(waypoint.getName()).toEqual('mission');
            });
            it('has lat', function() {
                expect(waypoint.getLat()).toEqual(1);
            });
            it('has lon', function() {
                expect(waypoint.getLon()).toEqual(2);
            });
        });
    });
});
