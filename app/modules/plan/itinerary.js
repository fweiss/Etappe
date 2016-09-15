angular.module('plan')
    .service('itinerary', [ function() {
        return {
            createItinerary: function(_trip) {
                if (_.isUndefined(_trip)) {
                    throw new Error('createItinerary: trip is required');
                }
                var trip = _trip;
                var segments = [];
                _.reduce(_.union([ trip.getOrigin() ], trip.getInnerWaypoints(), [ trip.getDestination() ]), function(previousWaypoint, waypoint) {
                    segments.push({ originWaypoint: previousWaypoint, destinationWaypoint: waypoint, rides: []});
                    return waypoint;
                });
                return {
                    getTrip: function() {
                        return trip;
                    },
                    getSegments: function() {
                        return segments;
                    }
                };
            }
        }
    }]);
