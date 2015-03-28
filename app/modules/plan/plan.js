angular.module('etappe')
    .service('plan', [ '$window', function($window) {
        return {
            createPlan: function(spanStart, spanEnd) {
                if (spanStart === undefined || spanEnd === undefined) {
                    throw new Error('createPlan: must specify time span');
                }
                var segments = [];
                return {
                    spanStart: spanStart,
                    spanEnd: spanEnd,
                    segments: segments,
                    getSegments: function() {
                        return segments;
                    },
                    addSegment: function(origin, destination, rides) {
                        segments.push({ origin: origin, destination: destination, rides: rides });
                    }
                };
            },
            createRide: function(rideStart, rideEnd) {
                return { startTime: rideStart, endTime: rideEnd };
            },
            store: function(plan) {
                $window.localStorage.setItem('plan', JSON.stringify(plan));
            },
            load: function(planName) {
                return $window.localStorage.getItem(planName);
            }
        }
    }]);