angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', '$q', 'sfMuni', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'waypoint', 'agency',
        function($scope, $q, SfMuni, alert, Nexus, Itinerary, Trip, System, TripFolder, Waypoint, Agency) {

        $scope.waypoints = [];
        $scope.agencies = Agency.getAll()
        $scope.originNexus = [];
        $scope.itinerary = null;
        $scope.$watch('agencies|filter:{selected:true}', function (agencies) {
            _.each(agencies, function(agency) {
                updateNexusForAgency(agency);
            });
        }, true);

        function updateNexusForAgency(agency) {
            var api = agency.api;
            api.getAllStops().then(function(response) {
                Nexus.mergeStops(response.data);
                var nexuses = _.sortBy(Nexus.getMergedNexuses(), function (nexus) {
                    return nexus.getName();
                });
                $scope.originNexus = nexuses;
            });
        }

        $scope.nextWaypointChanged = function() {
            var nexus = $scope.nextWaypointSelect;
            var waypoint = Waypoint.createWaypoint(nexus.getName(), nexus.getLat(), nexus.getLon());
            $scope.waypoints.push(waypoint);
        };
        $scope.createTrip = function() {
            $scope.trip = Trip.createFromWaypoints($scope.waypoints);
            $scope.createItineraryFromTrip($scope.trip);
            $scope.ridesRefresh();
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
        $scope.rides = null;

        $scope.ridesRefresh = function() {
            refreshRides($scope.itinerary);
        };
        function refreshRides(itinerary) {
            var segments = itinerary.getSegments();
            $q.all(_.map(segments, function(segment) {
                var agency = findAgency(segment);
                return agency.api.getRidesForSegment(segment)
                .then(function(response) {
                    segment.rides = response.data;
                });
            })).then(function() {
                var now = new Date();
                var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                itinerary.setSpan(now, then);
            });
        }
        // include fallback for segment without agencies or no registered agency
        function findAgency(segment) {
            var nullAgency = {
                name: 'null',
                api: {
                    getRidesForSegment: function() {
                        return $q.when({ data: []});
                    }
                }
            };
            var agencies = segment.getAgencies();
            var theAgency = agencies.length ? agencies[0].toUpperCase() : '';
            var agency = _.findWhere($scope.agencies, { name: theAgency});
            return agency || nullAgency;
        }
}]);
