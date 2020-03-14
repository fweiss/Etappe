describe('itinerary chart', function() {
    // N.B. Date constructor for ISO 8601 is always UTC, use RFC2822 instead
    //var spanStart = new Date('2013-02-22T13:00');
    var spanStart = new Date('22 Feb 2013 13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight;

    // captured injects
    var scope;
    var compile;
    var planConfig;
    var Itinerary;
    var Trip;
    var Waypoint;
    var Segment;
    var Nexus;
    var Ride;

    // mocks
    var element;
    var mockContext, ctx;

    // fixtures
    var itinerary;
    var config = {
        tickLegendHeight: 20,
        waypointLegendHeight: 20,
        waypointLegendFont: 'bold 12pt Calibri',
        pathFieldHeight: 180
    };
    var w1, w2, w3;

    // helper functions
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    function mockCanvasContext(width, height) {
        var html = '<canvas utt-rides width="' + width + '" height="' + height + '"></canvas>';
        element = angular.element(html);
        // angular.element() evidently ignores style attribute
        //element[0].width = width;
        //element[0].height = height;
        compile(element)(scope);

        mockContext = jasmine.createSpyObj('mockContext', [ 'save', 'restore', 'fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fillText', 'translate' ]);
        element[0].getContext = function() {
            return mockContext;
        };
    }

    function setItineraryAndApply(itinerary) {
        scope.itinerary = itinerary;
        element.scope().$apply();
    }

    // start of Jasmine specs
    beforeEach(module('plan', 'plan.canvas.config', function($provide) {
        $provide.value('canvasConfig', config);
    }));
    beforeEach(inject(function($rootScope, $compile, _planConfig_, itinerary, trip, waypoint, segment, nexus, ride) {
        scope = $rootScope;
        compile = $compile;
        planConfig = _planConfig_;
        Itinerary = itinerary;
        Trip = trip;
        Waypoint = waypoint;
        Segment = segment;
        Nexus = nexus;
        Ride = ride;
    }));

    beforeEach(function() {
        mockCanvasContext(canvasWidth, canvasHeight);
        ctx = mockContext;
        w1 = Waypoint.createWaypoint('w1', 1, 2);
        w2 = Waypoint.createWaypoint('w2', 1, 3);
        w3 = Waypoint.createWaypoint('w3', 1, 4);
    });

    describe('canvas properties', function() {
        it('noop on empty span', function() {
            var itinerary = createItineraryForWaypoints([ w1, w2 ]);
            scope.itinerary = itinerary;
            expect(function() { element.scope().$apply(); }).not.toThrow();
            expect(ctx.fillRect).not.toHaveBeenCalled();
        });
     });
    describe('canvas height', function() {
        it('for one segment', function() {
            var itinerary = createItineraryForWaypoints([ w1, w2 ]);
            itinerary.setSpan(spanStart, addMinutes(spanStart, 1));
            setItineraryAndApply(itinerary);
            canvasHeight = config.tickLegendHeight + 2 * config.waypointLegendHeight + config.pathFieldHeight;
            expect(element[0].height).toEqual(canvasHeight);
        });
        it('for two segments', function() {
            var itinerary = createItineraryForWaypoints([ w1, w2, w3 ]);
            itinerary.setSpan(spanStart, addMinutes(spanStart, 1));
            setItineraryAndApply(itinerary);
            canvasHeight = config.tickLegendHeight + 3 * config.waypointLegendHeight + 2 * config.pathFieldHeight;
            expect(element[0].height).toEqual(canvasHeight);
        });
    });
    describe('time ticks', function() {
        var itinerary;
        describe('lines', function() {
            var canvasHeight;
            describe('for one segment', function() {
                beforeEach(function() {
                    itinerary = createItineraryForWaypoints([ w1, w2 ]);
                    canvasHeight = config.tickLegendHeight + 2 * config.waypointLegendHeight + config.pathFieldHeight;
                });
                it('draws major', function() {
                    itinerary.setSpan(spanStart, addMinutes(spanStart, 1));
                    setItineraryAndApply(itinerary);
                    expect(ctx.lineTo).toHaveBeenCalledWith(0, canvasHeight);
                });
                it('draws a tick', function() {
                    itinerary.setSpan(addMinutes(spanStart, 1), addMinutes(spanStart, 6));
                    setItineraryAndApply(itinerary);
                    // 5 minute span 600 px 4/5 of 600 = 480
                    var x = 4 / 5 * 600;
                    expect(ctx.beginPath).toHaveBeenCalled();
                    expect(ctx.moveTo).toHaveBeenCalledWith(x, 0);
                    expect(ctx.lineTo).toHaveBeenCalledWith(x, canvasHeight);
                    expect(ctx.stroke).toHaveBeenCalled();
                });
                it('draws all ticks for span', function() {
                    itinerary.setSpan(spanStart, addMinutes(spanStart, 60));
                    setItineraryAndApply(itinerary);
                    expect(ctx.moveTo.calls.count()).toBe(12);
                });
                // can't spy on strokeStyle property
                it('draws minor tick', function() {
                    itinerary.setSpan(addMinutes(spanStart, 1), addMinutes(spanStart, 6));
                    setItineraryAndApply(itinerary);
                    expect(ctx.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
                });
                it('draws major tick', function() {
                    itinerary.setSpan(addMinutes(spanStart, 12), addMinutes(spanStart, 16));
                    setItineraryAndApply(itinerary);
                    expect(ctx.strokeStyle).toBe('rgba(0, 0, 0, 0.5)');
                });
            });
            describe('for two segments', function() {
                beforeEach(function() {
                    var itinerary = createItineraryForWaypoints([ w1, w2, w3 ]);
                    itinerary.setSpan(spanStart, addMinutes(spanStart, 1));
                    setItineraryAndApply(itinerary);
                    canvasHeight = config.tickLegendHeight + 3 * config.waypointLegendHeight + 2 * config.pathFieldHeight;
                });
                it('draws major', function() {
                    expect(ctx.lineTo).toHaveBeenCalledWith(0, canvasHeight);
                });
            });
         });
        describe('legend', function() {
            it('draws at 15 minute mark', function() {
                itinerary.setSpan(addMinutes(spanStart, 12), addMinutes(spanStart, 16));
                setItineraryAndApply(itinerary);
                expect(ctx.fillText).toHaveBeenCalledWith('1:15 PM', 452, 10);
            });
        });
    });
    describe('waypoint legend', function() {
        beforeEach(function() {
            var itinerary = createItineraryForWaypoints([ w1, w2, w3 ]);
            itinerary.setSpan(new Date(1), new Date(2));
            setItineraryAndApply(itinerary);
        });
        it('draw first', function() {
            expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight);
            expect(ctx.fillText).toHaveBeenCalledWith('w1', 0, 0);
            expect(ctx.font).toBe(config.waypointLegendFont);
        });
        it('draw second', function() {
            expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + config.waypointLegendHeight + config.pathFieldHeight);
            expect(ctx.fillText).toHaveBeenCalledWith('w2', 0, 0);
        });
        it('draw third', function() {
            expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + 2 * (config.waypointLegendHeight + config.pathFieldHeight));
            expect(ctx.fillText).toHaveBeenCalledWith('w3', 0, 0);
        });
    });
    describe('rides', function() {
        describe('fields', function() {
            beforeEach(function() {
                var itinerary = createItineraryForWaypoints([ w1, w2, w3 ]);
                itinerary.setSpan(new Date(1), new Date(2));
                setItineraryAndApply(itinerary);
            });
            it('draws two', function() {
                expect(ctx.fillRect.calls.count()).toEqual(2);
            });
            it('draws first offset', function() {
                expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + config.waypointLegendHeight);
                expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvasWidth, config.pathFieldHeight);
            });
            it('draws second offset', function() {
                expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + 2 * config.waypointLegendHeight + config.pathFieldHeight);
                expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, canvasWidth, config.pathFieldHeight);
            });
        });
        describe('paths', function() {
            beforeEach(function() {
                var itinerary = createItineraryForWaypoints([ w1, w2, w3 ]);
                // between minor ticks
                itinerary.setSpan(addMinutes(spanStart, 1), addMinutes(spanStart, 4));
                var ride1 = new Ride.createRide('a', 'r', 'v', addMinutes(spanStart, 1), addMinutes(spanStart, 2));
                var ride2 = new Ride.createRide('a', 'r', 'v', addMinutes(spanStart, 2), addMinutes(spanStart, 3));
                var ride3 = new Ride.createRide('a', 'r', 'v', addMinutes(spanStart, 3), addMinutes(spanStart, 4));
                itinerary.getSegments()[0].setRides([ ride1, ride2 ]);
                itinerary.getSegments()[1].setRides([ ride3 ]);
                setItineraryAndApply(itinerary);
            });
            it('first segment first ride', function() {
                expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + config.waypointLegendHeight);
                expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
                expect(ctx.lineTo).toHaveBeenCalledWith(200, config.pathFieldHeight);
            });
            it('first segment second ride', function() {
                expect(ctx.moveTo).toHaveBeenCalledWith(200, 0);
                expect(ctx.lineTo).toHaveBeenCalledWith(400, config.pathFieldHeight);
            });
            it('second segment first ride', function() {
                expect(ctx.translate).toHaveBeenCalledWith(0, config.tickLegendHeight + 2 * config.waypointLegendHeight + config.pathFieldHeight);
                expect(ctx.moveTo).toHaveBeenCalledWith(400, 0);
                expect(ctx.lineTo).toHaveBeenCalledWith(600, config.pathFieldHeight);
            });
        });
    });

    xdescribe('1200 x 200', function() {
        it('should have ticks for entire length', function() {
            mockCanvasContext(1200, 200);
            setItineraryAndApply(itinerary);
            // there should be 12 ticks in 60 minute span
            expect(mockContext.moveTo.calls.count()).toBe(12);
            // the last tick should be at 11 * (1200 / 12)
            expect(mockContext.moveTo).toHaveBeenCalledWith(1100, 0);
        });
    });

    // create bare Itinerary fixture without span and rides
    function createItineraryForWaypoints(waypoints) {
        var trip = Trip.createFromWaypoints(waypoints);
        var nexuses = _.map(waypoints, function(waypoint) {
            return Nexus.createFromWaypoint(waypoint);
        });
        var segments = Itinerary.createSegmentsFromNexuses(nexuses);
        return Itinerary.createItinerary(trip, segments);
    }

});