angular.module('plan')
.service('agency', function() {

    function Agency(name) {
        this.name = name
    }
    Agency.prototype.getName = function() {
        return this.name;
    }
    return {
        createAgency: function(name) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            return new Agency(name);
        }
    }
});
