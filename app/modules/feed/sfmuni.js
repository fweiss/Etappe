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
angular.module('sfmuni.config', [])
    .value('config', { baseUrl: 'https://webservices.nextbus.com/service/publicXMLFeed' });

angular.module('agencies', [ 'sfmuni.config' ])
    .service('sfMuni', [ 'config', '$http', '$q', 'stop', 'ride', function(config, $http, $q, Stop, Ride) {
        var $ = $ || angular.element;
        var parser = new DOMParser();
        const baseUrl = config.baseUrl;

        // route[tag] < stop[tag,title,stopId]
        // route[tag] < direction[name] < stop[tag]
        function transformStops(root) {
            var stops = [];
            var rrx = $(root).find('route');
            angular.forEach(rrx, function(rx) {
                var routeId = $(rx).attr('tag');
                var ssx = $(rx).find('stop');
                angular.forEach(ssx, function(sx) {
                    // because angular.element.children('stop') won't work
                    var title = $(sx).attr('title');
                    if (title !== undefined) {
                        var normalizedTitle = api.unPermuteStopTitle(title);
                        var name = normalizedTitle;
                        var agencyId = 'sfmuni';
                        var stopId = $(sx).attr('stopId');
                        var lat = parseFloat($(sx).attr('lat'));
                        var lon = parseFloat($(sx).attr('lon'));
                        var stop = Stop.createStop(name, agencyId, routeId, stopId, lat, lon);
                        stop.setStopTag($(sx).attr('tag'))
                        stops.push(stop);
                    }
                });
            });
            return stops;
        }

        var api = {
            getStopsForRoute: function (route) {
                return buildResource('routeConfig', parseStops)({r: route});
            },
            getAllStops: function () {
                return buildResource('routeConfig', transformStops)({});
            },
            getAllNexus: function () {
                return buildResource('routeConfig', nexusTransform)({});
            },
            getRides: function (originStop, destinationStop) {
                var origin = api.getPredictionsForStopId(originStop);
                var destination = api.getPredictionsForStopId(destinationStop);
                var defer = $q.defer();
                // combine the results of both sets of predictions
                $q.all([origin, destination]).then(function (responses) {
                    var originPredictions = responses[0].data;
                    var destinationPredictions = responses[1].data;
                    var rides = getRidesForSegmentPredictions(originPredictions, destinationPredictions);
                    defer.resolve({data: rides});
                });
                return defer.promise;
            },
            getPredictionsForStopId: function (stopId) {
                return buildResource('predictions', predictionsTransform)({stopId: stopId});
            },
            getPredictionsForMultiStops: function (stops) {
                var stopList = _.map(stops, function (stop) {
                    return stop.getRouteId() + '|' + stop.getStopTag();
                });
                // multiPredictionsTransform doesn't seem to be neeeded - the data is same as for stop
                return buildResource('predictionsForMultiStops', predictionsTransform)({stops: stopList});
            },
            getRidesForSegment: function (segment) {
                function invalid(stops) {
                    return _.isUndefined(stops) || ! (_.isObject( stops) && _.isArray(stops) && stops.length > 0);
                }
                var originStops = _.where(segment.getOriginNexus().getStops(), { agencyId: 'sfmuni' });
                var destinationStops = _.where(segment.getDestinationNexus().getStops(), { agencyId: 'sfmuni' });
                if (invalid(originStops) || invalid(destinationStops)) {
                    throw new Error('segment does not specify any stops');
                }
                var defer = $q.defer();
                var origin = api.getPredictionsForMultiStops(originStops);
                var destination = api.getPredictionsForMultiStops(destinationStops);
                $q.all([origin, destination]).then(function (responses) {
                    var originPredictions = filterDuplicatePredictionTimes(responses[0].data);
                    var destinationPredictions = responses[1].data;
                    var rides = getRidesForSegmentPredictions(originPredictions, destinationPredictions);
                    defer.resolve({data: rides});
                });
                return defer.promise;
            },
            unPermuteStopTitle: function (title) {
                var sep = ' & ';
                var p1 = title.indexOf(sep);
                if (p1 < 0) {
                    return title;
                }
                var s1 = title.substring(0, p1);
                var s2 = title.substring(p1 + sep.length);
                return (s1 > s2) ? s2 + sep + s1 : title;
            },
            duplicatenPredictionFilter: duplicate
        };
        function duplicate(prediction, otherPrediction) {
            const timeThreshold = 1 * 60 * 1000;
            var sameVehicle = prediction.vehicle === otherPrediction.vehicle;
            var timeDelta = Math.abs(prediction.time - otherPrediction.time);
            var duplicate = sameVehicle && timeDelta < timeThreshold;
            if (! duplicate) {
                _.extend(otherPrediction, prediction);
            }
            return duplicate;
        }
        function filterDuplicatePredictionTimes(unfiltered) {
            const timeThreshold = 0 *1000;
            var filtered = _.sortBy(unfiltered, function(prediction) {
                // better to left pad the time
                return prediction.vehicle + ':' + prediction.stopId + ':' + prediction.time.getTime();
            });
            var otherPrediction = { vehicle: '', time: 0 };
            return  _.filter(filtered, function(prediction) {
                return ! duplicate(prediction, otherPrediction);
            });
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
        function parsePrediction(px, route) {
            var prediction = {};
            prediction.vehicle = $(px).attr('vehicle');
            prediction.time = new Date($(px).attr('epochTime') * 1); // parseInt
            prediction.route = route;
            prediction.tripTag = $(px).attr('tripTag');
            return prediction;
        }
        // expecting predictions < direction < prediction
        function predictionsTransform(root) {
            var predictions = [];
            var ppsx = $(root).find('predictions');
            angular.forEach(ppsx, function(psx) {
                var route = $(psx).attr('routeTag');
                var ddx = $(psx).find('direction');
                angular.forEach(ddx, function(dx) {
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
            });
            return predictions;
        }
        // the docs are incorrect: direction < predictions[routeTag] < prediction[epochTime,vehicle,tripTag]
        // actual: body < predictions[routeTag] < direction <  prediction[epochTime,vehicle,tripTag]
        function multiPredictionsTransform(root) {
            predictions = [];
            var ssx = $(root).find('predictions')
            angular.forEach(ssx, function(sx) {
                var route = $(sx).attr('routeCode');
                var ddx = $(sx).find('direction');
                angular.forEach(ddx, function(dx) {
                    var ppx = $(dx).find('prediction');
                    angular.forEach(ppx, function(px) {
                        predictions.push(parsePrediction(px, route));
                    });
                });
            });
            return predictions;
        }
        // deprecated
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
                    stop.stopTag = $(sx).attr('tag');
                    stops.push(stop);
                }
            });
           return _.sortBy(stops, 'name');
        //            return _.uniq(_.sortBy(stops, 'name'), 'stopId');
        }
        // here we collect all the stops by title to try to avoid so many
        // stops, many of which are really at the same location
        // route[tag] < stop[tag,title,stopId]
        // route[tag] < direction[name] < stop[tag]
        function nexusTransform(root) {
            function getOrCreate(name) {
                var stops = nexus[name] && nexus[name].stops;
                if (stops === undefined) {
                    stops = [];
                    nexus[name] = { name: name, stops: stops };
                }
                return stops;
            }
            nexus = {};
            var rrx = $(root).find('route');
            angular.forEach(rrx, function(rx) {
                var route = $(rx).attr('tag');
                var ssx = $(rx).find('stop');
                angular.forEach(ssx, function(sx) {
                    // because angular.element.children('stop') won't work
                    var title = $(sx).attr('title');
                    if (title !== undefined) {
                        var normalizedTitle = api.unPermuteStopTitle(title);
                        var stops = getOrCreate(normalizedTitle);
                        //var stop = {};
                        //stop.stopId = $(sx).attr('stopId');
                        //stop.stopTag = $(sx).attr('tag');
                        //stop.route = route;
                        var stop = Stop.createStop(title, 'sf-muni', route, $(sx).attr('stopId'), $(sx).attr('lat'), $(sx).attr('lon'));
                        //var stop = Stop.createStop('a', 'b', 'c', 'd', 1, 2);
                        stop.setStopTag($(sx).attr('tag'));
                        stops.push(stop);
                    }
                });
            });
            return nexus;
        }
        function getRidesForSegmentPredictions(originPredictions, destinationPredictions) {
            var rides = [];
            // match up predictions by vehicle
            _.each(originPredictions, function(originPrediction) {
                _.each(destinationPredictions, function(destinationPrediction) {
                    var sameVehicle = originPrediction.vehicle === destinationPrediction.vehicle;
                    var originBeforeDestination = originPrediction.time < destinationPrediction.time;
                    var sameTripTag = originPrediction.tripTag === destinationPrediction.tripTag;
                    if (sameVehicle && originBeforeDestination && sameTripTag) {
                        //var ride = {};
                        //ride.agency = 'sf-muni';
                        //ride.vehicle = originPrediction.vehicle;
                        //ride.startTime = originPrediction.time;
                        //ride.endTime = destinationPrediction.time;

                        var ride = Ride.createRide('sf-muni', originPrediction.route, originPrediction.vehicle, originPrediction.time,destinationPrediction.time );
                        rides.push(ride);
                    }
                });
            });
            return rides;
        }
       return api;
    }]);
