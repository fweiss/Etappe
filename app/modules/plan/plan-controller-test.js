describe('plan controller', function() {
    var $httpBackend;
    var requestHandler;
    var scope;
    var Plan;
    var Trip;
    var Nexus;
    var Waypoint;
    var alertSpy;
    var mockSfMuni;
    var mockBart;
    var mockAgency;
    var $q;
    var Itinerary;
    var System;
    var Stop;
    var Ride;

    beforeEach(module('plan'));
    beforeEach(function() {
        module(function($provide) {
            alertSpy = jasmine.createSpy('alert');
            $provide.value('alert', alertSpy);
        });
    });
    beforeEach(inject(function($rootScope, $injector, $controller, nexus, itinerary,  _waypoint_, _trip_, _$q_, _system_, _stop_, ride, _agency_) {
        scope = $rootScope.$new();
        System = _system_;
        Trip = _trip_;
        Nexus = nexus;
        Waypoint = _waypoint_;
        Itinerary = itinerary;
        Stop = _stop_;
        Ride = ride;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;

        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getRidesForSegment', 'getAllStops' ]);
        mockBart = jasmine.createSpyObj('mockBart', [ 'getRidesForSegment', 'getAllStops' ]);
        mockAgency = jasmine.createSpyObj('mockAgency', [ 'getAll' ]);

        mockAgency.getAll.and.returnValue([{ name: 'SFMUNI', api: mockSfMuni }, { name: 'BART', api: mockBart } ]);

        $controller('PlanController', { $scope: scope, sfMuni: mockSfMuni, bart: mockBart, agency: mockAgency });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));

    }));
    it('shows segment builder', function() {

    });
    describe('build a segment', function() {
        // not clear why getRidesForSegment needs to be involved to just build a segment
        xit('should make one', function() {
            var waypointMap = { w1: { name: 'w1', stops: [] }, w2: { name: 'w2', stops: {} }};
            scope.orginNexus = waypointMap;
            scope.destinationNexus = waypointMap;
            scope.originNexusSelect = Nexus.create('w1', 21, 31);
            scope.destinationNexusSelect = Nexus.create('w2', 22, 32);
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: { rides: [ {} ] } }));
            scope.ridesRefresh();
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].originWaypoint.name).toBe('w1');
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].destinationWaypoint.name).toBe('w2');
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].rides.length).toBe(0);
            scope.$digest();
            expect(scope.plan).toBeTruthy();
            expect(scope.plan.getSpan().spanStart).toBeTruthy();

            var segments = scope.plan.getSegments2();
            expect(segments.length).toBe(1);
        });
        //it('build trip from waypoints', function() {
        //    var w1 = Waypoint.createWaypoint('w1', 21, 31);
        //    var w2 = Waypoint.createWaypoint('w2', 22, 32);
        //    scope.originNexusSelect = Nexus.createFromWaypoint(w1);
        //    scope.destinationNexusSelect = Nexus.createFromWaypoint(w2);
        //    scope.createTripFromNexusSelect();
        //    expect(scope.trip).toBeTruthy();
        //});
        // test fixture segments lacks stops
        xit('should update itinerary on rides refresh', function() {

            var trip = Trip.createTrip(Waypoint.createWaypoint('w1', 21, 31), Waypoint.createWaypoint('w2', 22, 32));
            scope.itinerary = Itinerary.createItinerary(trip);
            var ride = { startTime: 1, endTime: 2, agency: 'a', vehicle: 'v' }
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ ride ] }));
            scope.ridesRefresh();
            scope.$digest();
            expect(scope.itinerary).toBeTruthy();
            expect(scope.itinerary.getSegments().length).toBe(1);
            expect(scope.itinerary.getSegments()[0].getRides().length).toBe(1);
            expect(scope.itinerary.getSegments()[0].rides[0].startTime).toBe(1);

        });
    });
    describe('itinerary from trip', function() {
        it('segment', function() {
            System.mergeStop(Stop.createStop('s1', 'a', 'r', 'sid1', 1, 2 ));
            System.mergeStop(Stop.createStop('s2', 'a', 'r', 'sid1', 2, 3 ));

            var w1 = Waypoint.createWaypoint('w1', 1, 2);
            var w2 = Waypoint.createWaypoint('w2', 2, 3);
            var trip = Trip.createTrip(w1, w2);

            scope.createItineraryFromTrip(trip);

            expect(scope.itinerary.getSegments().length).toEqual(1);
            var segment0 = scope.itinerary.getSegments()[0];
            expect(segment0.originNexus.getName()).toEqual('s1');
            expect(segment0.rides.length).toEqual(0);

        });
    });
    describe('nexus', function() {
        var $controller;
        var mockPlan;
        var $timeout;
        beforeEach(inject(function(_$controller_, $q, _$timeout_) {
            $controller = _$controller_;
            $timeout = _$timeout_;
            mockPlan = jasmine.createSpyObj('mockPlan', [ 'fetchNexuses' ]);
            var nexus = []; // a fake
            mockPlan.fetchNexuses.and.returnValue($q.when([ nexus ]));
        }))
    });
    describe('saved trips', function() {
        it('show list', function() {
            scope.showSavedTrips();
            expect(scope.savedTrips.length).toEqual(1);
        });
        it('select one', function() {
            var s1 = Stop.createStop('s1', 'a', 'r', 'sid1', 1, 2 );
            var s2 = Stop.createStop('s2', 'a', 'r', 'sid1', 2, 3 );
            mockSfMuni.getAllStops.and.returnValue($q.when({ data: [ s1, s2 ] }));
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ {} ] } ));

            var origin = Waypoint.createWaypoint('w1', 1, 2);
            var destination = Waypoint.createWaypoint('w2', 2, 3);
            var trip = Trip.createTrip(origin, destination);
            scope.selectSavedTrip(trip);
            scope.$digest();
            expect(scope.itinerary.getSegments().length).toBe(1);
            var segment = scope.itinerary.getSegments()[0];
            expect(segment.rides.length).toBe(1);
        });
    });

    describe('refresh rides', function() {
        var w1, w2, w3;
        var trip2;
        var r1, r2;
        var s1, s2, s3, s4;
        var n1, n2, n3;
        beforeEach(function() {
            r1 = Ride.createRide('a1', 'r1', 'v1', new Date(1), new Date(2));
            r2 = Ride.createRide('a1', 'r2', 'v2', new Date(2), new Date(3));
            w1 = Waypoint.createWaypoint('w1', 1, 1);
            w2 = Waypoint.createWaypoint('w2', 1, 2);
            w3 = Waypoint.createWaypoint('w3', 1, 3);
            s1 = Stop.createStop('s1', 'sfmuni', 'r1', 'id1', 1, 1);
            s2 = Stop.createStop('s2', 'sfmuni', 'r1', 'id1', 1, 2);
            s3 = Stop.createStop('s3', 'bart', 'r1', 'id1', 1, 2);
            s4 = Stop.createStop('s4', 'bart', 'r1', 'id1', 1, 2);
            trip2 = Trip.createTrip(w1, w2);
            //Nexus.mergeStop(s1);
            //Nexus.mergeStop(s2);
            n1 = Nexus.createFromWaypoint(w1);
            n2 = Nexus.createFromWaypoint(w2);
            n3 = Nexus.createFromWaypoint(w3);
        });
        it('no agancies', function() {
            var nexuses = [ n1, n2 ];
            // here no stops or no stops with matching agencies.
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            scope.itinerary = Itinerary.createItinerary(trip2, segments);
            scope.ridesRefresh();
            scope.$digest();
        });
        it('for one segment', function() {
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ r1 ] } ));
            var nexuses = [ n1, n2 ];
            n1.addStop(s1);
            n2.addStop(s2);
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            var itinerary = Itinerary.createItinerary(trip2, segments);
            scope.itinerary = itinerary;
            scope.ridesRefresh();
            scope.$digest();
            expect(scope.itinerary.getSegments().length).toEqual(1);
            var segment0 = scope.itinerary.getSegments()[0];
            expect(segment0.getRides().length).toEqual(1);
            expect(segment0.getRides()[0].getRouteId()).toEqual('r1');
        });
        it('for one bart segment', function() {
            mockBart.getRidesForSegment.and.returnValue($q.when({ data: [ r1 ] } ));
            var nexuses = [ n2, n3 ];
            n2.addStop(s3);
            n3.addStop(s4);
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            var itinerary = Itinerary.createItinerary(trip2, segments);
            scope.itinerary = itinerary;
            scope.ridesRefresh();
            scope.$digest();
            expect(scope.itinerary.getSegments().length).toEqual(1);
            var segment0 = scope.itinerary.getSegments()[0];
            expect(segment0.getRides().length).toEqual(1);
            expect(segment0.getRides()[0].getRouteId()).toEqual('r1');
        });
        it('for two sfmuni segments', function() {
            mockSfMuni.getRidesForSegment.and.callFake(function(segment) {
                var originNexusName = segment.getOriginNexus().getName();
                var rides = originNexusName == 'w1' ? [ r1 ] : [ r2 ];
                return $q.when({ data: rides } );
            });
            var nexuses = [ n1, n2, n3 ];
            n1.addStop(s1);
            n2.addStop(s2);
            n3.addStop(s1); // yeah, circular
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            var itinerary = Itinerary.createItinerary(trip2, segments);
            scope.itinerary = itinerary;
            scope.ridesRefresh();
            scope.$digest();
            expect(scope.itinerary.getSegments().length).toEqual(2);
            var segment1 = scope.itinerary.getSegments()[1];
            expect(segment1.getRides().length).toEqual(1);
            expect(segment1.getRides()[0].getRouteId()).toEqual('r2');
        });
        it('for a sfmuni and a bart segment', function() {
            var r6 = Ride.createRide('sfmuni', 'r1', 'v1', new Date(1), new Date(2))
            var r7 = Ride.createRide('bart', 'r2', 'v2', new Date(2), new Date(3))
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ r6 ] } ));
            mockBart.getRidesForSegment.and.returnValue($q.when({ data: [ r7 ] } ));
            var nexuses = [ n1, n2, n3 ];
            n1.addStop(Stop.createStop('s1', 'sfmuni', 'r1', 'id1', 1, 1));
            n2.addStop(Stop.createStop('s2', 'sfmuni', 'r1', 'id1', 1, 1));
            n2.addStop(Stop.createStop('s3', 'bart', 'r2', 'id1', 1, 1));
            n3.addStop(Stop.createStop('s4', 'bart', 'r2', 'id1', 1, 1));
            var segments = Itinerary.createSegmentsFromNexuses(nexuses);
            var itinerary = Itinerary.createItinerary(trip2, segments);
            scope.itinerary = itinerary;
            scope.ridesRefresh();
            scope.$digest();
            expect(scope.itinerary.getSegments().length).toEqual(2);
            expect(segments[0].getRides().length).toEqual(1);
            expect(segments[0].getRides()[0].getRouteId()).toEqual('r1');
            expect(segments[0].getRides()[0].getAgencyId()).toEqual('sfmuni');
            expect(segments[1].getRides().length).toEqual(1);
            expect(segments[1].getRides()[0].getRouteId()).toEqual('r2');
            expect(segments[1].getRides()[0].getAgencyId()).toEqual('bart');
        });
    });

});