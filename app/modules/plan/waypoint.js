angular.module('plan')
    .service('waypoint', function() {

        function Waypoint(name, lat, lon) {
            this.name = name;
            this.lat = lat;
            this.lon = lon;
            this.stops = [];
        }
        Waypoint.prototype.getName = function() {
            return this.name;
        };
        Waypoint.prototype.getLat = function() {
            return this.lat;
        };
        Waypoint.prototype.getLon = function() {
            return this.lon;
        };
        Waypoint.prototype.getStops = function() {
            return this.stops;
        };

        return {
            createWaypoint: function(name, lat, lon) {
                if (! name) {
                    throw new Error('createWaypoint: must specify name');
                }
                if (! lat) {
                    throw new Error('createWaypoint: must specify lat');
                }
                if (! lon) {
                    throw new Error('createWaypoint: must specify lon');
                }
                return new Waypoint(name, lat, lon);
            }
        };
    });
