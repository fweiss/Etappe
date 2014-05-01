describe('SFMUNI adapter', function() {
    var routeConfigFixture;
    var backEndFixture = {
        getPredictions: function(options, callback) {
            var data = fixtures['p' + options.stopId];
            if ( ! data) {
                throw 'no fixture for stop: ' + options.stopId;
            }
            callback(data);
        },
        routeConfig: function(options, callback) {
            callback(routeConfigFixture);
        }
    };
    function getStations() {
        var stations = null;
        sfmuni.getStations({}, function(_stations) { stations =  _stations; });
        return stations;
    }
    function findSegmentsBetween(origin, destination) {
        var segments = null;
        var options = { originStation: origin, destinationStation: destination };
        sfmuni.findSegmentsBetweenStations(options, function(_segments) { segments = _segments; });
        // after converting to promise, we kind of lost it here, proabably the parser?
        return segments;
    }

    beforeEach(function() {
        sfmuni.setBackend(backEndFixture);
        routeConfigFixture = fixtures.routeConfig;
    });
    it('should parse routes', function() {
        var routeConfig = sfmuni.parseRouteConfig(routeConfigFixture);
        var routes = routeConfig.routes;
        expect(routes.length).toEqual(1);
        var route = routes[0];
        expect(route.name).toEqual('33-Stanyan');
        var stops = route.stops;
        expect(stops.length).toEqual(92);
        var stop = stops[0];
        expect(stop.id).toEqual('6293');
        expect(stop.name).toEqual('Sacramento St & Cherry St');
        expect(stop.routeId).toEqual('33');
    });
    it('should parse route directions', function() {
        var routeConfig = sfmuni.parseRouteConfig(routeConfigFixture);
        var routes = routeConfig.routes;
        expect(routes.length).toEqual(1);
        var route = routes[0];
        expect(routeConfig.directions.length).toEqual(2);
        var direction0 = routeConfig.directions[0];
        expect(direction0.routeId).toEqual('33');
        expect(direction0.routeName).toEqual('Inbound to the Richmond District');
        expect(direction0.stops.length).toEqual(46);
        var stopId = direction0.stops[0];
        expect(_.isString(stopId)).toBeTruthy();
        var direction1 = routeConfig.directions[1];
        expect(direction1.routeName).toEqual('Outbound to General Hospital');
    });
    it('should parse stations', function() {
        var stations = getStations();
        expect(stations.length).toBeGreaterThan(0);
        var station = stations[0];
        expect(station.id).toEqual('Sacramento St & Cherry St');
        expect(station.name).toEqual('Sacramento St & Cherry St');
        expect(station.lat).toEqual('37.7869099');
        expect(station.lon).toEqual('-122.45656');
    });
    it('should parse stations and aggregate stops', function() {
        routeConfigFixture = fixtures.routeConfig2;
        var stations = getStations();
        // note that geocodes may differ, say if stops are across the street
        expect(stations.length).toEqual(3);
    });
    it('should find a segment between stations', function() {
        // need to async this after using promise
        var segments = null;
        runs(function() {
            var originStation = 'California St & Cherry St';
            var destinationStation = '18th St & Guerrero St';
            segments = findSegmentsBetween(originStation, destinationStation);
        });
        waitFor(function() {
            return segments != null;
        }, 'findSegmentsBetween() should return segments' 1000);
        runs(function() {
            expect(segments.length).toEqual(1);
            var segment = segments[0];
            expect(segment.carrier).toEqual('sfmuni');
            expect(segment.routeName).toEqual('Outbound to General Hospital');
        });
    });
    describe('create MUNI rides', function() {
        var rides;
        beforeEach(function() {
            var origin = sfmuni.parsePredictions(fixtures.p15726, '15726');
            var destination = sfmuni.parsePredictions(fixtures.p16992, '16992');
            var routeConfig = sfmuni.parseRouteConfig(fixtures.routeConfig2);
            rides = sfmuni.createMuniRides('inbound', origin, destination, routeConfig);
        });
        it('should link multiple route predictions', function() {
            // list s/b rides
            expect(rides.list.length).toBeGreaterThan(0);
        });
        it('should not link multiple destinations', function() {});
        it('should have correct route id', function() {
            // this fails sometimes with 11 or 10, is it related to the fact that the bart api is being called?
            // this may be the time calc in sfmuni line 91
            expect(rides.list.length).toEqual(12);
            var ride4 = rides.list[4];
            expect(ride4.route).toEqual('L');
        });
        it('should have origin name', function() {
            expect(rides.originName).toEqual('Church St Station Inbound');
        });
        it('should have destination name', function() {
            expect(rides.destinationName).toEqual('Embarcadero Station Inbound');
        });
    });

});
