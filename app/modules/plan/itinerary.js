angular.module('plan')
.service('itinerary', [ function() {
    function Itinerary(trip, segments) {
        this.trip = trip;
        this.segments = segments;
    };
    Itinerary.prototype.getTrip = function() {
        return this.trip;
    };
    Itinerary.prototype.getSegments = function() {
        return this.segments;
    };
    return {
        createItinerary: function(_trip, _segments) {
            if (_.isUndefined(_trip)) {
                throw new Error('createItinerary: trip is required');
            }
            var trip = _trip;
            var segments = [];
            if (_segments) {
                segments = _segments;
            } else {
                _.reduce(_.union([ trip.getOrigin() ], trip.getInnerWaypoints(), [ trip.getDestination() ]), function(previousWaypoint, waypoint) {
                    segments.push({ originNexus: previousWaypoint, destinationNexus: waypoint, rides: []});
                    return waypoint;
                });
            }
            return new Itinerary(trip, segments);
        }
    }
}]);
