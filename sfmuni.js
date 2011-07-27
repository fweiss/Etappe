var sfmuni = function() {
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
     * @param data the jQuery.ajax data
     * @return a Predictions object
     * */
    function parsePredictions(data) {
        var predictions = {
            directions: [],
            messages: []
        };
        predictions.agencyTitle = $(data).attr("agencyTitle");
        predictions.routeTitle = data.attr("routeTitle");
        predictions.stopTitle = $(data).attr("stopTitle");
        predictions.stopTag = $(data).attr("stopTag");
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
    var api = {
        getPredictions: function(options, callback) {
            options.command = "predictions";
            options.a = "sf-muni";
            request(options, function(data, textStatus, jqXHR) {
                callback(parsePredictions($("predictions", data)));
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
    return api;
}();