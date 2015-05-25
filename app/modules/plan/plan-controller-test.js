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
        $controller('Trip', { $scope: scope, plan: plan });
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
});