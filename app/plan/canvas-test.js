describe('canvas5', function() {
    var spanStart = new Date('2013-02-22T13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight = 100;

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    beforeEach(module('rides'));
    describe('configuration', function() {
        var e1 = 'end must be greater than start';
        it('should reject bad times', inject(function(chart) {
            expect(function() { chart.setTimeSpan(1, 0); }).toThrow(e1);
        }));
        it('should reject equal times', inject(function(chart) {
            expect(function() { chart.setTimeSpan(1, 1); }).toThrow(e1);
        }));
    });
    describe('error exceptions', function() {
        var e1 = 'chart: scale not initialized';
        var e2 = 'invalid parameter: time';
        it('should detect no initialization', inject(function(chart) {
            expect(function() { chart.timeToX(0); }).toThrowError(e1);
        }));
        it('should detect missing parameter', inject(function(chart) {
            chart.setTimeSpan(spanStart, spanEnd);
            expect(function() { chart.timeToX(); }).toThrowError(e2);
        })) ;
    });
    describe('transform', function() {
        var chart;
        beforeEach(inject(function($injector) {
            chart = $injector.get('chart');
            chart.setWidth(601);
            chart.setTimeSpan(spanStart, spanEnd);
        }));
        it('should translate time to x', function() {
            var time = new Date('2013-02-22T13:30');
            expect(chart.timeToX(time)).toBe(300);
        });
        it('should extrapolate before', function() {
            var time = new Date('2013-02-22T12:45');
            expect(chart.timeToX(time)).toBe(-151);
        });
        it('should extrapolate after', function() {
            var time = new Date('2013-02-22T14:45');
            expect(chart.timeToX(time)).toBe(600 + 451);
        });
    });
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
    });
});