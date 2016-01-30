describe('plan controller', function() {
    var $httpBackend;
    var requestHandler;
    var scope;
    var Plan;
    var alertSpy;
    beforeEach(module('carrier'));
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
    beforeEach(inject(function($rootScope, $injector, $controller, plan) {
        scope = $rootScope.$new();
        Plan = plan;
        $httpBackend = $injector.get('$httpBackend');
        $controller('PlanController', { $scope: scope, plan: plan });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));
//            .respond('<?xml version="1.0" encoding="utf-8"?><stations></stations>', { 'Content-type': 'text/xml'});

    }));
    it('should show segment builder', function() {

    });
    describe('restore', function() {
        // save message
        it('should show error for invalid plan name', function() {
            scope.planRestore();
            expect(alertSpy).toHaveBeenCalledWith('cannot restore plan: invalid plan name: expected non-empty string');
        });
        // plan not found?
        it('should set origin and destination nexus', function() {
            var plan = Plan.createPlan(0, 1);
            plan.addSegment('origin', 'destination', []);
            scope.plan = plan;
            scope.planSaveName = 'gggg';
            scope.$digest();
            scope.planSave();
            scope.planRestoreName = 'gggg';
            scope.$digest();
            scope.planRestore();
            expect(alertSpy).not.toHaveBeenCalled();
            expect(scope.nexusStart).toBe('origin');
            expect(scope.nexusEnd).toBe('destination');
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