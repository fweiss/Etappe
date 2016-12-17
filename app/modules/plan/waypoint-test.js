describe('domain waypoint', function() {
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (waypoint) {
        Waypoint = waypoint;
    }));
    describe('create', function() {
        describe('validation error', function() {
            it('when no name', function() {
                var e1 = new Error('createWaypoint: must specify name');
                expect(function() { Waypoint.createWaypoint(); }).toThrow(e1);
            });
            it('when no lat', function() {
                var e1 = new Error('createWaypoint: must specify lat');
                expect(function() { Waypoint.createWaypoint('waypoint'); }).toThrow(e1);
            });
            it('when no lon', function() {
                var e1 = new Error('createWaypoint: must specify lon');
                expect(function() { Waypoint.createWaypoint('waypoint', 2); }).toThrow(e1);
            });
        });
        describe('value', function() {
            var waypoint;
            beforeEach(function() {
                waypoint = Waypoint.createWaypoint('w1', 1, 2);
            });
            it('has initial name', function() {
                expect(waypoint.getName()).toEqual('w1');
            });
            it('has initial lat', function() {
                expect(waypoint.getLat()).toEqual(1);
            });
            it('has initial lon', function() {
                expect(waypoint.getLon()).toEqual(2);
            });
        });
    });
});
