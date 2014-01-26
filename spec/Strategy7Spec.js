describe('strategy7', function() {
    var options = {};
    var trip1 = {
        id: 2,
        routes: {
            outbound: [
                { carrier: "sfmuni", route: "37", origin: "16239", destination: "13255" },
                { carrier: "sfmuni", route: "1", origin: "15726", destination: "16992" }
            ],
            inbound: [
                { carrier: "sfmuni", route: "L", origin: "17217", destination: "16998" },
                { carrier: "sfmuni", route: "37", origin: "13254", destination: "16238" }
            ]
        }
    };

    var backEndFixture = {
        getPredictions: function(options, callback) {
            var data = fixtures['p' + options.stopId];
            if ( ! data) {
                throw 'no fixture for stop: ' + options.stopId;
            }
            callback(data);
        },
        getRouteConfig: function(options, callback) {
            callback(fixtures.routeConfig);
        }
    };

    beforeEach(function() {
        options = {};
        options.trip = trip1;
        options.direction = 'outbound';
        sfmuni.setBackend(backEndFixture);
    });

    it('should make a trip', function() {
        var trip = strategy(options);
        expect(trip).toBeTruthy();
    });

    it('should make a trip with segments', function() {
        var trip = strategy(options);
        var segments = trip.segments;
        expect(segments.length).toBeGreaterThan(0);
    });

    describe('segment', function() {
        var segment;
        beforeEach(function() {
//            options.orig = '15726';
            options.trip = trip1;
            options.direction = 'outbound';
            var trip = strategy(options);
            segment = trip.segments[0];
        });
        it('should have agency name', function() {
            expect(segment.agency).toBe('sfmuni');
        });
        it('should have origin name', function() {
            expect(segment.origin).toBe('16239');
        });
        it('should have destination name', function() {
            expect(segment.destination).toBe('13255');
        });
        it('should have rides', function() {
            expect(segment.list.length).toBeGreaterThan(0);
        });

    });

    describe('ride', function() {
        var ride;

        beforeEach(function() {
            options.orig = '15726';
            var trip = strategy(options);
            ride = trip.segments[0].list[0];
        });
        it('should have route id', function() {
            expect(ride.route).toBe('37');
        });
        it('should have vehicle id', function() {
            expect(ride.vehicle).toBe('8526');
        });

        it('should have origin time', function() {
            expect(ride.originTime).toBeDefined();
        });
        it('should have destination time', function() {
            expect(ride.destinationTime).toBeDefined();
        });

    });

    describe('muni parser', function() {
        var predictions;
        beforeEach(function() {
        });

        it('should have agency title', function() {
            var connections = sfmuni.parsePredictions(fixtures.p13292);
            expect(connections.length).toEqual(1);
            var connection = connections[0];
            expect(connection.agencyTitle).toBe('San Francisco Muni');
        });
        it('should have multiple connections', function() {
            connections = sfmuni.parsePredictions(fixtures.p15726);
            expect(connections.length).toBe(3);

        });
    });

    describe('create MUNI rides', function() {
        var rides;
        beforeEach(function() {
            var origin = sfmuni.parsePredictions(fixtures.p15726);
            var destination = sfmuni.parsePredictions(fixtures.p16992);
            var routeConfig = sfmuni.parseRouteConfig($("route", fixtures.routeConfig));
            rides = sfmuni.createMuniRides('inbound', origin, destination, routeConfig);
        });
        it('should link multiple route predictions', function() {
            // list s/b rides
            expect(rides.list.length).toBeGreaterThan(0);
        });
        it('should not link multiple destinations', function() {});
        it('should have correct route id', function() {
            expect(rides.list.length).toEqual(12);
            var ride4 = rides.list[4];
            expect(ride4.route).toEqual('L');
        });
    });

    describe('create MUNI rides origin-destination linking', function() {
        var routeConfig;
        var originConnections;
        var destinationConnections;
        beforeEach(function() {
            var routeConfig = sfmuni.parseRouteConfig($("route", fixtures.routeConfig));
            originConnections = [ { directions: [ { predictions: [] } ] }];
            destinationConnections = [ { directions: [ { predictions: [] } ] }];
        });

        it('should not link to destination occurring before origin', function() {
            originConnections[0].directions[0].predictions.push({ datetime: 2000, vehicle: '1111' });
            destinationConnections[0].directions[0].predictions.push({ datetime: 1000, vehicle: '1111' });
            var rides = sfmuni.createMuniRides('inbound', originConnections, destinationConnections, routeConfig);
            expect(rides.list.length).toEqual(0);
        });
    });

   /**
     * Make the SUT look synchronous instead of asynchronous. Since all async calls in the SUT
     * are stubbed, the callback occurs synchronously
     * @param options
     * @returns trip
     */
    function strategy(options) {
        var cTrip = null;
       options.orig = 'str';
        etappe.strategy7(options, function(trip) {
            cTrip = trip;
        });
        return cTrip;
    }

});
