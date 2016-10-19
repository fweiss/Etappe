angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', 'chart', 'sfMuni', 'plan', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'segment',
        function($scope, chart, SfMuni, Plan, alert, Waypoint, Itinerary, Trip, System, TripFolder, Segment) {

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
        //$scope.createPlanFromItinerary = function(itinerary) {
        //    //var plan = Plan.createPlan(itinerary.getTrip().getName());
        //    //_.each(itinerary.getSegments(), function(segment) {
        //    //    plan.addSegment(segment.originNexus.getName(), segment.destinationNexus.getName(), segment.rides);
        //    //});
        //    //var now = new Date();
        //    //var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        //    ////plan.spanStart =  now;
        //    ////plan.spanEnd = then;
        //    //plan.setSpan(now, then);
        //    //$scope.plan = plan;
        //};
        $scope.showSavedTrips = function() {
            $scope.savedTrips = TripFolder.list();
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
                    //$scope.createPlanFromItinerary($scope.itinerary);
                });
            });
        };
        $scope.disableOrigin = true;
        $scope.disableDestination = true;
        $scope.carriers = [
            { name: 'BART' },
            { name: 'SFMUNI' }
        ];
        $scope.rides = null;
        //$scope.agencySelected = function() {
        //    Plan.fetchNexuses().then(function(nexuses) {
        //        $scope.originNexuses = nexuses;
        //    });
        //};
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
                //var plan = Plan.createPlan(itinerary.getTrip().getName());
                //plan.setSpan(now, then);
                //plan.addSegment(segment.originNexus.getName(), segment.destinationNexus.getName(), rides);
                //$scope.plan = plan;

                $scope.rideList = rides.length;
            }, function(fail) { $scope.rideList = fail; });
        }
}]);
