var sfmuni = function() {
    var backend;
    var routeConfigs = {};
    function addMinutes(date, addMinutes) {
        var minutes = date.getMinutes() + addMinutes;
        if (minutes < 60) {
            date.setMinutes(minutes);
        } else {
            date.setMinutes(minutes % 60);
            var hours = date.getHours() + Math.floor(minutes / 60);
            if (hours < 24) {
                date.setHours(hours);
            } else {
                date.setHours(hours % 24);
                // FIXME: carry day
            }
        }
        return date;
    }
    /**
     * Parse the given jQuery data into a Predictions object.
     *
     * XML:
     * body < predictions < direction < prediction
     *
     * JS:
     * predictions < direction < prediction
     * but it flattens the directions, leaving out the route id in the predictions element
     * 
     * @param data the jQuery.ajax data
     * @return a Predictions object
     * */
    function parsePredictionsx(data) {
        var predictions = {
            directions: [],
            messages: []
        };
        predictions.agencyTitle = $(data).attr("agencyTitle");
        predictions.routeTitle = $(data).attr("routeTitle");
        predictions.stopTitle = $(data).attr("stopTitle");
        predictions.stopTag = $(data).attr("stopTag");
        predictions.routeTag = $(data).attr("routeTag");
        $("direction", data).each(function() {
            var direction = {
                predictions: []
            };
            direction.title = $(this).attr("title");
            $(this).find("prediction").each(function() {
                var prediction = {};
                prediction.epochTime = $(this).attr("epochTime");
                prediction.seconds = $(this).attr("seconds");
                prediction.minutes = $(this).attr("minutes");
                prediction.datetime = addMinutes(new Date(), parseInt(prediction.minutes, 10));
                prediction.isDeparture = $(this).attr("isDeparture");
                prediction.affectedByLayover = $(this).attr("affectedByLayover");
                prediction.dirTag = $(this).attr("dirTag");
                prediction.vehicle = $(this).attr("vehicle");
                prediction.block = $(this).attr("block");
                prediction.tripTag = $(this).attr("tripTag");
                direction.predictions.push(prediction);
            });
            predictions.directions.push(direction);
        });
        return predictions;
    }

    /**
     * Parse the given predictions (XML) to a list of connections (JS)
     * @param data
     * @returns {Array}
     */
    function parsePredictions(data) {
        var connections = [];
        $(data).find("body").find("predictions").each(function() {
            var connection = {
                routeTag: $(this).attr("routeTag"),
                agencyTitle: $(this).attr("agencyTitle"),
                directions: [],
                messages: []
            };
            $(this).find("direction").each(function() {
                var direction = {
                    title: $(this).attr("title"),
                    predictions: []
                };
                $(this).find("prediction").each(function() {
                    var prediction = {};
                    prediction.epochTime = $(this).attr("epochTime");
                    prediction.seconds = $(this).attr("seconds");
                    prediction.minutes = $(this).attr("minutes");
                    prediction.datetime = addMinutes(new Date(), parseInt(prediction.minutes, 10));
                    prediction.isDeparture = $(this).attr("isDeparture");
                    prediction.affectedByLayover = $(this).attr("affectedByLayover");
                    prediction.dirTag = $(this).attr("dirTag");
                    prediction.vehicle = $(this).attr("vehicle");
                    prediction.block = $(this).attr("block");
                    prediction.tripTag = $(this).attr("tripTag");
                    direction.predictions.push(prediction);
                });
                connection.directions.push(direction);
            });
            connections.push(connection);
        });
        return connections;
    }
    function parseRoutes(data) {
        var routes = [];
        $("route", data).each(function() {
            var route = {};
            route.tag = $(this).attr("tag");
            route.title = $(this).attr("title");
            routes.push(route);
        });
        return routes;
    }
    function parseRouteConfig(data) {
        var route = {};
        route.stops = [];
        $("stop", data).each(function() {
            var stop = {};
            stop.tag = $(this).attr("tag");
            stop.title = $(this).attr("title");
            stop.lat = $(this).attr("lat");
            stop.lon = $(this).attr("lon");
            stop.stopId = $(this).attr("stopId");
            route.stops.push(stop);
        });
        return route;
    }
    function request(options, callback) {
        //$.ajax("http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=14075", {
        $.ajax("http://webservices.nextbus.com/service/publicXMLFeed", {
            data: options,
            dataType: "xml",
            success: callback
        });
    }
    /**
     * Determine the originTime and destinationTime for the rides in the segment by matching up the vehicle ids
     * at the origin and destination. SFMuni only provides departure times for a stop.
     *
     * @param direction
     * @param departurePredictions
     * @param arrivalProdictions
     * @param routeConfig
     * @returns {{}}
     */
    function createMuniRides(direction, departurePredictions, arrivalProdictions, routeConfig) {
        function getStop(stopId) {
            for (var i=0; i<routeConfig.stops.length; i++) {
                var stop = routeConfig.stops[i];
                if (stop.stopId == stopId) {
                    return stop;
                }
            }
        }
        var rides = {};
        rides.agency = "sfmuni";
        rides.origin = departurePredictions.stopTag;
        rides.destination = arrivalProdictions.stopTag;
        rides.list = [];
        var committedOrigins = [];
        departurePredictions.forEach(function(connectionA) {
            var routeTag = connectionA.routeTag;
//            committedOrgins.push(connectionA.)
            connectionA.directions.forEach(function(directionA) {
                directionA.predictions.forEach(function(predictionA) {

                    arrivalProdictions.forEach(function(connection) {
                        connection.directions.forEach(function(direction) {
                            direction.predictions.forEach(function(predictionB) {
                                var sameVehicle = predictionA.vehicle == predictionB.vehicle;
                                var originBeforeDestination = predictionA.datetime < predictionB.datetime;
                                var sameTripTag = predictionA.tripTag == predictionB.tripTag;

                                if (sameVehicle && originBeforeDestination && sameTripTag) {
                                    var segment = {};
                                    segment.originTime = predictionA.datetime;
                                    segment.destinationTime = predictionB.datetime;
                                    segment.carrier = "sfmuni";
                                    segment.route = routeTag;
                                    segment.vehicle = predictionA.vehicle;
                                    segment.origin = { id: 0, name: "", abbr: 'zzz'}; //getStop(rides.origin).title };
                                    segment.destination = { id: "16TH", name: "16th", abbr: "16th Street" };
                                    rides.list.push(segment);
                                }
                            });
                        });
                    });

                });
            });
        });
        return rides;
    }
    function findSegments(options, callback) {
        var route = options.route; //"33";
        var origStop = options.orig; //14076;
        var destStop = options.dest; //13292;
        // FIXME: check if stops and route make sense
        var predictions1;
        var predictions2;
        var routeConfig;
        backend.getRouteConfig({r: route }, function(rc) {
            routeConfig = rc;
            predictionsUpdated();
        });
        backend.getPredictions({ stopId: origStop }, function(data) {
            predictions1 = parsePredictions(data);
            predictions1.stopTag = origStop;
            predictionsUpdated();
        });
        backend.getPredictions({ stopId: destStop }, function(data) {
            predictions2 = parsePredictions(data);
            predictions2.stopTag = destStop;
            predictionsUpdated();
        });
        function predictionsUpdated() {
            if (predictions1 && predictions2 && routeConfig) {
                result();
            }
        }
        function getStop(stopId) {
            for (var i=0; i<routeConfig.stops.length; i++) {
                var stop = routeConfig.stops[i];
                if (stop.stopId == stopId) {
                    return stop;
                }
            }
        }
        function result() {
            var segments = sfmuni.createMuniRides('1', predictions1, predictions2, routeConfig);
            callback(segments);
        }
    }
    function getSegments(subroute, callback) {
        var options = {};
        options.route = subroute.route;
        options.orig = subroute.origin;
        options.dest = subroute.destination;
        findSegments(options, callback);
    }
    function setBackend(_backend) {
        backend = _backend;
    }
    function initialize() {
        backend = {
            getPredictions: function(options, callback) {
                options.command = "predictions";
                options.a = "sf-muni";
                request(options, function(data, textStatus, jqXHR) {
                    callback(data);
                });
            },
            getRoutes: function(options, callback) {
                options.command = "routeList";
                options.a = "sf-muni";
                request(options, function(data, textStatus, jqXHR) {
                    callback(parseRoutes($("body", data)));
                });
            },
            getRouteConfig: function(options, callback) {
                options.command = "routeConfig";
                options.a = "sf-muni";
                if (routeConfigs[options.r]) {
                    callback(routeConfigs[options.r]);
                } else {
                    request(options, function(data, textStatus, jqXHR) {
                        var routeConfig = parseRouteConfig($("route", data));
                        routeConfigs[options.r] = routeConfig;
                        callback(routeConfig);
                    });
                }
            }
        };
    }
    var api = {
        setBackend: setBackend,

        parsePredictions: parsePredictions,
        parseRouteConfig: parseRouteConfig,

        createMuniRides: createMuniRides,
        findSegments: findSegments,

        getSegments: getSegments

    };
    initialize();
    return api;
}();