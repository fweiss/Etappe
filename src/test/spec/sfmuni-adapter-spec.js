describe('SFMUNI adapter', function() {
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
    function getStations() {
        var stations = null;
        sfmuni.getStations({}, function(_stations) { stations =  _stations; });
        return stations;
    }

    beforeEach(function() {
        sfmuni.setBackend(backEndFixture);
    });
    it('should parse stations', function() {
        var stations = getStations();
        expect(stations.length).toEqual(92);
        var station = stations[0];
        expect(station.id).toEqual('16293');
        expect(station.name).toEqual('Sacramento St & Cherry St');
        expect(station.lat).toEqual('37.7869099');
        expect(station.lon).toEqual('-122.45656');
    });
    it('should parse stations and aggregate stops', function() {
        // still trying to figure this out, need to aggregate stops into a station
    });

});
