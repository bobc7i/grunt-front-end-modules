/*
 * grunt-front-end-modules
 * https://github.com/bobc7i/grunt-front-end-modules
 *
 * Copyright (c) 2015 Bob Czarnecki
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  require('string.prototype.startswith');
  require('string.prototype.endswith');
  require('grunt-then/tasks/then')(grunt);
  require('grunt-contrib-copy/tasks/copy')(grunt);
  require('grunt-browserify/tasks/browserify')(grunt);

  var _ = require('underscore'),
      path = require('path'),
      chalk = require('chalk');

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
    if (mapping.expand === false || (typeof mapping.cwd === 'string' && mapping.cwd.startsWith(cwd))) { return; }
    mapping.expand = true;
    mapping.cwd = path.join(cwd, mapping.cwd || '');
  };

  var addDest = function (mapping, dest) {
    if (mapping.dest == null && dest != null) {
      mapping.dest = dest;
    }
  };

  var augmentFilesConfig = function (mapping, cwd, dest) {
    addCwd(mapping, cwd);
    addDest(mapping, dest);
  };

  var addFilesConfig = function (config) {
    var entry = {
      flatten: true,
      src: config.src
    };
    delete config.src;
    config.files = [];
    config.files.push(entry);

    if (config.dest) {
      entry.dest = config.dest;
      delete config.dest;
    }
  };

  var toFilesConfig = function (moduleName, options, data) {
    var modulesPath = path.join(options.modulesPath, moduleName);
    var config = _(data).clone();

    if (config.src) {
      addFilesConfig(config);
    }

    if (_.isArray(config.files)) {
      config.files.forEach(function (entry) { augmentFilesConfig(entry, modulesPath, options.dest); });

    } else {
      augmentFilesConfig(config.files, modulesPath, options.dest);
    }

    return config;
  };

  var toBrowserifyFilesConfig = function(moduleName, options, data) {
    var config = _(data).clone();

    if (!config.files) {
      var modulesPath = path.join(options.modulesPath, moduleName),
          mainFile = getModuleFiles(modulesPath, options.moduleSrcKey)[0];

      if (!config.src) {
        // Default to main file
        config.src = path.join(modulesPath, mainFile);
      }

      config.dest = config.dest || '';
      if (!config.dest.startsWith(options.dest)) {
        config.dest = path.join(options.dest, config.dest);
      }
      if (!config.dest.endsWith('.js')) {
        config.dest = path.join(config.dest, mainFile);
      }
    }

    return config;
  };

  var runAnonymousTask = function (task, config) {
    grunt.task
      .then(task, config)
      .then(function() {
        var config = grunt.config.get(task);
        delete config.anonymous_target; // grunt-then is not cleaning itself up properly
        grunt.config.set(task, config);
      });
  };

  var browserify = function(moduleName, options, data) {
    var config = toBrowserifyFilesConfig(moduleName, options, data);
    delete config.browserify;
    config.options = data.browserify;
    runAnonymousTask('browserify', config);
  };

  var copyFiles = function (moduleName, options, data) {
    runAnonymousTask('copy', toFilesConfig(moduleName, options, data));
  };

  var isModulesConfig = function (data) {
    return data.modules != null;
  };

  var isFilesConfig = function (data) {
    return data.files != null || data.src != null;
  };

  var isBrowserifyConfig = function (data) {
    return data.browserify != null;
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

    } else if (isBrowserifyConfig(this.data)) {
      browserify(this.target, options, this.data);

    } else if (isFilesConfig(this.data)) {
      copyFiles(this.target, options, this.data);

    } else {
      copyModule(this.target, options);
    }

    grunt.log.ok();
  });
};
