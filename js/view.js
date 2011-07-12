var view = function() {
    var routeColor = [ "#7fff7f", "#7f7fff" ];
    /** Time of Day */
    function tod(time) {
        // 3:34:00 PM - 3:34 PM
        var tt =  time.toLocaleTimeString();
        var p1 = tt.indexOf(" ");
        return tt.substring(0, p1 - 3) + tt.substring(p1);
    }
    function ftm(minutes) {
        return minutes;
    }
    function updateTrip(id, trip) {
        var d = $(id);
        d.empty();
        $("<div>").appendTo(d).append("plans for the trip from " + trip.origin + " to " + trip.destination + " departing " + tod(trip.originTime));
        var pol = $("<ol>").appendTo(d);
        for (var i=0; i<trip.plans.length; i++) {
            var plan = trip.plans[i];
            var pli = $("<li>").appendTo(pol).append("plan arriving " + tod(plan.destinationTime));
            var rol = $("<ol>").appendTo(pli);
            for (var j=0; j<plan.rides.length; j++) {
                var ride = plan.rides[j];
                //$("<li>").appendTo(rol).append(ftm(ride.waitDuration) + " " + ride.segment.carrier + "/" + ride.segment.vehicle + " " + tod(ride.segment.originTime) + "-" + tod(ride.segment.destinationTime));
                $("<li>").appendTo(rol).append(ftm(ride.waitDuration) + " " + ride.segment.origin.abbr + " " + ride.segment.carrier + "/" + ride.segment.vehicle + " " + tod(ride.segment.originTime) + "-" + tod(ride.segment.destinationTime));
            }
        }
    }
    function updateSegments(id, segments, datetime) {
        var d = $(id);
        d.empty();
        //d.css("background-color", routeColor[0]);
        $("<div>").appendTo(d).append(segments.agency + ": " + segments.origin + " to " + segments.destination);
        for (var i=0; i<segments.list.length; i++) {
            var segment = segments.list[i];
            var wait = Math.floor((segment.originTime - datetime) / 60000);
            $("<div>").appendTo(d).append("(" + wait + ") " + segment.route + "/" + segment.vehicle +  ": " + segment.originTime.toLocaleTimeString() + "-" + segment.destinationTime.toLocaleTimeString());
        }
    }
    function updateGraph(segments) {
        var canvas = document.getElementById("graph");
        var ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.width;
        var trackWidth = 6;
        var nexusWidth = 6;
        var routeHeight = 100;
        var hourMillis = 60 * 60 * 1000;
        var t0 = new Date().getTime();
        var t1 = t0 + 2 * hourMillis; 
        
        function timeToX(time) {
            return Math.floor(600 * (time.getTime() - t0) / (t1 - t0));
        }
        function drawRoute(index, segments) {
            ctx.save();
            var y0 = index * (routeHeight + nexusWidth);
            var y1 = y0 + routeHeight;
            ctx.fillStyle = routeColor[index];
            ctx.fillRect(0, y0, 600, (y1 - y0));
            //ctx.fill();
            ctx.lineCap = "square";
                        
            for(var i=0; i<segments.list.length; i++) {
                var segment = segments.list[i];
                var x0 = timeToX(segment.originTime);
                var x1 = timeToX(segment.destinationTime);
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = trackWidth;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.stroke();
            }
            ctx.restore();
        }
        function drawTicks() {
            var s = new Date((Math.floor(t0 / hourMillis) + 0) * hourMillis);
            var x = timeToX(new Date((Math.floor(t0 / hourMillis) + 1) * hourMillis));
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            for (var t=s.getTime(); t<t1; t+=15 * 60 * 1000) {
                var dd = new Date(t);
                var dtt = tod(dd);
                var xx = timeToX(dd);
                var metricst = ctx.measureText(dtt);
                ctx.fillText(dtt, xx - metricst.width / 2, 20);
                ctx.moveTo(xx, 0);
                ctx.lineTo(xx, 220);
                ctx.stroke();
           }
        }
        ctx.beginPath();
        drawRoute(0, segments[0]);
        drawRoute(1, segments[1]);
        drawTicks();
    }
    var api = {
        updateTrip: updateTrip,
        updateSegments: updateSegments,
        updateGraph: updateGraph
    };
    return api;
}();