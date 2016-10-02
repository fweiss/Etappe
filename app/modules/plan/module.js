angular.module('plan.config', [])
    .value('initSavedPlans', [
        { id: 1, name: 'get Cliffs', waypoints: [
            { name: 'Mission St', stops: [{"stopId":"15553","stopTag":"5553","route":"33"},{"stopId":"13338","stopTag":"3338","route":"33"}] },
            { name: 'Castro St', stops: [{"stopId":"13326","stopTag":"3326","route":"33"},{"stopId":"13325","stopTag":"3325","route":"33"}] }]
        }
    ])
    .value('initSavedTrips', [
        // honestly, time to get rid of origin and destination
        { id: 1, tripName: 'get Cliffs',
            origin: { waypointName: 'Mission St', lat: 1, lon: 1 },
            destination: { waypointName: 'Castro St', lat: 1, lon: 2 },
            waypoints: [ ]
        }
    ]);

angular.module('plan.canvas.config', [])
    .value('planConfig', function(key) {
        var defaults = {};
        defaults.tickLegendHeight = 26
        return defaults[key] || null;
    })
    .constant('tickLegendHeight', 20)
    .value('nexusHeight', 30);

angular.module('plan', [ 'plan.canvas.config', 'plan.config', 'agencies' ]);

angular.module('plan')
    // handle angular exceptions so that protractor can verify there are none
    .config(function($provide) {
        $provide.decorator('$exceptionHandler', function($delegate, $injector) {
            return function(exception, cause) {
                var $rootScope = $injector.get('$rootScope');
                $rootScope.error = exception.message;
                $delegate(exception, cause);
            };
        });
    })

