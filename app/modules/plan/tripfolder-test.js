describe('trip folder', function() {
    var TripFolder;
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (_tripfolder_, _waypoint_) {
        TripFolder = _tripfolder_;
        Waypoint = _waypoint_;
    }));
    describe('deserialize', function() {
        var trip;
        beforeEach(function() {
            var origin = { waypointName: 'origin', lat: 1, lon: 2, stops: [] };
            var destination = { waypointName: 'destination', lat: 1, lon: 3, stops: [] };
            var inner = { waypointName: 'mission', lat: 1, lon: 4, stops: [] };
            var data = {
                tripName: 'trip1',
                origin: origin,
                destination: destination,
                waypoints: [
                    inner ] };
            trip = TripFolder.deserialize(data);
        });
        it('error on parsing', function() {
            var bad = [];
            //var e1 = new Error('TripFolder: error deserializing data: TypeError: \'undefined\' is not an object (evaluating \'data.origin.waypointName\')');
            //expect(function() { TripFolder.deserialize(bad); }).toThrow(e1);
            expect(function() { TripFolder.deserialize(bad); }).toThrowError(Error, /TripFolder: error deserializing data/);
        });
        it('trip name', function() {
            expect(trip.getName()).toEqual('trip1');
        });
        it('origin', function() {
            expect(trip.getOrigin().getName()).toEqual('origin');
        });
        it('destination', function() {
            expect(trip.getDestination().getName()).toEqual('destination');
        });
        describe('waypoint', function() {
            var waypoint;
            beforeEach(function() {
                waypoint = trip.getInnerWaypoints()[0];
            });
            xit('it is a Waypoint', function() {
                //console.log(waypoint.constructor.name);
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
                expect(waypoint.getLon()).toEqual(4);
            });
        });
    });
    describe('list', function() {
        // assuming initSavedTrips in module.js
        it('has trip', function() {
            var trips = TripFolder.list();
            expect(trips.length).toBe(1);
            var trip0 = trips[0];
            expect(trip0.getName()).toEqual('get Cliffs');
            // assume deserialize works
        });
    });
});
