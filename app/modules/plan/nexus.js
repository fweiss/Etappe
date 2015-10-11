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
            create: function(name, lat, lon) {
                if (_.isUndefined(name)) {
                    throw new Error('name is required');
                }
                if (_.isUndefined(lat)) {
                    throw new Error('lat is required');
                }
                if (_.isUndefined(lon)) {
                    throw new Error('lon is required');
                }
                return new Nexus(name, lat, lon );
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