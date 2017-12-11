angular.module('plan')
.service('agency', function() {

    function Agency(name) {
        this.name = name
    }
    Agency.prototype.getName = function() {
        return this.name;
    }
    return {
        createAgency: function(name, api) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            if (_.isUndefined(api)) {
                throw new Error('createAgency: no api')
            }
            return new Agency(name);
        }
    }
});
