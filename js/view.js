var view = function() {
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
        $("<div>").appendTo(d).append(segments.agency + ": " + segments.origin + " to " + segments.destination);
        for (var i=0; i<segments.list.length; i++) {
            var segment = segments.list[i];
            var wait = Math.floor((segment.originTime - datetime) / 60000);
            $("<div>").appendTo(d).append("(" + wait + ") " + segment.route + "/" + segment.vehicle +  ": " + segment.originTime.toLocaleTimeString() + "-" + segment.destinationTime.toLocaleTimeString());
        }
    }
    var api = {
        updateTrip: updateTrip,
        updateSegments: updateSegments
    };
    return api;
}();