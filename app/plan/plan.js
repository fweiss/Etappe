angular.module('etappe')
    .service('plan', [ function() {
        return {
            createPlan: function(spanStart, spanEnd) {
                if (spanStart === undefined || spanEnd === undefined) {
                    throw new Error('createPlan: must specify time span');
                }
                var segments = [];
                return {
                    spanStart: new Date(),
                    rides: [],
                    getSegments: function() {
                        return segments;
                    },
                    addSegment: function(segment) {
                        segments.push(segment);
                    }
                };
            }
        }
    }]);