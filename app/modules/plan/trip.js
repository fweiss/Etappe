angular.module('plan')
    .service('trip', [ function() {
        var nameSerial = 1;
        return {
            createTrip: function (origin, destination) {
                var name = 'Trip' + (nameSerial++);
                var waypoints = [];
                if (! origin) {
                    throw new Error('createTrip: must specify origin');
                }
                if (! destination) {
                    throw new Error('createTrip: must specify destination');
                }
                return {
                    getName: function() {
                        return name;
                    },
                    setName: function(newName) {
                        name = newName;
                    },
                    getOrigin: function() {
                        return origin;
                    },
                    getDestination: function() {
                        return destination;
                    },
                    getInnerWaypoints: function() {
                        // _.clone does not preserve type
                        return _.map(waypoints, _.clone);
                     },
                    setInnerWaypoints: function(list) {
                        waypoints = list;
                    },
                    getWaypoints: function() {
                        return _.union([ origin ], waypoints, [ destination ]);
                    }
                };
            }
        };
    }]);
