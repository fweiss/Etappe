angular.module('carrier', [ 'agencies', 'plan' ])
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', 'chart', 'sfMuni', 'plan', 'planFolder', 'alert', function($scope, chart, SfMuni, Plan, PlanFolder, alert) {
        $scope.showSavedPlans = function() {
            $scope.savedPlans = PlanFolder.list();
        }
        $scope.selectSavedPlanx = function(planData) {
            $scope.currentPlan = plan;
            showSavedRides(plan);
        };
        $scope.selectSavedPlan = function(planData) {
            $scope.currentPlan = planData;
            var plan = Plan.createPlan2(planData);
            var waypoints = plan.getWaypoints();
            var originStops = waypoints[0].stops;
            var destinationStops = waypoints[1].stops;
            var segment = { originStops: originStops, destinationStops: destinationStops };
            var now = new Date();
            var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            plan.spanStart =  now;
            plan.spanEnd = then;
            SfMuni.getRidesForSegment(segment).then(function(response) {
                var rides = response.data;
                plan.addSegment(waypoints[0].name, waypoints[1].name, rides);
                $scope.plan = plan;
                $scope.rideList = rides;
                $scope.routes = '33 Ashbury'; //response.routes;
            });
        };
        $scope.disableOrigin = true;
        $scope.disableDestination = true;
        $scope.carriers = [
            { name: 'BART' },
            { name: 'SFMUNI' }
        ];
        $scope.rides = null;
        $scope.agencySelected = function() {
            Plan.fetchNexuses().then(function(nexuses) {
                $scope.originNexuses = nexuses;
            });
        };
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
            var planName = $scope.planSaveName;
            PlanFolder.store($scope.plan, planName);
        };
        $scope.planRestore = function() {
            try {
                var restoredPlan = PlanFolder.load($scope.planRestoreName);
                //$scope.originNexus = restoredPlan.segments[0].origin;
                $scope.destinationNexus = '';
                var segments = restoredPlan.getSegments();
                $scope.nexusStart = segments[0].origin;
                $scope.nexusEnd = segments[0].destination;
                //$scope.plan = restoredPlan;
            }
            catch (e) {
                alert('cannot restore plan: ' + e);
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
        function showSavedRides(plan) {
            var waypoints = plan.waypoints;
            //var originStops = [{"stopId":"15553","stopTag":"5553","route":"33"},{"stopId":"13338","stopTag":"3338","route":"33"}];
            //var destinationStops = [{"stopId":"13326","stopTag":"3326","route":"33"},{"stopId":"13325","stopTag":"3325","route":"33"}];
            var now = new Date();
            var originStops = waypoints[0].stops;
            var destinationStops = waypoints[1].stops;
            var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            var segment = { originStops: originStops, destinationStops: destinationStops };
            console.log('getting rides: ' + plan.name);
            SfMuni.getRidesForSegment(segment).then(function(response) {
                console.log('got rides: ');
                var rides = response.data;
                console.log('got rides: ' + rides);
                try {
                    var plan = Plan.createPlan(now, then);
                }
                catch(e) {
                    console.log('err: ' + e)
                }
                console.log($scope);
                plan.addSegment(waypoints[0].name, waypoints[1].name, rides);
                $scope.plan = plan;
                $scope.rideList = rides.length;
            }, function(fail) { $scope.rideList = fail; });
        }
}]);
