angular.module('plan')
    .service('stop', function() {
        function Stop(agency, route, stopId) {
            this.agency = agency;
            this.route = route;
            this.stopId = stopId;
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
        return {
            createStop: function(agency, route, stopId) {
                if (! agency) {
                    throw new Error('createStop: must specify agency');
                }
                if (! route) {
                    throw new Error('createStop: must specify route');
                }
                if (! stopId) {
                    throw new Error('createStop: must specify stop id');
                }
                return new Stop(agency, route, stopId);
            }
        };
    });
