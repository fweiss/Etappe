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
    };
    $scope.changeOrigin = function() {
        changePlan();
    };
    $scope.changeDestination = function() {
        changePlan();
    };
    function changePlan() {
        if ($scope.originStationSelect && $scope.destinationStationSelect) {
            var originStop = $scope.originStationSelect.stopId; // 13293
            var destinationStop = $scope.destinationStationSelect.stopId; // 17324
            var now = new Date();
            var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            SfMuni.getRides(originStop, destinationStop).then(function(response) {
                var plan =  { spanStart: now, spanEnd: then,
                    rides: response.data
                };
                $scope.plan = plan;
            });
        }
   }
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
