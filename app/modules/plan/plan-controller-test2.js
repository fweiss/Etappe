describe('plan controller', function() {
    var $controller;
    var Plan;
    var Waypoint;
    var $rootScope;
    var $q;

    // oddly, the Trip controller is loaded in the carrier module
    beforeEach(module('plan'));
    beforeEach(inject(function(_$controller_, plan, nexus, _$rootScope_, _$q_) {
        $controller = _$controller_;
        Plan = plan;
        Waypoint = nexus;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));



    describe('saved plan', function() {
        var mockSfMuni;
        beforeEach(function() {
            mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getRidesForSegment' ]);
        });

        it('should get rides', function() {
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ {}, {} ] }));

            var $scope = {};
            var controller = $controller('PlanController', { $scope: $scope, sfMuni: mockSfMuni });

            var planData = { id: 1, name: 'get Cliffs', waypoints: [
                { name: 'Mission St', stops: [{"stopId":"15553","stopTag":"5553","route":"33"},{"stopId":"13338","stopTag":"3338","route":"33"}] },
                { name: 'Castro St', stops: [{"stopId":"13326","stopTag":"3326","route":"33"},{"stopId":"13325","stopTag":"3325","route":"33"}] }]
            };
            var plan = Plan.createPlan(planData);
            //var w1 = Waypoint.create('Mission St', 20, 30);
            //w1.stops = [{"stopId":"15553","stopTag":"5553","route":"33"},{"stopId":"13338","stopTag":"3338","route":"33"}];
            //var w2 = Waypoint.create('Castro St', 21, 31);
            //w2.stops = [ {"stopId":"13326","stopTag":"3326","route":"33"},{"stopId":"13325","stopTag":"3325","route":"33"}];
            //plan.addWaypoints([ w1, w2 ]);

            $scope.selectSavedPlan(planData);
            $rootScope.$apply();
            expect($scope.rideList.length).toBe(2);
            expect($scope.plan.getSpan().spanEnd).toBeGreaterThan($scope.plan.getSpan().spanStart)
            expect($scope.plan.getSegment(0).rides.length).toBe(2);

            expect($scope.itinerary).toBeTruthy();
        });

    });
});