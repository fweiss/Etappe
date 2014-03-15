$(function() {
    $("#tabs").tabs();
    var tripInfo = {
        origin: '1349 Clayton St',
        destination: '555 Market St'
    };
    var direction;
    var autoRefresh = false;
    view.updateTripInfo(tripInfo);
    var options = {};
    options.trip = trips[1];
    $("#obRefresh").click(function(event) {
        direction = 'outbound';
        autoRefresh = true;
        updateTrip();
    });
    $("#ibRefresh").click(function(event) {
        direction = 'inbound';
        autoRefresh = true;
        updateTrip();
    });
    function updateTrip() {
        options.direction = direction;
        $("#busyModal").show();
        etappe.strategy7(options, function(trip) {
            $("#busyModal").hide();
            if (direction == 'inbound') {
                view.updateInbound(trip);
            }
            if (direction == 'outbound') {
                view.updateOutbound(trip);
            }
        });

    }
    var ageRefresh;
    var ageEpoch = new Date();
    ageRefresh = window.setInterval(function() {
        var age = new Date() - ageEpoch;
        $("#inbound .ageRefresh").html(Math.floor(age /1000));
        if (autoRefresh) {
            updateTrip();
        }
    } , 60 * 1000);
});
