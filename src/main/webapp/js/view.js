var view = function() {
    var trackWidth = 6;
    var nexusWidth = 12;
    var topLegendHeight = 12;
    var routeHeight = 100;

    var hourMillis = 60 * 60 * 1000;
    var minuteMillis = 60 * 1000;
    
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
    function updateTripInfo(tripInfo) {
        $('#tripOrigin').text(tripInfo.origin);
        $('#tripDestination').text(tripInfo.destination)
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
    function updateTripSummary(id) {
        var d = $(id);
        d.empty();
        $("<span>").appendTo(d).append("trip from: Montgomery to: Clayton and Corbett transfer at: 16th and Mission");
    }
    function updateSegments(id, segments, datetime) {
        var d = $(id);
        d.empty();
        //d.css("background-color", routeColor[0]);
        $("<div>").appendTo(d).append(segments.agency + ": " + segments.origin + " to " + segments.destination);
        var table = $("<table>").appendTo(d);
        var tbody = $("<tbody>").appendTo(table);
        for (var i=0; i<segments.list.length; i++) {
            var segment = segments.list[i];
            var wait = Math.floor((segment.originTime - datetime) / 60000);
            var tr = $("<tr>").appendTo(tbody);
//            $("<div>").appendTo(d).append("(" + wait + ") " + segment.route + "/" + segment.vehicle +  ": " + segment.originTime.toLocaleTimeString() + "-" + segment.destinationTime.toLocaleTimeString());
            $("<td>").appendTo(tr).append("(" + wait + ")");
            $("<td>").appendTo(tr).append(segment.route);
            $("<td>").appendTo(tr).append(segment.vehicle);
            $("<td>").appendTo(tr).append(segment.originTime.toLocaleTimeString());
            $("<td>").appendTo(tr).append(segment.destinationTime.toLocaleTimeString());
        }
    }
    function updateGraph(id, segments) {
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.width; // clear canvas
        var t0 = new Date().getTime();
        var t1 = t0 + 1 * hourMillis; 
        
        function timeToX(time) {
            return Math.floor(600 * (time.getTime() - t0) / (t1 - t0));
        }
        function drawRoute(index, segments) {
            ctx.save();
            ctx.globalCompositeOperation = 'xor';
            var y0 = index * routeHeight + (index + 1) * nexusWidth + topLegendHeight;
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
                ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
                ctx.fillText(segment.route, x0 + 5, 20 + y0);
            }
//            for(var i=0; i<segments.list.length; i++) {
//                var segment = segments.list[i];
//                var x0 = timeToX(segment.originTime);
//                var x1 = timeToX(segment.destinationTime);
//                ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
//                ctx.fillText(segment.route, x0 + 5, 20 + y0);
//            }
            ctx.restore();
        }
        function drawNexusLabels(labels) {
            for (var i=0; i<labels.length; i++) {
                var x = 20;
                var y = topLegendHeight + i * routeHeight + (i + 1) * nexusWidth;
                ctx.fillText(labels[i], x, y - 2);            
            }
        }
        function drawTicks() {
            var s = new Date((Math.floor(t0 / hourMillis) - 1) * hourMillis);
            //var x = timeToX(new Date((Math.floor(t0 / hourMillis) + 1) * hourMillis));
            var height = topLegendHeight + nexusWidth + segments.length * (routeHeight + nexusWidth);
            ctx.lineWidth = 1;
            for (var t=s.getTime(); t<t1; t+=15 * 60 * 1000) {
                var dd = new Date(t);
                var dtt = tod(dd);
                var xx = timeToX(dd);
                var metrics = ctx.measureText(dtt);
                ctx.fillText(dtt, xx + 2, 10);
                
                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(xx + 0.5, 0);
                ctx.lineTo(xx + 0.5, height);
                ctx.stroke();
                
                ctx.strokeStyle = "rgba(0, 0, 0, 0.10)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (var td=5; td<15; td+=5) {
                    xx = timeToX(new Date(t + td * minuteMillis));
                    ctx.moveTo(xx + 0.5, 0);
                    ctx.lineTo(xx + 0.5, height);
                }
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, topLegendHeight);
                ctx.lineTo(canvas.width, topLegendHeight);
                ctx.stroke();
            }
        }
        ctx.beginPath();
        drawRoute(0, segments[0]);
        drawRoute(1, segments[1]);
        drawNexusLabels([ "Montgomery", "16th and Mission", "Clayton and Corbett"]);
        drawTicks();
    }
    function drawExpiredArea(epochTime, segments) {
        var canvas = document.getElementById("ibGraph");
        var ctx = canvas.getContext("2d");
        var t0 = new Date().getTime();
        var t1 = t0 + hourMillis; 
        var x0 = 0;
        var x1 = 600;
        var x = timeToX(new Date(), t0, t1, x0, x1);
        var y0 = topLegendHeight + nexusWidth;
        var y1 = y0 + segments.length * (routeHeight + nexusWidth);
        ctx.beginPath();
        ctx.rect(x0, x, y0, y1);
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, .5)";
        ctx.fill();
        ctx.restore();
        function timeToX(time, t0, t1, x0, x1) {
            return Math.floor(600 * (time.getTime() - t0) / (t1 - t0));
        }
    }
    function updateViews(trip, direction) {
        var epoch = new Date();
        view.updateTripSummary("#" + direction + "trip", trip);
        view.updateSegments("#" + direction + "1", trip.segments[0], epoch);
        view.updateSegments("#" + direction + "2", trip.segments[1], epoch);
        view.updateGraph(direction + "Graph", trip.segments);
    }
    var api = {
        updateTrip: updateTrip,
        updateSegments: updateSegments,
        updateGraph: updateGraph,
        updateTripSummary: updateTripSummary,
        drawExpiredArea: drawExpiredArea,
        updateTripInfo: updateTripInfo,
        updateInbound: function(trip) {
            updateViews(trip, 'ib');
        },
        updateOutbound: function(trip) {
            updateViews(trip, 'ob');
        },
        drawStations: function(stations) {
            var origin = $('#originStationSelect');
            var destination = $('#destinationStationSelect');
            origin.empty;
            _.each(stations, function(station) {
                $('<option>').appendTo(origin).append(station.name).attr('value', station.id);
                $('<option>').appendTo(destination).append(station.name).attr('value', station.id);
            });
        },
        drawPlan: function(segments) {
            var thead = $('#plan thead');
            var tbody = $('#plan tbody');
            thead.empty();
            tbody.empty();
            var tr = $('<tr>').appendTo(thead);
            if (segments.length === 0) {
                $('<td>').appendTo(tr).append('No direct routes found');
            } else {
                $('<td>').appendTo(tr).append('Available routes');
                _.each(segments, function(segment) {
                    var tr = $('<tr>').appendTo(tbody);
                    $('<td>').appendTo(tr).append(segment.routeName);
                });
            }
       }
    };
    return api;
}();