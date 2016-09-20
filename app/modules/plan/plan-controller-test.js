describe('plan controller', function() {
    var $httpBackend;
    var requestHandler;
    var scope;
    var Plan;
    var Trip;
    var Waypoint;
    var alertSpy;
    var mockSfMuni;
    var $q;
    var Itinerary;
    var System;

    beforeEach(module('plan'));
    beforeEach(function() {
        module(function($provide) {
            $provide.service('xplanFolder', function() {
                return {
                   load: function() {
                       return {
                           getSegments: function() {
                               return [
                                   { origin: 'an origin nexus' }
                               ];
                           }
                       }
                   }
                };
            });
            alertSpy = jasmine.createSpy('alert');
            $provide.value('alert', alertSpy);
        });
    });
    beforeEach(inject(function($rootScope, $injector, $controller, plan, nexus, itinerary,  _waypoint_, _trip_, _$q_, _system_) {
        scope = $rootScope.$new();
        System = _system_;
        Plan = plan;
        Trip = _trip_;
        Waypoint = nexus;
        Waypoint2 = _waypoint_;
        Itinerary = itinerary;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;
        mockSfMuni = jasmine.createSpyObj('mockSfMuni', [ 'getRidesForSegment' ]);
        $controller('PlanController', { $scope: scope, plan: plan, sfMuni: mockSfMuni });
        requestHandler = $httpBackend.whenGET(new RegExp('.*'));
//            .respond('<?xml version="1.0" encoding="utf-8"?><stations></stations>', { 'Content-type': 'text/xml'});

    }));
    it('should show segment builder', function() {

    });
    describe('build a segment', function() {
        it('should make one', function() {
            var waypointMap = { w1: { name: 'w1', stops: [] }, w2: { name: 'w2', stops: {} }};
            //var waypointMap = { w1: Waypoint.create('w1', 21, 31), w2: Waypoint.create('w2', 22, 32)};
            scope.orginNexus = waypointMap;
            scope.destinationNexus = waypointMap;
            scope.originNexusSelect = Waypoint.create('w1', 21, 31);
            scope.destinationNexusSelect = Waypoint.create('w2', 22, 32);
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: { rides: [ {} ] } }));
            scope.ridesRefresh();
            //expect(mockSfMuni.getRidesForSegment).toHaveBeenCalledWith({ origin: 'w1', destination: 'w2', originStops: [ {route: 'A', stopTag: '3'} ], destinationStops: [ { route: 'A', stopTag: '5' }]});
            //expect(mockSfMuni.getRidesForSegment).toHaveBeenCalledWith({
            //    originWaypoint: Waypoint.create('w1', 21, 31, [ {route: 'A', stopTag: '3'} ] ),
            //    destinationWaypoint: Waypoint.create('w2', 22, 32, [ { route: 'A', stopTag: '5' } ]),
            //    rides: [ ]
            //});
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].originWaypoint.name).toBe('w1');
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].destinationWaypoint.name).toBe('w2');
            expect(mockSfMuni.getRidesForSegment.calls.mostRecent().args[0].rides.length).toBe(0);
            scope.$digest();
            expect(scope.plan).toBeTruthy();
            expect(scope.plan.getSpan().spanStart).toBeTruthy();

            var segments = scope.plan.getSegments2();
            expect(segments.length).toBe(1);
            //expect(segments[0].rides.length).toBe(1);
        });
        it('should update itinerary on rides refresh', function() {
            var plan = Plan.createPlan();
            plan.addWaypoints([ Waypoint.create('w1', 21, 31), Waypoint.create('w2', 22, 32) ]);
            // add waypoints doesn't create segments
            plan.addSegment('w1', 'w2', []);
            scope.plan = plan;

            var trip = Trip.createTrip(Waypoint.create('w1', 21, 31), Waypoint.create('w2', 22, 32));
            scope.itinerary = Itinerary.createItinerary(trip);
            var ride = { startTime: 1, endTime: 2, agency: 'a', vehicle: 'v' }
            mockSfMuni.getRidesForSegment.and.returnValue($q.when({ data: { rides: [ ride ] } }));
            scope.ridesRefresh2();
            scope.$digest();
            expect(scope.itinerary).toBeTruthy();
            expect(scope.itinerary.getSegments().length).toBe(1);
            expect(scope.itinerary.getSegments()[0].rides.length).toBe(1);
            expect(scope.itinerary.getSegments()[0].rides[0].startTime).toBe(1);

            // legacy plan segment rides
            expect(scope.plan.getSegments()[0].rides[0].startTime).toEqual(1);
        });
    });
    describe('restore', function() {
        // save message
        it('should show error for invalid plan name', function() {
            scope.planRestore();
            expect(alertSpy).toHaveBeenCalledWith('cannot restore plan: invalid plan name: expected non-empty string');
        });
        // plan not found?
        it('should set origin and destination nexus', function() {
            var plan = Plan.createPlan('gggg');
            plan.addSegment('origin', 'destination', []);
            plan.addWaypoint(Waypoint.create('w1', 20, 31));
            plan.addWaypoint(Waypoint.create('w2', 21, 31));
            scope.plan = plan;
            scope.planSaveName = 'gggg';
            scope.$digest();
            scope.planSave();
            scope.planRestoreName = 'gggg';
            scope.$digest();
            scope.planRestore();
            //expect(alertSpy).toHaveBeenCalledWith('cannot restore plan: invalid plan name: expected non-empty string');
            expect(alertSpy).not.toHaveBeenCalled();
            expect(scope.nexusStart.name).toBe('w1');
            expect(scope.nexusEnd.name).toBe('w2');
        });
    });
    describe('itinerary from trip', function() {
        it('segment', function() {
            System.mergeStop({ name: 's1', lat: 1, lon: 2 });
            System.mergeStop({ name: 's2', lat: 2, lon: 3 });

            var w1 = Waypoint2.createWaypoint('w1', 1, 2);
            var w2 = Waypoint2.createWaypoint('w2', 2, 3);
            var trip = Trip.createTrip(w1, w2);

            scope.makeItinerary(trip);
            expect(scope.itinerary.getSegments().length).toEqual(1);
            var segment0 = scope.itinerary.getSegments()[0];
            expect(segment0.originWaypoint.getName()).toEqual('w1');
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
        it('should fetch on selected agency', function() {
            var $scope = {};
            $controller('PlanController', { $scope: $scope, plan: mockPlan });
            $scope.agency = 'sf-muni';
            $scope.agencySelected();
            //expect(mockPlan.fetchNexuses).toHaveBeenCalled();
            $timeout.flush();
            expect($scope.originNexuses.length).toBeGreaterThan(0);
        });
    });

});