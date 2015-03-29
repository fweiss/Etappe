angular.module('plan')
    .directive('uttRides', function(chart, planConfig) {
        //console.log('mmmmmmmm ' + tickLegendHeight);
        var tickLegendHeight = planConfig('tickLegendHeight');
        var rideLine = { lineWidth: 6, strokeStyle: 'rgba(255, 255, 255, 1' };
        var timeTickMajor = { lineWidth: 1, strokeStyle: 'rgba(0, 0, 0, 0.5)' };
        var timeTickMinor = { lineWidth: 1, strokeStyle: 'rgba(0, 0, 0, 0.1)' };
        var width;
        var height;

        var hourMillis = 60 * 60 * 1000;
        var minuteMillis = 60 * 1000;

        var timeToX = chart.timeToX;

        function addMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        }
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
                        ctx.fillRect(0, tickLegendHeight, width, height);
                        drawTimeTickMajor(ctx, plan.spanStart, plan.spanEnd);

                        //var rides = plan.rides;
                        //var rides = plan.rides || (plan.segments && plan.segments[0]);
                        var segment = plan.segments && plan.segments[0];
                       var rides = (segment && segment.rides) || [];
                        _.each(rides, function(ride) {
                            var startTime = ride.startTime;
                            var endTime = ride.endTime;

                            ctx.strokeStyle = rideLine.strokeStyle;
                            ctx.lineWidth = rideLine.lineWidth;
                            ctx.beginPath();
                            ctx.moveTo(chart.timeToX(startTime), 0);
                            ctx.lineTo(chart.timeToX(endTime), height);
                            ctx.stroke();
                        });
                        if (segment) {
                            ctx.font = 'bold 12pt Calibri';
                            ctx.fillText(segment.origin, 0, tickLegendHeight);
                        }
                        ctx.restore();
                    }
                });
            }
        };
        function drawTimeTickMajor(ctx, spanStart, spanEnd) {
            var fiveMinuteMillis = 5 * minuteMillis;
            var fifteenMinutesMillis = 15 * minuteMillis;
            var t0 = Math.ceil(spanStart.getTime() / fiveMinuteMillis) * fiveMinuteMillis;
            var t1 = spanEnd.getTime();
            var fifteenMinuteTimes = [];
            var fiveMinuteTimes = [];
            for (var t=t0; t<t1; t+=fiveMinuteMillis) {
                var majorTick = t % fifteenMinutesMillis == 0;
                if (majorTick) {
                    fifteenMinuteTimes.push(new Date(t));
                } else {
                    fiveMinuteTimes.push(new Date(t));
                }
            }
            ctx.lineWidth = timeTickMajor.lineWidth;
            _.each(fifteenMinuteTimes, function(time) {
                ctx.strokeStyle = timeTickMajor.strokeStyle;
                var x = timeToX(time);
                drawTick(x);
                var tickLabel = tod(time);
                ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
                ctx.fillText(tickLabel, x + 2, 10);
            });
            ctx.lineWidth = timeTickMinor.lineWidth;
            _.each(fiveMinuteTimes, function(time) {
                ctx.strokeStyle = timeTickMinor.strokeStyle;
                var x = timeToX(time);
                drawTick(x);
            });
            function drawTick(x) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }
        /** Time of Day */
        function tod(time) {
            // 3:34:00 PM - 3:34 PM
            var tt =  time.toLocaleTimeString();
            var p1 = tt.indexOf(" ");
            return tt.substring(0, p1 - 3) + tt.substring(p1);
        }
    });
