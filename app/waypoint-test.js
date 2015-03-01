// migrate to Nexus?
describe('waypoint', function() {
    var Waypoint = {
        create: function(name) {
            var waypoint = {
                name: "my stop",
                findNearbyStops: function() {
                    return [
                        { agency: "sfmuni" }
                    ];
                }
            }
            return waypoint;
        }
    };
    describe('nearby stops', function() {
        var waypoint = Waypoint.create("name");
        it('should find nearby stops', function() {
            var stops = waypoint.findNearbyStops();
            expect(stops.length).toEqual(1);
        });
    });

});