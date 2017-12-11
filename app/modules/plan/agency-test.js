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
            it('is type Agency', function() {
                const agency = Agency.createAgency('a1', {});
                expect(agency.constructor.name).toBe('Agency');
            });
            it('has name', function() {
                const agency = Agency.createAgency('a2', {});
                expect(agency.getName()).toBe('a2');
            });
        });
    });
});
