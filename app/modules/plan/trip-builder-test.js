// start with an empty list of waypoints
fdescribe('trip builder', function() {
    var scope;
    beforeEach(module('plan'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('PlanController', { $scope: scope });
    }));
    describe('initial', function() {
        it('has empty waypoints', function() {
            expect(scope.waypoints.length).toBe(0);
        });
        it('has default agencies', function() {});
        it('has default nexuses', function() {});
        it('is incomplete', function() {});
        it('can extend', function() {});
    });
    describe('add one waypoint', function() {
        beforeEach(function() {});
        it('has one waypoint', function() {});
        it('is incomplete', function() {});
        it('can extend', function() {});
    });
    describe('add two waypoints', function() {
        beforeEach(function() {});
        it('has two waypoints', function() {});
        it('is complete', function() {});
        it('can extend', function() {});
    });
});