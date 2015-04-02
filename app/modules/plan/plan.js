angular.module('plan')
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
                    segments: segments,
                    getSegments: function() {
                        return segments;
                    },
                    addSegment: function(origin, destination, rides) {
                        nexus.push(origin);
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
            store: function(plan) {
                var storedPlan = {
                    name: 'plan',
                    spanStart: new Date(plan.spanStart),
                    spanEnd: new Date(plan.spanEnd),
                    nexus: plan.getNexus()
                };
                $window.localStorage.setItem(storedPlan.name, JSON.stringify(storedPlan));
            },
            load: function(planName) {
                var storedPlan = JSON.parse($window.localStorage.getItem(planName));
                var plan = this.createPlan(new Date(storedPlan.spanStart), new Date(storedPlan.spanEnd));
                plan.addSegment(storedPlan.nexus[0], storedPlan.nexus[1], []);
                return plan;
            }
        }
    }]);