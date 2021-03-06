angular.module('plan')
    .service('nexus', [ 'waypoint', function(Waypoint) {
        var nexuses = [];

        function Nexus(waypoint) {
            this.waypoint = waypoint;
            this.stops = [];
        }
        Nexus.prototype.getName = function() {
            return this.waypoint.getName();
        };
        Nexus.prototype.getLat = function() {
            return this.waypoint.getLat();
        };
        Nexus.prototype.getLon = function() {
            return this.waypoint.getLon();
        };
        Nexus.prototype.addStop = function(stop) {
            this.stops.push(stop);
        };
        Nexus.prototype.getStops = function() {
            return this.stops;
        };

        return {
            create: createNexus,
            createFromWaypoint: function(waypoint) {
                if (! waypoint) {
                    throw new Error('createFromWaypoint: waypoint must be given');
                }
                if (waypoint.constructor.name != 'Waypoint') {
                    throw new Error('createFromWaypoint: waypoint must be Waypoint type');
                }
                return new Nexus(waypoint);
            },
            mergeStop: mergeStop,
            mergeStops: function(stops) {
                _.each(stops, function(stop) {
                    mergeStop(stop);
                });

            },
            getMergedNexuses: function() {
                return nexuses;
            },
            findNearbyNexus: findNearbyNexus
        };
        function createNexus(name, lat, lon) {
            // validation left up to Waypoint
            return new Nexus(Waypoint.createWaypoint(name, lat, lon));
        }
        function findNearbyNexus(lat, lon) {
            return _.find(nexuses, function(nexus) {
                var deltaLat = Math.abs(nexus.getLat() - lat);
                var deltaLon = Math.abs(nexus.getLon() - lon);
                return deltaLat < .001 && deltaLon < .001;
            });
        }
        function mergeStop(stop) {
            var nearbyNexus = findNearbyNexus(stop.getLat(), stop.getLon());
            if (_.isUndefined(nearbyNexus)) {
                nearbyNexus = createNexus(stop.getName(), stop.getLat(), stop.getLon());
                nexuses.push(nearbyNexus);
            }
            nearbyNexus.stops.push(stop);
        }
    }]);