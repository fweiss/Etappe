angular.module('plan')
.service('agency', function() {
    return {
        createAgency: function() {
            throw new Error('createAgency: no agency name')
        }
    }
});
