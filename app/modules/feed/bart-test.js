describe('bart', function() {
    var Bart;
    var httpBackend;
    var baseUrl = 'http://api.bart.gov/api';
    beforeEach(module('agencies', 'plan'));
    beforeEach(inject(function(bart, $httpBackend) {
        Bart = bart;
        httpBackend = $httpBackend;
    }));
    it('get stops', function() {
        var xml = '<root><stations>'
            + '<station><name>sta1</name><gtfs_latitude>2.00</gtfs_latitude><gtfs_longitude>3.00</gtfs_longitude></station>'
            + '<station><name>sta2</name><gtfs_latitude>4.00</gtfs_latitude><gtfs_longitude>5.00</gtfs_longitude></station>'
            + '</stations></root>';
        httpBackend.whenGET(baseUrl + '/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V').respond(xml);
        Bart.getAllStops().then(function(response) {
            var stops = response.data;
            expect(stops.length).toEqual(2);
            var stop = stops[0];
            expect(stop.getName()).toEqual('sta1');
            expect(stop.getAgencyId()).toEqual('bart');
            expect(stop.getLat()).toEqual(2.00);
            expect(stop.getLon()).toEqual(3.00);
        });
        httpBackend.flush();
    });
});