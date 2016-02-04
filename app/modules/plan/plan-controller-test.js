describe('plan controller', function() {
    var $httpBackend;
    var requestHandler;
    var scope;
    var Plan;
    var Waypoint;
    var alertSpy;
    var mockSfMuni;
    var $q;

    beforeEach(module('plan'));
    beforeEach(function() {
        module(function($provide) {
            $provide.service('xplanFolder', function() {
                return {
                   load: function() {
                       return {
                           getSegments: function() {
                               return [
                                   { origin: 'an origin nexus' }
                               ];
                           }
                       }
                   }
                };
            });
            alertSpy = jasmine.createSpy('alert');
            $provide.value('alert', alertSpy);
        });
    });
    beforeEach(inject(function($rootScope, $injector, $controller, plan, nexus, _$q_) {
        scope = $rootScope.$new();
        Plan = plan;
        Waypoint = nexus;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;
        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getRidesForSegment' ]);
        $controller('PlanController', { $scope: scope, plan: plan, sfMuni: mockSfMuni });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));
//            .respond('<?xml version="1.0" encoding="utf-8"?><stations></stations>', { 'Content-type': 'text/xml'});

    }));
    it('should show segment builder', function() {

    });
    describe('build a segment', function() {
        it('should make one', function() {
            var waypointMap = { w1: { name: 'w1', stops: [] }, w2: { name: 'w2', stops: {} }};
            scope.orginNexus = waypointMap;
            scope.destinationNexus = waypointMap;
            scope.originNexusSelect = Waypoint.create('w1', 21, 31);
            scope.destinationNexusSelect = Waypoint.create('w2', 22, 32);
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: { rides: [ {} ] } }));
            scope.ridesRefresh();
            scope.$digest();
            console.log(scope.plan);
            expect(scope.plan).toBeTruthy();
            expect(scope.plan.getSegments2().length).toBe(1);
        });
    });
    describe('restore', function() {
        // save message
        it('should show error for invalid plan name', function() {
            scope.planRestore();
            expect(alertSpy).toHaveBeenCalledWith('cannot restore plan: invalid plan name: expected non-empty string');
        });
        // plan not found?
        it('should set origin and destination nexus', function() {
            var plan = Plan.createPlan('gggg');
            plan.addSegment('origin', 'destination', []);
            plan.addWaypoint(Waypoint.create('w1', 20, 31));
            plan.addWaypoint(Waypoint.create('w2', 21, 31));
            scope.plan = plan;
            scope.planSaveName = 'gggg';
            scope.$digest();
            scope.planSave();
            scope.planRestoreName = 'gggg';
            scope.$digest();
            scope.planRestore();
            //expect(alertSpy).toHaveBeenCalledWith('cannot restore plan: invalid plan name: expected non-empty string');
            expect(alertSpy).not.toHaveBeenCalled();
            expect(scope.nexusStart).toBe('w1');
            expect(scope.nexusEnd).toBe('w2');
        });
    });
    describe('nexus', function() {
        var $controller;
        var mockPlan;
        var $timeout;
        beforeEach(inject(function(_$controller_, $q, _$timeout_) {
            $controller = _$controller_;
            $timeout = _$timeout_;
            mockPlan = jasmine.createSpyObj('mockPlan', [ 'fetchNexuses' ]);
            var nexus = []; // a fake
            mockPlan.fetchNexuses.and.returnValue($q.when([ nexus ]));
        }))
        it('should fetch on selected agency', function() {
            var $scope = {};
            $controller('PlanController', { $scope: $scope, plan: mockPlan });
            $scope.agency = 'sf-muni';
            $scope.agencySelected();
            //expect(mockPlan.fetchNexuses).toHaveBeenCalled();
            $timeout.flush();
            expect($scope.originNexuses.length).toBeGreaterThan(0);
        });
    });
});