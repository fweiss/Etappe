# Etappe

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

### Toolchain setup
Node and npm are required for testing and building. You will need the latest versions. Current development uses:

- node v6.10.3
- npm 3.10.10

The remaining toolchain is specified in the package.json file. Install by running:

``npm update``

One more step required for protractor is to install the webdriver manager:

``node ./node_modules/protractor/bin/webdriver-manager update``

It is assumed you already have the latest web browsers installed. Most of the development has been with Chrome browser.

### Running tests from command line
The unit tests and integration tests can be run from the command line.
I tend to run the test in IntelliJ, because the workflow is easier in the IDE.

The unit tests are run with Karma.
There is a script in the ``package.json`` file to simplify this.
Just run:

``npm test``

The karma configuration invokes the spec reporter, so you'll see a nice summary of the tests in the command output.

Running the Protractor integration tests from the command line is a bit more complex.
Three command line terminal windows are required to run: 1) the web server, 2) the Mountebank server, 3) the Protractor tests.

In the first terminal window, run the web server:

``npm start``

In the second terminal window, run Mountebank:

``npm run mountebank``

In the third terminal window, run the Protractor tests:

``npm run protractor``

Protractor also produces a spec summary of the tests, similar to the unit tests.

### IntelliJ setup
If you are using IntelliJ, here are some additional setup steps for running the tests within the IDE.

#### Plugins
IntelliJ has plugins which make TDD with Karma and Protractor highly productive.
Install Karma plugin

The IntelliJ Karma plugin makes Javascript testing really nice. First make sure you have the Karma plugin installed.
If not, it's easy to do:

Preferences > Plugins > Install Jetbrains plugin. Navigate to and select the Karma plugin. Click Install and restart.

#### Run configurations
Once you have installed the plugins setup the following run configurations:

- karma unit tests
- server run configuration (Node)
- mountebank required for protractor
- protractor

protractor tricks for running in jenkins
selenium driver jar issue

#### Running the tests
Launch each of the four tools and pin them in the Run window. This includes the web server and mountebank, which will
be always running. Run the Karma unit test or the Protractor E2E tests by selecting the tab and clicking the run button.

### Create a Karma run configuration
Enter name, config file (it finds it), browser (start with Chrome)

Test environment

run configrations for:

- karma for unit testing
- protractor (requires http server and mountebank)

### IntelliJ run configurations
details here
karma, http server, mountebank, protractor

###

Http server, new run configuration, node, javascript=node_modules/http-server

Then you can go to http://localhost:8080/app/index.html

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

Manual testing should be done periodically to ensure the UX is reasonable. However, whenever JavaScript errors are encountered
in manual testing, the error should immediately be exercised in Protractor. For example, there was an Angular injector
error due to a missing script tag. By adding an Angular exception handler, the Protractor run was made red. Then the
missing script tag was added to index.html to make the test green.

When manual testing exposes UX issues, they may or may not involve BDD or TDD. For example, if it's necessary to modify
the DOM or add CSS classes to DOM elements, the changes should first be added to BDD tests. When other changes are made
to the DOM, use protractor for regression testing. However, changes to the CSS would be
manually tested changes.

## Links and References
Really good article about the who, why, and how of testing: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html

How to mock providers: http://www.syntaxsuccess.com/viewarticle/how-to-mock-providers-in-angular

## FAQ
Here are some issues that may arise during development, testing, and usage.

### Protractor: No Selenium web driver
This is likely due to not installing the webdriver manager. Refer to the toolchain setup section for instructions.

### Create trip: no rides are shown
Currently the app does not validate that routes or rides exist between one chosen waypoint and the next.
