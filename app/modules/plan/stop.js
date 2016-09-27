angular.module('plan')
    .service('stop', function() {
        function Stop(agency, route, stopId, lat, lon) {
            this.agency = agency;
            this.route = route;
            this.stopId = stopId;
            this.lat = lat;
            this.lon = lon;
        }
        Stop.prototype.getAgency = function() {
            return this.agency;
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
            createStop: function(agency, route, stopId, lat, lon) {
                if (! agency) {
                    throw new Error('createStop: must specify agency');
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
                return new Stop(agency, route, stopId, lat, lon);
            }
        };
    });
