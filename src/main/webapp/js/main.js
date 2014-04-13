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
        modalController.start();
        etappe.strategy7(options, function(trip) {
            modalController.finish();
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
/**
 * The user can select a carrier/agency and an origin and destination station.
 * Display a list of available segments/routes between the stations.
 * @type {tripController}
 */
var tripController = function() {
    var carrier;
    var originStation;
    var destinationStation;
    var segments;
    var adapters = {
        bart: {
            getStations: bart.getStations,
            findSegments: bart.findSegments
        },
        sfmuni: {
            getStations: sfmuni.getStations,
            findSegments: sfmuni.findSegmentsBetweenStations
        }
    };
    $(function() {
        $('#originStationSelect, #destinationStationSelect, #doChart').attr('disabled', 'disabled');
        $('#carrierSelect').change(function(event) {
            carrier = event.target.value;
            adapters[carrier].getStations({}, function(stations) {
                $('#originStationSelect, #destinationStationSelect').removeAttr('disabled');
                view.drawStations(_.sortBy(stations, 'name'));
            });
        });
        $('#originStationSelect').change(function() {
            originStation = $(this).val();
            join();
        });
        $('#destinationStationSelect').change(function() {
            destinationStation = $(this).val();
            join();
        });
        $('#doChart').click(function() {
//            var rides = etappe.getRidesForSegments(segments);
        });
    });
    function join() {
        if (originStation && destinationStation) {
            options = {};
            options.originStation = originStation;
            options.destinationStation= destinationStation
            adapters[carrier].findSegments(options, function(_segments) {
                segments = _segments;
                view.drawPlan(segments);
                $('#doChart').removeAttr('disabled');
            });
        }
    }
}();

var modalController = function() {
    var timer;
    function timeout() {
        $("#busyModal").hide();
    }

    return {
        start: function() {
            $("#busyModal").show();
            timer = window.setTimeout(timeout, 5000);
        },
        finish: function() {
            window.clearTimeout(timer);
            $("#busyModal").hide();
        }
    }
}();
