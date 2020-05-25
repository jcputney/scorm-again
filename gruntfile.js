module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'list',
          require: '@babel/register',
          noFail: false,
          recursive: true,
          captureFile: false,
        },
        src: ['test/**/*.spec.js'],
      },
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify:development'],
        options: {
          spawn: false,
        },
      },
    },
    browserify: {
      development: {
        src: [
          './src/**/*.js',
        ],
        dest: './dist/scorm-again.js',
        options: {
          browserifyOptions: {debug: true},
          transform: [
            [
              'babelify', {
                'presets': ['@babel/preset-env', '@babel/preset-flow'],
                'plugins': [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-private-methods',
                  '@babel/plugin-proposal-optional-chaining',
                ],
              },
            ],
          ],
        },
      },
      production: {
        src: [
          './src/**/*.js',
        ],
        dest: './dist/scorm-again.min.js',
        options: {
          browserifyOptions: {debug: true},
          transform: [
            [
              'babelify', {
                'presets': ['@babel/preset-env', '@babel/preset-flow'],
                'plugins': [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-proposal-private-methods',
                  '@babel/plugin-proposal-optional-chaining',
                ],
              },
            ],
          ],
          plugin: [
            [
              'minifyify',
              {
                map: 'scorm-again.js.map',
                output: './dist/scorm-again.js.map',
              }],
          ],
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('default',
      ['browserify:development', 'browserify:production']);
};
