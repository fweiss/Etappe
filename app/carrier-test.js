describe('carrier', function() {
    var $httpBackend;
    var requestHandler;
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));
        console.log('fff: ' + requestHandler.passThrough);
//            .respond('<?xml version="1.0" encoding="utf-8"?><stations></stations>', { 'Content-type': 'text/xml'});
    }));
});