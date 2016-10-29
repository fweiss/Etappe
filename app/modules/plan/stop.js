angular.module('plan')
    .service('stop', function() {

        function Stop(name, agencyId, routeId, stopId, lat, lon) {
            this.name = name;
            this.agencyId = agencyId;
            this.routeId = routeId;
            this.stopId = stopId;
            this.lat = lat;
            this.lon = lon;
            this.stopTag = '';
        }
        Stop.prototype.getName = function() {
            return this.name;
        };
        Stop.prototype.getAgencyId = function() {
            return this.agencyId;
        };
        Stop.prototype.getRouteId = function() {
            return this.routeId;
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
        Stop.prototype.setStopTag = function(stopTag) {
            this.stopTag = stopTag;
        };
        Stop.prototype.getStopTag = function() {
            return this.stopTag;
        };

        return {
            createStop: function(name, agencyId, routeId, stopId, lat, lon) {
                if (! name) {
                    throw new Error('createStop: must specify name');
                }
                if (! agencyId) {
                    throw new Error('createStop: must specify agency id');
                }
                if (! routeId) {
                    throw new Error('createStop: must specify route id');
                }
                if (! stopId) {
                    throw new Error('createStop: must specify stop id');
                }
                if (_.isUndefined(lat)) {
                    throw new Error('createStop: must specify lat');
                }
                if (_.isNaN(parseFloat(lat))) {
                    throw new Error('createStop: must specify valid lat');
                }
                if (_.isUndefined(lon)) {
                    throw new Error('createStop: must specify lon');
                }
                if (_.isNaN(parseFloat(lon))) {
                    throw new Error('createStop: must specify valid lon');
                }
                return new Stop(name, agencyId, routeId, stopId, parseFloat(lat), parseFloat(lon));
            }
        };
    });
