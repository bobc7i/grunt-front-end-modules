/*
 * grunt-front-end-modules
 * https://github.com/bobc7i/grunt-front-end-modules
 *
 * Copyright (c) 2015 Bob Czarnecki
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    front_end_modules: {
      options: {
        dest: 'tmp/test/dest/default'
      },
      libs: {
        modules: [
          "cactus",
          "pear"
        ],
        test: {
          modulesPath: 'test/fixtures/libs/node_modules'
        }
      },
      'pkg-specific': {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'dist/ps.js',
            dest: 'tmp/test/dest/pkg-specific'
          }
        ],
        test: {
          modulesPath: 'test/fixtures/pkg-specific/node_modules'
        }
      },
      defaults: {
        test: {
          modulesPath: 'test/fixtures/defaults/node_modules'
        }
      },
      overrides: {
        options: {
          dest: 'tmp/test/dest/overrides',
          moduleSrcKey: 'cactus'
        },
        test: {
          modulesPath: 'test/fixtures/overrides/node_modules'
        }
      },
      globs1: {
        options: {
          dest: 'tmp/test/dest/globs1',
          moduleSrcKey: 'cactus'
        },
        test: {
          modulesPath: 'test/fixtures/globs1/node_modules'
        }
      },
      globs2: {
        options: {
          dest: 'tmp/test/dest/globs2',
          moduleSrcKey: 'cactus'
        },
        test: {
          modulesPath: 'test/fixtures/globs2/node_modules'
        }
      },
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'front_end_modules', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
