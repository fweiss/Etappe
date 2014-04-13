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
        getRouteConfig: function(options, callback) {
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
        expect(stations.length).toEqual(1);
    });
    it('should find a segment between stations', function() {
        var originStation = 'California St & Cherry St';
        var destinationStation = '18th St & Guerrero St';
        var segments = findSegmentsBetween(originStation, destinationStation);
        expect(segments.length).toEqual(1);
        var segment = segments[0];
        expect(segment.carrier).toEqual('sfmuni');
        expect(segment.routeName).toEqual('Outbound to General Hospital');
    });

});
