describe('plan folder', function() {
    var Plan;
    var PlanFolder;
    var localStorage;
    var Waypoint;
    var savedPlan = '{ "name": "another", "waypoints": [ { "name": "w1", "lat": 21, "lon": 45 }, { "name": "w2", "lat": 31, "lon": 45 } ]}';

    beforeEach(module('plan'));
    beforeEach(inject(function(_plan_, _planFolder_, $window, nexus) {
        Plan = _plan_;
        PlanFolder = _planFolder_;
        localStorage = $window.localStorage;
        Waypoint = nexus;
    }));
    describe('store', function() {
        beforeEach(function() {
            spyOn(localStorage, 'setItem');
            var plan = Plan.createPlan('saved plan');
            plan.addWaypoint(Waypoint.create('wp-1', 20, 21));
            PlanFolder.store(plan, 'fffg');
        });
        it('should save plan', function() {
            //expect(localStorage.setItem).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'saved plan'}));
            expect(localStorage.setItem).toHaveBeenCalledWith('saved plan', jasmine.stringMatching(/waypoints/));
        });
        it('should dehydrate waypoint name', function() {
            expect(localStorage.setItem).toHaveBeenCalledWith('saved plan', jasmine.stringMatching(/wp-1/));
        });
    });
    describe('load', function() {
        var plan;
        beforeEach(function() {
            spyOn(localStorage, 'getItem').and.returnValue(savedPlan);
            plan = PlanFolder.load('another');
        });
        it('should hydrate name', function() {
            expect(plan.getName()).toBe('another');
        });
        it('should hydrate collections', function() {
            expect(plan.getWaypoints().length).toBe(2);
            expect(plan.getSegments2().length).toBe(1);
        });
        it('should hydrate waypoints', function() {
            var waypoints = plan.getWaypoints();
            expect(waypoints[0].getName).toBeTruthy();
            expect(plan.getWaypoints()[0].getName()).toBe('w1');
        });
    });
});