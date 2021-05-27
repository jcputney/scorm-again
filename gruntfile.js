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
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
    browserify: {
      development: {
        files: [{
          expand: true,
          cwd: 'src/exports/',
          src: ['*.js'],
          dest: 'dist/',
          ext: '.js',
          extDot: 'first',
        }],
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
        files: [{
          expand: true,
          cwd: 'src/exports/',
          src: ['*.js'],
          dest: 'dist/',
          ext: '.min.js',
          extDot: 'first',
        }],
        options: {
          browserifyOptions: {debug: false},
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
              'uglifyify', {
                sourceMap: true,
              },
            ],
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
