angular.module('plan')
    .service('trip', [ function() {
        return {
            createTrip: function (origin, destination) {
                var waypoints = [];
                if (! origin) {
                    throw new Error('createTrip: must specify origin');
                }
                if (! destination) {
                    throw new Error('createTrip: must specify destination');
                }
                return {
                    getOrigin: function() {
                        return origin;
                    },
                    getDestination: function() {
                        return destination;
                    },
                    getInnerWaypoints: function() {
                        return _.map(waypoints, _.clone);
                    },
                    setInnerWaypoints: function(list) {
                        waypoints = list;
                    }
                };
            }
        };
    }]);
