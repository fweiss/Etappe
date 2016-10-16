angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', 'chart', 'sfMuni', 'plan', 'planFolder', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'segment',
        function($scope, chart, SfMuni, Plan, PlanFolder, alert, Waypoint, Itinerary, Trip, System, TripFolder, Segment) {

        $scope.createItineraryFromTrip = function(trip) {
            var nexuses = _.map(trip.getWaypoints(), function(waypoint) {
                return System.findNexus(waypoint);
            });
            var segments = [];
            _.reduce(nexuses, function(origin, destination) {
                var segment = Segment.createSegment(origin, destination);
                //segments.push({ originNexus: origin, destinationNexus: destination, rides: [] });
                segments.push(segment);
            });
            var itinerary = Itinerary.createItinerary(trip, segments);

            //var itinerary = Itinerary.createItinerary(trip);
            //var segments = itinerary.getSegments();
            $scope.itinerary = itinerary;
        };
        $scope.createPlanFromItinerary = function(itinerary) {
            var plan = Plan.createPlan(itinerary.getTrip().getName());
            _.each(itinerary.getSegments(), function(segment) {
                plan.addSegment(segment.originNexus.getName(), segment.destinationNexus.getName(), segment.rides);
            });
            var now = new Date();
            var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            //plan.spanStart =  now;
            //plan.spanEnd = then;
            plan.setSpan(now, then);
            $scope.plan = plan;
        };
        //$scope.originStationSelect = null;
        $scope.showSavedPlans = function() {
            $scope.savedPlans = PlanFolder.list();
        };
        $scope.showSavedTrips = function() {
            $scope.savedTrips = TripFolder.list();
        };
        $scope.selectSavedPlanx = function(planData) {
            $scope.currentPlan = plan;
            showSavedRides(plan);
        };
        $scope.refreshItineraryRides = function(callback) {
            _.each($scope.itinerary.getSegments(), function(segment) {
                SfMuni.getRidesForSegment(segment).then(function(response) {
                    var rides = response.data;
                    segment.rides = rides;
                    callback();
                });
            });
        };
        $scope.selectSavedTrip = function(trip) {
            $scope.currentTrip = trip;
            SfMuni.getAllStops().then(function(response) {
                _.each(response.data, function(stop) {
                    System.mergeStop(stop);
                });

                $scope.createItineraryFromTrip(trip);
                $scope.refreshItineraryRides(function() {
                    var now = new Date();
                    var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                    $scope.itinerary.setSpan(now, then);
                    $scope.createPlanFromItinerary($scope.itinerary);
                });
            });
        };
        $scope.selectSavedPlan = function(planData) {
            // $scope.plan is watched by canvas
            // but $scope.itinerary is really the domain object
            // plan is not supposed to have rides
            // also the getRidesPerSegment is called other places, and should be centralized
            $scope.currentPlan = planData;
            var plan = Plan.createPlan(planData);
            var trip = Trip.createTrip(plan.getWaypoints()[0], plan.getWaypoints()[1]);
            $scope.itinerary = Itinerary.createItinerary(trip);
            // needs System nexuses
            //$scope.createItineraryFromTrip(trip);


            var waypoints = plan.getWaypoints();
            var originStops = waypoints[0].stops;
            var destinationStops = waypoints[1].stops;
            //var segment = { originStops: originStops, destinationStops: destinationStops };
            var segment = { originWaypoint: waypoints[0],  destinationWaypoint: waypoints[1], rides: [] };
            var now = new Date();
            var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            //plan.spanStart =  now;
            //plan.spanEnd = then;
            plan.setSpan(now, then);


            SfMuni.getRidesForSegment(segment).then(function(response) {
                var rides = response.data;
                plan.addSegment(waypoints[0].name, waypoints[1].name, rides);
                $scope.plan = plan;
                //setPlanFromItinerary(Itinerary.create(plan));
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
            console.log('hereh');
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
        $scope.ridesRefresh2 = function() {
            refreshRides($scope.itinerary.getSegments()[0], $scope.itinerary);
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
                var segments = restoredPlan.getSegments2();
                //$scope.nexusStart = segments[0].origin;
                //$scope.nexusEnd = segments[0].destination;
                $scope.nexusStart = segments[0].originWaypoint;
                $scope.nexusEnd = segments[0].destinationWaypoint;
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
                var plan = Plan.createPlan('cplan');
                var itinerary;
                plan.setSpan(now, then);
                var w1 = Waypoint.create($scope.originNexusSelect.name, 21, 31); // originStops
                _.each(originStops, function(stop) {
                    w1.addStop(stop);
                });
                plan.addWaypoint(w1);
                var w2 = Waypoint.create($scope.destinationNexusSelect.name, 22, 33);
                _.each(destinationStops, function(stop) {
                    w2.addStop(stop);
                });
                plan.addWaypoint(w2); // destinationStops);
                var segment = plan.getSegments2()[0];
                $scope.plan = plan;

                // Itinerary is in plan.js
                var trip = Trip.createTrip(w1, w2);
                var ss = _.map(plan.getSegments2(), function(segment) {
                    return Segment.createSegment(segment.originWaypoint, segment.destinationWaypoint);
                });
                itinerary = Itinerary.createItinerary(trip, ss);
                $scope.itinerary = itinerary;
                //refreshRides(segment, itinerary);
                refreshRides(itinerary.getSegments()[0], itinerary);
            }
        }
        function refreshRides(segment, itinerary) {
            SfMuni.getRidesForSegment(segment).then(function(response) {
                var rides = response.data;
                segment.rides = rides;
                itinerary.getSegments()[0].rides = rides;

                var now = new Date();
                var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                itinerary.setSpan(now, then);
                var plan = Plan.createPlan(itinerary.getTrip().getName());
                plan.setSpan(now, then);
                plan.addSegment(segment.originNexus.getName(), segment.destinationNexus.getName(), rides);
                $scope.plan = plan;

                $scope.rideList = rides.length;
            }, function(fail) { $scope.rideList = fail; });
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
                //console.log($scope);
                plan.addSegment(waypoints[0].name, waypoints[1].name, rides);
                $scope.plan = plan;
                $scope.rideList = rides.length;
            }, function(fail) { $scope.rideList = fail; });
        }
}]);
