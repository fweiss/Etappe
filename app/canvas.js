angular.module('rides', [])
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
.directive('uttRides', function(chart) {
    var width;
    var height;
    function clearCanvas(canvas) {
        canvas.width = canvas.width;
    }
    return {
        restrict: 'A',
        link: function(scope, element) {
            width = element[0].width;
            height = element[0].height;
            chart.setWidth(width);
            scope.$watch('plan', function(plan) {
                if (plan) {
                    chart.setTimeSpan(plan.spanStart, plan.spanEnd);
                    var ride = plan.rides[0];
                    var rideStart = ride.rideStart;
                    var rideEnd = ride.rideEnd;
                    clearCanvas(element[0]);
                    var ctx = element[0].getContext('2d');
                    ctx.save();

                    ctx.fillStyle = '#7f7fff';
                    ctx.fillRect(0, 0, width, height);

                    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
                    ctx.lineWidth = 10;
                    ctx.beginPath();
                    ctx.moveTo(chart.timeToX(rideStart), 0);
                    ctx.lineTo(chart.timeToX(rideEnd), height);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        }
    };
});
