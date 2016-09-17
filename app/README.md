use cases

I want to so that

select an origin and a destination, define a trip
see the upcoming rides, pick a time to start
see the wait times, optimize time at which to start
see destination times, estimate time at which to complete
see the street names, get oriented spatially
see the routes names, pick the right ride
refresh the timetable, keep up to date
see the time ticks, get oriented temporally

save a trip, use it again later
save several trips, go different places
see saved trips, select appropriate on
select saved trip, see current timetable

select a carrier, DEFER

domain model

origin, destination
trip
start. end
ride
street name
orient spatially
route name
timetable
up to date, current
time ticks
orient temporally
places
saved trip

trip[name, origin, destination, waypoints]
waypoint[name, lat, lon]
trip < leg
leg[origin, destination]
itinerary[start, end, trip]
itinerary < segment
segment[origin, destination]
segment < ride
ride[start, end, originStop, destinationStop, agency, route, vehicle]
stop[name, agency, route, lat, lon]
route[name, agency]
route < stop
route < segment
system < agency < route < stop
system < nexus
nexus[waypoint]
nexus < stop

a system has a set of nexuses
a nexus aggregates stops

the segments of an itinerary match the legs of a trip
a waypoint is roughly coincident with a stop
a segment is part of both a route and an itinerary
a leg is invariant within a trip (new trip to change legs)
a segment is invariant within an itinerary
a segment is invariant with a route (mostly)
rides within an itinerary can be refreshed






