angular.module('plan')
    .service('stop', function() {
        function Stop(name, agencyId, route, stopId, lat, lon) {
            this.name = name;
            this.agencyId = agencyId;
            this.route = route;
            this.stopId = stopId;
            this.lat = lat;
            this.lon = lon;
        }
        Stop.prototype.getName = function() {
            return this.name;
        };
        Stop.prototype.getAgencyId = function() {
            return this.agencyId;
        };
        Stop.prototype.getRoute = function() {
            return this.route;
        };
        Stop.prototype.getStopId = function() {
            return this.stopId;
        };
        Stop.prototype.getLat = function() {
            return this.lat;
        };
        Stop.prototype.getLon = function() {
            return this.lon;
        };
        return {
            createStop: function(name, agencyId, route, stopId, lat, lon) {
                if (! name) {
                    throw new Error('createStop: must specify name');
                }
                if (! agencyId) {
                    throw new Error('createStop: must specify agency id');
                }
                if (! route) {
                    throw new Error('createStop: must specify route');
                }
                if (! stopId) {
                    throw new Error('createStop: must specify stop id');
                }
                if (! lat) {
                    throw new Error('createStop: must specify lat');
                }
                if (! lon) {
                    throw new Error('createStop: must specify lon');
                }
                return new Stop(name, agencyId, route, stopId, lat, lon);
            }
        };
    });
