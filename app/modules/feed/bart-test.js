describe('feed bart', function() {
    var Bart;
    var Waypoint;
    var Nexus;
    var Segment;
    var Stop;

    var httpBackend;
    var baseUrl = 'https://api.bart.gov/api';

    beforeEach(module('agencies', 'plan'));
    beforeEach(inject(function(bart, $httpBackend, waypoint, segment, nexus, stop) {
        Bart = bart;
        Waypoint = waypoint;
        Segment = segment;
        Nexus = nexus;
        Stop = stop;
        httpBackend = $httpBackend;
    }));

    beforeEach(function() {
        //w1 = Waypoint.createWaypoint('RICH', 2.1, 3.1);
        //w2 = Waypoint.createWaypoint('FRMT', 4.1, 5.1);
        w1 = Waypoint.createWaypoint('Richmond', 2.1, 3.1);
        w2 = Waypoint.createWaypoint('Fremont', 4.1, 5.1);
    });
    it('get all stops', function() {
        var xml = '<root><stations>'
            + '<station><name>sta1</name><abbr>AAAA</abbr><gtfs_latitude>2.00</gtfs_latitude><gtfs_longitude>3.00</gtfs_longitude></station>'
            + '<station><name>sta2</name><abbr>BBBB</abbr><gtfs_latitude>4.00</gtfs_latitude><gtfs_longitude>5.00</gtfs_longitude></station>'
            + '</stations></root>';
        httpBackend.whenGET(baseUrl + '/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V').respond(xml);
        Bart.getAllStops().then(function(response) {
            var stops = response.data;
            expect(stops.length).toEqual(2);
            var stop = stops[0];
            expect(stop.getName()).toEqual('sta1');
            expect(stop.getAgencyId()).toEqual('bart');
            expect(stop.getStopId()).toEqual('AAAA')
            expect(stop.getLat()).toEqual(2.00);
            expect(stop.getLon()).toEqual(3.00);
        });
        httpBackend.flush();
    });
    describe('rides', function() {

    });
    it('get rides for segment', function() {
        var xml = '<root><origin>RICH</origin><destination>FRMT</destination>'
            + '<schedule><request>'
            + '<trip origin="RICH" destination="FRMT" origTimeMin="10:50 AM" origTimeDate="09/23/2016" destTimeMin="11:14 AM" destTimeDate="09/23/2016"></trip>'
            + '<trip origin="RICH" destination="FRMT" origTimeMin="10:57 AM" origTimeDate="09/23/2016" destTimeMin="11:22 AM" destTimeDate="09/23/2016"></trip>'
            + '</request></schedule>'
            + '</root>';
        // FIXME duplicate code
        httpBackend.whenGET('https://api.bart.gov/api/sched.aspx?a=4&cmd=depart&date=now&dest=FRMT&key=MW9S-E7SL-26DU-VV8V&orig=RICH').respond(xml);
        var n1 = Nexus.createFromWaypoint(w1);
        n1.addStop(Stop.createStop('Richmond', 'bart', 'r1', 'RICH', 2, 3));
        var n2 = Nexus.createFromWaypoint(w2);
        n2.addStop(Stop.createStop('Fremont', 'bart', 'r1', 'FRMT', 4, 5));
        var segment = Segment.createSegment(n1, n2);

        Bart.getRidesForSegment(segment).then(function(response) {
            var rides = response.data;
            expect(rides.length).toEqual(2);
            var ride = rides[0];
            expect(ride.getStartTime().getTime()).toEqual(new Date('09/23/2016 10:50 AM').getTime());
            expect(ride.getEndTime().getTime()).toEqual(new Date('09/23/2016 11:14 AM').getTime());
        });
        httpBackend.flush();
    });
});