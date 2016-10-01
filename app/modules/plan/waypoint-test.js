describe('domain waypoint', function() {
    var Waypoint;
    beforeEach(module('plan'));
    beforeEach(inject(function (_waypoint_) {
        Waypoint = _waypoint_;
    }));
    describe('creation', function() {
        var waypoint;
        beforeEach(function() {
            waypoint = Waypoint.createWaypoint('w1', 1, 2);
        });
        it('error if name not given', function() {
            var e1 = new Error('createWaypoint: must specify name');
            expect(function() { Waypoint.createWaypoint(); }).toThrow(e1);
        });
        it('error if lat not given', function() {
            var e1 = new Error('createWaypoint: must specify lat');
            expect(function() { Waypoint.createWaypoint('waypoint'); }).toThrow(e1);
        });
        it('error if lon not given', function() {
            var e1 = new Error('createWaypoint: must specify lon');
            expect(function() { Waypoint.createWaypoint('waypoint', 2); }).toThrow(e1);
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
        it('has no initial stops', function() {
            expect(waypoint.getStops()).toEqual([]);
        });
    });
});