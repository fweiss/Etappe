angular.module('plan')
.service('itinerary', [ 'segment', 'nexus',  function(Segment, Nexus) {

    function Itinerary(trip, segments) {
        this.trip = trip;
        this.segments = segments;
        this.span = { spanStart: 0, spanEnd: 0 };
    }
    Itinerary.prototype.getTrip = function() {
        return this.trip;
    };
    Itinerary.prototype.getSpan = function() {
        return this.span;
    };
    Itinerary.prototype.setSpan = function(spanStart, spanEnd) {
        this.span.spanStart = spanStart;
        this.span.spanEnd = spanEnd;
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
                    var originNexus = Nexus.createFromWaypoint(previousWaypoint);
                    var destinationNexus = Nexus.createFromWaypoint(waypoint);
                    var segment = Segment.createSegment(originNexus, destinationNexus);
                    segments.push(segment);
                    return waypoint;
                });
            }
            return new Itinerary(trip, segments);
        },
        createSegmentsFromNexuses: function(nexuses) {
            if (_.isUndefined(nexuses)) {
                throw new Error('createSegmentsFromNexuses: nexuses must be given');
            }
            if (!_.isArray(nexuses)) {
                throw new Error('createSegmentsFromNexuses: nexuses must be Array type');
            }
            if (nexuses.length < 2) {
                throw new Error('createSegmentsFromNexuses: nexus count must be 2 or more');
            }
            _.each(nexuses, function(nexus) {
                if (nexus.constructor.name != 'Nexus') {
                    throw new Error('createSegmentsFromNexuses: nexuses must be Nexus type');
                }
            });
            var segments = [];
            _.reduce(nexuses, function(origin, destination) {
                var segment = Segment.createSegment(origin, destination);
                segments.push(segment);
                return destination;
            });
            return segments;
        }
    }
}]);
