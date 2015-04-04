describe('carrier', function() {
    var $httpBackend;
    var requestHandler;
    var scope;
    beforeEach(module('carrier'));
    beforeEach(function() {
        module(function($provide) {
            $provide.service('plan', function() {
                return {
                   load: function() {
                       return { segments: [ { origin: 'an origin nexus'} ] };
                   }
                };
            });
        });
    });
    beforeEach(inject(function($rootScope, $injector, $controller, plan) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $controller('Trip', { $scope: scope, plan: plan });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));
//            .respond('<?xml version="1.0" encoding="utf-8"?><stations></stations>', { 'Content-type': 'text/xml'});

    }));
    describe('restore', function() {
        it('should alert for error', function() {
            scope.planRestore();
            var alertDialog = driver.switchTo().alert();
            expect(alertDialog.getText()).toEqual("Hello");
        });
        xit('should set origin and destination nexus', function() {
            scope.planRestore();
            scope.$digest();
            expect(scope.originNexus).toEqual('an origin nexus');
        });
    });
});