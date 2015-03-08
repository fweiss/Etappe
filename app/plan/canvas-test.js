describe('canvas5', function() {
    var spanStart = new Date('2013-02-22T13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight = 100;

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    beforeEach(module('rides'));
    describe('directive', function() {
        var element;
        var scope;
        var mockContext = jasmine.createSpyObj('mockContext', [ 'save', 'restore', 'fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke' ]);
        beforeEach(inject(function($rootScope, $compile, chart) {
            scope = $rootScope;
            var html = '<canvas utt-rides width="600" height="100"></canvas>';
            element = angular.element(html);
            // angular.element() evidently ignores style attribute
            element[0].width = canvasWidth;
            element[0].height = canvasHeight;
            $compile(element)(scope);
            chart.setTimeSpan(spanStart, spanEnd);
            element[0].getContext = function() {
                return mockContext;
            };
        }));
        it('should draw background', function() {
            scope.plan = { spanStart: spanStart, spanEnd: spanEnd, rides: [  { startTime: spanStart, endTime: spanEnd }]};
            element.scope().$apply();
            expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, canvasWidth, canvasHeight);
        });
        it('should draw a ride', function() {
            var rideStart = addMinutes(spanStart, 10);
            var rideEnd = addMinutes(spanStart, 20);
            scope.plan = { spanStart: spanStart, spanEnd: spanEnd, rides: [ { startTime: rideStart, endTime: rideEnd }]};
            element.scope().$apply();
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
            scope.plan = plan;
            element.scope().$apply();
            expect(mockContext.moveTo).toHaveBeenCalledWith(100, 0);
            expect(mockContext.lineTo).toHaveBeenCalledWith(200, canvasHeight);
            expect(mockContext.moveTo).toHaveBeenCalledWith(300, 0);
        });
    });
});