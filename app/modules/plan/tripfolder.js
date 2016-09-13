angular.module('plan')
    .service('tripfolder', [ 'trip', 'waypoint', function(Trip, Waypoint) {
        return {
            deserialize: function(data) {
                try {
                    var origin = Waypoint.createWaypoint(data.origin.waypointName, data.origin.lat, data.origin.lon);
                    var destination = Waypoint.createWaypoint(data.destination.waypointName, data.destination.lat, data.destination.lon);
                    var trip = Trip.createTrip(origin, destination);
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
