module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      development: {
        src: [
          './src/**/*.js',
        ],
        dest: './dist/scorm-again.js',
        options: {
          browserifyOptions: {
            debug: true,
            standalone: true,
          },
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
          browserifyOptions: {
            debug: true,
            standalone: true,
          },
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
            ['minifyify',
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

  grunt.registerTask('default',
      ['browserify:development', 'browserify:production']);
};
