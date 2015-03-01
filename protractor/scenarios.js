describe('carrier select', function() {
    var PROMPT = 1; // to account for the prompt option in select
    beforeEach(function() {
        browser.get('http://localhost:8080/app/index.html');
    });
    it('should prompt to select carrier', function() {
        expect(element(by.model('carrierSelect')).$('option:checked').getText()).toEqual('Choose a carrier');
    });
    it('should have available carriers', function() {
        expect(element(by.model('carrierSelect')).all(by.tagName('option')).count()).toEqual(2 + PROMPT);
    });
    xit('should disable origin selection');
    xit('should disable destination selection');

    describe('available stops', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
        });
        it('should show origin stops', function() {
            expect(element(by.model('originStationSelect')).all(by.tagName('option')).count()).toEqual(3 + PROMPT);
        });
        it('should show destination stops', function() {
            expect(element(by.model('destinationStationSelect')).all(by.tagName('option')).count()).toEqual(2 + PROMPT);
        });
    });

    describe('selected origin and destination', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
            element(by.cssContainingText('#originStationSelect option', 'foo')).click();
            element(by.cssContainingText('#destinationStationSelect option', 'foo2')).click();
        });
        xit('should show available routes', function() {
            expect(element(by.model('availableRoutes')).getText()).toBe('55 16th');
        });
    });
});

