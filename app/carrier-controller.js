angular.module('carrier', [ 'rides', 'agencies' ])
// this is deprecated in 1.2 and removed in 1.3
.config(function ($parseProvider) {
    $parseProvider.unwrapPromises(true);
})
.controller('Trip', [ '$scope', 'chart', 'sfMuni', function($scope, chart, SfMuni) {
    $scope.disableOrigin = true;
    $scope.disableDestination = true;
    $scope.carriers = [
        { name: 'BART' },
        { name: 'SFMUNI' }
    ];
    $scope.rides = null;
    $scope.changeCarrier = function() {
        SfMuni.getStops('55').then(function(response) {
            $scope.originStations = response.data;
            $scope.destinationStations = response.data;
        });
        $scope.destinationStations = [ { name: 'foo2'},{ name: 'bar2'}];
        $scope.disableOrigin = false;
        $scope.disableDestination = false;
        chart.setWidth(600);
        var now = new Date();
        var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
//        chart.setTimeSpan(now, then);
//        $scope.plan = getPlan();
        SfMuni.getRides('13293', '17324').then(function(response) {
            var plan =  { spanStart: now, spanEnd: then,
                rides: response.data
            };
           $scope.plan = plan;
        });
    };
    $scope.changeOrigin = function() {
        console.log('ooooooo ' + $scope.originStationSelect.stopId);
    };
    $scope.changeDestination = function() {
        console.log('dddddd ' + $scope.destinationStationSelect.stopId);
    };
    function getPlan() {
        var plan =  { spanStart: new Date('2013-02-22T13:00'), spanEnd: new Date('2013-02-22T14:00'),
            rides: [
            { agency: 'sfmuni', route: '55', origin: '3rd', destination: '16th', rides: [
                [ '20150221T1300', '20150222T1315' ]
            ],
                rideStart: new Date('2013-02-22T13:10'), rideEnd: new Date('2013-02-22T13:20')
            }
        ]};
        return plan;
    }
}])
.factory('stops', [ '$resource', function($resource) {
    return $resource('http://webservices.nextbus.com/service/publicXMLFeed', { command: 'routeList', a: 'sf-muni' }, {
        query: {method:'GET', params:{}, isArray:true}
    });
}]);
