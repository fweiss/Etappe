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
            //if (_.isUndefined(name)) {
            //    throw new Error('Waypoint.create: name is required');
            //}
            //if (_.isUndefined(lat)) {
            //    throw new Error('Waypoint.create: lat is required');
            //}
            //if (_.isUndefined(lon)) {
            //    throw new Error('Waypoint.create: lon is required');
            //}
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