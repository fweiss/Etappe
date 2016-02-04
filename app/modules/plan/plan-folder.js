/**
 * A folder to keep saved plans. default implementation is window.localStorage.
 * Also mediates between a stored plan and an domain plan object.
 */
angular.module('plan')
    .service('planFolder', [ 'plan', 'initSavedPlans', '$window', 'nexus', function(Plan, initSavedPlans, $window, Waypoint) {
        return {
            list: function() {
                return initSavedPlans;
            },
            store: function(plan, name) {
                if (!_.isString(name)) {
                    throw 'invalid plan name: expected string';
                }
                if (_.isEmpty(name)) {
                    throw 'invalid plan name: expected non-empty string';
                }
                try {
                    var storedPlan = {
                        //name: name,
                        name: plan.getName(),
                        spanStart: new Date(plan.spanStart),
                        spanEnd: new Date(plan.spanEnd),
                        waypoints: plan.getWaypoints()
                        //nexus: plan.getNexus()
                    };
                }
                catch (e) {
                    throw new Error('invalid plan: ' + e);
                }
                $window.localStorage.setItem(storedPlan.name, JSON.stringify(storedPlan));
            },
            load: function(planName) {
                if ( ! _.isString(planName) || _.isEmpty(planName)) {
                    throw 'invalid plan name: expected non-empty string';
                }
                var data = $window.localStorage.getItem(planName);
                if (data === null) {
                    throw 'no stored plan found: "' + planName + '"';
                }
                var storedPlan = JSON.parse(data);
                //var plan = Plan.createPlan(new Date(storedPlan.spanStart), new Date(storedPlan.spanEnd));
                var plan = Plan.createPlan(storedPlan.name);
                //plan.addSegment(storedPlan.nexus[0], storedPlan.nexus[1], []);
                //plan.addSegment('a', 'b', []);
                _.each(storedPlan.waypoints, function(wp) {
                    var waypoint = Waypoint.create(wp.name, wp.lat, wp.lon);
                    plan.addWaypoint(waypoint);
                });
                return plan;
            }

        };
        Y
    }]);
