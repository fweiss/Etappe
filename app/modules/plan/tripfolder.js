angular.module('plan')
    .service('tripfolder', [ 'trip', 'waypoint', function(Trip, Waypoint) {
        return {
            deserialize: function(data) {
                try {
                    var trip = Trip.createTrip(data.origin, data.destination);
                    trip.setName(data.tripName);
                    trip.setInnerWaypoints(_.map(data.waypoints, function(wp) {
                        var w = Waypoint.createWaypoint(wp.waypointName, wp.lat, wp.lon);
                        return w;
                    }));
                    return trip;
                }
                catch (e) {
                    throw new Error('TripFolder: error deserializing data');
                }
            }
        };
    }]);
