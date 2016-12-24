module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: [
            'jasmine'
        ],
        browsers: [
            //'Chrome'
            //'Firefox'
            'PhantomJS'
            //'Safari' // don't have current version for Windows
        ],
        plugins: [
            'karma-coverage',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-jasmine-html-reporter',
            //'karma-chrome-launcher'
            //'karma-firefox-launcher'
            'karma-phantomjs-launcher'
            //'karma-safari-launcher'
        ],
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/underscore/underscore.js',
            'app/*.js',
            'app/modules/feed/sfmuni.js',
            'app/modules/feed/sfmuni-test.js',
            'app/modules/feed/bart.js',
            'app/modules/feed/bart-test.js',
            'app/modules/plan/module.js',
            'app/modules/plan/*.js'
        ],
        nestedReporter: {
            colors: false
        },
        singleRun: true,
        reporters: [ 'coverage', 'spec', 'junit', 'html' ],
        junitReporter: {
            outputFile: 'reports/karma.xml'
        },
        htmlReporter: {
            outputFile: 'reports/jasmine'
        },
        preprocessors: {
            'app/modules/**/!(*test).js': [ 'coverage' ]
        }
    });
};
