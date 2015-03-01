describe('specify a route1', function() {
    var Route = {
        create: function() {
            var route = {
                origin: null,
                destination: null,
                status: this.EMPTY,
                getStatus: function() {
                    return this.status;
                },
                setOrigin: function(origin) {
                    this.origin = origin;
                },
                setDestination: function(destination) {
                    this.destination = destination;
                    this.status = Route.SET;
                }
            };
            return route;
        },
        EMPTY: 'empty',
        SET: 'set'
    };
    describe('a new route', function() {
        var emptyRoute;
        beforeEach(function() {
            emptyRoute = Route.create();
        });
        it('should be empty', function() {
            expect(emptyRoute.getStatus()).toEqual(Route.EMPTY);
        });
    });
    describe('route with origin and destination', function() {
        var route;
        beforeEach(function() {
            route = Route.create();
            route.setOrigin("a");
            route.setDestination("b");
        });
        it('should be set', function() {
            expect(route.getStatus()).toEqual(Route.SET);
        });
    });
});