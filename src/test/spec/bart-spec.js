describe('BART adapter', function() {
    var backEndFixture = {
        getStations: function(options, callback) {
            callback(bart_fixtures.stations);
        },
        getRoutes: function(options, callback) {
            callback(bart_fixtures.routes);
        },
        getRouteInfo: function(options, callback) {
            callback(bart_fixtures.routes);
        }
    };

    beforeEach(function() {
        bart.setBackend(backEndFixture);
    });
    it('should parse stations', function() {
        var stations;
        bart.getStations({}, function(_stations) { stations = _stations });
        expect(stations.length).toEqual(2);
    });
    it('should parse route info', function() {
        var routes;
        bart.getRoutes({}, function(_routes) { routes = _routes; })
        expect(routes.length).toEqual(2);
        var route = routes[1];
        expect(route.config.length).toEqual(19);
        expect(route.config[0]).toEqual('DALY');
    });
    it('should find correct segments for two stations', function() {
        var origin = '16TH';
        var destination = 'EMBR';
        var segments = bart.findSegments(origin, destination);
        expect(segments.length).toEqual(1);
        var segment = segments[0];
        expect(segment.routeNumber).toEqual('6');
        expect(segment.routeName).toEqual('Daly City - Fremont');
        expect(segment.carrier).toEqual('bart');
        expect(segment.orginStation).toEqual('16TH');
        expect(segment.destinationStation).toEqual('EMBR');
    });

});