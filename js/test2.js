$(function() {
    $("#tabs").tabs();
    $("#obRefresh").click(function(event) {
        etappe.strategy6({ direction: "outbound" }, function(segments) {
            ageEpoch = new Date();
            //view.updateTrip("#ob", trip);
            view.updateTripSummary("#obtrip");
            view.updateSegments("#ob1", segments[0], new Date());
            view.updateSegments("#ob2", segments[1], new Date());
            view.updateGraph("obGraph", segments);
        });
    });
    $("#ibRefresh").click(function(event) {
        etappe.strategy6({ direction: "inbound" }, function(segments) {
            ageEpoch = new Date();
            //view.updateTrip("#ob", trip);
            view.updateTripSummary("#ibtrip");
            view.updateSegments("#ib1", segments[0], new Date());
            view.updateSegments("#ib2", segments[1], new Date());
            view.updateGraph("ibGraph", segments);
        });
    });
    $("#xibRefresh").click(function(event) {
        etappe.strategy5(function(trip) {
            ageEpoch = new Date();
            view.updateTrip("#ib", trip);
            //view.updateGraph(trip.segments[0]);
        });
    });
    var ageRefresh;
    var ageEpoch = new Date();
    ageRefresh = window.setInterval(function() {
        var age = new Date() - ageEpoch;
        $("#inbound .ageRefresh").html(Math.floor(age /1000));
    } , 1000);
});
