angular.module('plan')
    .service('trip', [ function() {
        var nameSerial = 1;

        function Trip(name, originWaypoint, destinationWaypoint) {
            this.name = name;
            this.originWaypoint = originWaypoint;
            this.destinationWaypoint = destinationWaypoint;
            this.innerWaypoints = [];
        }
        Trip.prototype.getName = function() {
            return this.name;
        };
        Trip.prototype.setName = function(name) {
            this.name = name;
        };
        Trip.prototype.getOrigin = function() {
            return this.originWaypoint;
        };
        Trip.prototype.getDestination = function() {
            return this.destinationWaypoint;
        };
        Trip.prototype.getInnerWaypoints = function() {
            // _.clone does not preserve type
            return _.map(this.innerWaypoints, _.clone);
        };
        Trip.prototype.setInnerWaypoints = function(waypoints) {
            this.innerWaypoints = waypoints;
        };
        Trip.prototype.getWaypoints = function() {
            return _.union([ this.originWaypoint ], this.innerWaypoints, [ this.destinationWaypoint ]);
        };

        return {
            createTrip: function (origin, destination) {
                var name = 'Trip' + (nameSerial++);
                var waypoints = [];
                if (! origin) {
                    throw new Error('createTrip: must specify origin');
                }
                if (origin.constructor.name != 'Waypoint') {
                    throw new Error('createTrip: origin must be Waypoint type');
                }
                if (! destination) {
                    throw new Error('createTrip: must specify destination');
                }
                if (destination.constructor.name != 'Waypoint') {
                    throw new Error('createTrip: destination must be Waypoint type');
                }
                return new Trip(name, origin, destination);
            }
        };
    }]);
