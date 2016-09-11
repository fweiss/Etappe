angular.module('plan')
    .service('itinerary', [ function() {
        return {
            createItinerary: function(_plan) {
                if (_.isUndefined(_plan)) {
                    throw new Error('createItinerary: plan is required');
                }
                if (_plan.getWaypoints().length < 2) {
                    throw new Error('createItinerary: plan must have at least two waypoints');
                }
                var plan = _plan;
                var segments = [];
                _.reduce(plan.getWaypoints(), function(previousWaypoint, waypoint) {
                    segments.push({ originWaypoint: previousWaypoint, destinationWaypoint: waypoint, rides: []});
                    return waypoint;
                });
                return {
                    getPlan: function() {
                        return plan;
                    },
                    getSegments: function() {
                        return segments;
                    }
                };
            }
        }
    }]);
