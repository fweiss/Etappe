angular.module('plan')
    .factory('alert', function($window) {
        return function(message) {
            $window.alert(message);
        }
    })
    .controller('PlanController', [ '$scope', '$q', 'sfMuni', 'bart', 'alert', 'nexus', 'itinerary', 'trip', 'system', 'tripfolder', 'waypoint',
        function($scope, $q, SfMuni, Bart, alert, Nexus, Itinerary, Trip, System, TripFolder, Waypoint) {

        $scope.waypoints = [];
        $scope.carriers = [
            { name: 'BART', api: Bart, selected: false },
            { name: 'SFMUNI', api: SfMuni, selected: false }
        ];
        $scope.itinerary = null;

        $scope.nextWaypointChanged = function() {
            var nexus = $scope.nextWaypointSelect;
            var waypoint = Waypoint.createWaypoint(nexus.getName(), nexus.getLat(), nexus.getLon());
            $scope.waypoints.push(waypoint);
        };
        $scope.createTrip = function() {
            //$scope.trip = Trip.createTrip($scope.waypoints[0], $scope.waypoints[1]);
            $scope.trip = Trip.createFromWaypoints($scope.waypoints);
            $scope.createItineraryFromTrip($scope.trip);
            //$scope.refreshItineraryRides(function() {
            //    var now = new Date();
            //    var then = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            //    $scope.itinerary.setSpan(now, then);
            //});
            $scope.ridesRefresh();
        };

        //$scope.createTripFromNexusSelect = function() {
        //    var n1 = $scope.originNexusSelect;
        //    var n2 = $scope.destinationNexusSelect;
        //    var w1 = Waypoint.createWaypoint(n1.getName(), n1.getLat(), n1.getLon());
        //    var w2 = Waypoint.createWaypoint(n2.getName(), n2.getLat(), n2.getLon());
        //    $scope.trip = new Trip.createTrip(w1, w2);
        //};
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
        //$scope.disableOrigin = true;
        //$scope.disableDestination = true;
        $scope.rides = null;

        $scope.selection = [];
        $scope.selectedAgencies = function() {
            return filterFilter($scope.carriers, { selected: true });
        };
        $scope.$watch('carriers|filter:{selected:true}', function (nv) {
            $scope.selection = nv.map(function (agency) {
                var api = agency.api;
                api.getAllStops().then(function(response) {
                    Nexus.mergeStops(response.data);
                    var nexuses = _.sortBy(Nexus.getMergedNexuses(), function(nexus) { return nexus.getName(); });
                    $scope.originNexus = nexuses;
                    $scope.destinationNexus = nexuses;
                    $scope.destinationNexus = nexuses;
                    $scope.disableOrigin = false;
                    $scope.disableDestination = false;
                });
                return agency.name;
            });
        }, true);

        $scope.ridesRefresh = function() {
            refreshRides($scope.itinerary);
        }
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
            var agency = _.findWhere($scope.carriers, { name: theAgency});
            return agency || nullAgency;
        }
}]);
