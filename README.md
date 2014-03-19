Etappe is a browser app for planning a metro transit trip using one or more 
transit carriers. There are many strategies for creating an optimal trip. Some 
of the optimization criteria are:

departure time
arrival time
number of layovers (transfers)
trip duration
layover duration
transit carriers (allow/deny)
fare cost
...and so on

Many transit carriers (agencies) publish route information and real-time
schedules via web service interfaces (APIs). Although there is a standard
protocol, it does not appear to provide the real time data this application
requires.

The key data structure is a trip. A trip has a origin place and a destination
place. It also may have an anchor time and anchor time mode. Thus, for example
a trip could depart the origin at a particular time or arrive at the destination
at a particular time. Currently, a trip starts now at the origin. When a trip
is evaluated, it creates plans. Each plan is a sequence of rides, such that each
plan satisfies the trip, but may use different routes, stops, and vehicles. The
intention is that plans be optimized according to a strategy, which may be left
up to the user.

A key subordinate data structure is a segment or subroute. This abstracts the
time factor from a ride, or conversly specifies the prototype for a ride.