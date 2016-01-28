angular.module('plan')
    // handle angular exceptions so that protractor can verify there are none
    .config(function($provide) {
        $provide.decorator('$exceptionHandler', function($delegate, $injector) {
            return function(exception, cause) {
                var $rootScope = $injector.get('$rootScope');
                $rootScope.error = exception.message;
                $delegate(exception, cause);
            };
        });
    })
/**
 * A folder to keep saved plans. default implementation is window.localStorage.
 * Also mediates between a stored plan and an domain plan object.
 */
    .service('planFolder', [ 'plan', 'initSavedPlans', '$window', function(Plan, initSavedPlans, $window) {
        return {
            list: function() {
                return initSavedPlans;
            },
            store: function(plan, name) {
                if (!_.isString(name)) {
                    throw 'invalid plan name: expected string';
                }
                if (_.isEmpty(name)) {
                    throw 'invalid plan name: expected non-empty string';
                }
                try {
                    var storedPlan = {
                        name: name,
                        spanStart: new Date(plan.spanStart),
                        spanEnd: new Date(plan.spanEnd),
                        nexus: plan.getNexus()
                    };
                }
                catch (e) {
                    throw new Error('invalid plan: ' + e);
                }
                $window.localStorage.setItem(storedPlan.name, JSON.stringify(storedPlan));
            },
            load: function(planName) {
                if ( ! _.isString(planName) || _.isEmpty(planName)) {
                    throw 'invalid plan name: expected non-empty string';
                }
                var data = $window.localStorage.getItem(planName);
                if (data === null) {
                    throw 'no stored plan found: "' + planName + '"';
                }
                var storedPlan = JSON.parse(data);
                var plan = Plan.createPlan(new Date(storedPlan.spanStart), new Date(storedPlan.spanEnd));
                plan.addSegment(storedPlan.nexus[0], storedPlan.nexus[1], []);
                return plan;
            }

        };
Y
    }])
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