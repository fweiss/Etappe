// start with an empty list of waypoints
describe('trip builder', function() {
    var scope;
    var mockSfMuni;
    var Stop;
    var $q;
    beforeEach(module('plan'));
    beforeEach(inject(function($rootScope, $controller, _$q_, _stop_, agency) {
        $q = _$q_;
        Stop = _stop_;
        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getAllStops' ]);
        scope = $rootScope.$new();
        this.Agency = agency
        $controller('PlanController', { $scope: scope, sfMuni: mockSfMuni });
    }));
    describe('initial', function() {
        it('has empty waypoints', function() {
            expect(scope.waypoints.length).toBe(0);
        });
        it('has default agencies', function() {
            expect(scope.agencies.length).toBe(2);
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
        var s1;
        beforeEach(function() {
            s1 = Stop.createStop('n1', 'a', 'r1', 's1', 1, 2);
            s2 = Stop.createStop('n1', 'a', 'r1', 's1', 1, 3);
            mockSfMuni.getAllStops.and.returnValue($q.when({ data: [ s1, s2 ] }));

            scope.agencies = [ this.Agency.createAgency('SFMUNI', mockSfMuni )]
            scope.agencies[0].selected = true;
            scope.$digest();
        });
        it('has waypoints', function() {
            expect(scope.originNexus.length).toBe(2);
        });
        describe('select waypoint', function() {
            it('one waypoint', function() {
                scope.nextWaypointSelect = s1;
                scope.nextWaypointChanged();
                expect(scope.waypoints.length).toBe(1);
            });
            it('two waypoint', function() {
                scope.nextWaypointSelect = s1;
                scope.nextWaypointChanged();
                scope.nextWaypointSelect = s2;
                scope.nextWaypointChanged();
                expect(scope.waypoints.length).toBe(2);
            });
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