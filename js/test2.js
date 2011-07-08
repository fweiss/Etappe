$(function() {
    $("#tabs").tabs();
    $("#ibRefresh").click(function(event) {
        etappe.strategy5(function(trip) {
            ageEpoch = new Date();
            view.updateTrip("#ib", trip);
        });
    });
    $("#obRefresh").click(function(event) {
        etappe.strategy6({ }, function(trip) {
            ageEpoch = new Date();
            view.updateTrip("#ob", trip);
        });
    });
    var ageRefresh;
    var ageEpoch = new Date();
    ageRefresh = window.setInterval(function() {
        var age = new Date() - ageEpoch;
        $("#inbound .ageRefresh").html(Math.floor(age /1000));
    } , 1000);
});
