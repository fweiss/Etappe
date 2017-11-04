//jshint strict: false
module.exports = function(config) {
    config.set({

        basePath: './app',

        files: [
            '../node_modules/angular/angular.min.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '../node_modules/underscore/underscore.js',
            '*.js',
            'modules/feed/sfmuni.js',
            'modules/feed/sfmuni-test.js',
            'modules/feed/bart.js',
            'modules/feed/bart-test.js',
            'modules/plan/module.js',
            'modules/plan/*.js'
        ],

        autoWatch: true,

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
            'karma-jasmine'
        ],
        reporters: [ 'coverage', 'junit' ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        preprocessors: {
            'modules/**/!(*test).js': [ 'coverage' ]
        }
    });
};
