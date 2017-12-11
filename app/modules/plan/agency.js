angular.module('plan')
.service('agency', function() {

    function Agency() {
    }

    return {
        createAgency: function(name) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            return new Agency();
        }
    }
});
