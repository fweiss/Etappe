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
            'karma-chrome-launcher'
        ],
        files: [
            'app/lib/angular.min.js',
            'app/lib/angular-resource.js',
            'app/lib/angular-mocks.js',
            'app/lib/underscore.js',
            'app/*.js',
            'app/feed/*.js',
            'app/plan/*.js'
        ],
        nestedReporter: {
            colors: false
        }
    });
};
