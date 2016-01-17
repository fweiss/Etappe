Etappe is a browser app for planning a metro transit trip using one or more 
transit carriers. There are many strategies for creating an optimal trip. Some 
of the optimization criteria are:

* departure time
* arrival time
* number of layovers (transfers)
* trip duration
* layover duration
* transit carriers (allow/deny)
* fare cost
* ...and so on

Many transit carriers (agencies) publish route information and real-time
schedules via web service interfaces (APIs). Although there is a standard
protocol, it does not appear to provide the real time data this application
requires.

The key data structure is a trip. A trip has a origin place and a destination
place. It also may have an anchor time and anchor time mode. Thus, for example
a trip could depart the origin at a particular time or arrive at the destination
at a particular time. Currently, a trip starts now at the origin.

When a trip
is evaluated, it creates plans. Each plan is a sequence of segments, such that each
plan satisfies the trip, but may use different routes, stops, and vehicles. The
intention is that plans be optimized according to a strategy, which may be left
up to the user.

A key subordinate data structure of a segment is a ride. A ride provide concrete
instances which satisfy a segment, including details origin and destination time,
carrier, and vehicle id.

## Resources

http://www.bart.gov/schedules/developers/api

http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf

http://www.sflivebus.com/

## Developing

This project is developed using BDD and TDD. Protractor is used for BDD and Karma is used for TDD.

### Required toolchain

Node and npm are required for testing and running. The required dev dependencies are specified in the package.json file.

### Project setup

Run ``npm install`` to get and install the development tooling.

### BDD with Protractor and IntellIJ

The Protractor tests are not fully end-to-end because the data that would come from the transit servers varies over time.
A consistent test fixture is provided by Mountebank. Before running Protractor, start up Mountebank.
The Protractor tests inject the test fixtures into Mountebank. The Protractor ``beforeEach()`` function injects a mock module to
configure the back end service URL to the Mountebank imposter port on localhost.

Set up a node run configuration for Protractor. Initially, run it from the Run menu or toolbar.
After that, a run can be easily started with the Run button in the Run pane.

In keeping with BDD, a UI story is first expressed in Protractor. That way, the BDD red-green-refactor methodology can
be followed nicely.

Continuity with TDD: The author is still exploring the tradeoffs between top-down BDD and bottom-up TDD methodologies.
The emphasis has been on BDD because it addresses the user story much more directly that TDD. So far, TDD comes into play
when user stories demand new data models and services, or when an existing 'ad-hoc' solution demands refactoring of the
code. The BDD cycle time is of course slower than TDD. The TDD tests are taking less than a second, while the BDD tests
in the Chrome browser are taking about 7 seconds.

Manually testing should be done periodically to ensure the UX is reasonable. However, whenever JavaScript errors are encountered
in manually testing, the error should immediately be exercised in Protractor. For example, there was an Angular injector
error due to a missing script tag. By adding an Angular exception handler, the Protractor run was made red. Then the
missing script tag was added to index.html to make the test green.

When manual testing exposes UX issues, they may or may not involve BDD or TDD. For example, if it's necessary to rearrange
the DOM or add CSS classes to DOM elements, should changes should first be added to BDD tests. However, changes to the CSS would be
manually tested changes.

### IntelliJ

server run configuration (Node)
mountebank required for protractor
protractor
karma unit tests

protractor tricks for running in jenkins
selenium driver jar issue
node ./node_modules/protractor/bin/webdriver-manager update

