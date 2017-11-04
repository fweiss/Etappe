var Jasmine2SpecReporter = require("jasmine-spec-reporter").SpecReporter;
exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        '*.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8080/app/',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },
    onPrepare: function() {
        var options = {
            prefixes: {
                success: "✓ "
            }
        };
        var reporter = new Jasmine2SpecReporter(options);
        jasmine.getEnv().addReporter(reporter);
    }
};
