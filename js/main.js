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
            view.updateOutbound(trip);
        });
    });
    $("#ibRefresh").click(function(event) {
        options.direction = 'inbound';
        event.preventDefault();
        $("#busyModal").show();
        etappe.strategy7(options, function(trip) {
            $("#busyModal").hide();
            view.updateInbound(trip);
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
