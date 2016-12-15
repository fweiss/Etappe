angular.module('agencies')
.service('bart', [ '$q', '$http', 'stop', function($q, $http, Stop) {
    var $ = $ || angular.element;
    var parser = new DOMParser();
    var baseUrl = 'http://api.bart.gov/api';
    return {
        getAllStops: function() {
            var params = {};
            params.cmd = 'stns';
            params.key = 'MW9S-E7SL-26DU-VV8V';
            var config = {
                url: baseUrl + '/stn.aspx',
                params: params,
                transformResponse: function(response) {
                    var root = $(parser.parseFromString(response, 'text/xml'));
                    var stations = $(root).find('station');
                    var stops = _.map(stations, function(station) {
                        var name = $(station).find('name').text();
                        var agency = 'bart';
                        var route = 'NA';
                        var id = 'id';
                        var lat = $(station).find('gtfs_latitude').text();
                        var lon = $(station).find('gtfs_longitude').text();
                        return Stop.createStop(name, agency, route, id, lat, lon);
                    });
                    return stops;
                }
            };
            return $http(config);
        }
    }
}]);
