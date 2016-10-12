angular.module('plan')
.service('segment', function() {
    function Segment(originNexus, destinationNexus) {
        this.originNexus = originNexus;
        this.destinationNexus = destinationNexus;
        this.rides = [];
    };
    Segment.prototype.getOriginNexus = function() {
        return this.originNexus;
    };
    Segment.prototype.getDestinationNexus = function() {
        return this.destinationNexus;
    };
    Segment.prototype.getRides = function() {
        return this.rides;
    };
    Segment.prototype.setRides = function(rides) {
        this.rides = rides;
    };
    return {
        createSegment: function(originNexus, destinationNexus) {
            if (_.isUndefined(originNexus)) {
                throw new Error('createSegment: requires origin nexus');
            }
            if (originNexus.constructor.name != 'Nexus') {
                throw new Error('createSegment: origin nexus not Nexus type');
            }
            if (_.isUndefined(destinationNexus)) {
                throw new Error('createSegment: requires destination nexus');
            }
            if (destinationNexus.constructor.name != 'Nexus') {
                throw new Error('createSegment: destination nexus not Nexus type');
            }
            return new Segment(originNexus, destinationNexus);
        }
    }
});
