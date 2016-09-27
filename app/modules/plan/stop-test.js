describe('domain stop', function() {
    var Stop;
    beforeEach(module('plan'));
    beforeEach(inject(function (_stop_) {
        Stop = _stop_;
    }));
    describe('creation', function() {
        var stop;
        beforeEach(function() {
            stop = Stop.createStop('a', 'r', 'id', 20, 30);
        });
        it('error if no agency given', function() {
            var e1 = new Error('createStop: must specify agency');
            expect(function() { Stop.createStop(); }).toThrow(e1);
        });
        it('error if no route given', function() {
            var e1 = new Error('createStop: must specify route');
            expect(function() { Stop.createStop('muni'); }).toThrow(e1);
        });
        it('error if no stop id given', function() {
            var e1 = new Error('createStop: must specify stop id');
            expect(function() { Stop.createStop('muni', 'masonic'); }).toThrow(e1);
        });
        it('error if no lat given', function() {
            var e1 = new Error('createStop: must specify lat');
            expect(function() { Stop.createStop('muni', 'masnonc', '4931'); }).toThrow(e1);
        });
        it('error if no lon given', function() {
            var e1 = new Error('createStop: must specify lon');
            expect(function() { Stop.createStop('muni', 'masnonc', '4931', 1); }).toThrow(e1);
        });
        it('has initial agency', function() {
            expect(stop.getAgency()).toEqual('a');
        });
        it('has initial route', function() {
            expect(stop.getRoute()).toEqual('r');
        });
        it('has initial stop id', function() {
            expect(stop.getStopId()).toEqual('id');
        });
        it('has initial lat', function() {
            expect(stop.getLat()).toEqual(20);
        });
        it('has initial lon', function() {
            expect(stop.getLon()).toEqual(30);
        });
    });
});