$(function() {
    var currentOutboundTrip;
    var currentInboundTrip;
    $("#tabs").tabs();
    $("#obRefresh").click(function(event) {
        event.preventDefault();
        $("#busyModal").show();
        etappe.strategy6({ direction: "outbound" }, function(trip) {
            $("#busyModal").hide();
            ageEpoch = new Date();
            //view.updateTrip("#ob", trip);
            view.updateTripSummary("#obtrip", trip);
            view.updateSegments("#ob1", trip.segments[0], new Date());
            view.updateSegments("#ob2", trip.segments[1], new Date());
            view.updateGraph("obGraph", trip.segments);
        });
    });
    $("#ibRefresh").click(function(event) {
        event.preventDefault();
        $("#busyModal").show();
        etappe.strategy6({ direction: "inbound" }, function(trip) {
            $("#busyModal").hide();
            currentInboundTrip = trip;
            ageEpoch = new Date();
            //view.updateTrip("#ob", trip);
            view.updateTripSummary("#ibtrip", trip);
            view.updateSegments("#ib1", trip.segments[0], new Date());
            view.updateSegments("#ib2", trip.segments[1], new Date());
            view.updateGraph("ibGraph", trip.segments);
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
        if (currentInboundTrip) {
            //view.drawExpiredArea(ageEpoch, currentInboundTrip.segments);
        }
    } , 1000);
});
