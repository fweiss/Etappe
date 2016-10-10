angular.module('plan')
    .service('nexus', [ 'waypoint', function(Waypoint) {
        //function Nexus(name, lat, lon) {
        //    this.name = name;
        //    this.lat = lat;
        //    this.lon = lon;
        //    this.stops = [];
        //}
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
            nexuses: [],
            create: function(name, lat, lon) {
                //if (_.isUndefined(name)) {
                //    throw new Error('Waypoint.create: name is required');
                //}
                //if (_.isUndefined(lat)) {
                //    throw new Error('Waypoint.create: lat is required');
                //}
                //if (_.isUndefined(lon)) {
                //    throw new Error('Waypoint.create: lon is required');
                //}
                //return new Nexus(name, lat, lon );
                return new Nexus(Waypoint.createWaypoint(name, lat, lon));
            },
            createFromWaypoint: function(waypoint) {
                return new Nexus(waypoint);
            },
            mergeStop: function(stop) {
                var nearbyNexus = this.findNearbyNexus(stop.getLat(), stop.getLon());
                if (_.isUndefined(nearbyNexus)) {
                    //nearbyNexus = new Nexus(stop.getName(), stop.getLat(), stop.getLon());
                    nearbyNexus = this.create(stop.getName(), stop.getLat(), stop.getLon());
                    this.nexuses.push(nearbyNexus);
                }
                nearbyNexus.stops.push(stop);
            },
            getMergedNexuses: function() {
                return this.nexuses;
            },
            findNearbyNexus: function(lat, lon) {
                return _.find(this.nexuses, function(nexus) {
                    var deltaLat = Math.abs(nexus.getLat() - lat);
                    var deltaLon = Math.abs(nexus.getLon() - lon);
                    return deltaLat < .001 && deltaLon < .001;
                });
            }
        };
    }]);