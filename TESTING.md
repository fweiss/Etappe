# Testing

## Karma spec patterns
- easiy to read
- well organized
- terse

### Creation method validation errors
Write specs for the creation method(s) for a domain object.
The pattern is 

``<domain>/create/validation error/when <propery constraint>``

Example Karma/Jasmine report:

* [domain]
    * create
        * validation error
            * when [prop 1 constraint]
            * when [prop 2 constraint]

Example of a property contraint:

``when no endpoint given``

The interpretation

> The creation method for domain X should produce a validation error when no endpoint is given


Why? Orgaize tests/specs by domain. Hence in the tree structure the domain is at the root of the tree.
the childres on that break out the api functionaliy.
One of the cheif funtions is the creational methods.
Others are getters/setters, transformational, query.

## Karma test report
The Karma Server tab has a text report that can be copied to the clipboard.

How to get the test report that shows those that are missing expectation?