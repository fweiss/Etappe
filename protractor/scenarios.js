describe('carrier select', function() {
    var PROMPT = 1; // to account for the prompt option in select
    beforeEach(function() {
        // using mountebank here
        browser.addMockModule('sfmuni.config', function() {
            angular.module('sfmuni.config', {})
                .value('config', { baseUrl: 'http://localhost:4545' });
        });
        browser.get('http://localhost:8080/app/index.html');
    });
    xit('should prompt to select carrier', function() {
        expect(element(by.model('carrierSelect')).$('option:checked').getText()).toEqual('Choose a carrier');
    });
    xit('should have available carriers', function() {
        expect(element(by.model('carrierSelect')).all(by.tagName('option')).count()).toEqual(2 + PROMPT);
    });
    xit('should disable origin selection');
    xit('should disable destination selection');

    describe('available stops', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
        });
        xit('should show origin stops', function() {
            expect(element(by.model('originStationSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
        xit('should show destination stops', function() {
            expect(element(by.model('destinationStationSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
        it('should show origin nexus', function() {
            expect(element(by.model('originNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
        it('should show destination nexus', function() {
            expect(element(by.model('destinationNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
    });

    describe('selected origin and destination', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
            //element(by.cssContainingText('#originStationSelect option', 'foo')).click();
            //element(by.cssContainingText('#destinationStationSelect option', 'foo2')).click();
            element(by.cssContainingText('#originNexusSelect option', '16th St and Mission')).click();
            element(by.cssContainingText('#destinationNexusSelect option', '16th St and Harrison')).click();
            //element(by.model('originNexusSelect', 'Roosevelt Way & Lower Ter')).click();
            //element(by.model('destinationNexusSelect', 'Roosevelt Way & Clifford Ter')).click();
        });
        xit('should show available routes', function() {
            expect(element(by.model('availableRoutes')).getText()).toBe('55 16th');
        });
        // this is dependent on data and time of day, should mock backend
        it('should show available rides', function() {
            expect(element(by.binding('rideList')).getText()).toBeGreaterThan(0);
        })
    });
});

