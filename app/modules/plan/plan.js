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
                    segments: [],
                    getSegments: function() {
                        return segments;
                    },
                    addSegment: function(segment) {
                        segments.push(segment);
                    }
                };
            },
            store: function(plan) {
                $window.localStorage.setItem('plan', JSON.stringify(plan));
            },
            load: function(planName) {
                return $window.localStorage.getItem(planName);
            }
        }
    }]);