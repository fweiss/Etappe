describe('scaling', function() {
    var spanStart = new Date('2013-02-22T13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight = 100;

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    beforeEach(module('rides'));
    describe('configuration', function () {
        var e1 = 'end must be greater than start';
        it('should reject bad times', inject(function (chart) {
            expect(function () {
                chart.setTimeSpan(1, 0);
            }).toThrow(e1);
        }));
        it('should reject equal times', inject(function (chart) {
            expect(function () {
                chart.setTimeSpan(1, 1);
            }).toThrow(e1);
        }));
    });
    describe('error exceptions', function () {
        var e1 = 'chart: scale not initialized';
        var e2 = 'invalid parameter: time';
        it('should detect no initialization', inject(function (chart) {
            expect(function () {
                chart.timeToX(0);
            }).toThrowError(e1);
        }));
        it('should detect missing parameter', inject(function (chart) {
            chart.setTimeSpan(spanStart, spanEnd);
            expect(function () {
                chart.timeToX();
            }).toThrowError(e2);
        }));
    });
    describe('transform', function () {
        var chart;
        beforeEach(inject(function ($injector) {
            chart = $injector.get('chart');
            chart.setWidth(601);
            chart.setTimeSpan(spanStart, spanEnd);
        }));
        it('should translate time to x', function () {
            var time = new Date('2013-02-22T13:30');
            expect(chart.timeToX(time)).toBe(300);
        });
        it('should extrapolate before', function () {
            var time = new Date('2013-02-22T12:45');
            expect(chart.timeToX(time)).toBe(-151);
        });
        it('should extrapolate after', function () {
            var time = new Date('2013-02-22T14:45');
            expect(chart.timeToX(time)).toBe(600 + 451);
        });
    });
});
