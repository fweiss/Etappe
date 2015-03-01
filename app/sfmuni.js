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
.service('sfMuni', function($http) {
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
            getPredictions: function(route) {
                var config = {
                    url: baseUrl,
                    params: {
                        command: 'predictions',
                        a: 'sf-muni',
                        r: route
                    },
                    transformResponse: function(data) {
                        return predictionsTransform(data);
                    }
                }
                return $http(config);
            },
            getStops: function(route) {
                var config = {
                    url: baseUrl,
                    params: {
                        command: 'routeConfig',
                        a: 'sf-muni',
                        r: route
                    },
                    transformResponse: function(data) {
                        return parseStops(data);
                    }
                }
                return $http(config).then(function(result) { return result.data; });
            }
        }
        function predictionsTransform(data) {
            var doc =  parser.parseFromString(data, 'text/xml');
            var root = angular.element(doc);
            var px = angular.element(root).find('predictions');
            var dx = angular.element(px).find('direction');
            var predictions = { directions: [ ]};
            angular.forEach(dx, function(ff) {
                var direction = { time: '' };
                predictions.directions.push(direction);
            });
            return predictions;
        }
        // note that stop is both child of route and route.direction
        function parseStops(data) {
            var root = angular.element(parser.parseFromString(data, 'text/xml'));
            var rx = angular.element(root).find('route');
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
        return api;
    });
