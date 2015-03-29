angular
    .module('plan.canvas.config', [])
    .value('planConfig', function(key) {
        var defaults = {};
        defaults.tickLegendHeight = 20
        return defaults[key] || null;
    })
    .constant('tickLegendHeight', 20)
    .value('nexusHeight', 30);

angular.module('plan', [ 'plan.canvas.config' ]);


