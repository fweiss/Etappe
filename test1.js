$(function() {
    $("#get1").click(function(event) {
        event.preventDefault();
        etappe.strategy2(function(result) {
            updatePredictions("#ob1", result.predictions1);
            updatePredictions("#ob2", result.predictions2);
            updateSchedule("#ob3", result.schedule, new Date());
            $("<div>").appendTo($("#ob2")).append("transfer: " + result.transferDatetime.toLocaleTimeString());
        });
        etappe.findSegments({ route: 33, orig: 14076, dest: 13292 }, function(segments) {
            updateSegments("#ob4", segments, new Date());
        });
    });
    $("#getib").click(function(event) {
        event.preventDefault();
        etappe.strategy5(function(trip) {
            updateTrip("#ib1", trip);
        });
    });
    $("#getibzz").click(function(event) {
        event.preventDefault();
        etappe.strategy4(function(result) {
            updateSchedule("#ib1", result.schedule);
            updateSegments("#ib4", result.segments, new Date());
        });
    });
    $("#getibyyy").click(function(event) {
        event.preventDefault();
        etappe.strategy3(function(result) {
            updateSchedule("#ib1", result.schedule);
            //updatePredictions("#ib2", result.predictions1);
            //updatePredictions("#ib3", result.predictions2);
        });
        etappe.findSegments({ route: 33, orig: 15552, dest: 14075 }, function(segments) {
            updateSegments("#ib4", segments, new Date());
        });
    });
    $("#getibxxx").click(function(event) {
        event.preventDefault();
        bart.getSchedule({ cmd: "depart", orig: "MONT", dest: "16TH", b: 0, a: 4 }, function(schedule) {
            updateSchedule("#ib1", schedule);
        });
        sfmuni.getPredictions({ stopId: 15552, r: "33" }, function(predictions) {
            updatePredictions("#ib2", predictions);
        });
        sfmuni.getPredictions({ stopId: 14075, r: "33" }, function(predictions) {
            updatePredictions("#ib3", predictions);
        });
    });
    function updateSchedule(id, schedule) {
        var now = new Date();
        var p = $(id);
        p.empty();
        $("<div>").appendTo(p).append("to " + schedule.cmd + " from: " + schedule.origin + " to: "+ schedule.destination);
        for (var i=0; i<schedule.trips.length; i++) {
            var trip = schedule.trips[i];
            var route = bart.findRoute(trip.legs[0].line);
            var wait = Math.floor((trip.origDatetime - now) / 60000);
            $("<div>").appendTo(p).append("(" + wait + ") " + trip.origDatetime.toLocaleTimeString() + " " + trip.destDatetime.toLocaleTimeString() + " " + route.name);
        }
    }
    function updatePredictions(id, predictions) {
        var p = $(id);
        p.empty();
        $("<div>").appendTo(p).append("predictions: " + predictions.routeTitle + ": " + predictions.stopTitle);
        for (var i in predictions.directions) {
            var direction = predictions.directions[i];
            $("<div>").appendTo(p).append(direction.title);
            for (var j in direction.predictions) {
                var prediction = direction.predictions[j];
                $("<div>").appendTo(p).append(prediction.minutes + " " + prediction.datetime.toLocaleTimeString() + " " + prediction.vehicle);
            }
        }
    }
    function updateE(id, etd) {
        var d = $(id);
        d.empty();
        for (var i=0; i<etd.estimates.length; i++) {
            var estimate = etd.estimates[i];
            $("<div>").appendTo(d).append(estimate.minutes);
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
    function updateTrip(id, trip) {
        var d = $(id);
        d.empty();
        $("<div>").appendTo(d).append("trip:");
        for (var i=0; i<trip.plans.length; i++) {
            var plan = trip.plans[i];
            $("<div>").appendTo(d).append("plan " + i + ":");
            for (var j=0; j<plan.rides.length; j++) {
                var ride = plan.rides[j];
                $("<div>").appendTo(d).append("ride: (" + ride.waitDuration + ") " + ride.segment.carrier + " " + ride.segment.route + "/" + ride.segment.vehicle + ": " + ride.segment.originTime.toLocaleTimeString() + "-" + ride.segment.destinationTime.toLocaleTimeString());
            }
        }
    }
});