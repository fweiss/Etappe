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
             getStopsForRoute: function(route) {
                return buildResource('routeConfig', parseStops)({ r: route });
            },
            getAllStops: function() {
                return buildResource('routeConfig', parseStops)({});
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
                        _.each(destinationPredictions, function(destinationPrediction) {
                            var sameVehicle = originPrediction.vehicle === destinationPrediction.vehicle;
                            var originBeforeDestination = originPrediction.time < destinationPrediction.time;
                            var sameTripTag = originPrediction.tripTag === destinationPrediction.tripTag;
                            if (sameVehicle && originBeforeDestination && sameTripTag) {
                                ride = {};
                                ride.agency = 'sf-muni';
                                ride.vehicle = originPrediction.vehicle;
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
            },
            getAllNexus: function() {
                return buildResource('routeConfig', nexusTransform)({});
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
                    prediction.time = new Date($(px).attr('epochTime') * 1); // parseInt
                    prediction.route = route;
                    prediction.tripTag = $(px).attr('tripTag');
                    predictions.push(prediction);
                });
            });
            return predictions;
        }
       // note that stop is both child of route and route.direction
       function parseStops(root) {
//            var root = angular.element(parser.parseFromString(data, 'text/xml'));
            var rx = $(root).find('route');
            var ssx = angular.element(rx).find('stop');
            var stops = [];
            angular.forEach(ssx, function(sx){
                // because angular.element.children('stop') won't work
                var title = $(sx).attr('title');
                if (title !== undefined) {
                    var stop = {};
                    stop.name = title;
                    stop.stopId = $(sx).attr('stopId');
                    stops.push(stop);
                }
            });
            return _.uniq(_.sortBy(stops, 'name'), 'stopId');
       }
       // here we collect all the stops by title to try to avoid so many
       // stops, many of which are really at the same location
       // route[tag] < stop[tag,title,stopId]
       // route[tag] < direction[name] < stop[tag]
       function nexusTransform(root) {
            nexus = {};
            function getOrCreate(name) {
                var stops = nexus[name] && nexus[name].stops;
                if (stops === undefined) {
                    stops = [];
                    nexus[name] = { stops: stops };
                }
                return stops;
            }
            var rrx = $(root).find('route');
            angular.forEach(rrx, function(rx) {
                var route = $(rx).attr('tag');
                var ssx = $(rx).find('stop');
                angular.forEach(ssx, function(sx) {
                    // because angular.element.children('stop') won't work
                    var title = $(sx).attr('title');
                    if (title !== undefined) {
                        var stops = getOrCreate(title);
                        var stop = {};
                        stop.stopId = $(sx).attr('stopId');
                        stop.route = route;
                        stops.push(stop);
                    }
                });
            });

            return nexus;
       }
       return api;
    });
