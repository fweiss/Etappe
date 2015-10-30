describe('plan date', function() {
    var date;
    beforeEach(module('plan'));
    beforeEach(inject(function(_date_) {
        date = _date_;
    }));
    it('should format phantomjs', function() {
        expect(date.format('13:15:00')).toBe('1:15 PM');
    });
    it('should format others', function() {
        expect(date.format('1:12;37 PM')).toBe('1:12 PM');
    });
});