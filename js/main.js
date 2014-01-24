$(function() {
    var currentOutboundTrip;
    var currentInboundTrip;
    $("#tabs").tabs();
    var tripInfo = {
        origin: '1349 Clayton St',
        destination: '555 Market St'
    };
    view.updateTripInfo(tripInfo);
    var options = {};
    options.trip = trips[1];
    $("#obRefresh").click(function(event) {
        options.direction = 'outbound';
        event.preventDefault();
        $("#busyModal").show();
        etappe.strategy7(options, function(trip) {
            $("#busyModal").hide();
            updateViews(trip, 'ob');
        });
    });
    $("#ibRefresh").click(function(event) {
        options.direction = 'inbound';
        event.preventDefault();
        $("#busyModal").show();
        etappe.strategy7(options, function(trip) {
            $("#busyModal").hide();
            updateViews(trip, 'ib');
        });
    });
    function updateViews(trip, direction) {
        var epoch = new Date();
        view.updateTripSummary("#" + direction + "trip", trip);
        view.updateSegments("#" + direction + "1", trip.segments[0], epoch);
        view.updateSegments("#" + direction + "2", trip.segments[1], epoch);
        view.updateGraph(direction + "Graph", trip.segments);
    }
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
