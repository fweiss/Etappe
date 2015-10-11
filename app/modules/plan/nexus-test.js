describe('nexus', function() {
    var NexusService;
    beforeEach(function() {
        function Nexus(canonicalName, lat, lon) {
            this.canonicalName = canonicalName;
            this.lat = lat;
            this.lon = lon;
            this.stops = [];
            this.getCanonicalName = function() {
                return this.canonicalName
            };
            this.getLat = function() {
                return this.lat;
            };
            this.getLon = function() {
                return this.lon;
            };
            this.getStops = function() {
                return this.stops;
            };
        }
        NexusService = {
            nexuses: [],
            create: function(config) {
                return new Nexus(config.cannonicalName, config.lat, config.lon );
            },
            mergeStop: function(stop) {
                var nearbyNexus = this.findNearbyNexus(stop.lat, stop.lon);
                if (_.isUndefined(nearbyNexus)) {
                    nearbyNexus = new Nexus(stop.name, stop.lat, stop.lon);
                    this.nexuses.push(nearbyNexus);
                }
                nearbyNexus.stops.push(stop);
            },
            getMergedNexuses: function() {
                return this.nexuses;
            },
            findNearbyNexus: function(lat, lon) {
                return _.find(this.nexuses, function(nexus) {
                    var deltaLat = Math.abs(nexus.lat - lat);
                    var deltaLon = Math.abs(nexus.lat - lat);
                    return deltaLat < .001 && deltaLon < .001;
                });
            }
        };
    });
    describe('create', function() {
        var nexus;
        beforeEach(function() {
            nexus = NexusService.create({ cannonicalName: 'abc', lat: 15, lon: -31 });
        });
        it('should have Nexus type', function() {
            expect(nexus.constructor.name).toBe('Nexus');
        });
        it('should have canonical name', function() {
            expect(nexus.getCanonicalName() ).toBe('abc');
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
                NexusService.mergeStop({ agencyId: 'sd-muni', id: '7890', name: '16th St & Mission St', lat: 37.76502, lon: -122.41928 });
                NexusService.mergeStop({ name: '16th St & Mission St', lat: 37.7651399, lon: -122.4196 });
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
                    expect(nexus.getCanonicalName()).toBe('16th St & Mission St');
                });
            });
            describe('first stop info', function() {
                var stop;
                beforeEach(function() {
                    stop = nexuses[0].stops[0];
                });
                it('should have stop id', function() {
                    expect(stop.id).toBe('7890');
                });
                it('should have agengy id', function() {
                    expect(stop.agencyId).toBe('sd-muni');
                });
            });
        });
       describe('other stops', function() {
           var nexuses;
           beforeEach(function() {
               NexusService.mergeStop({  name: '16th St & Mission St', lat: 37.76502, lon: -122.41928 });
               NexusService.mergeStop({ name: '3rd St & Gene Friend Wy', lat: 37.7695599, lon: -122.3892999 });
               nexuses = NexusService.getMergedNexuses();
           });
           it('should count 2 nexuses', function() {
               expect(nexuses.length).toBe(2);
           });
           it('should count 1 stop in a nexus', function() {
               expect(nexuses[1].stops.length).toBe(1);
           });
       });
    });
});