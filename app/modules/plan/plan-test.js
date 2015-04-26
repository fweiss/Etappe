describe('plan domain', function() {
    const spanStart = new Date('22 Feb 2013 13:00'); //('2013-02-22T13:00');
    const spanEnd = new Date('22 Feb 2013 14:00'); //('2013-02-22T14:00');
    var Plan;
    var PlanFolder;
    beforeEach(module('plan'));
    beforeEach(inject(function(_plan_, _planFolder_) {
        Plan = _plan_;
        PlanFolder = _planFolder_;
    }));
    describe('create', function() {
        var e1 = new Error('createPlan: must specify time span');
        it('should require initial span', function() {
            expect(function() { Plan.createPlan(); }).toThrow(e1);
        });
        it('should create empty plan', function() {
            var plan = Plan.createPlan(spanStart, spanEnd);
            expect(plan.spanStart).toBe(spanStart);
            expect(plan.spanEnd).toBe(spanEnd);
            expect(plan.getSegments().length).toBe(0);
        });
    });
    describe('with segments', function() {
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan(spanStart, spanEnd);
        });
        it('should add a segment', function() {
            plan.addSegment({ origin: '', destination: '', rides: [ { agency: '', startTime: null, endTime: null }]});
            expect(plan.getSegments().length).toBe(1);
        });
        it('should add segment nexus', function() {
            plan.addSegment('abc', 'def', [ { agency: '', startTime: null, endTime: null }]);
            var nexus = plan.getNexus();
            expect(nexus.length).toBe(2);
            expect(nexus[0]).toBe('abc');
            expect(nexus[1]).toBe('def');
        });
    });
    describe('ride', function() {
        it('should create a ride', function() {
            var ride = Plan.createRide(spanStart, spanEnd);
            expect(ride).toBeTruthy();
        });
    });
    describe('storing', function() {
        beforeEach(function() {
            window.localStorage.clear();
            var plan = Plan.createPlan(spanStart, spanEnd);
            plan.addSegment('abc', 'def', [ ]);
            PlanFolder.store(plan, 'ffff');
        });
        it('should throw exception for invalid plan object', function() {
            // would like to have a fuzzy match?
            var e1 = 'invalid plan: TypeError: plan.getNexus is not a function';
            expect(function() { PlanFolder.store({}, 'a'); }).toThrow(e1);
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
            expect(storedPlan.spanStart).toEqual(spanStart);
            expect(storedPlan.spanEnd).toEqual(spanEnd);
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