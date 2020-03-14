# Test Driven Development (TDD)
Following is a scenario demonstrating the process of TDD for this project.

In this description, we'll use the following bold kewords to indicate milestones during this TDD session.
* **RED** indicates running the test and getting a failure status.
* **GREEN** indicates running the test and getting a passing status.
* **COMMIT** indicates a local commit for significant improvement
* **REFACTOR** indicates taking an opportunity to make the code better

## Example : Add a new domain object 'Agency'
This will reduce coupling by removing the controller dependencies on sfmuni and bart.

Getting started:
1. Create a new file agency-test.js
1. Fill in a skeleton unit test

Note the structure of the spec:

> domain agency > create > validation error > when no name

(see rides-test.js, fix segment-test.js)
```
describe('domain agency', function() {
    describe('create', function() {
        describe('validation error', function() {
            it('when no name', function() {
                expect(1).toBe(0);
            });
        });
    });
});
```

try contrstructur

new failing skeleton with spec structure

**RED**

add an expection
write it natural way (this is TDD)

**RED** ``Expected function to throw Error: createAgency: must specify agency name, but it threw ReferenceError: Agency is not defined``
That's OK, now we know what needs to be implemented. This is a very importany step, as we never write implementation excpet to make GREEN.
this way every line of code we write is tested.
```
            it('when no name', function() {
                  expect(function() { Agency.createAgency(); }).toThrow(expectedException('must specify agency name'));
              });
```
so now we add agancy and write just enought to go green
try
```
angular.module('plan')
.service(agency, function() {
    return {
        createAgency: function() {}
    }
});
```
**RED** - same error as before Agancy not defined
well, we will need to inject for the unit test add
```
describe('domain agency', function() {
    var Agency;

    beforeEach(module('plan'));
    beforeEach(inject(function(agency) {
        Agency = agency;
    }));
    ...
```
**RED** - Expected function to throw an exception.
well that's OK, we're working incrementally
so just add the throw - fake it!
```
        createAgency: function() {
            throw new Error('createAgency: name required')
        }
```

We know createAgency is going to be more than this, but incremaentally

**RED** - Expected function to throw Error: createAgency: must specify agency name, but it threw Error: createAgency: name required.
Well, this happens in TDD, the actual error message is a bit arbitrary. In the expect we wrote one thing and in the imple we wrote another.
This provide a break to determine which one to use. Us a standard patter or use a regexp, if you need to broaden to expect
options:
- soemting required
- when no something
think of this in terma s of the spec report
We chose when no something
so fix the test
``                expect(function() { Agency.createAgency(); }).toThrow(expectedException('no agency name'));
``
**RED** - Expected function to throw Error: createAgency: no agency name, but it threw Error: createAgency: name required.
then fix the service
``            throw new Error('createAgency: no agency name')
``

**GREEN**
COMMIT
we could commit at this point, as we have 1) a green 2) a slice of usefull behavior
The message can also describe why we're adding agency

> Important, do not refactor before the commit. The commit provides s way to revert back to green if the refactor get tangled.

We should turn back to what are we trying to do.
the minimum is to have a name we can display in the UI and a api property for the backend.
lets' start with the name in the consrtuctor
```
        describe('value', function() {
            it('is type Agency', function() {
                const agency = Agency.createAgency('a1');
                expect(agency.constructor.name).toBe('Agency');
            })
        });

```

**RED** - Error: createAgency: no agency name
well, even though we passed a name, the implementation is just faking an exception to meet our first expectation
so lets mod the createAgency method to meet the new expect and the old one too
we  use ths simplist and us underscare to help
```
        createAgency: function(name) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
        }
```
**RED** - TypeError: Cannot read property 'constructor' of undefined
well, our createAgency is stiull pretty naive, so lets add a bit
diwcuss the pattern
```
.service('agency', function() {

    function Agency() {
    }

    return {
        createAgency: function(name) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            return new Agency();
        }
    }
});
```

again, just the slimest code to get gree
**GREEN**
COMMIT
but we really don't have a name yet, so lets add that the the value section
so let's add
```
            it('has name', function() {
                const agency = Agency.createAgency('a2');
                expect(agency.getName()).toBe('a2');
            });

```
note that we used a differnt name, just in case the name was fake in the imple

**RED** - TypeError: agency.getName is not a function

OK, let's roll up our sleves and add the getter.
Note how we don't add a getter until we have a getter test that's red
```
    Agency.prototype.getName = function() {
        return this.name;
    }
```
Of course this is not enough, but we did get the previosu error resolved.
so more sleeves
```
    function Agency(name) {
        this.name = name
    }
```
and also in ``creatAgency``, add the name to the constructor:
```
       createAgency: function(name) {
            if (_.isEmpty(name)) {
                throw new Error('createAgency: no agency name')
            }
            return new Agency(name);
        }

```
**GREEN**
COMMIT - we added the name getter, yeah!
Let's review the test cases so far:
```
describe('domain agency', function() {
    var Agency;

    beforeEach(module('plan'));
    beforeEach(inject(function(agency) {
        Agency = agency;
    }));

    describe('create', function() {
        describe('validation error', function() {
            function expectedException(message) {
                return new Error('createAgency: ' + message);
            }
            it('when no name', function() {
                expect(function() { Agency.createAgency(); })
                .toThrow(expectedException('no agency name'));
            });
        });
        describe('value', function() {
            it('is type Agency', function() {
                const agency = Agency.createAgency('a1');
                expect(agency.constructor.name).toBe('Agency');
            });
            it('has name', function() {
                const agency = Agency.createAgency('a2');
                expect(agency.getName()).toBe('a2');
            });
        });
    });
});

```
We now have three feature implemented (each 'it' clause). 
* Each is valuable towards the goal.
* Each has been developed via TDD so code coverage is 100%

> maybe you'd like to check it this point?
> hmm, not workingm, screen shot would be nice

We also need the api so let's first add a validator

**GREEN** always a good proctice to check before adding a new feature!
```
          it('when no api', function() {
                expect(function() { Agency.createAgency('a3'); })
                .toThrow(expectedException('no api'));
            });

```

**RED** - Expected function to throw an exception.  
Add the test
```
            if (_.isUndefined(api)) {
                throw new Error('createAgency: no api')
            }
 ```
 **RED** - Error: createAgency: no api  
 This is in two places, in describe 'value'
 let's add the extra constructor param, in two places
 ```
                 const agency = Agency.createAgency('a1', {});
```
Note that this is a fake input here, just trying to get back to green

**GREEN**
COMMIT
but we just may have add code debt, dulicae in the test,m so let's be sanity
REFACTOR
for describe value, we can use a common fixture
```
            var agency;
            beforeEach(function() {
                agency = Agency.createAgency('a1', {});
            });
``
and we go back and use a common name
GREEN
COMMIT refactor remove duplicate code
one cool thing is we can commit very safely (local) as we're keeping in GREEN
but that was only te validator, let's get back to the value imp
```
            it('has api', function() {
                expect(agency.getApi()).toBe({});
            });
```
maybe {} is not brillinat, but it the simplest contract we can think of now
RED - TypeError: agency.getApi is not a function
so off the the getter, add a prototype, add params in the function and in createAgency
```
        describe('value', function() {
            var agency;
            var api;
            beforeEach(function() {
                api = {};
                agency = Agency.createAgency('a1', api);
            });
            it('is type Agency', function() {
                expect(agency.constructor.name).toBe('Agency');
            });
            it('has name', function() {
                expect(agency.getName()).toBe('a1');
            });
            it('has api', function() {
                expect(agency.getApi()).toBe(api);
            });
        });
```
we had to do a bit test refactoring to get the object compare to work
GREEN
COMMIT - add api to object
we can review the service and see it's quite succinct.
the test has five assertion. think about them are they essential?
- needs a name
- needs an api
- is type Agency
- has name
- has api
also note how the spec report describes this exactly!
stats LOC
service: 25
test: 39
next we want to add a collection function
it will be provided by a configuration to the service
```
```
RED - TypeError: Agency.getAll is not a function
ok, so write the getter and return a fake value
```
        getAll: function() {
            return [ new Agency('a4, {}') ];
        }
```
GREEN
note how if we left off the parms, an erro would be thrown
well, actual             return [ new Agency('a4, {}') ];
 is incorrect. lets; try the create methos
 ```
             return [ this.createAgency('a4, {}') ];

 ```
 RED - Error: createAgency: no api
 ok, lets; fix that
 ```            return [ this.createAgency('a4', {}) ];
```
GREEN
time to commit? ech, we haven't reall gotten sometwher
```
            expect(agencies[0].name).toBe('remarkable');
```
we're chainin expects here - jusdgement call
RED - Expected 'a4' to be 'remarkable'
so now we want to create an injectibe config fixture





Refactor: extract common exception helper
``
           function expectedException(message) {
                return new Error('createAgency: ' + message);
            }

 ``
GREEN


