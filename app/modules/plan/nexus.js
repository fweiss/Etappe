angular.module('plan')
    .service('nexus', function() {
        function Nexus(canonicalName, lat, lon) {
            this.canonicalName = canonicalName;
            this.lat = lat;
            this.lon = lon;
            this.stops = [];
            this.getCanonicalName = function() {
                return this.canonicalName
            };
            this.getLat = function() {
                return this.lat;
            };
            this.getLon = function() {
                return this.lon;
            };
            this.getStops = function() {
                return this.stops;
            };
        }
        return {
            nexuses: [],
            create: function(config) {
                return new Nexus(config.cannonicalName, config.lat, config.lon );
            },
            mergeStop: function(stop) {
                var nearbyNexus = this.findNearbyNexus(stop.lat, stop.lon);
                if (_.isUndefined(nearbyNexus)) {
                    nearbyNexus = new Nexus(stop.name, stop.lat, stop.lon);
                    this.nexuses.push(nearbyNexus);
                }
                nearbyNexus.stops.push(stop);
            },
            getMergedNexuses: function() {
                return this.nexuses;
            },
            findNearbyNexus: function(lat, lon) {
                return _.find(this.nexuses, function(nexus) {
                    var deltaLat = Math.abs(nexus.lat - lat);
                    var deltaLon = Math.abs(nexus.lat - lat);
                    return deltaLat < .001 && deltaLon < .001;
                });
            }
        };
    });