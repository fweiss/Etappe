angular.module('carrier', [ 'agencies', 'plan' ])
    .controller('Trip', [ '$scope', 'chart', 'sfMuni', 'plan', function($scope, chart, SfMuni, Plan) {
        $scope.disableOrigin = true;
        $scope.disableDestination = true;
        $scope.carriers = [
            { name: 'BART' },
            { name: 'SFMUNI' }
        ];
        $scope.rides = null;
        $scope.changeCarrier = function() {
            //SfMuni.getAllStops().then(function(response) {
            //    $scope.originStations = response.data;
            //    $scope.destinationStations = response.data;
            //});
            SfMuni.getAllNexus().then(function(response) {
                $scope.originNexus = response.data;
                $scope.destinationNexus = response.data;
            });
            $scope.destinationStations = [ { name: 'foo2'},{ name: 'bar2'}];
            $scope.disableOrigin = false;
            $scope.disableDestination = false;
            //chart.setWidth(600);
        };
        $scope.changeOrigin = function() {
            changePlan();
        };
        $scope.changeDestination = function() {
            changePlan();
        };
            // deprecated
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
        $scope.originNexusChanged = function() {
            changeNexus();
        }
        $scope.destinationNexusChanged = function() {
            changeNexus();
        }
        $scope.ridesRefresh = function() {
            changeNexus();
        }
        $scope.planSave = function() {
            Plan.store($scope.plan);
        };
        $scope.planRestore = function() {
            try {
                var restoredPlan = Plan.load();
                //$scope.originNexus = restoredPlan.segments[0].origin;
                $scope.destinationNexus = '';
                var segments = restoredPlan.getSegments();
                $scope.nexusStart = segments[0];
                $scope.nexusEnd = segments[1];
                //$scope.plan = restoredPlan;
            }
            catch (e) {
                alert('Hello');
            }
        };
        function changeNexus() {
            if ($scope.originNexusSelect && $scope.destinationNexusSelect) {
                var originStops = $scope.originNexusSelect.stops;
                var destinationStops = $scope.destinationNexusSelect.stops;
                var now = new Date();
                var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                var segment = { originStops: originStops, destinationStops: destinationStops };
                SfMuni.getRidesForSegment(segment).then(function(response) {
                    var rides = response.data;
                    //var plan =  { spanStart: now, spanEnd: then,
                    //    rides: rides
                    //};
                    var plan = Plan.createPlan(now, then);
                    plan.addSegment($scope.originNexusSelect.name, $scope.destinationNexusSelect.name, rides);
                    $scope.plan = plan;
                    $scope.rideList = rides.length;
                }, function(fail) { $scope.rideList = fail; });

            }

        }
}]);
