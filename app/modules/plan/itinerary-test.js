describe('itinerary', function() {
    var Itinerary;
    var Plan;
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (_itinerary_, _plan_, _nexus_) {
        Itinerary = _itinerary_;
        Plan = _plan_;
        Waypoint = _nexus_;
    }));
    describe('itinerary domain', function() {
        var plan;
        var w1;
        var w2;
        var w3;
        beforeEach(function() {
            plan = Plan.createPlan('iplan');
            w1 = Waypoint.create('w1', 21, 31);
            w2 = Waypoint.create('w2', 22, 32);
            w3 = Waypoint.create('w2', 23, 33);
        });
        describe('create', function() {
            describe('validation', function() {
                var e1 = new Error('createItinerary: plan is required');
                var e2 = new Error('createItinerary: plan must have at least two waypoints');
                it('should require plan', function() {
                    expect(function() { Itinerary.createItinerary(); }).toThrow(e1);
                });
                it('should require two or more waypoints', function() {
                    expect(function() { Itinerary.createItinerary(plan)}).toThrow(e2);
                });
            });
            it('should have plan', function() {
                plan.addWaypoint(w1);
                plan.addWaypoint(w2);
                var itinerary = Itinerary.createItinerary(plan);
                expect(itinerary.getPlan()).toBe(plan);
            });
            // it cannot have zero segments
            it('should have one segment for two waypoints', function() {
                plan.addWaypoint(w1);
                plan.addWaypoint(w2);
                var itinerary = Itinerary.createItinerary(plan);
                expect(itinerary.getSegments().length).toBe(1);
            });
            it('should have two segments for three waypoints', function() {
                plan.addWaypoint(w1);
                plan.addWaypoint(w2);
                plan.addWaypoint(w3);
                var itinerary = Itinerary.createItinerary(plan);
                expect(itinerary.getSegments().length).toBe(2);
            });
            it('should have segment with empty rides', function() {
                plan.addWaypoint(w1);
                plan.addWaypoint(w2);
                var itinerary = Itinerary.createItinerary(plan);
                expect(itinerary.getSegments()[0].rides.length).toBe(0);
            });
        });
    });
});
