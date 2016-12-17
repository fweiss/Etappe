describe('domain stop', function() {
    var Stop;

    beforeEach(module('plan'));
    beforeEach(inject(function (stop) {
        Stop = stop;
    }));

    describe('create', function() {
        describe('validation error', function() {
            it('when no name', function() {
                var e1 = new Error('createStop: must specify name');
                expect(function() { Stop.createStop(); }).toThrow(e1);
            });
            it('when no agency id', function() {
                var e1 = new Error('createStop: must specify agency id');
                expect(function() { Stop.createStop('A & B'); }).toThrow(e1);
            });
            it('when no route id', function() {
                var e1 = new Error('createStop: must specify route id');
                expect(function() { Stop.createStop('A & B', 'muni'); }).toThrow(e1);
            });
            it('when no stop id', function() {
                var e1 = new Error('createStop: must specify stop id');
                expect(function() { Stop.createStop('A & B', 'muni', 'masonic'); }).toThrow(e1);
            });
            it('when no lat', function() {
                var e1 = new Error('createStop: must specify lat');
                expect(function() { Stop.createStop('A & B', 'muni', 'masnonc', '4931'); }).toThrow(e1);
            });
            it('when no lon', function() {
                var e1 = new Error('createStop: must specify lon');
                expect(function() { Stop.createStop('A & B', 'muni', 'masnonc', '4931', 1); }).toThrow(e1);
            });
            it('when invalid lat', function() {
                var e1 = new Error('createStop: must specify valid lat');
                expect(function() { Stop.createStop('A & B', 'muni', 'masnonc', '4931', 'z'); }).toThrow(e1);
            });
            it('when invalid lon', function() {
                var e1 = new Error('createStop: must specify valid lon');
                expect(function() { Stop.createStop('A & B', 'muni', 'masnonc', '4931', 12, 'z'); }).toThrow(e1);
            });
        });
        describe('value', function() {
            var stop;
            beforeEach(function() {
                stop = Stop.createStop('stop', 'a', 'r', 'id', 20, 30);
            });
            it('has initial name', function() {
                expect(stop.getName()).toEqual('stop');
            });
            it('has initial agency id', function() {
                expect(stop.getAgencyId()).toEqual('a');
            });
            it('has initial route id', function() {
                expect(stop.getRouteId()).toEqual('r');
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
            it('accepts zero lat and lon', function() {
                var stop = Stop.createStop('n', 'a', 'r', 'id', 0.0, 0.0);
            });
            it('can set stop tag', function() {
                stop.setStopTag('abc');
            });
            it('has default stop tag', function() {
                expect(stop.getStopTag()).toEqual('');
            });
            it('has stop tag', function() {
                stop.setStopTag('abc');
                expect(stop.getStopTag()).toEqual('abc');
            });
        });
    });
});