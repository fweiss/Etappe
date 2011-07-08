var view = function() {
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
        $("<div>").appendTo(d).append("plans for the trip from " + trip.origin + " to " + trip.destination);
        var pol = $("<ol>").appendTo(d);
        for (var i=0; i<trip.plans.length; i++) {
            var plan = trip.plans[i];
            var pli = $("<li>").appendTo(pol).append("plan");
            var rol = $("<ol>").appendTo(pli);
            for (var j=0; j<plan.rides.length; j++) {
                var ride = plan.rides[j];
                $("<li>").appendTo(rol).append(ftm(ride.waitDuration) + " " + ride.segment.carrier + "/" + ride.segment.vehicle + " " + tod(ride.segment.originTime) + "-" + tod(ride.segment.destinationTime));
            }
        }
    }
    var api = {
        updateTrip: updateTrip
    };
    return api;
}();