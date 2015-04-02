describe('plan', function() {
    const spanStart = new Date('22 Feb 2013 13:00'); //('2013-02-22T13:00');
    const spanEnd = new Date('22 Feb 2013 14:00'); //('2013-02-22T14:00');
    var Plan;
    beforeEach(module('plan'));
    beforeEach(inject(function(_plan_) {
        Plan = _plan_;
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
        // note that with karma, the local storage is persistent
        it('should store a plan', function() {
            var plan = Plan.createPlan(spanStart, spanEnd);
            plan.addSegment('abc', 'def', [ { startTime: spanStart, endTime: spanEnd } ]);
            Plan.store(plan);
            expect(window.localStorage.getItem('plan')).toBeTruthy();
        });
        it('should load a plan', function() {
            var storedPlan = Plan.load('plan');
            expect(storedPlan).toBeTruthy();
            expect(storedPlan.spanStart).toEqual(spanStart);
            expect(storedPlan.spanEnd).toEqual(spanEnd);
            expect(storedPlan.segments.length).toBe(1);
            expect(storedPlan.getNexus()).toBeTruthy();
            expect(storedPlan.getNexus().length).toBeGreaterThan(1);
            var nexus = storedPlan.getNexus();
            expect (nexus[0]).toEqual('abc');
            expect (nexus[1]).toEqual('def');
        });
    });
});