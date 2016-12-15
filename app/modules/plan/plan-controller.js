angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', '$q', 'chart', 'sfMuni', 'bart', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'segment', 'waypoint',
        function($scope, $q, chart, SfMuni, Bart, alert, Nexus, Itinerary, Trip, System, TripFolder, Segment, Waypoint) {

        $scope.waypoints = [];

        $scope.nextWaypointChanged = function() {
            var nexus = $scope.nextWaypointSelect;
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
            { name: 'BART', api: Bart },
            { name: 'SFMUNI', api: SfMuni }
        ];
        $scope.rides = null;
        $scope.changeCarrier = function() {
            var carrier = $scope.carrierSelect.name;
            var api = {
                SFMUNI: SfMuni,
                BART: Bart
            };
            api[carrier].getAllStops().then(function(response) {
                Nexus.mergeStops(response.data);
                var nexuses = _.sortBy(Nexus.getMergedNexuses(), function(nexus) { return nexus.getName(); });
                $scope.originNexus = nexuses;
                $scope.destinationNexus = nexuses;
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
            refreshRides($scope.itinerary);
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
        // keep just to illustrate the transform to parallel
        function refreshRidesx(itinerary) {
            var segment = itinerary.getSegments()[0];
            SfMuni.getRidesForSegment(segment).then(function(response) {
                var rides = response.data;
                segment.rides = rides;
                itinerary.getSegments()[0].rides = rides;

                var now = new Date();
                var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                itinerary.setSpan(now, then);

                $scope.rideList = rides.length;
            }, function(fail) { $scope.rideList = fail; });
        }
        function refreshRides(itinerary) {
            var segments = itinerary.getSegments();
            $q.all(_.map(segments, function(segment) {
                var promise =  SfMuni.getRidesForSegment(segment);
                promise.then(function(response) {
                    segment.rides = response.data;
                });
                return promise;
            })).then(function() {
                var now = new Date();
                var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                itinerary.setSpan(now, then);
            });
        }
}]);
