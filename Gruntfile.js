'use strict';
module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
    , meta: {
      version: '<%= pkg.version %>'
      , banner: '/*! <%= pkg.name %> - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n'
    }
    , jshint: {
      all: [
        'Gruntfile.js'
        , 'index.js'
        , 'lib/**/*.js'
        , 'test/**/*.js'
      ]
      , options: {
        jshintrc: '.jshintrc'
      }
    }
    , jscs: {
      all: '<%= jshint.all %>'
      , options: {
      }
    }
    , bump: {
      patch: {
        options: {
          part: 'patch'
          , tabSize: 2
        }
        , src: [
          'package.json'
          , 'bower.json'
        ]
      }
      , minor: {
        options: {
          part: 'minor'
          , tabSize: 2
        }
        , src: '<%= bump.patch.src %>'
      }
      , major: {
        options: {
          part: 'major'
          , tabSize: 2
        }
        , src: '<%= bump.patch.src %>'
      }
    }
    , umd: {
      all: {
        src: ['lib/leaflet.filelayer.js']
        , dest: 'dist/leaflet.filelayer.js'
        , deps: {
          'default': ['leaflet', 'toGeoJSON']
          , global: ['L', 'toGeoJSON']
        }
        , objectToExport: 'FileLoader'
        , globalAlias: 'L.FileLoader'
      }
    }
    , uglify: {
      dist: {
        src: ['dist/leaflet.filelayer.js']
        , dest: 'dist/leaflet.filelayer.min.js'
      }
      , options: {
        report: 'min'
      }
    }
    , simplemocha: {
      options: {
        timeout: 2000
        , ignoreLeaks: true
        , ui: 'bdd'
      }
      , all: {
        src: ['test/**/*.js']
      }
    }
    , shell: {
      gitTag: {
        command: 'git tag -a v<%= grunt.file.readJSON("package.json").version %> -m "`git log --pretty=format:"* %s" v<%= pkg.version %>...`"'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitRequireCleanTree: {
        command: 'function require_clean_work_tree(){\n' +
          ' # Update the index\n' +
          '    git update-index -q --ignore-submodules --refresh\n' +
          '    err=0\n' +

          ' # Disallow unstaged changes in the working tree\n' +
          '    if ! git diff-files --quiet --ignore-submodules --\n' +
          '    then\n' +
          '        echo >&2 "cannot $1: you have unstaged changes."\n' +
          '        git diff-files --name-status -r --ignore-submodules -- >&2\n' +
          '        err=1\n' +
          '    fi\n' +

          ' # Disallow uncommitted changes in the index\n' +
          '    if ! git diff-index --cached --quiet HEAD --ignore-submodules --\n' +
          '    then\n' +
          '        echo >&2 "cannot $1: your index contains uncommitted changes."\n' +
          '        git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2\n' +
          '        err=1\n' +
          '    fi\n' +

          '    if [ $err = 1 ]\n' +
          '    then\n' +
          '        echo >&2 "Please commit or stash them."\n' +
          '        exit 1\n' +
          '    fi\n' +
          '} \n require_clean_work_tree'
        , options: {
          failOnError: true
        }
      }
      , gitCommitPackage: {
        command: 'git commit --amend -i package.json --reuse-message HEAD'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitPullRebase: {
        command: 'git pull --rebase origin master'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , gitPush: {
        command: 'git push origin master --tags'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , npmPublish: {
        command: 'npm publish'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
      , npmTest: {
        command: 'npm test'
        , options: {
          stdout: true
          , failOnError: true
        }
      }
    }
  })

  // so much smarter than manually requiring
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['simplemocha'])
  grunt.registerTask('publish', [
    'shell:gitRequireCleanTree'
    , 'shell:gitPullRebase'
    , 'jshint'
    , 'jscs'
    , 'umd'
    , 'uglify'
    , 'shell:npmTest'
    , 'bump:' + (grunt.option('bump') || 'patch')
    , 'shell:gitCommitPackage'
    , 'shell:gitTag'
    , 'shell:gitPush'
    , 'shell:npmPublish'
  ])
}
