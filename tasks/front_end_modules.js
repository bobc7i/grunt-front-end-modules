/*
 * grunt-front-end-modules
 * https://github.com/bobc7i/grunt-front-end-modules
 *
 * Copyright (c) 2015 Bob Czarnecki
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var _ = require('underscore'),
      path = require('path'),
      chalk = require('chalk');

  require('grunt-contrib-copy/tasks/copy')(grunt);

  var getModuleFiles = function (modulesPath, key) {
    var pkgFile = path.join(modulesPath, 'package.json');
    var pkg = grunt.file.readJSON(pkgFile);

    if (!pkg[key]) {
      grunt.fail.fatal('No property ' + key + ' found in ' + pkgFile);
    }

    return typeof pkg[key] === 'string' ? [pkg[key]] : pkg[key];
  };

  var globPrefix = function (specifier) {
    var idx = specifier.indexOf('*');
    return idx > 1 ? specifier.substring(0, idx-1) : '';
  };

  var expand = function (pathPrefix, specifier) {
    specifier = path.join(pathPrefix, specifier);

    if (grunt.file.isFile(specifier)) {
      return {
        baseName: path.basename(specifier),
        name: specifier
      };
    } else {
      var prefix = globPrefix(specifier);
      return _(grunt.file.expand(specifier)).map(function (file) {
        return {
          baseName: file.replace(prefix, ''),
          name: file
        };
      });
    }
  };

  var copyTo = function (file, destPath) {
    var dest = path.join(destPath, file.baseName);
    grunt.file.copy(file.name, dest);
    grunt.log.writeln('Copied ' + chalk.cyan(file.name) + ' to ' + chalk.cyan(dest));
  };

  var copyModule = function (moduleName, options) {
    var modulesPath = path.join(options.modulesPath, moduleName),
        files = getModuleFiles(modulesPath, options.moduleSrcKey),
        expander = function (specifier) { return expand(modulesPath, specifier); },
        copy = function (file) { copyTo(file, options.dest); };

    _.chain(files)
      .map(expander)
      .flatten()
      .each(copy);
  };

  var copyModules = function (modules, options) {
    modules.forEach(function (module) {
      copyModule(module, options);
    });
  };

  var addCwd = function (mapping, cwd) {
    if (mapping.expand === false || (typeof mapping.cwd === 'string' && mapping.cwd.indexOf(cwd) === 0)) { return; }
    mapping.expand = true;
    mapping.cwd = path.join(cwd, mapping.cwd || '');
  };

  var addDest = function (mapping, dest) {
    if (mapping.dest == null && dest != null) {
      mapping.dest = dest;
    }
  };

  var augmentCopyConfig = function (mapping, cwd, dest) {
    addCwd(mapping, cwd);
    addDest(mapping, dest);
  };

  var toCopyConfig = function (moduleName, options, data) {
    var modulesPath = path.join(options.modulesPath, moduleName);

    var config = _(data).clone();
    if (config.src) {
      augmentCopyConfig(config, modulesPath, options.dest);

    } else if (_.isArray(config.files)) {
      config.files.forEach(function (entry) { augmentCopyConfig(entry, modulesPath, options.dest); });

    } else {
      augmentCopyConfig(config.files, modulesPath, options.dest);
    }

    return config;
  };

  var initCopyTask = function (moduleName, options, data) {
    grunt.config.set('copy.front_end_modules', toCopyConfig(moduleName, options, data));
  };

  var copyFiles = function () {
    grunt.task.run('copy:front_end_modules');
  };

  var isModulesConfig = function (data) {
    return data.modules != null;
  };

  var isFilesConfig = function (data) {
    return data.files != null || data.src != null;
  };

  var validate = function (options, data) {
    if (!isFilesConfig(data) && options.dest == null) {
      grunt.fail.fatal('"dest" option to copy modules not provided');
    }
  };

  grunt.registerMultiTask('front_end_modules', 'Use npm to manage front-end dependencies', function () {
    var options = this.options({
      modulesPath: 'node_modules',
      moduleSrcKey: 'main'
    });
    _(options).extend(this.data.test);  // Test hook

    validate(options, this.data);

    if (isModulesConfig(this.data)) {
      copyModules(this.data.modules, options);

    } else if (isFilesConfig(this.data)) {
      initCopyTask(this.target, options, this.data);
      copyFiles();

    } else {
      copyModule(this.target, options);
    }

    grunt.log.ok();
  });
};
