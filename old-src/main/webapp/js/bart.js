/**
 * A singleton/static adapter to the BART API
 * http://api.bart.gov/docs/overview/index.aspx
 * 
 * Responsibilities:
 * 1. BART API endpoint, api key, commands
 * 2. Parse BART API XML response to JS object graph (I hate to say "JSON" here)
 * 
 * Future: normalize datetime, implement a yet to be defined interface that
 * would provide a common api abstraction, such as for datetime, routes, stops.
 * 
 * It's very much a DAO/OXM pattern, where methods/commands/parameters are
 * translated first to the BART API and then the BART API XML response is
 * translated to a JS object graph.
 * 
 * TODO: define the object graphs
 */
var bart = function() {
    var backend;
    var cachedRoutes;
    function initialize() {
        backend = {
            getEtd: function(options, callback) {
                options.uri = "/api/etd.aspx";
                options.cmd = "etd";
                request(options, function(data, textStatus, jqXHR) {
                    callback(parseEtd(data));
                });
            },
            getSchedule: function(options, callback) {
                options.uri = "/api/sched.aspx";
                if (options.time && options.time instanceof Date) {
                    options.time = convertFromDate(options.time);
                }
                request(options, function(data, textStatus, jqXHR) {
                    var schedule = parseSched(data);
                    // inject arrive/depart, since BART API response doesn't say
                    schedule.cmd = options.cmd;
                    callback(schedule);
                });
            },
            getStations: function(options, callback) {
                options.uri = '/api/stn.aspx';
                options.cmd = 'stns';
                request(options, callback);
            },
            getRouteInfo: function(options, callback) {
                options.uri = '/api/route.aspx';
                options.cmd = 'routeinfo';
                options.route = 'all';
                options.date = 'today';
                request(options, callback);
            }
        };
    }
    function convertToDate(date, time) {
        var datetime = new Date();
        datetime.setTime(Date.parse(date + " " + time));
        return datetime;
    }
    // BART API expects time=h:mm+am/pm
    function convertFromDate(date) {
        var hours = date.getHours();
        return (hours % 12) + ":" + date.getMinutes() + (hours < 12 ? " am" : " pm");
    }
    function parseEtd(data) {
        var etdx = {};
        etdx.estimates = [];
        $("station etd estimate", data).each(function() {
            var etd = {};
            etd.minutes = $(this).find("minutes").text();
            etdx.estimates.push(etd);
        });
        return etdx;
    }
    function parseRoutes(data) {
        var routes = [];
        $("routes route", data).each(function() {
            var route = {};
            route.name= $(this).find("name").text();
            route.abbr = $(this).find("abbr").text();
            route.routeID = $(this).find("routeID").text();
            route.number = $(this).find("number").text();
            route.color = $(this).find("color").text();
            route.config = [];
            $('config station', this).each(function() {
                route.config.push($(this).text());
            });
            routes.push(route);
        });
        return routes;
    }
    function parseStations(data) {
        var stations = [];
        $('stations station', data).each(function() {
            var station = {};
            station.name = $(this).find('name').text();
            station.id = $(this).find('abbr').text();
            station.lat = $(this).find('gtfs_latitude').text();
            station.lon = $(this).find('gtfs_longitude').text();
            stations.push(station);
        });
        return stations;
    }
    function findRoute(routeID) {
        for (var i=0; i<routes.length; i++) {
            var route = routes[i];
            if (route.routeID == routeID) {
                return route;
            }
        }
    }
    function parseSched(data) {
        var sched = {};
        sched.origin = $(data).find("origin").text();
        sched.destination = $(data).find("destination").text();
        sched.trips = [];
        $("schedule request trip", data).each(function() {
            var trip = {};
            trip.origin = $(this).attr("origin");
            trip.destination = $(this).attr("destination");
            trip.fare = $(this).attr("fare");
            trip.origTimeMin = $(this).attr("origTimeMin");
            trip.origTimeDate = $(this).attr("origTimeDate");
            trip.origDatetime = convertToDate(trip.origTimeDate, trip.origTimeMin);
            trip.destTimeMin = $(this).attr("destTimeMin");
            trip.destTimeDate = $(this).attr("destTimeDate");
            trip.destDatetime = convertToDate(trip.destTimeDate, trip.destTimeMin);
            trip.legs = [];
            $("leg", $(this)).each(function() {
                var leg = {};
                leg.order = $(this).attr("order");
                leg.transfercode = $(this).attr("transfercode");
                leg.origin = $(this).attr("origin");
                leg.destination = $(this).attr("destination");
                leg.origTimeMin = $(this).attr("origTimeMin");
                leg.origTimeDate = $(this).attr("origTimeDate");
                leg.destTimeMin = $(this).attr("destTimeMin");
                leg.destTimeDate = $(this).attr("destTimeDate");
                leg.line = $(this).attr("line");
                leg.bikeflag = $(this).attr("bikeflag");
                leg.trainHeadStation = $(this).attr("trainHeadStation");
                trip.legs.push(leg);
            });
            sched.trips.push(trip);
        });
        return sched;
    }
    /**
     * Make a HTTP GET request to the BART API with the given options and
     * invoke the given callback as like jQuery.ajax(xml).
     * This method's aspect is to define the host, BART API key, and response
     * data type as XML.
     */
    function request(options, callback) {
        options.key = "MW9S-E7SL-26DU-VV8V"; // public key, please play nice!
        $.ajax("http://api.bart.gov" + options.uri, {
            data: options,
            dataType: "xml",
            success: callback
        });
    }
    function init() {
        initialize();
        // should synchronize?
        api.getRoutes({}, function() {});
    }
    var api = {
        getEtd: function(options, callback) {
            backend.getEtd(options, callback);
        },
        getSchedule: function(options, callback) {
            backend.getSchedule(options.callback);;
        },
        getStations: function(options, callback) {
           backend.getStations(options, function(data) {
               var stations = parseStations(data);
               callback(stations);
           });
        },
        getRoutes: function(options, callback) {
            if (cachedRoutes) {
                callback(cachedRoutes);
            }
            backend.getRouteInfo(options, function(data) {
                cachedRoutes = parseRoutes(data);
                callback(cachedRoutes);
            });
        },
        findRoute: findRoute,
//        getStations: parseStations,
        setBackend: function(_backend) {
            backend = _backend
        },
        findSegments: function(origin, destination) {
            var segments = [];
            var commonRoutes = _.filter(cachedRoutes, function(route) {
                var originIndex = _.indexOf(route.config, origin);
                var destinationIndex = _.indexOf(route.config, destination);
                return originIndex !== -1 && destinationIndex !== -1 && originIndex < destinationIndex;
            });
            _.each(commonRoutes, function(route) {
                var segment = {};
                segment.orginStation = origin;
                segment.destinationStation = destination;
                segment.carrier = 'bart';
                segment.routeNumber = route.number;
                segment.routeName = route.name;
                segments.push(segment);
            });
            return segments;
        }
    };
    init();
    return api;
}();