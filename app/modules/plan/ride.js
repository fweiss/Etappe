angular.module('plan')
    .service('ride', function() {
        function Ride(agency, routeId, vehicleId, startTime, endTime) {
            this.agency = agency;
            this.routeId = routeId;
            this.vehicleId = vehicleId;
            this.startTime = startTime;
            this.endTime = endTime;
        }
        Ride.prototype.getAgency = function() {
            return this.agency;
        };
        Ride.prototype.getRouteId = function() {
            return this.routeId;
        };
        Ride.prototype.getVehicleId = function() {
            return this.vehicleId;
        };
        Ride.prototype.getStartTime = function() {
            return this.startTime;
        };
        Ride.prototype.getEndTime = function() {
            return this.endTime;
        };
        return {
            createRide: function(agency, routeId, vehicleId, startTime, endTime) {
                if (!agency) {
                    throw new Error('createRide: must specify agency');
                }
                if (!routeId) {
                    throw new Error('createRide: must specify route id');
                }
                if (!vehicleId) {
                    throw new Error('createRide: must specify vehicle id');
                }
                if (!startTime) {
                    throw new Error('createRide: must specify start time');
                }
                if (startTime.constructor.name != 'Date') {
                    throw new Error('createRide: start time is not Date type');
                }
                if (!endTime) {
                    throw new Error('createRide: end time is not given');
                }
                if (endTime.constructor.name != 'Date') {
                    throw new Error('createRide: end time is not Date type');
                }
                return new Ride(agency, routeId, vehicleId, startTime, endTime);
            }
        };
    });