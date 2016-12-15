describe('bart', function() {
    var Bart;
    beforeEach(module('agencies'));
    beforeEach(inject(function(bart) {
        Bart = bart;
    }));
    it('get stops', function() {
        Bart.getAllStops().then(function(response) {

        });
    });
});