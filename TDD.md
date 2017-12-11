outline:

propose a new class
### Example TDD
Need add a new domain model, Agency. This will remove the controller dependencies on sfmuni and bart.
1. create a new agency-test.js
1. fill in a skeleton unit test

note structure spec
domain agency > create > validation error > when no name
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
RED
add an expection
write it natural way (this is TDD)
RED ``Expected function to throw Error: createAgency: must specify agency name, but it threw ReferenceError: Agency is not defined``
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
RED - same error as before Agancy not defined
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
RED - Expected function to throw an exception.
well that's OK, we're working incrementally
so just add the throw - fake it!
```
        createAgency: function() {
            throw new Error('createAgency: name required')
        }
```
we know createAgncy is going to be more than this, but invcremanetaallly
RED - Expected function to throw Error: createAgency: must specify agency name, but it threw Error: createAgency: name required.
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
RED - Expected function to throw Error: createAgency: no agency name, but it threw Error: createAgency: name required.
then fix the service
``            throw new Error('createAgency: no agency name')
``
GREEN
COMMIT
we could commit at this point, as we have 1) a green 2) a slice of usefull behavoir
The message can also describe why we're adding agency
Important, don not refactor before the commit. The commit give s way to revert back to green if the refactor get tangled.



Refactor: extract common exception helper
``
           function expectedException(message) {
                return new Error('createAgency: ' + message);
            }

 ``
GREEN

