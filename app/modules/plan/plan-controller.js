angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', 'chart', 'sfMuni', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'segment', 'waypoint',
        function($scope, chart, SfMuni, alert, Nexus, Itinerary, Trip, System, TripFolder, Segment, Waypoint) {

        $scope.waypoints = [];

        $scope.nextWaypointChanged = function() {
            var nexus = $scope.originNexusSelect;
            var waypoint = Waypoint.createWaypoint(nexus.getName(), nexus.getLat(), nexus.getLon());
            $scope.waypoints.push(waypoint);
        };
        $scope.createTrip = function() {
            //$scope.trip = Trip.createTrip($scope.waypoints[0], $scope.waypoints[1]);
            $scope.trip = Trip.createFromWaypoints($scope.waypoints);
            $scope.createItineraryFromTrip($scope.trip);
        };

        $scope.createTripFromNexusSelect = function() {
            var n1 = $scope.originNexusSelect;
            var n2 = $scope.destinationNexusSelect;
            var w1 = Waypoint.createWaypoint(n1.getName(), n1.getLat(), n1.getLon());
            var w2 = Waypoint.createWaypoint(n2.getName(), n2.getLat(), n2.getLon());
            $scope.trip = new Trip.createTrip(w1, w2);
        };
        $scope.createItineraryFromTrip = function(trip) {
            var nexuses = _.map(trip.getWaypoints(), function(waypoint) {
                return System.findNexus(waypoint);
            });
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            var itinerary = Itinerary.createItinerary(trip, segments);
            $scope.itinerary = itinerary;
        };
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
            $scope.trip = trip;
            SfMuni.getAllStops().then(function(response) {
                _.each(response.data, function(stop) {
                    System.mergeStop(stop);
                });

                $scope.createItineraryFromTrip(trip);
                $scope.refreshItineraryRides(function() {
                    var now = new Date();
                    var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                    $scope.itinerary.setSpan(now, then);
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
        $scope.changeCarrier = function() {
            SfMuni.getAllStops().then(function(response) {
                Nexus.mergeStops(response.data);
                var nexuses = _.sortBy(Nexus.getMergedNexuses(), function(nexus) { return nexus.getName(); });
                $scope.originNexus = nexuses;
                $scope.destinationNexus = nexuses;
                $scope.disableOrigin = false;
                $scope.disableDestination = false;
            });
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
        $scope.ridesRefresh2 = function() {
            refreshRides($scope.itinerary.getSegments()[0], $scope.itinerary);
        }
        function changeNexus() {
            if ($scope.originNexusSelect && $scope.destinationNexusSelect) {
                $scope.createTripFromNexusSelect();
                $scope.createItineraryFromTrip($scope.trip);
                $scope.refreshItineraryRides(function() {
                    var now = new Date();
                    var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                    $scope.itinerary.setSpan(now, then);
                });
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
