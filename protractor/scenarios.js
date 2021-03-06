describe('etappe', function() {
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
            angular.module('sfmuni.config', [])
                .value('config', { baseUrl: 'http://localhost:4545' });
        });

        browser.addMockModule('plan.config', function() {
            angular.module('plan.config', [])
                .value('initSavedPlans', [
                    { id: 1, name: 'get Cliffs', waypoints: [
                        { name: 'Mission St', stops: [ { route: 'N', stopTag: '5555' } ] },
                        { name: 'Castro St', stops: [ { route: 'N', stopTag: '4444' } ] } ]
                    }
                ])
                .value('initSavedTrips', [ { id: 1, tripName: 'Trip to  Cliffs',
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
    describe('load page', function() {
        it('without errors', function() {
            // in module.js, an exception handler gets any angular errors - supposeably
            expect(element(by.id('errors')).getText()).toEqual('');
        });
        it('shows trip builder', function() {
            expect(element(by.id('tripBuilder')).isPresent()).toBe(true);
        });
    });
    describe('trip builder', function() {
        it('shows waypoint selector', function() {
            expect(element(by.id('nextWaypointSelect')).isPresent()).toBe(true);
        });
        it('shows waypoint agency options', function() {
            expect(element(by.css('#waypointSelector .agencySelector')).isPresent()).toBe(true);
        });
        describe('waypoint selector', function() {
            it('shows agencies', function() {
                expect(element.all(by.css('#waypointSelector .field label')).getText()).toEqual([ 'BART', 'SFMUNI' ]);
            });
            //it('populates sfmuni stops', function() {
            //    element(by.css('#waypointSelector .field input[value=SFMUNI]')).click();
            //});
        });
        describe('a simple sfmuni trip', function() {
            it('shows empty list', function() {
                expect(element.all(by.css('#waypoints td')).getText()).toEqual([ ]);
            });
            describe('select first waypoint', function() {
                beforeEach(function() {
                    element(by.css('#waypointSelector .field input[value=SFMUNI]')).click();
                    element(by.cssContainingText('#nextWaypointSelect option', '16th St and Mission')).click();
                });
                it('is shown in list', function() {
                    expect(element.all(by.css('#waypoints td')).getText()).toEqual([ '16th St and Mission' ]);
                });
                describe('select second waypoint', function() {
                    beforeEach(function() {
                        element(by.cssContainingText('#nextWaypointSelect option', '16th St and Harrison')).click();
                    });
                    it('both are shown in list', function() {
                        expect(element.all(by.css('#waypoints td')).getText()).toEqual([ '16th St and Mission', '16th St and Harrison' ]);
                    });
                    describe('create trip', function() {
                        beforeEach(function() {
                            element(by.css('#createTrip')).click();
                        });
                        it('shows both waypoints', function() {
                            expect(element.all(by.css('#trip td')).getText()).toEqual([ '16th St and Mission', '16th St and Harrison' ]);
                        })
                        it('shows available rides', function() {
                            var headers = element.all(by.css('table#rides thead th')).map(function(ele) {
                                return ele.getText();
                            });
                            expect(headers).toEqual([ 'segment', 'origin', 'destination', 'agency', 'route', 'vehicle', 'start', 'end' ]);
                            var row0 = element.all(by.css('table#rides tbody td')).map(function(ele) {
                                return ele.getText();
                            });
                            expect(row0).toEqual([ '1', '16th St and Mission', '16th St and Harrison', 'sf-muni', 'N', '3333', '4:00 PM', '4:00 PM' ]);
                        });
                    });
                });
            });
        });
    });

    //describe('saving a plan', function() {
    //    //clear storage
    //    //create a plan
    //    //save it
    //    //restore it
    //    it('should show error when no plan name given', function() {
    //        element(by.css('#planRestore')).click();
    //        var alertDialog = browser.switchTo().alert();
    //        expect(alertDialog.getText()).toEqual("cannot restore plan: invalid plan name: expected non-empty string");
    //    });
    //    xit('should save and restore plan', function() {
    //        element(by.model('planSaveName')).sendKeys('gggg');
    //        element(by.css('#planSave')).click();
    //        // something is displayed
    //        // remember verify corner cases in unit, but verify UI here
    //        // so we do need to do some mocking
    //        element(by.model('planRestoreName')).sendKeys('gggg');
    //        element(by.css('#planRestore')).click();
    //        // verify list
    //        // verify content
    //        // do click
    //        expect(element(by.model('nexusStart')).getText()).toBe('16th St and Mission');
    //        expect(element(by.model('nexusEnd')).getText()).toBe('16th St and Harrison');
    //    });
    //});

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
    //describe('saved plans', function() {
    //    beforeEach(function() {
    //        element(by.css('#showSavedPlans')).click();
    //    });
    //    describe('list', function() {
    //        it('should be displayed', function() {
    //            expect(element(by.css('#savedPlans li.plan')).isPresent()).toBe(true);
    //            element.all(by.css('#savedPlans li.plan')).then(function(plans) {
    //                expect(plans).not.toBeUndefined();
    //                expect(plans.length).toBe(1);
    //                expect(plans[0].getText()).toMatch(/get Cliffs/);
    //            });
    //        });
    //        it('should display waypoints', function() {
    //            element.all(by.css('#savedPlans li.waypoint')).then(function(waypoints) {
    //                expect(waypoints.length).toBe(2);
    //                expect(waypoints[0].getText()).toMatch(/Mission St/);
    //                expect(waypoints[1].getText()).toMatch(/Castro St/);
    //            });
    //        });
    //    });
    //    describe('selection', function() {
    //        // wish we could just fail instead of having to check the log
    //        afterEach(function() {
    //            expect(element(by.css('#errors')).getText()).toBeFalsy();
    //        });
    //        xit('should make selection', function() {
    //            element.all(by.css('#savedPlans li')).then(function(plans) {
    //                var thePlan = plans[0];
    //                thePlan.click().then(function() {
    //                    expect(thePlan.getAttribute('class')).toMatch(/selected/);
    //                    expect(element(by.binding('currentPlan')).getText()).toMatch(/get Cliffs/);
    //                    // TODO sync up mock saved plans and mountebank backend
    //                    //browser.driver.sleep(1);
    //                    //browser.waitForAngular();
    //
    //                    expect(element(by.binding('routes')).getText()).toMatch(/33 Ashbury/);
    //                });
    //            });
    //        });
    //    });
    //});
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
                it('get nexuses', function() {
                    expect(element(by.id('errors')).getText()).toBe('');
                    expect(element(by.css('#trip caption')).getText()).toBe('Trip to Cliffs')
                });
            });

        });

    });
});

