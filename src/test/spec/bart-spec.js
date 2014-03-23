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
        expect(routes.length).toEqual(1);
        var route = routes[0];
        expect(route.config.length).toEqual(19);
        expect(route.config[0]).toEqual('DALY');
    });
});