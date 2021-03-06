describe('plan scaling', function() {
    var spanStart = new Date('2013-02-22T13:00');
    var spanEnd = addMinutes(spanStart, 60);
    var canvasWidth = 600;
    var canvasHeight = 100;

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    beforeEach(module('plan'));
    describe('configuration', function () {
        var e1 = 'chart: end must be greater than start';
        it('rejects bad times', inject(function (chart) {
            expect(function () {
                chart.setTimeSpan(1, 0);
            }).toThrow(e1);
        }));
        it('rejects equal times', inject(function (chart) {
            expect(function () {
                chart.setTimeSpan(1, 1);
            }).toThrow(e1);
        }));
    });
    describe('error exceptions', function () {
        var e1 = 'chart: scale not initialized';
        var e2 = 'chart: invalid parameter: time';
        it('should detect no initialization', inject(function (chart) {
            expect(function () {
                chart.timeToX(0);
            }).toThrowError(e1);
        }));
        it('detects missing parameter', inject(function (chart) {
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
        it('translates time to x', function () {
            var time = new Date('2013-02-22T13:30');
            expect(chart.timeToX(time)).toBe(300);
        });
        it('extrapolates before', function () {
            var time = new Date('2013-02-22T12:45');
            expect(chart.timeToX(time)).toBe(-151);
        });
        it('extrapolates after', function () {
            var time = new Date('2013-02-22T14:45');
            expect(chart.timeToX(time)).toBe(600 + 451);
        });
    });
});
