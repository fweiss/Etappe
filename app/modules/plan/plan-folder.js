/**
 * A folder to keep saved plans. default implementation is window.localStorage.
 * Also mediates between a stored plan and an domain plan object.
 */
angular.module('plan')
    .service('planFolder', [ 'plan', 'initSavedPlans', '$window', function(Plan, initSavedPlans, $window) {
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
                        name: name,
                        spanStart: new Date(plan.spanStart),
                        spanEnd: new Date(plan.spanEnd),
                        nexus: plan.getNexus()
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
                var plan = Plan.createPlan(new Date(storedPlan.spanStart), new Date(storedPlan.spanEnd));
                plan.addSegment(storedPlan.nexus[0], storedPlan.nexus[1], []);
                return plan;
            }

        };
        Y
    }]);
