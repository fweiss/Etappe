describe('strategy7', function() {
    var options = {};
    var muniPredictions001;

    beforeEach(function() {
        options = {};
//        var xhttp = new XMLHttpRequest();
//        xhttp.open('GET', 'fixtures/muni-prediction-001.xml', false);
//        xhttp.send();
//        muniPredictions001 = xhttp.responseXML;
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
            var trip = strategy(options);
            segment = trip.segments[0];
        });
        it('should have agency name', function() {
            expect(segment.agency).toBe('sfmuni');
        });
        it('should have origin name', function() {
            expect(segment.origin).toBe('origin');
        });
        it('should have destination name', function() {
            expect(segment.destination).toBe('destination');
        });
    });


    describe('ride', function() {
        var ride;

        beforeEach(function() {
            var trip = strategy(options);
            ride = trip.segments[0].list[0];
        });
        it('should have route id', function() {
            expect(ride.route).toBe('route');
        });
        it('should have vehicle id', function() {
            expect(ride.vehicle).toBe('vehicle');
        });

        it('should have origin time', function() {
            expect(ride.originTime).toBeDefined();
        });
        it('should have destination time', function() {
            expect(ride.destinationTime).toBeDefined();
        });

    });

    describe('muni parser', function() {
        it('should have agency title', function() {
            var predictions = sfmuni.parsePredictions($("predictions", fixtures.p13292));
            expect(predictions.agencyTitle).toBe('San Francisco Muni');
        });
    });

    describe('create MUNI rides', function() {
        var rides;
        beforeEach(function() {
            var origin = sfmuni.parsePredictions($("predictions", fixtures.p15726));
            var destination = sfmuni.parsePredictions($("predictions", fixtures.p16992));
            var routeConfig = sfmuni.parseRouteConfig($("route", fixtures.routeConfig));
            rides = etappe.createMuniRides('inbound', origin, destination, routeConfig);
        });
        it('should link multiple route predictions', function() {
            // list s/b rides
            expect(rides.list.length).toBeGreaterThan(0);
        });
        it('should not link multiple destinations', function() {});
        it('should have correct route id', function() {
            var op = {};
            op.directions = [];

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
        etappe.strategy7(options, function(trip) {
            cTrip = trip;
        });
        return cTrip;
    }

});
