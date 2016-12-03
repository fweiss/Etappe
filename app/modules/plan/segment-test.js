describe('segment', function() {
    var Segment;
    var Nexus;
    beforeEach(module('plan'));
    beforeEach(inject(function (segment, nexus) {
        Segment = segment;
        Nexus = nexus;
    }));

    describe('validate', function() {
        var nexus;
        beforeEach(function() {
            nexus = Nexus.create('n', 1, 2);
        });
        it('error if origin nexus not given', function() {
            var e1 = new Error('createSegment: requires origin nexus');
            expect(function() { Segment.createSegment(); }).toThrow(e1);
        });
        it('error if origin nexus not Nexus type', function() {
            var e1 = new Error('createSegment: origin nexus not Nexus type');
            expect(function() { Segment.createSegment({}); }).toThrow(e1);
        });
        it('error if no destination nexus given', function() {
            var e1 = new Error('createSegment: requires destination nexus');
            expect(function() { Segment.createSegment(nexus); }).toThrow(e1);
        });
        it('error if destination nexus not Nexus type', function() {
            var e1 = new Error('createSegment: destination nexus not Nexus type');
            expect(function() { Segment.createSegment(nexus, {}); }).toThrow(e1);
        });
    });
    describe('create', function() {
        var nexus1;
        var nexus2;
        var segment;
        beforeEach(function() {
            nexus1 = Nexus.create('n1', 1, 2);
            nexus2 = Nexus.create('n2', 1, 3);
            segment = Segment.createSegment(nexus1, nexus2);
        });
        it('has origin nexus', function() {
            expect(segment.getOriginNexus()).toEqual(nexus1);
        });
        it('has destination nexus', function() {
            expect(segment.getDestinationNexus()).toEqual(nexus2);
        });
        it('has empty rides', function() {
            expect(segment.getRides()).toEqual([]);
        });
        describe('rides', function() {
            it('can set rides', function() {
                segment.setRides([ 'ride' ]);
                expect(segment.getRides()).toEqual([ 'ride' ]);
            });
        });
    });
});