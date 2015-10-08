angular.module('plan')
/**
 * A folder to keep saved plans. default implementation is window.localStorage.
 * Also mediates between a stored plan and an domain plan object.
 */
    .service('planFolder', [ 'plan', '$window', function(Plan, $window) {
        return {
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
                    throw 'invalid plan: ' + e;
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
    .service('plan', [ '$window', function($window) {
        return {
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
            }
        }
    }]);