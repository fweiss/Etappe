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
    var $q;
    var Itinerary;
    var System;
    var Stop;

    beforeEach(module('plan'));
    beforeEach(function() {
        module(function($provide) {
            alertSpy = jasmine.createSpy('alert');
            $provide.value('alert', alertSpy);
        });
    });
    beforeEach(inject(function($rootScope, $injector, $controller, nexus, itinerary,  _waypoint_, _trip_, _$q_, _system_, _stop_) {
        scope = $rootScope.$new();
        System = _system_;
        Trip = _trip_;
        Nexus = nexus;
        Waypoint = _waypoint_;
        Itinerary = itinerary;
        Stop = _stop_;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;
        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getRidesForSegment', 'getAllStops' ]);
        $controller('PlanController', { $scope: scope, sfMuni: mockSfMuni });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));

    }));
    it('should show segment builder', function() {

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
        it('change agency', function() {
            var stop = Stop.createStop('n', 'a', 'r', 's', 1, 2);
            mockSfMuni.getAllStops.and.returnValue($q.when({ data: [ stop ] }));
            scope.changeCarrier();
            scope.$digest();
            expect(scope.originNexus.length).toEqual(1);
        });
        it('build trip from waypoints', function() {
            var w1 = Waypoint.createWaypoint('w1', 21, 31);
            var w2 = Waypoint.createWaypoint('w2', 22, 32);
            scope.originNexusSelect = Nexus.createFromWaypoint(w1);
            scope.destinationNexusSelect = Nexus.createFromWaypoint(w2);
            scope.createTripFromNexusSelect();
            expect(scope.trip).toBeTruthy();
        });
        it('should update itinerary on rides refresh', function() {

            var trip = Trip.createTrip(Waypoint.createWaypoint('w1', 21, 31), Waypoint.createWaypoint('w2', 22, 32));
            scope.itinerary = Itinerary.createItinerary(trip);
            var ride = { startTime: 1, endTime: 2, agency: 'a', vehicle: 'v' }
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: [ ride ] }));
            scope.ridesRefresh2();
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

});