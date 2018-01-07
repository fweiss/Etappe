describe('etappe', function() {
    beforeEach(function() {
        browser.get('http://localhost:8080/app/index.html');
        browser.executeScript('window.localStorage.clear()')
    })
    fdescribe('trip storage', function() {
        it('works', function() {
            expect(element(by.id('showSavedTrips')).isPresent()).toBe(true)
        })
        describe('list', function() {
            beforeEach(function() {
                const xinitialTrip = '{ id: 1, tripName: "saved trip 1", '
                    + 'origin: { waypointName: \'16th St & Mission St\', lat: 37.7651399, lon: -122.4196 },'
                    + 'destination: { waypointName: \'Castro St\', lat: 37.7608499, lon: -122.43484 },'
                    + 'waypoints: [ ] }'
                const initialTrips = [ { id: 1, tripName: "saved trip 1",
                    origin: { waypointName: '16th St & Mission St', lat: 37.7651399, lon: -122.4196 },
                    destination: { waypointName: 'Castro St', lat: 37.7608499, lon: -122.43484 },
                    waypoints: [ ] }]
                // browser.executeScript('window.localStorage.setItem("savedTrips",' + JSON.stringify(initialTrips) +')')
                const value = JSON.stringify(initialTrips).replace(/"/g, '\\"')
                browser.executeScript('window.localStorage.setItem("savedTrips", arguments[0])', JSON.stringify(initialTrips));
                // browser.executeScript('window.localStorage.setItem("savedTrips", "' + value + '")')
                // browser.pause()
                element(by.id('showSavedTrips')).click()
            })
            it('without errors', function() {
                expect(element(by.id('errors')).getText()).toEqual('');
            })
            it('is displayed', function() {
                expect(element(by.id('savedTrips')).isPresent()).toBe(true)
            })
            it('shows saved trip', function() {
                expect(element(by.css('#savedTrips li.trip > span')).getText()).toEqual('saved trip 1')
            })
        })
    })
})