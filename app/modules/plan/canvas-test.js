describe('canvas', function() {
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

    // mocks
    var element;
    var mockContext;

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
    beforeEach(module('rides', 'etappe')); // FIXME correct modules
    beforeEach(inject(function($rootScope, $compile, _plan_) {
        scope = $rootScope;
        compile = $compile;
        Plan = _plan_;
        //mockCanvasContext(canvasWidth, canvasHeight);
    }));
    describe('600 x 100', function() {
        beforeEach(function() {
            mockCanvasContext(canvasWidth, canvasHeight);
        });
        it('should draw background', function() {
            var plan = Plan.createPlan(spanStart, spanEnd);
            setPlanAndApply(plan);
            expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, canvasWidth, canvasHeight);
        });
        it('should draw a ride', function() {
            var rideStart = addMinutes(spanStart, 10);
            var rideEnd = addMinutes(spanStart, 20);
            var plan = { spanStart: spanStart, spanEnd: spanEnd, rides: [ { startTime: rideStart, endTime: rideEnd }]};
            setPlanAndApply(plan);
            expect(mockContext.moveTo).toHaveBeenCalledWith(100, 0);
            expect(mockContext.lineTo).toHaveBeenCalledWith(200, canvasHeight);
        });
        it('should draw two rides', function() {
            var rideStart0 = addMinutes(spanStart, 10);
            var rideEnd0 = addMinutes(spanStart, 20);
            var rideStart1 = addMinutes(spanStart, 30);
            var rideEnd1 = addMinutes(spanStart, 43);
            var plan = { spanStart: spanStart, spanEnd: spanEnd,
                rides: [
                    { startTime: rideStart0, endTime: rideEnd0 },
                    { startTime: rideStart1, endTime: rideEnd1 }
                ]
            };
            setPlanAndApply(plan);
            expect(mockContext.moveTo).toHaveBeenCalledWith(100, 0);
            expect(mockContext.lineTo).toHaveBeenCalledWith(200, canvasHeight);
            expect(mockContext.moveTo).toHaveBeenCalledWith(300, 0);
        });
        describe('time ticks', function() {
            it('should draw a tick', function() {
                var plan = { spanStart: addMinutes(spanStart, 1), spanEnd: addMinutes(spanStart, 6) };
                setPlanAndApply(plan);
                // 5 minute span 600 px 4/5 of 600 = 480
                var x = 4 / 5 * 600;
                expect(mockContext.beginPath).toHaveBeenCalled();
                expect(mockContext.moveTo).toHaveBeenCalledWith(x, 0);
                expect(mockContext.lineTo).toHaveBeenCalledWith(x, canvasHeight);
                expect(mockContext.stroke).toHaveBeenCalled();
            });
            it('should draw all ticks for span', function() {
                var plan = { spanStart: spanStart, spanEnd: addMinutes(spanStart, 60) };
                setPlanAndApply(plan);
                expect(mockContext.moveTo.calls.count()).toBe(12);
            });
            // can't spy on strokeStyle property
            it('should draw minor tick', function() {
                var plan = { spanStart: addMinutes(spanStart, 1), spanEnd: addMinutes(spanStart, 6) };
                setPlanAndApply(plan);
                expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.1)');
            });
            it('should draw major tick', function() {
                var plan = { spanStart: addMinutes(spanStart, 12), spanEnd: addMinutes(spanStart, 16) };
                setPlanAndApply(plan);
                expect(mockContext.strokeStyle).toBe('rgba(0, 0, 0, 0.5)');
            });
        });
        describe('tick labels', function() {
            it('should draw at 15 minute mark', function() {
                console.log(new Date(new Date('2013-02-22T13:00').getTime()).toLocaleTimeString());
                var plan = { spanStart: addMinutes(spanStart, 12), spanEnd: addMinutes(spanStart, 16) };
                setPlanAndApply(plan);
                expect(mockContext.fillText).toHaveBeenCalledWith('1:15 PM', 452, 10);
            });
        });
    });
    describe('1200 x 200', function() {
        it('should have ticks for entire length', function() {
            mockCanvasContext(1200, 200);
            var plan = { spanStart: spanStart, spanEnd: addMinutes(spanStart, 60), plan: {}};
            expect(mockContext.moveTo.calls.count()).toBe(0);
            setPlanAndApply(plan);
            // there should be 12 ticks in 60 minute span
            expect(mockContext.moveTo.calls.count()).toBe(12);
            // the last tick should be at 11 * (1200 / 12)
            expect(mockContext.moveTo).toHaveBeenCalledWith(1100, 0);
        });
    });
});