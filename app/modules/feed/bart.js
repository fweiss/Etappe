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
    function buildResource(resource, command, transform) {
        return function(params) {
            params.cmd = command;
            params.key = 'MW9S-E7SL-26DU-VV8V';
            var config = {
                url: baseUrl + '/' + resource + '.aspx',
                params: params,
                transformResponse: function(response) {
                    var root = $(parser.parseFromString(response, 'text/xml'));
                    return transform(root);
                }
            };
            return $http(config);
        }
    }
    function transformStationsToStops(root) {
        var stations = $(root).find('station');
        var stops = _.map(stations, function(station) {
            var name = $(station).find('name').text();
            var agency = 'bart';
            var route = 'NA';
            var id = $(station).find('abbr').text();
            var lat = $(station).find('gtfs_latitude').text();
            var lon = $(station).find('gtfs_longitude').text();
            return Stop.createStop(name, agency, route, id, lat, lon);
        });
        return stops;
    }
    function transformScheduleToRides(root) {
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

    return {
        getAllStops: function() {
            return buildResource('stn', 'stns', transformStationsToStops)({ })
        },
        getRidesForSegment: function(segment) {
            var originStop = segment.getOriginNexus().getStops()[0];
            var destinationStop = segment.getDestinationNexus().getStops()[0];
            var args = { a: '4', date: 'now', orig: originStop.getStopId(), dest: destinationStop.getStopId() };
            return buildResource('sched', 'depart', transformScheduleToRides)(args)
        }
    }
}]);
