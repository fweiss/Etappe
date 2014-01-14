var etappe = function() {
    /**
     * find the next departure in prediction1 and match it up
     * with the corresponding arrival in prediction2, based on
     * matching vehicle id. return the datetime for the end
     * of the leg.
     */
    function strategy1(prediction1, prediction2) {
        var datetime;
        var vehicle = prediction1.directions[0].predictions[0].vehicle;
        var destPrediction;
        for (var i=0; i<prediction2.directions[0].predictions.length; i++) {
            var prediction = prediction2.directions[0].predictions[i];
            if (prediction.vehicle == vehicle) {
                destPrediction = prediction;
            }
        }
        if (destPrediction) {
            datetime = destPrediction.datetime;
        }
        return datetime;
    }
    /**
     * get muni predictions, find end time, get bart prediction
     * 
     * This is or is like a Reactor Pattern in that it dispatches some
     * asynchronous operations, synchronizes their results, etc. The effect is
     * that the client does not know the details of the synchronization.
     * 
     * TODO: generalize the strategy, probably by adding a command parameter
     * to specify the route that is to be optimized. 
     */
    function strategy2(callback) {
        var predictions1;
        var predictions2;
        sfmuni.getPredictions({ stopId: 14076 }, function(predictions) {
            predictions1 = predictions;
            predictionsUpdated();
        });
        sfmuni.getPredictions({ stopId: 13292 }, function(predictions) {
            predictions2 = predictions;
            predictionsUpdated();
        });
        function predictionsUpdated() {
            if (predictions1 && predictions2) {
                var datetime = etappe.strategy1(predictions1, predictions2);
                bart.getSchedule({ cmd: "depart", orig: "16TH", dest: "MONT", b: 0, a: 4, time: datetime }, function(schedule) {
                    callback({
                        predictions1: predictions1,
                        predictions2: predictions2,
                        schedule: schedule,
                        transferDatetime: datetime
                    });
                });
           }
        }
    }
    /**
     * start with bart and try to minimize layout to sfmuni
     */
    function strategy3(callback) {
        var schedule1;
        var predictions1;
        var predictions2;
        bart.getSchedule({ cmd: "depart", orig: "MONT", dest: "16TH", b: 0, a: 4 }, function(schedule) {
            schedule1 = schedule;
            scheduleUpdated();
        });
        function scheduleUpdated() {
            sfmuni.getPredictions({ stopId: 15552, r: "33" }, function(predictions) {
                predictions1 = predictions;
                predictionsUpdated();
            });
            sfmuni.getPredictions({ stopId: 14075, r: "33" }, function(predictions) {
                predictions2 =  predictions;
                predictionsUpdated();
            });
        }
        function predictionsUpdated() {
            if (predictions1 && predictions2) {
                callback({
                    schedule: schedule1,
                    predictions1: predictions1,
                    predictions2: predictions2
                });
            }
        }
    }
    // find bart to muni using muni segments
    function strategy4(callback) {
        var schedule1;
        var predictions1;
        var predictions2;
        bart.getSchedule({ cmd: "depart", orig: "MONT", dest: "16TH", b: 0, a: 4 }, function(schedule) {
            schedule1 = schedule;
            scheduleUpdated();
        });
        function scheduleUpdated() {
            findSegments({ route: 33, orig: 15552, dest: 14075}, segmentsUpdated);
        }
        function segmentsUpdated(segments) {
            callback({
                schedule: schedule1,
                segments: segments
            });
        }
    }
    /**
     * This is a more advanced startegy that returns a trip object. A trip is
     * an origin<place>, destination<place>, anchorTime, and a list of plans
     * Each plan satisfies the trip. A plan is a list of rides. Each ride
     * has a wait time and a reference to a segment. A segment abstracts the
     * ability of a route to provide a ride.
     * 
     * Strategy: bart to muni, minimize transfer time.
     */
    function strategy5(callback) {
        var schedule1;
        var segments1;
        bart.getSchedule({ cmd: "depart", orig: "MONT", dest: "16TH", b: 0, a: 4 }, function(schedule) {
            schedule1 = schedule;
            scheduleUpdated();
        });
        function scheduleUpdated() {
            findSegments({ route: 33, orig: 15552, dest: 14075}, function(segments) {
            segments1 = segments;
            segmentsUpdated();
        });
        }
        function segmentsUpdated() {
            var trip = {};
            trip.origin = "bart:MONT";
            trip.destination = "sfmuni:14075";
            trip.segments = [];
            trip.segments.push(segments1);
            //var anchorTime = Date();
            trip.originTime = new Date();
            trip.plans = [];
            for (var i=0; i<schedule1.trips.length; i++) {
                var waitBeginTime = new Date();
                var ride1 = {};
                ride1.segment = bartTrip2Segment(schedule1.trips[i]);
                ride1.waitDuration = Math.floor((ride1.segment.originTime - waitBeginTime) / 60000);
                if (ride1.waitDuration < 1) {
                    continue;
                }
                waitBeginTime = ride1.segment.destinationTime;
                for (var j=0; j<segments1.list.length; j++) {
                    var segment = segments1.list[j];
                    if (segment.originTime > ride1.segment.destinationTime) {
                        var ride2 = {};
                        ride2.segment = segment;
                        ride2.waitDuration = Math.floor((ride2.segment.originTime - waitBeginTime) / 60000);
                        
                        var plan = {};
                        plan.rides = [];
                        plan.rides.push(ride1);
                        plan.rides.push(ride2);
                        plan.destinationTime = ride2.segment.destinationTime;
                        trip.plans.push(plan);
                    }
                }
            }
            trip.plans.sort(function(plan1, plan2) {
                return plan1.rides[1].waitDuration - plan2.rides[1].waitDuration;
            });
            callback(trip);
        }
    }
    function bartTrip2Segment(trip) {
        // annunciator map SFIA/Milbrae -> SFO AIRPORT
        function bartVehicle(route, direction) {
            var p1 = route.indexOf(" - ");
            return (p1 > -1) ? route.substring(p1 + 3) : route;
        }
        segment = {};
        segment.carrier = "bart";
        var route = bart.findRoute(trip.legs[0].line);
        segment.route = route.abbr;
        segment.vehicle = bartVehicle(route.name);
        segment.origin = { id: trip.origin, name: trip.origin, abbr: trip.origin };
        segment.destination = { id: trip.destination, name: trip.destination, abbr: trip.destination };
        segment.originTime = trip.origDatetime;
        segment.destinationTime = trip.destDatetime;
        return segment;
    }
    function strategy7(options, callback) {
        var trip = {};
        trip.segments = [];
        var segment = {};
        segment.agency = 'sfmuni';
        segment.origin = 'origin';
        segment.destination = 'destination';
        segment.list = [];
        var ride = {};
        ride.route = 'route';
        ride.vehicle = 'vehicle';
        ride.originTime = new Date();
        ride.destinationTime = new Date(ride.originTime.getTime() + 3 * 60 * 1000);
        // s/b rides, not list
        segment.list.push(ride);
        trip.segments.push(segment);
        trip.segments.push(segment);
        callback(trip);
    }
    function strategy6(options, callback) {
        options.origin = "muni:14076";
        options.destination = "bart:mont";
        function getPlan() {
            console.log(options);
            return options.trip.routes[options.direction];
        }
        var trip = {};
        var strategies = {
            outbound: function(options, callback) { // muni segments, bart segments, plans
                var subroutes = getPlan();
                var segments0;
                var segments1;
                getSegments(subroutes[0], function(segments) {
                    segments0 = segments;
                    var t;
                    for (var i=0; i<segments.list.length; i++) {
                        if ( ! t)
                            t = segments.list[i].destinationTime;
                    }
                    subroutes[1].startTime = t;
                    getSegments(subroutes[1], function(segments) {
                        segments1 = segments;
                        segmentsUpdated();
                    });
                });
                function segmentsUpdated() {
                    if (segments0 && segments1) {
                        var segments = [];
                        segments.push(segments0);
                        segments.push(segments1);
                        trip.segments = segments;
                        callback(trip);
                    }
                }
            }, 
            inbound: function(options, callback) {  // bart segments, muni segments, plans
                var subroutes = getPlan();
                var segments0;
                var segments1;
                getSegments(subroutes[0], function(segments) {
                    segments0 = segments;
                    getSegments(subroutes[1], function(segments) {
                        segments1 = segments;
                        segmentsUpdated();
                    });
                });
                function segmentsUpdated() {
                    if (segments0 && segments1) {
                        var segments = [];
                        segments.push(segments0);
                        segments.push(segments1);
                        trip.segments = segments;
                        callback(trip);
                    }
                }

            }
        };
        try {
            strategies[options.direction](options, callback);
        }
        catch (e) {
            alert(e);
        }
        // find segments for given carrier, stops, time
        function template1() {
        }
        // find sequence of segment lists for given subroute
        function getSegments(subroute, callback) {
            var adaptor = getCarrierAdaptor(subroute.carrier);
            adaptor.getSegments(subroute, callback);
        }
        // find sequence of subroutes for given endpoints and direction
        function getSubroutes(options) {
            // directions, time, origin, destination
            return {
                outbound: [
                    { carrier: "sfmuni", route: "33", origin: "14076", destination: "13292" },
                    { carrier: "bart", route: "1", origin: "16TH", destination: "MONT" }
                ],
                inbound: [
                    { carrier: "bart", route: "1", origin: "MONT", destination: "16TH" },
                    { carrier: "sfmuni", route: "33", origin: "15552", destination: "14075" }
                ]
            }[options.direction];
        }
    }
    /**
     * Get an 
     */
    function getCarrierAdaptor(carrier) {
        var adaptors = {
            sfmuni: {
                getSegments: function(subroute, callback) {
                    var options = {};
                    options.route = subroute.route;
                    options.orig = subroute.origin;
                    options.dest = subroute.destination;
                    findSegments(options, callback);
                }
            },
            bart: {
                getSegments: function(subroute, callback) {
                    var startTime = subroute.startTime || new Date();
                    bart.getSchedule({ cmd: "depart", orig: subroute.origin, dest: subroute.destination, b: 0, a: 4, time: startTime }, function(schedule) {
                        var segments = {};
                        segments.agency = "bart";
                        segments.origin = subroute.origin;
                        segments.destination = subroute.destination;
                        segments.list = [];
                        for (var i=0; i<schedule.trips.length; i++) {
                            var segment = bartTrip2Segment(schedule.trips[i]);
                            segments.list.push(segment);
                        }
                        callback(segments);
                    });
                }
            }
        };
        return adaptors[carrier];
    }
    function findSegments(options, callback) {
        var route = options.route; //"33";
        var origStop = options.orig; //14076;
        var destStop = options.dest; //13292;
        // FIXME: check if stops and route make sense
        var predictions1;
        var predictions2;
        var routeConfig;
        sfmuni.getRouteConfig({r: route }, function(rc) {
            routeConfig = rc;
            predictionsUpdated();
        });
        sfmuni.getPredictions({ stopId: origStop }, function(predictions) {
            predictions1 = predictions;
            predictionsUpdated();
        });
        sfmuni.getPredictions({ stopId: destStop }, function(predictions) {
            predictions2 = predictions;
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
            var segments = createMuniRides('1', predictions1, predictions2, routeConfig);
            callback(segments);
        }
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
        rides.origin = direction + departurePredictions.stopTag;
        rides.destination = direction + arrivalProdictions.stopTag;
        rides.list = [];
        for (var ii=0; ii<departurePredictions.directions.length; ii++) {
            var direction1 = departurePredictions.directions[ii];
        for (var i=0; i<direction1.predictions.length; i++) {
            var prediction1 = direction1.predictions[i];
            for (var jj=0; jj<arrivalProdictions.directions.length; jj++) {
                var direction2 = arrivalProdictions.directions[jj];
            for (var j=0; j<direction2.predictions.length; j++) {
                var prediction2 = direction2.predictions[j];
                if (prediction2.vehicle == prediction1.vehicle) {
                    var segment = {};
                    segment.originTime = prediction1.datetime;
                    segment.destinationTime = prediction2.datetime;
                    segment.carrier = "sfmuni";
                    segment.route = departurePredictions.routeTag;
                    segment.vehicle = prediction1.vehicle;
                    segment.origin = { id: 0, name: "", abbr: 'zzz'}; //getStop(rides.origin).title };
                    segment.destination = { id: "16TH", name: "16th", abbr: "16th Street" };
                    rides.list.push(segment);
                }
            }}
        }}
        return rides;
    }
    var api = {
        strategy1: strategy1,
        strategy2: strategy2,
        strategy3: strategy3,
        strategy4: strategy4,
        strategy5: strategy5,
        strategy6: strategy6,
        strategy7: strategy7,
        findSegments: findSegments,
        createMuniRides: createMuniRides
    };
    return api;
}();