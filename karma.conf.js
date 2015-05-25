module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: [
            'jasmine'
        ],
        browsers: [
            'Chrome'
        ],
        plugins: [
            'karma-jasmine',
            'karma-spec-reporter',
            //'karma-jasmine-html-reporter',
            'karma-chrome-launcher'
        ],
        files: [
            'app/lib/angular.min.js',
            'app/lib/angular-resource.js',
            'app/lib/angular-mocks.js',
            'app/lib/underscore.js',
            'app/*.js',
            'app/modules/feed/*.js',
            'app/modules/plan/module.js',
            'app/modules/plan/*.js'
        ],
        nestedReporter: {
            colors: false
        },
        reporters: [ 'spec' ]
    });
};
