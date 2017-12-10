//jshint strict: false
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
            'Chrome'
            //'Firefox'
            //'PhantomJS'
            //'Safari' // don't have current version for Windows
        ],
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
