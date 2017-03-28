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
        var stations = null;
        bart.getStations({}, function(_stations) { stations = _stations });
        expect(stations.length).toEqual(2);
        var station = stations[0];
        expect(station.id).toEqual('12TH');
        expect(station.name).toEqual('12th St. Oakland City Center');
        expect(station.lat).toEqual('37.803664');
        expect(station.lon).toEqual('-122.271604');
    });
    it('should parse route info', function() {
        var routes;
        bart.getRoutes({}, function(_routes) { routes = _routes; });
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
//    it('should find correct rides for a segment', function() {
//        var segments = [ { carrier: 'bart', route: '6', originStation: 'MONT', destinationStation: '16TH' }];
//        var rides = bart.findRidesForSegments(segments);
//        expect(rides.length).toEqual(1);
//    });
});