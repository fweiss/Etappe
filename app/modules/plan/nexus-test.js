describe('domain nexus', function() {
    var NexusService;
    var Waypoint;
    var Stop;
    beforeEach(module('plan'));
    beforeEach(inject(function(nexus, waypoint, stop) {
        NexusService = nexus;
        Waypoint = waypoint;
        Stop = stop;
    }));
    describe('create', function() {
        var nexus;
        beforeEach(function() {
            //nexus = NexusService.create('abc', 15, -31);
            var waypoint = Waypoint.createWaypoint('abc', 15, -31);
            nexus = NexusService.createFromWaypoint(waypoint);
        });
        it('should have Nexus type', function() {
            expect(nexus.constructor.name).toBe('Nexus');
        });
        it('should have canonical name', function() {
            expect(nexus.getName() ).toBe('abc');
        });
        it('should have lat', function() {
            expect(nexus.getLat()).toBe(15);
        });
        it('should have lon', function() {
            expect(nexus.getLon()).toBe(-31);
        });
        it('should have empty stops', function() {
            expect(nexus.getStops().length).toBe(0);
        });
        describe('stops', function() {
            it('should add one', function() {
                nexus.addStop({ name: 's1' });
                expect(nexus.getStops().length).toBe(1);
            });
        });
    });
    describe('merge', function() {
        // route 33 <stop tag="3292" title="16th St & Mission St" lat="37.76502" lon="-122.41928" stopId="13292"/>
        // route 33 <stop tag="5552" title="Mission St & 16th St" lat="37.7645499" lon="-122.4197099" stopId="15552"/>
        // route 33 <stop tag="4070" title="Clayton St & Twin Peaks Blvd" lat="37.7608599" lon="-122.4464799" stopId="14070"/>
        // route 33 <stop tag="4077" title="Clayton St & Carmel St" lat="37.76094" lon="-122.44634" stopId="14077"/>
        // route 55 <stop tag="3293" title="16th St & Mission St" lat="37.7649799" lon="-122.41983" stopId="13293"/>
        // route 55 <stop tag="7324" title="3rd St & Gene Friend Way" lat="37.7693199" lon="-122.3894399" stopId="17324"/>
        // route 55 <stop tag="7321" title="3rd St & Gene Friend Wy" lat="37.7695599" lon="-122.3892999" stopId="17321"/>
        // route 55 <stop tag="3291" title="16th St & Mission St" lat="37.7651399" lon="-122.4196" stopId="13291"/>
        describe('nearby stops', function() {
            var nexuses;
            beforeEach(function() {
                NexusService.mergeStop(Stop.createStop('16th St & Mission St', 'sd-muni', 'K', '7890', 37.76502, -122.41928));
                NexusService.mergeStop(Stop.createStop('16th St & Mission St', 'a', 'r', 's', 37.7651399, -122.4196));
                nexuses = NexusService.getMergedNexuses();
            });
            it('should count 1 nexus', function() {
               expect(nexuses.length).toBe(1);
            });
            describe('nexus', function() {
                var nexus;
                beforeEach(function() {
                    nexus = nexuses[0];
                });
                it('should have 2 stops', function() {
                    expect(nexus.stops.length).toBe(2);
                });
                it('should have merged name', function() {
                    expect(nexus.getName()).toBe('16th St & Mission St');
                });
                describe('first stop info', function() {
                    var stop;
                    beforeEach(function() {
                        stop = nexus.stops[0];
                    });
                    it('should have agency id', function() {
                        expect(stop.getAgencyId()).toBe('sd-muni');
                    });
                    it('should have stop id', function() {
                        expect(stop.getStopId()).toBe('7890');
                    });
                });
            });
        });
        describe('other stops', function() {
            var nexuses;
            beforeEach(function() {
                NexusService.mergeStop(Stop.createStop('16th St & Mission St', 'a', 'r', 's1', 37.76502, -122.41928));
                NexusService.mergeStop(Stop.createStop('3rd St & Gene Friend Wy', 'a', 'r', 's2', 37.7695599, -122.3892999));
                nexuses = NexusService.getMergedNexuses();
            });
            it('should count 2 nexuses', function() {
                expect(nexuses.length).toBe(2);
            });
            it('should count 1 stop in a nexus', function() {
                expect(nexuses[1].stops.length).toBe(1);
            });
        });
        describe('stops', function() {
            var stop1;
            var stop2;
            var stop3;
            beforeEach(function() {
                stop1 = Stop.createStop('n', 'a', 'r', 's', 1, 1);
                stop2 = Stop.createStop('n', 'a', 'r', 's', 1, 1);
                stop3 = Stop.createStop('n', 'a', 'r', 's', 1, 2);
            });
            it('empty', function() {
                NexusService.mergeStops([]);
                expect(NexusService.getMergedNexuses()).toEqual([]);
            });
            it('single', function() {
                NexusService.mergeStops([ stop1 ]);
                expect(NexusService.getMergedNexuses().length).toEqual(1);
            });
            it('two nearby', function() {
                NexusService.mergeStops([ stop1, stop2 ]);
                expect(NexusService.getMergedNexuses().length).toEqual(1);
            });
            it('two not nearby', function() {
                NexusService.mergeStops([ stop1, stop3 ]);
                expect(NexusService.getMergedNexuses().length).toEqual(2);
            });
        });
    });
});