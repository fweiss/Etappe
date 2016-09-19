angular.module('plan')
    .service('system', [ 'nexus', function(NexusService) {
        return {
            getAgencies: function() {
                return [];
            },
            getNexuses: function() {
                return NexusService.getMergedNexuses();
            },
            findNexus: function(waypoint) {
                if (NexusService.getMergedNexuses().length == 0) {
                    throw new Error('findNexus: no nexuses available');
                }
                var nexus =  NexusService.findNearbyNexus(waypoint.getLat(), waypoint.getLon());
                if (nexus === undefined) {
                    throw new Error('findNexus: no matching nexus found');
                }
                return nexus;
            },
            mergeStop: function(stop) {
                NexusService.mergeStop(stop);
            }
        }
    }]);