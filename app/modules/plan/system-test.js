describe('domain system', function() {
    var System;
    var Waypoint;
    var Stop;
    beforeEach(module('plan'));
    beforeEach(inject(function(_system_, _waypoint_, _stop_) {
        System = _system_;
        Waypoint = _waypoint_;
        Stop = _stop_;
    }));
    describe('initialized', function() {
        it('has no agencies', function() {
            expect(System.getAgencies().length).toEqual(0);
        });
        it('has no nexuses', function() {
            expect(System.getNexuses().length).toEqual(0);
        });
        it('error on find nexus', function() {
            var e1 = new Error('findNexus: no nexuses available');
            var w1 = Waypoint.createWaypoint('w1', 1, 2);
            expect(function() { System.findNexus(w1); }).toThrow(e1);
        });
    });
    describe('nexuses', function() {
        describe('find', function() {
            beforeEach(function() {
                var stop = Stop.createStop('s1', 'a', 'r', 'id', 1, 2);
                System.mergeStop(stop);
            });
            it('error on nexus not found', function() {
                var e1 = new Error('findNexus: no matching nexus found');
                var w1 = Waypoint.createWaypoint('w1', 2, 2);
                expect(function() { System.findNexus(w1); }).toThrow(e1);
            });
            it('finds a nexus', function() {
                var w1 = Waypoint.createWaypoint('w1', 1, 2);
                var nexus = (System.findNexus(w1));
                expect(nexus.name).toEqual('s1');
            });
        });
     });
});