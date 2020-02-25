//jshint strict: false

const os = require('os');
const chromeHeadlessSupported = os.platform() !== 'win32' || Number((os.release().match(/^(\d+)/) || ['0', '0'])[1]) >= 10;

module.exports = function(config) {
    config.set({

        basePath: '.',

        files: [
            'app/modules/util/*.js',
            'app/node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/node_modules/underscore/underscore.js',
            'app/*.js',
            'app/modules/feed/sfmuni.js',
            'app/modules/feed/sfmuni-test.js',
            'app/modules/feed/bart.js',
            'app/modules/feed/bart-test.js',
            'app/modules/plan/module.js',
            'app/modules/plan/*.js'
        ],

        singleRun: true,

        frameworks: ['jasmine'],

        browsers: [
            chromeHeadlessSupported ? 'ChromeHeadless' : 'Chrome'
            //'Firefox'
            //'PhantomJS'
            //'Safari' // don't have current version for Windows
        ],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
            }
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-jasmine',
            'karma-spec-reporter'
        ],
        reporters: [ 'coverage', 'junit', 'spec' ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        preprocessors: {
            'modules/**/!(*test).js': [ 'coverage' ]
        }
    });
};
