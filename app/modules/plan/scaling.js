angular.module('rides')
    .service('chart', function() {
        var startDate;
        var endDate;
        var timeSpanSeconds;
        var chartWidth;
        return {
            getScaleForRides: function(rides) {
                return null;
            },
            timeToX: function(time) {
                if (timeSpanSeconds === undefined) {
                    throw new Error('chart: scale not initialized');
                }
                if (time === undefined || startDate === undefined) {
                    throw new Error("invalid parameter: " + (time === undefined ? 'time' : 'startTime'));
                }
                return Math.floor(chartWidth * (time.getTime() - startDate.getTime()) / timeSpanSeconds);
            },
            setTimeSpan: function(start, end) {
                if (start >= end) {
                    throw "end must be greater than start";
                };
                startDate = start;
                endDate = end;
                timeSpanSeconds = end.getTime() - start.getTime();
            },
            setWidth: function (width) {
                chartWidth = width;
            }
        };
    })
