describe('domain agency', function() {
    var Agency;

    beforeEach(module('plan'));
    beforeEach(inject(function(agency) {
        Agency = agency;
    }));

    describe('create', function() {
        describe('validation error', function() {
            function expectedException(message) {
                return new Error('createAgency: ' + message);
            }
            it('when no name', function() {
                expect(function() { Agency.createAgency(); }).toThrow(expectedException('no agency name'));
            });
            it('when no api', function() {
                expect(function() { Agency.createAgency('a3'); }).toThrow(expectedException('no api'));
            });
        });
        describe('value', function() {
            var agency;
            var api;
            beforeEach(function() {
                api = {};
                agency = Agency.createAgency('a1', api);
            });
            it('is type Agency', function() {
                expect(agency.constructor.name).toBe('Agency');
            });
            it('has name', function() {
                expect(agency.getName()).toBe('a1');
            });
            it('has api', function() {
                expect(agency.getApi()).toBe(api);
            });
        });
    });
    describe('gets', function() {
        // eventually move to config?
        it('agencies', function() {
            const agencies = Agency.getAll();
            expect(agencies.length).toBe(2);
            expect(agencies[0].name).toBe('BART');
        });
    });
});
