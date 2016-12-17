angular.module('agencies')
.service('bart', [ '$q', '$http', 'stop', 'ride', function($q, $http, Stop, Ride) {
    var $ = $ || angular.element;
    var parser = new DOMParser();
    var baseUrl = 'http://api.bart.gov/api';
    // a bit too simple to unit test?
    function convertToDate(date, time) {
        var datetime = new Date();
        datetime.setTime(Date.parse(date + ' ' + time));
        return datetime;
    }

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
        },
        getRidesForSegment: function(segment) {
            var config = {
                url: 'http://api.bart.gov/api/sched.aspx',
                params: {
                    a: '4',
                    cmd: 'depart',
                    date: 'now',
                    key: 'MW9S-E7SL-26DU-VV8V',
                    orig: 'RICH',
                    dest: 'FRMT'
                },
                transformResponse: function(response) {
                    var root = $(parser.parseFromString(response, 'text/xml'));
                    var trips = $(root).find('trip');
                    var rides = _.map(trips, function(trip) {
                        var agency = 'bart';
                        var route = 'NA'; // need to get this from leg element
                        var vehicle = 'NA'; // need to get this from leg element
                        var startTime = convertToDate($(trip).attr('origTimeDate'), $(trip).attr('origTimeMin'));
                        var endTime = convertToDate($(trip).attr('destTimeDate'), $(trip).attr('destTimeMin'));
                        return Ride.createRide(agency, route, vehicle, startTime, endTime);
                    });
                    return rides;
                }
            };
            return $http(config);
        }
    }
}]);
