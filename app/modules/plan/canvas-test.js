describe('plan canvas', function() {
    // N.B. Date constructor for ISO 8601 is always UTC, use RFC2822 instead
    //var spanStart = new Date('2013-02-22T13:00');
    var spanStart = new Date('22 Feb 2013 13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight = 100;

    // captured injects
    var scope;
    var compile;
    var Plan;
    var planConfig;

    // mocks
    var element;
    var mockContext;

    // helper functions
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    function createPlanWithSpan(spanStart, spanEnd) {
        var plan = Plan.createPlan('test');
        plan.setSpan(spanStart, spanEnd);
        return plan;
    }
    function mockCanvasContext(width, height) {
        var html = '<canvas utt-rides width="' + width + '" height="' + height + '"></canvas>';
        element = angular.element(html);
        // angular.element() evidently ignores style attribute
        //element[0].width = width;
        //element[0].height = height;
        compile(element)(scope);

        mockContext = jasmine.createSpyObj('mockContext', [ 'save', 'restore', 'fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fillText' ]);
        element[0].getContext = function() {
            return mockContext;
        };
    }
    function setPlanAndApply(plan) {
        scope.plan = plan;
        element.scope().$apply();
    }

    // start of Jasmine specs
    beforeEach(module('plan', 'plan.canvas.config'));
    beforeEach(inject(function($rootScope, $compile, _plan_, _planConfig_) {
        scope = $rootScope;
        compile = $compile;
        Plan = _plan_;
        planConfig = _planConfig_;
    }));
    describe('600 x 100', function() {
        var tickLegendHeight;
        beforeEach(function() {
            mockCanvasContext(canvasWidth, canvasHeight);
            tickLegendHeight = planConfig('tickLegendHeight');
        });
        it('should draw background', function() {
            var plan = createPlanWithSpan(spanStart, spanEnd);
            setPlanAndApply(plan);
            expect(mockContext.fillRect).toHaveBeenCalledWith(0, tickLegendHeight, canvasWidth, canvasHeight);
        });
        it('should draw a ride', function() {
            var rideStart = addMinutes(spanStart, 10);
            var rideEnd = addMinutes(spanStart, 20);

            var plan = createPlanWithSpan(spanStart, spanEnd);
            var ride = Plan.createRide(rideStart, rideEnd);
            plan.addSegment('abc', 'def', [ ride ]);

            setPlanAndApply(plan);
            expect(mockContext.moveTo).toHaveBeenCalledWith(100, 0);
            expect(mockContext.lineTo).toHaveBeenCalledWith(200, canvasHeight);
        });
        it('should draw two rides', function() {
            var rideStart0 = addMinutes(spanStart, 11);
            var rideEnd0 = addMinutes(spanStart, 21);
            var rideStart1 = addMinutes(spanStart, 31);
            var rideEnd1 = addMinutes(spanStart, 43);
            var plan = createPlanWithSpan(spanStart, spanEnd);
            var ride0 = Plan.createRide(rideStart0, rideEnd0);
            var ride1 = Plan.createRide(rideStart1, rideEnd1);
            plan.addSegment('abc', 'def', [ ride0, ride1 ]);

            setPlanAndApply(plan);
            expect(mockContext.moveTo).toHaveBeenCalledWith(110, 0);
            expect(mockContext.lineTo).toHaveBeenCalledWith(210, canvasHeight);
            expect(mockContext.moveTo).toHaveBeenCalledWith(310, 0);
        });
        describe('time ticks', function() {
            it('should draw a tick', function() {
                var plan = createPlanWithSpan(addMinutes(spanStart, 1), addMinutes(spanStart, 6));
                setPlanAndApply(plan);
                // 5 minute span 600 px 4/5 of 600 = 480
                var x = 4 / 5 * 600;
                expect(mockContext.beginPath).toHaveBeenCalled();
                expect(mockContext.moveTo).toHaveBeenCalledWith(x, 0);
                expect(mockContext.lineTo).toHaveBeenCalledWith(x, canvasHeight);
                expect(mockContext.stroke).toHaveBeenCalled();
            });
            it('should draw all ticks for span', function() {
                var plan = createPlanWithSpan(spanStart, addMinutes(spanStart, 60));
                setPlanAndApply(plan);
                expect(mockContext.moveTo.calls.count()).toBe(12);
            });
            // can't spy on strokeStyle property
            it('should draw minor tick', function() {
                var plan = createPlanWithSpan(addMinutes(spanStart, 1), addMinutes(spanStart, 6));
                setPlanAndApply(plan);
                expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
            });
            it('should draw major tick', function() {
                var plan = createPlanWithSpan(addMinutes(spanStart, 12), addMinutes(spanStart, 16));
                setPlanAndApply(plan);
                expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.5)');
            });
        });
        describe('tick labels', function() {
            it('should draw at 15 minute mark', function() {
                var plan = createPlanWithSpan(addMinutes(spanStart, 12), addMinutes(spanStart, 16));
                setPlanAndApply(plan);
                expect(mockContext.fillText).toHaveBeenCalledWith('1:15 PM', 452, 10);
            });
        });
        describe('nexus', function() {
            it('should draw top label', function() {
                var plan = createPlanWithSpan(spanStart, spanEnd);
                plan.addSegment('abc', 'def', []);
                setPlanAndApply(plan);
                // FIXME actual position
                var tickLegendHeight = planConfig('tickLegendHeight');
                expect(mockContext.fillText).toHaveBeenCalledWith('abc', 0, tickLegendHeight);
                expect(mockContext.font).toBe('bold 12pt Calibri');
            });
        });
    });
    describe('1200 x 200', function() {
        it('should have ticks for entire length', function() {
            mockCanvasContext(1200, 200);
            var plan = createPlanWithSpan(spanStart, addMinutes(spanStart, 60));
            setPlanAndApply(plan);
            // there should be 12 ticks in 60 minute span
            expect(mockContext.moveTo.calls.count()).toBe(12);
            // the last tick should be at 11 * (1200 / 12)
            expect(mockContext.moveTo).toHaveBeenCalledWith(1100, 0);
        });
    });
});