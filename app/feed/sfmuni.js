/**
 * XML feed is organized as body > route > ( stop, direction > stop, path > point )
 * A stop represents a distinct node on a route. Since routes intersect, nodes
 * may coincide, one for each route. Supposably, the geocodes will be equal.
 * There will need to be a way to aggregate such stops into "station" or "nexus"
 * which would represent an endpoint for a ride and a trip.
 *
 * Note that this is unlike BART, where a station can be shared among routes.
 *
 * http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni
 *
 * @param data XML
 * @returns {{}}
 */
angular.module('agencies', [])
.service('sfMuni', function($http, $q) {
        var $ = $ || angular.element;
        var parser = new DOMParser();
        const baseUrl =  'http://webservices.nextbus.com/service/publicXMLFeed';
        var api = {
            getData: function() {
                var config = {
                    url: 'http://webservices.nextbus.com/service/publicXMLFeed',
                    method: 'GET',
                    transformResponse: function(data) {
                        var routes = [];
//                        data = '<body><route tag="" title=""><stop tag="" title="" shortTitle=""></stop></route></body>';
                        var doc =  parser.parseFromString(data, 'text/xml');
                        var root = angular.element(doc);
                        var re = angular.element(root).find('route');
                        angular.forEach(re, function(ff) {
                            var route = { id: angular.element(ff).attr('tag') };
                            routes.push(route);
                        });
                        return  routes;
                    }
                };
                return $http(config);
            },
            getStops: function(route) {
                return buildResource('routeConfig', parseStops)({ r: route });
            },
            getRides: function(originStop, destinationStop) {
                var origin = api.getPredictionsForStopId(originStop);
                var destination = api.getPredictionsForStopId(destinationStop);
                var defer = $q.defer();
                // combine the results of both sets of predictions
                $q.all([ origin, destination ]).then(function(responses) {
                    var originPredictions = responses[0].data;
                    var destinationPredictions = responses[1].data;
                    var rides = [];
                    // match up predictions by vehicle
                    _.each(originPredictions, function(originPrediction) {
                        var vehicle = originPrediction.vehicle;
                        _.each(destinationPredictions, function(destinationPrediction) {
                            var sameVehicle = vehicle === destinationPrediction.vehicle;
                            if (sameVehicle) {
                                ride = {};
                                ride.agency = 'sf-muni';
                                ride.vehicle = vehicle;
                                ride.startTime = originPrediction.time;
                                ride.endTime = destinationPrediction.time;
                                rides.push(ride);
                            }
                        });
                    });
                    defer.resolve({ data: rides });
                });
                return defer.promise;
            },
            getPredictionsForStopId: function(stopId) {
                return buildResource('predictions', predictionsTransform)({ stopId: stopId });
            }
        }
        function buildResource(command, transform) {
            return function(params) {
                params.command = command;
                params.a = 'sf-muni';
                var config = {
                    url: baseUrl,
                    params: params,
                    transformResponse: function(response) {
                        var root = $(parser.parseFromString(response, 'text/xml'));
                        return transform(root);
                    }
                };
                return $http(config);
            }
        }
       function predictionsTransform(root) {
            var px = $(root).find('predictions');
            var ddx = $(px).find('direction');
            var predictions = [];
            angular.forEach(ddx, function(dx) {
                var route = $(dx).attr('routeTag');
                var ppx = $(ddx).find('prediction');
                angular.forEach(ppx, function(px) {
                    var prediction = {};
                    prediction.vehicle = $(px).attr('vehicle');
                    prediction.time = new Date($(px).attr('epochTime') * 1);
                    prediction.route = route;
                    predictions.push(prediction);
                });
            });
            return predictions;
        }
        // note that stop is both child of route and route.direction
        function parseStops(root) {
//            var root = angular.element(parser.parseFromString(data, 'text/xml'));
            var rx = $(root).find('route');
            var sxc = angular.element(rx).find('stop');
            var stops = [];
            angular.forEach(sxc, function(sx){
                // because angular.element.children('stop') won't work
                var title = angular.element(sx).attr('title');
                if (title !== undefined) {
                    var stop = { name: title };
                    stops.push(stop);
                }
            });
            return stops;
        }
        function addMinutes(date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        }
        function parseRides(root) {
            var psx = angular.element(root).find('predictions');
            var dx = angular.element(psx).find('direction');
            var px = angular.element(dx).find('prediction');
            var rides = [];
            var now = new Date();
            angular.forEach(px, function(ppx) {
                var pt = angular.element(ppx).attr('epochTime');
                var pm = angular.element(ppx).attr('minutes');
//                var st = addMinutes(now, parseInt(pm, 10));
                var st = new Date(pt * 1000);
                var ride = {};
                ride.agency = 'sf-muni';
                ride.vehicle = angular.element(ppx).attr('vehicle');
                ride.startTime = new Date(pt * 1000);
                ride.endTime = '';
                rides.push(ride);
            });
            return rides;
        }
        return api;
    });
