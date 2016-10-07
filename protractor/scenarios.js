describe('plan builder', function() {
    var Imposter = require('./imposter');

    var PROMPT = 1; // to account for the prompt option in select
    beforeEach(function() {
        // create mountebank imposter
        // TODO builder DSL
        // when({command:'routeConfig').route('N').stop('5555', '15555', '16th St and Mission').stop(...)
        // when({command:'pre...',stops:'N|4444').predictions('N').prediction({time:'2222',vehicle:'3333',trip:'7777'}).prediction(...)
        var imposter = new Imposter()
            .addStub({ command: 'routeConfig' }, '<body>'
            + '<route tag="N">'
            + '<stop tag="5555" title="16th St and Mission" stopId="15555" lat="1" lon="1"></stop>'
            + '<stop tag="4444" title="16th St and Harrison" stopId="14444" lat="1" lon="2"></stop>'
            + '</route>'
            + '</body>')
            .addStub({ command: 'predictionsForMultiStops', stops: 'N|4444'}, '<body><predictions routeTag="N"><direction><prediction epochTime="2222" vehicle="3333" tripTag="7777"></prediction></direction></predictions></body>')
            .addStub({ command: 'predictionsForMultiStops', stops: 'N|5555' }, '<body><predictions routeTag="N"><direction><prediction epochTime="1111" vehicle="3333" tripTag="7777"></prediction></direction></predictions></body>');

        var flow = protractor.promise.controlFlow();
        flow.execute(function() { imposter.put() });

        // using mountebank here
        browser.addMockModule('sfmuni.config', function() {
            angular.module('sfmuni.config', {})
                .value('config', { baseUrl: 'http://localhost:4545' });
        });

        browser.addMockModule('plan.config', function() {
            angular.module('plan.config', {})
                .value('initSavedPlans', [
                    { id: 1, name: 'get Cliffs', waypoints: [
                        { name: 'Mission St', stops: [ { route: 'N', stopTag: '5555' } ] },
                        { name: 'Castro St', stops: [ { route: 'N', stopTag: '4444' } ] } ]
                    }
                ])
                .value('initSavedTrips', [ { id: 1, tripName: 'get Cliffs',
                    origin: { waypointName: 'Mission St', lat: 1, lon: 1 },
                    destination: { waypointName: 'Castro St', lat: 1, lon: 2 },
                    waypoints: [ ]}]
            );
        });

        browser.get('http://localhost:8080/app/index.html');
    });
    afterEach(function () {
        // to clear errant alerts
        browser.switchTo().alert().then(
            function (alert) { alert.dismiss(); },
            function (err) { }
        );
        // maybe in main beforeEach?
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    it('should load page without errors', function() {
        // in module.js, an exception handler gets any angular errors - supposeably
        expect(element(by.id('errors')).getText()).toEqual('');
    });
    it('should prompt to select carrier', function() {
        expect(element(by.model('carrierSelect')).$('option:checked').getText()).toEqual('Choose a carrier');
    });
    it('should have available carriers', function() {
        expect(element(by.model('carrierSelect')).all(by.tagName('option')).count()).toEqual(2 + PROMPT);
    });
    it('should disable origin selection', function() {
        expect(element(by.model('originNexusSelect')).isEnabled()).toBe(false);
    });
    it('should disable destination selection', function() {
        expect(element(by.model('destinationNexusSelect')).isEnabled()).toBe(false);
    });
    it('should show origin prompt', function() {
        expect(element(by.model('originNexusSelect')).all(by.tagName('option')).count()).toBe(0 + PROMPT);
        expect(element(by.model('originNexusSelect')).all(by.tagName('option')).get(0).getText()).toBe('Choose an origin');
    });
    it('should show destination prompt', function() {
        expect(element(by.model('destinationNexusSelect')).all(by.tagName('option')).count()).toBe(0 + PROMPT);
        expect(element(by.model('destinationNexusSelect')).all(by.tagName('option')).get(0).getText()).toBe('Choose a destination');
    });

    describe('agency selected', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
        });
        it('should show origin nexus', function() {
            expect(element(by.model('originNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
        it('should show destination nexus', function() {
            expect(element(by.model('destinationNexusSelect')).all(by.tagName('option')).count()).toBeGreaterThan(1 + PROMPT);
        });
    });

    describe('origin and destination selected', function() {
        beforeEach(function() {
            element(by.cssContainingText('#carrierSelect option', 'SFMUNI')).click();
            element(by.cssContainingText('#originNexusSelect option', '16th St and Mission')).click();
            element(by.cssContainingText('#destinationNexusSelect option', '16th St and Harrison')).click();
        });
        xit('should show available routes', function() {
            expect(element(by.model('availableRoutes')).getText()).toBe('55 16th');
        });
        it('should show available rides', function() {
            expect(element(by.binding('rideList')).getText()).toBeGreaterThan(0);
        });
         describe('saving a plan', function() {
            //clear storage
            //create a plan
            //save it
            //restore it
             it('should show error when no plan name given', function() {
                 element(by.css('#planRestore')).click();
                 var alertDialog = browser.switchTo().alert();
                 expect(alertDialog.getText()).toEqual("cannot restore plan: invalid plan name: expected non-empty string");
             });
             xit('should save and restore plan', function() {
                 element(by.model('planSaveName')).sendKeys('gggg');
                 element(by.css('#planSave')).click();
                 // something is displayed
                 // remember verify corner cases in unit, but verify UI here
                 // so we do need to do some mocking
                 element(by.model('planRestoreName')).sendKeys('gggg');
                 element(by.css('#planRestore')).click();
                 // verify list
                 // verify content
                 // do click
                 expect(element(by.model('nexusStart')).getText()).toBe('16th St and Mission');
                 expect(element(by.model('nexusEnd')).getText()).toBe('16th St and Harrison');
             });
        });
    });
    // this should go to controller test, not e2e
    xdescribe('saving a plan', function() {

        var savedPlan;
        xit('should save plan', function() {
            browser.addMockModule('plan.save', function() {
                angular.module('plan.save', {})
                    .service('xplan', function($window) {
                        return {
                            store: function(plan) {
                                savedPlan = plan;
                            }
                        }
                    });
            });
            var plan = Plan.createPlan(0, 1);
            plan.addSegment('def', 'ghi', []);
            Plan.store('ggg');
            element(by.css('#planSave')).click();
            expect(savedPlan).toEqual({ origin: '16th st and Mission'});
        });
    });
    // before adding, should not show add button
    describe('adding a segment', function() {
        beforeEach(function() {

        });
        it('should show add button', function() {
            expect(element(by.css('#addSegment')).isPresent()).toBeTruthy();
        });
    });
    describe('saved plans', function() {
        beforeEach(function() {
            element(by.css('#showSavedPlans')).click();
        });
        describe('list', function() {
            it('should be displayed', function() {
                expect(element(by.css('#savedPlans li.plan')).isPresent()).toBe(true);
                element.all(by.css('#savedPlans li.plan')).then(function(plans) {
                    expect(plans).not.toBeUndefined();
                    expect(plans.length).toBe(1);
                    expect(plans[0].getText()).toMatch(/get Cliffs/);
                });
            });
            it('should display waypoints', function() {
                element.all(by.css('#savedPlans li.waypoint')).then(function(waypoints) {
                    expect(waypoints.length).toBe(2);
                    expect(waypoints[0].getText()).toMatch(/Mission St/);
                    expect(waypoints[1].getText()).toMatch(/Castro St/);
                });
            });
        });
        describe('selection', function() {
            // wish we could just fail instead of having to check the log
            afterEach(function() {
                expect(element(by.css('#errors')).getText()).toBeFalsy();
            });
            it('should make selection', function() {
                element.all(by.css('#savedPlans li')).then(function(plans) {
                    var thePlan = plans[0];
                    thePlan.click().then(function() {
                        expect(thePlan.getAttribute('class')).toMatch(/selected/);
                        expect(element(by.binding('currentPlan')).getText()).toMatch(/get Cliffs/);
                        // TODO sync up mock saved plans and mountebank backend
                        //browser.driver.sleep(1);
                        //browser.waitForAngular();

                        expect(element(by.binding('routes')).getText()).toMatch(/33 Ashbury/);
                    });
                });
            });
        });
    });
    // remember controller test checks $scope state and actions
    describe('saved trips', function() {
        beforeEach(function() {
            element(by.id('showSavedTrips')).click();
        });
        describe('list', function() {
            it('has waypoint', function() {
                expect(element(by.css('#savedTrips li.trip')).isPresent()).toBeTruthy();
                //element.all(by.css('#savedPlans li.plan')).then(function(plans) {
                //    expect(plans).not.toBeUndefined();
                //    expect(plans.length).toBe(1);
                //    expect(plans[0].getText()).toMatch(/get Cliffs/);
                //});
            });
            describe('select', function() {
                beforeEach(function() {
                    element(by.css('#savedTrips li.trip')).click();
                });
                fit('get nexuses', function() {
                    expect(element(by.id('errors')).getText()).toBe('');
                    expect(element(by.binding('currentTrip')).getText()).toBe('waypoint')
                });
            });

        });

    });
});

