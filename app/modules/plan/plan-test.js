describe('plan domain', function() {
    const spanStart = new Date('22 Feb 2013 13:00'); //('2013-02-22T13:00');
    const spanEnd = new Date('22 Feb 2013 14:00'); //('2013-02-22T14:00');
    var Plan;
    var Waypoint;
    var PlanFolder;
    beforeEach(module('plan'));
    beforeEach(inject(function(_plan_, _planFolder_, nexus) {
        Plan = _plan_;
        PlanFolder = _planFolder_;
        Waypoint = nexus;
    }));
    xdescribe('create', function() {
        var e1 = new Error('createPlan: must specify time span');
        xit('should require initial span', function() {
            expect(function() { Plan.createPlan(); }).toThrow(e1);
        });
        xit('should create empty plan', function() {
            var plan = Plan.createPlan(spanStart, spanEnd);
            expect(plan.spanStart).toBe(spanStart);
            expect(plan.spanEnd).toBe(spanEnd);
            expect(plan.getSegments().length).toBe(0);
        });
    });
    describe('span', function() {
        var e1 = new Error('setSpan(): must specify time span');
        var e2 = new Error('setSpan(): must specify start < end');
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan('test plan');
        });
        it('should require values', function() {
            expect(function() { plan.setSpan(); }).toThrow(e1);
        });
        it('should require valid range', function() {
            expect(function() { plan.setSpan(2, 1); }).toThrow(e2);
        });
        it('should require non-empty range', function() {
            expect(function() { plan.setSpan(2, 2); }).toThrow(e2);
        });
        it('should be set', function() {
            plan.setSpan(1, 2);
            expect(plan.getSpan()['spanStart']).toEqual(1);
            expect(plan.getSpan()['spanEnd']).toEqual(2);
        });
    });
    // spans are optional part of creation
    describe('create2', function() {
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan('test plan');
        });
        it('should create empty plan', function() {
            expect(plan.getName()).toBe('test plan');
            expect(plan.spanStart).toBeFalsy();
            expect(plan.spanEnd).toBeFalsy();
            expect(plan.getWaypoints().length).toBe(0);
            expect(plan.getSegments().length).toBe(0);
        });
        it('should add waypoints', function() {
            var waypoint1 = Waypoint.create('way1', 20, 30);
            var waypoint2 = Waypoint.create('way2', 21, 31);
            plan.addWaypoints([ waypoint1, waypoint2 ]);
            expect(plan.getWaypoints().length).toBe(2);
        });
        it('should hydrate from data object', function() {
            plan = Plan.createPlan({ name: 'a name', waypoints: [ { name: 'waypoint1' }] });
            expect(plan.getName()).toBe('a name');
            expect(plan.getWaypoints().length).toBe(1);
        });
    });
    xdescribe('segments', function() {
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan(spanStart, spanEnd);
        });
        it('should require valid origin', function() {
            expect(function() {
                plan.addSegment();
            }).toThrow(new Error('addSegment: must specify origin'));
        });
        it('should require valid destination', function() {
            expect(function() {
                plan.addSegment('abc');
            }).toThrow(new Error('addSegment: must specify destination'));
        });
        it('should add a segment', function() {
            //plan.addSegment({ origin: '', destination: '', rides: [ { agency: '', startTime: null, endTime: null }]});
            plan.addSegment('abd', 'xyz',  [ { agency: '', startTime: null, endTime: null }]);
            expect(plan.getSegments().length).toBe(1);
        });
        // TODO nexus -> waypoint
        // waypoints primary, not segments
        it('should add segment nexus', function() {
            plan.addSegment('abc', 'def', [ { agency: '', startTime: null, endTime: null }]);
            var nexus = plan.getNexus();
            expect(nexus.length).toBe(2);
            expect(nexus[0]).toBe('abc');
            expect(nexus[1]).toBe('def');
        });
        it('should add two segment nexus', function() {
            plan.addSegment('abc', 'def');
            plan.addSegment('def', 'ghi');
            var nexus = plan.getNexus();
            expect(nexus.length).toBe(3);
        });
    });
    describe('waypoints', function() {
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan('test waypoints');
        });
        it('should add one', function() {
            var w1 = Waypoint.create('w1', 20, 30);
            plan.addWaypoint(w1);
            expect(plan.getWaypoints().length).toBe(1);
        });
        it('should add two', function() {
            plan.addWaypoint(Waypoint.create('w1', 20, 30));
            plan.addWaypoint(Waypoint.create('w2', 21, 31));
            expect(plan.getWaypoints().length).toBe(2);
        });
        describe('to segments', function() {
            var e1 = new Error('getSegments(): needs at least 2 waypoints');
            it('should error on no waypoints', function() {
                expect(function() { plan.getSegments2(); }).toThrow(e1);
            });
            it('should error on single waypoints', function() {
                plan.addWaypoint(Waypoint.create('w1', 20, 30));
                expect(function() { plan.getSegments2(); }).toThrow(e1);
            });
            it('should have one', function() {
                plan.addWaypoint(Waypoint.create('w1', 20, 30));
                plan.addWaypoint(Waypoint.create('w2', 21, 31));
                expect(plan.getSegments2().length).toBe(1);
            });
            it('should have two', function() {
                plan.addWaypoint(Waypoint.create('w1', 20, 30));
                plan.addWaypoint(Waypoint.create('w2', 21, 31));
                plan.addWaypoint(Waypoint.create('w3', 22, 31));
                expect(plan.getSegments2().length).toBe(2);
            });
            it('should be chained', function() {
                plan.addWaypoint(Waypoint.create('w1', 20, 30));
                plan.addWaypoint(Waypoint.create('w2', 21, 31));
                plan.addWaypoint(Waypoint.create('w3', 22, 31));
                var segments = plan.getSegments2();
                expect(segments[0].originWaypoint.name).toBe('w1');
                expect(segments[0].destinationWaypoint.name).toBe('w2');
                expect(segments[1].originWaypoint.name).toBe('w2');
                expect(segments[1].destinationWaypoint.name).toBe('w3');
            });
            it('should have stops', function() {
                var w1 = Waypoint.create('w1', 20, 30);
                w1.addStop({ name: 'stop1' });
                plan.addWaypoint(w1);
                var w2 = Waypoint.create('w2', 21, 31);
                plan.addWaypoint(w2);
                var segments = plan.getSegments2();
                var segment0 = segments[0];
                expect(segment0.originWaypoint.stops.length).toBe(1);
            });
        });
    });
    describe('ride', function() {
        it('should create a ride', function() {
            var ride = Plan.createRide(spanStart, spanEnd);
            expect(ride).toBeTruthy();
        });
    });
    xdescribe('storing', function() {
        beforeEach(function() {
            window.localStorage.clear();
            var plan = Plan.createPlan(spanStart, spanEnd);
            // TODO no segments for storing
            plan.addSegment('abc', 'def', [ ]);
            var w1 = Waypoint.create('w1', 20, 30);
            var w2 = Waypoint.create('w2', 21, 31);
            PlanFolder.store(plan, 'ffff');
        });
        it('should throw exception for invalid plan object', function() {
            // would like to have a fuzzy match?
            var e1 = /invalid plan: TypeError: /;
            expect(function() { PlanFolder.store({}, 'a'); }).toThrowError(e1);
        });
        it('should throw exception for invalid plan name', function() {
            var e1 = 'invalid plan name: expected string';
            var plan = Plan.createPlan(spanStart, spanEnd);
            expect(function() { PlanFolder.store(plan, undefined); }).toThrow(e1);
        });
        it('should throw exception for empty plan name', function() {
            var e1 = 'invalid plan name: expected non-empty string';
            var plan = Plan.createPlan(spanStart, spanEnd);
            expect(function() { PlanFolder.store(plan, ''); }).toThrow(e1);
        });
        // note that with karma, the local storage is persistent
        it('should store a plan', function() {
            var storedPlan = JSON.parse(window.localStorage.getItem('ffff'));
            expect(storedPlan).toBeTruthy();
            expect(storedPlan.nexus.length).toBe(2);
            expect(storedPlan.nexus[0]).toBe('abc');
            expect(storedPlan.nexus[1]).toBe('def');
        });
        it('should load a plan', function() {
            var storedPlan = PlanFolder.load('ffff');
            expect(storedPlan).toBeTruthy();
            // stored plans don't need to have spans
            //expect(storedPlan.spanStart).toEqual(spanStart);
            //expect(storedPlan.spanEnd).toEqual(spanEnd);
            expect(storedPlan.segments).toBe(undefined);
            expect(storedPlan.getSegments().length).toBe(1);
            expect(storedPlan.getSegments()[0].rides.length).toBe(0);
            expect(storedPlan.getNexus()).toBeTruthy();
            expect(storedPlan.getNexus().length).toBeGreaterThan(1);
            var nexus = storedPlan.getNexus();
            expect (nexus[0]).toEqual('abc');
            expect (nexus[1]).toEqual('def');
        });
    });
    describe('load', function() {
        it('should throw exception for invalid plan name', function() {
            var e1 = 'invalid plan name: expected non-empty string';
            expect(function() { PlanFolder.load(); }).toThrow(e1);
        });
        it('should throw exception for nonexistent plan', function() {
            var e1 = 'no stored plan found: "invalid"';
            expect(function () { PlanFolder.load('invalid'); }).toThrow(e1);
        });
    });
});

