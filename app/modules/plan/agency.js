angular.module('plan')
.service('agency', [ 'sfMuni', 'bart', function(SfMuni, Bart) {

    function Agency(name, api) {
        this.name = name;
        this.api = api;
    }
    Agency.prototype.getName = function() {
        return this.name;
    };
    Agency.prototype.getApi = function() {
        return this.api;
    };
    return {
        createAgency: function(name, api) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            if (_.isUndefined(api)) {
                throw new Error('createAgency: no api')
            }
            return new Agency(name, api);
        },
        getAll: function() {
            return [
                this.createAgency('BART', Bart),
                this.createAgency('SFMUNI', SfMuni)
            ];
        }
    }
}]);
