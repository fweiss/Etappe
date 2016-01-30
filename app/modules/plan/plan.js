angular.module('plan')
    .service('plan', [ '$window', '$q', function($window, $q) {
        return {
            createPlan2: function(initializer) {
                var segments = [];
                var waypoints = [];
                plan = {
                    name: initializer,
                    spanStart: null,
                    spanEnd: null,
                    //waypoints: [],
                    getWaypoints: function() {
                        return waypoints;
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
                    }
                };
                if (_.isObject(initializer)) {
                    plan.name = initializer.name;
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
            createPlan: function(spanStart, spanEnd) {
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