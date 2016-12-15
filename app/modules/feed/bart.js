angular.module('agencies')
.service('bart', function($q) {
    return {
        getAllStops: function() {
            var defer = $q.defer();
            return defer.promise;
        }
    }
});
