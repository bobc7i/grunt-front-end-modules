'use strict';

var grunt = require('grunt');

exports.front_end_modules = {
  setUp: function(done) {
    done();
  },

  defaults: function(test) {
    test.expect(1);

    var source = grunt.file.read('test/fixtures/defaults/node_modules/defaults/dist/foo.js');
    var copied = grunt.file.read('tmp/test/dest/default/foo.js');
    test.equal(source, copied, 'should copy main file');

    test.done();
  },

  overrides: function(test) {
    test.expect(2);

    var source = grunt.file.read('test/fixtures/overrides/node_modules/overrides/cactus1.js');
    var copied = grunt.file.read('tmp/test/dest/overrides/cactus1.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/overrides/node_modules/overrides/cactus2.js');
    copied = grunt.file.read('tmp/test/dest/overrides/cactus2.js');
    test.equal(source, copied, 'should copy lib file');

    test.done();
  },

  globs1: function(test) {
    test.expect(3);

    var source = grunt.file.read('test/fixtures/globs1/node_modules/globs1/dist/cactus1.js');
    var copied = grunt.file.read('tmp/test/dest/globs1/cactus1.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/globs1/node_modules/globs1/dist/cactus2.js');
    copied = grunt.file.read('tmp/test/dest/globs1/cactus2.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/globs1/node_modules/globs1/dist/sub/cactus3.js');
    copied = grunt.file.read('tmp/test/dest/globs1/sub/cactus3.js');
    test.equal(source, copied, 'should copy lib file');

    test.done();
  },

  globs2: function(test) {
    test.expect(3);

    var source = grunt.file.read('test/fixtures/globs2/node_modules/globs2/cactus1.js');
    var copied = grunt.file.read('tmp/test/dest/globs2/cactus1.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/globs2/node_modules/globs2/dist/cactus2.js');
    copied = grunt.file.read('tmp/test/dest/globs2/cactus2.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/globs2/node_modules/globs2/dist/cactus3.js');
    copied = grunt.file.read('tmp/test/dest/globs2/cactus3.js');
    test.equal(source, copied, 'should copy lib file');

    test.done();
  },

  main: function(test) {
    test.expect(2);

    var source = grunt.file.read('test/fixtures/libs/node_modules/cactus/dist/cactus.js');
    var copied = grunt.file.read('tmp/test/dest/default/cactus.js');
    test.equal(source, copied, 'should copy lib file');
    source = grunt.file.read('test/fixtures/libs/node_modules/pear/dist/pear.js');
    copied = grunt.file.read('tmp/test/dest/default/pear.js');
    test.equal(source, copied, 'should copy lib file');

    test.done();
  },

  'pkg-specific-simple': function(test) {
    test.expect(1);

    var source = grunt.file.read('test/fixtures/pkg-specific-simple/node_modules/pkg-specific-simple/dist/pss.js');
    var copied = grunt.file.read('tmp/test/dest/pkg-specific-simple/pss.js');
    test.equal(source, copied, 'should copy dist file');

    test.done();
  },

  'pkg-specific': function(test) {
    test.expect(1);

    var source = grunt.file.read('test/fixtures/pkg-specific/node_modules/pkg-specific/dist/ps.js');
    var copied = grunt.file.read('tmp/test/dest/pkg-specific/ps.js');
    test.equal(source, copied, 'should copy main file');

    test.done();
  },

  cjs: function(test) {
    test.expect(1);

    var expected = grunt.file.read('test/expected/cjs/cjs.js');
    var bundled = grunt.file.read('tmp/test/dest/cjs/cjs.js');
    test.equal(expected, bundled, 'should browserify');

    test.done();
  },
};
