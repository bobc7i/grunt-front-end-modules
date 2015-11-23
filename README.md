# grunt-front-end-modules [![Build Status](https://travis-ci.org/bobc7i/grunt-front-end-modules.svg?branch=master)](https://travis-ci.org/bobc7i/grunt-front-end-modules)

> Use npm to manage front-end dependencies

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-front-end-modules --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-front-end-modules');
```

## The "front_end_modules" task
This task allows you to use npm to manage front-end dependencies on your project.  It will copy files out of installed
packages to other areas of your project such as a `libs` directory.  It was inspired by this vision of 
[npm and front-end packaging](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging).

It will honor the file specified in the `main` key in a dependent module's `package.json` or you can configure a package
specific key.  You can also exercise full control over what files are copied via the gruntjs file configuration formats.

This task could be run as a `postinstall` script or as part of your existing grunt workflow.  For CommonJS modules,
you can then use a solution like [browserify](http://browserify.org/) to make those modules runnable in a browser.

### Overview
In your project's Gruntfile, add a section named `front_end_modules` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  front_end_modules: {
    options: {
      dest: 'js/libs'
    },
    libs: {
      modules: [ 
        'underscore',
        'mustache'
      }
    },
    test: {
      options: {
        dest: 'test/libs'
      },
      modules: [ 
        'jasmine-jquery'
      }
    },
    'cactus': {
      src: 'dist/foo.js',
      dest: 'js/libs'
    }
  },
});
```

The specified front-end module files will be copied from `node_modules` to the destination path.  Modules that are
published in CommonJs format can then be converted using a tool such as browserify.

### Options

#### options.dest
Type: `String`
Default value: none

A string value that specifies the destination directory to copy modules to.

#### options.moduleSrcKey
Type: `String`
Default value: none

A string value that specifies the field in the module's `package.json` to use for the module file or list of files
to copy to `options.dest`.

### Usage Examples
There are several ways to specify front-end module dependencies to be copied.  All modules must be installed under
`node_modules`.

#### Multiple Modules
You can copy multiple front-end modules. Each module will have its `main` file as configured in the `main` property of
its `package.json` copied to the `options.dest` path. Configure different targets for each destination path.

```js
grunt.initConfig({
  front_end_modules: {
    libs: {
      options: {
        dest: 'js/libs'
      },
      modules: [ 
        'underscore',
        'mustache'
      }
    },
    test: {
      options: {
        dest: 'test/libs'
      },
      modules: [ 
        'jasmine-jquery'
      }
    }
  },
});
```

In the example above, `underscore.js` and `mustache.js` will be copied from their installed packages under
`node_modules` to `js/libs`, and `jasmine-jquery.js` will be copied from its installed package to `test/libs`.

#### Single Module
You can copy a single front-end module by using the package name as the target name. Its `main` file as configured in
the `main` property of its `package.json` will be copied to the `options.dest` path. The name of the task target is the 
name of the npm package.

```js
grunt.initConfig({
  front_end_modules: {
    underscore: {
      options: {
        dest: 'js/libs/underscore'
      }
    },
    mustache: {
      options: {
        dest: 'js/libs/mustache'
      }
    }
  }
});
```

In the example above, `underscore.js` will be copied from its installed package under `node_modules` to 
`js/libs/underscore`, and `mustache.js` will be likewise be copied from its installed package to `js/libs/mustache`. 

#### Package Specific Key for Main Files
If a package uses a key other than `main` in its `package.json` say for example to specify a collection of library
files, that key can be configured under `options.moduleSrcKey`.  The name of the task target is the name of the npm 
package.

```js
grunt.initConfig({
  front_end_modules: {
    options {
      dest: 'js/libs'
    }
    cactus: {
      options: {
        moduleSrcKey: 'srcFiles'
      }
    }
  }
});
```

In the example above, a library named `cactus` in `node_modules/cactus` will have the file or files specified in the 
`srcFiles` key of its `package.json` copied to `js/libs`.

#### Package Specific Files
For fine-grained control over which modules files are coped all [gruntjs][http://gruntjs.com/configuring-tasks#files] 
file configuration formats are also supported on a per target basis.  The name of the task target is the name of the
npm package.
 
```js
grunt.initConfig({
  front_end_modules: {
    'cactus': {
      src: 'dist/**/*.js',
      dest: 'js/libs'
    }
  },
});
```

In the example above, all `.js` files under `node_modules/cactus/dist` will be copied to `js/libs`. 

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 1.1.0 Initial version
