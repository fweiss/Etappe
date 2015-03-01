describe('plan2', function() {
    const spanStart = new Date('2013-02-22T13:00');
    const spanEnd = new Date('2013-02-22T14:00');
    var Plan;
    beforeEach(module('etappe'));
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
            expect(plan.spanStart).toBeTruthy();
            expect(plan.rides.length).toBe(0);
        });
    });
    describe('with rides', function() {
        var plan;
        beforeEach(function() {
            plan = Plan.createPlan(spanStart, spanEnd);
        });
        it('should add a segment', function() {
            plan.addSegment({ origin: '', destination: '', rides: [ { agency: '', startTime: null, endTime: null }]});
            expect(plan.getSegments().length).toBe(1);
        });
    });
});