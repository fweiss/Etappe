describe('BART adapter', function() {
    var backEndFixture = {
        getStations: function(options, callback) {
            callback(bart_fixtures.stations);
        },
        getRoutes: function(options, callback) {
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
});