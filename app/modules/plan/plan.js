angular.module('plan')
    .service('plan', [ '$q', function($q) {
        return {
            createPlan: function(initializer) {
                var name = initializer;
                var spanStart = null;
                var spanEnd = null;
                var segments = [];
                var waypoints = [];
                plan = {
                    getName: function() {
                        return name;
                    },
                    setSpan: function(start, end) {
                        if (start === undefined || end === undefined) {
                            throw new Error('setSpan(): must specify time span');
                        }
                        if ( ! (start < end)) {
                            throw new Error('setSpan(): must specify start < end');
                        }
                        spanStart = start;
                        spanEnd = end;
                    },
                    getSpan: function() {
                        return { spanStart: spanStart, spanEnd: spanEnd };
                    },
                    //waypoints: [],
                    getWaypoints: function() {
                        return waypoints;
                    },
                    addWaypoint: function(waypoint) {
                        waypoints.push(waypoint);
                    },
                    addWaypoints: function(newWaypoints) {
                        waypoints = newWaypoints;
                    },
                    getNexus: function() {
                        return nexus;
                    },
                    addSegment: function(origin, destination, rides) {
                        if (! _.isString(origin) || _.isEmpty(origin)) {
                            throw new Error('addSegment: must specify origin');
                        }
                        if (! _.isString(destination) || _.isEmpty(destination)) {
                            throw new Error('addSegment: must specify destination');
                        }
                       segments.push({ origin: origin, destination: destination, rides: rides });
                    },
                    getSegment: function(index) {
                        return segments[index];
                    },
                    getSegments: function() {
                        return segments;
                    },
                    getSegments2: function() {
                        if (waypoints.length < 2) {
                            throw new Error('getSegments(): needs at least 2 waypoints');
                        }
                        var segments = [];
                        _.reduce(waypoints, function(previousWaypoint, waypoint) {
                            segments.push({ originWaypoint: previousWaypoint, destinationWaypoint: waypoint, rides: []});
                            return waypoint;
                        });
                        return segments;
                    }
                };
                if (_.isObject(initializer)) {
                    name = initializer.name;
                    waypoints = initializer.waypoints;
                }
                return plan;
            },
            createWaypoint: function(agency, stopId) {
                return {
                    agency: agency,
                    stopId: stopId
                };
            },
            xcreatePlan: function(spanStart, spanEnd) {
                if (spanStart === undefined || spanEnd === undefined) {
                    throw new Error('createPlan: must specify time span');
                }
                var segments = [];
                var nexus = [];
                return {
                    spanStart: spanStart,
                    spanEnd: spanEnd,
                    getSegments: function() {
                        return segments;
                    },
                    addSegment: function(origin, destination, rides) {
                        if (! _.isString(origin) || _.isEmpty(origin)) {
                            throw new Error('addSegment: must specify origin');
                        }
                        if (! _.isString(destination) || _.isEmpty(destination)) {
                            throw new Error('addSegment: must specify destination');
                        }
                        var lastNexus = nexus.length > 0 ? nexus[nexus.length - 1] : null;
                        if (lastNexus != origin) {
                            nexus.push(origin);
                        }
                        nexus.push(destination);
                        segments.push({ origin: origin, destination: destination, rides: rides });
                    },
                    getNexus: function() {
                        return nexus;
                    }
                };
            },
            createRide: function(rideStart, rideEnd) {
                return { startTime: rideStart, endTime: rideEnd };
            },
            fetchNexuses: function () {
                var defer = $q.defer();
                defer.resolve([]);
                return defer.promise;
            }
        }
    }]);
