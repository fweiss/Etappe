angular.module('rides')
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
                    clearCanvas(element[0]);
                    var ctx = element[0].getContext('2d');
                    ctx.save();

                    ctx.fillStyle = '#7f7fff';
                    ctx.fillRect(0, 0, width, height);
                    _.each(plan.rides, function(ride) {
                        var startTime = ride.startTime;
                        var endTime = ride.endTime;

                        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
                        ctx.lineWidth = 10;
                        ctx.beginPath();
                        ctx.moveTo(chart.timeToX(startTime), 0);
                        ctx.lineTo(chart.timeToX(endTime), height);
                        ctx.stroke();
                    });
                    ctx.restore();
                }
            });
        }
    };
});
