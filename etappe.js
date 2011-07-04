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
            trip.orgin = "bart:MONT";
            trip.destination = "sfmuni:14075";
            //var anchorTime = Date();
            trip.plans = [];
            for (var i=0; i<schedule1.trips.length; i++) {
                var waitBeginTime = new Date();
                var ride1 = {};
                ride1.segment = bartTrip2Segment(schedule1.trips[i]);
                ride1.waitDuration = Math.floor((ride1.segment.originTime - waitBeginTime) / 60000);
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
                        trip.plans.push(plan);
                    }
                }
            }
            callback(trip);
        }
        function bartTrip2Segment(trip) {
            segment = {};
            segment.carrier = "bart";
            segment.route = bart.findRoute(trip.legs[0].line).abbr;
            segment.vehicle = trip.route;
            segment.orgin = trip.origin;
            segment.destination = trip.destination;
            segment.originTime = trip.origDatetime;
            segment.destinationTime = trip.destDatetime;
            return segment;
        }
    }
    function findSegments(options, callback) {
        var route = options.route; //"33";
        var origStop = options.orig; //14076;
        var destStop = options.dest; //13292;
        // FIXME: check if stops and route make sense
        var predictions1;
        var predictions2;
        sfmuni.getPredictions({ stopId: origStop }, function(predictions) {
            predictions1 = predictions;
            predictionsUpdated();
        });
        sfmuni.getPredictions({ stopId: destStop }, function(predictions) {
            predictions2 = predictions;
            predictionsUpdated();
        });
        function predictionsUpdated() {
            if (predictions1 && predictions2) {
                result();
            }
        }
        function result() {
            var segments = {};
            segments.agency = "sfmuni";
            segments.origin = origStop;
            segments.destination = destStop;
            segments.list = [];
            for (var i=0; i<predictions1.directions[0].predictions.length; i++) {
                var prediction1 = predictions1.directions[0].predictions[i];
                for (var j=0; j<predictions2.directions[0].predictions.length; j++) {
                    var prediction2 = predictions2.directions[0].predictions[j];
                    if (prediction2.vehicle == prediction1.vehicle) {
                        var segment = {};
                        segment.originTime = prediction1.datetime;
                        segment.destinationTime = prediction2.datetime;
                        segment.carrier = "sfmuni";
                        segment.route = route;
                        segment.vehicle = prediction1.vehicle;
                        segment.origStop = {};
                        segment.destStop = {};
                        segments.list.push(segment);
                    }
                }
            }
            callback(segments);
        }
    }
    var api = {
        strategy1: strategy1,
        strategy2: strategy2,
        strategy3: strategy3,
        strategy4: strategy4,
        strategy5: strategy5,
        findSegments: findSegments
    };
    return api;
}();