// start with an empty list of waypoints
describe('trip builder', function() {
    var scope;
    var mockSfMuni;
    var Stop;
    var $q;
    beforeEach(module('plan'));
    beforeEach(inject(function($rootScope, $controller, _$q_, _stop_) {
        $q = _$q_;
        Stop = _stop_;
        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getAllStops' ]);
        scope = $rootScope.$new();
        $controller('PlanController', { $scope: scope, sfMuni: mockSfMuni });
    }));
    describe('initial', function() {
        it('has empty waypoints', function() {
            expect(scope.waypoints.length).toBe(0);
        });
        it('has default agencies', function() {
            expect(scope.carriers.length).toBe(2);
        });
        it('has default nexuses', function() {
            expect(scope.originNexus.length).toBe(0);
        });
        it('is incomplete', function() {
            expect(scope.waypoints.length).toBe(0);
        });
        it('can extend', function() {});
    });
    describe('for one agency', function() {
        beforeEach(function() {
            mockSfMuni.getAllStops.and.returnValue($q.when({ data: [ Stop.createStop('n', 'a', 'r', 's', 1, 2) ] }));

            // 1 = sfmuni
            scope.carriers[1].selected = true;
            scope.$digest();
        });
        it('has waypoints', function() {
            expect(scope.originNexus.length).toBe(1);
        });
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