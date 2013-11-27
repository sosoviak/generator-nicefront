module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      dev: {
        files: [
          'src/**/*',
        ],
        tasks: ['dev'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },
    sass:{
      dev: {
        options:{
          sourcemap:true,
          loadPath: 'src/assets/bower_components/'
        },
        files:{
          'src/assets/css/main.css':'src/scss/main.scss'
        }
      }
    },
    /*
    concat: {
      }
    },
    uglify: {
    },
    */
    imagemin: {
      build: {
        options:{
          optimizationLevel : 3
        },
        files:[{
          expand: true,
          cwd:'src/assets/images/',
          src: ['**/*.png','**/*.jpg'],
          dest:'build/assets/images'
        }]
      }
    },
    copy:{
      build:{
        files:[
          {expand:true,cwd:'src/assets/images/',src:['**/*.gif'],dest:'build/assets/images/'},
          {expand:true,cwd:'src/assets/fonts/',src:['*'],dest:'build/assets/fonts/'}
        ]
      }
    },
    clean: {
      build:['.tmp','build']    
    },
    webfont: {
      icons: {
        stylesheet: 'scss',
        destCss: 'build/css/',
        src: 'production/icons/*.svg',
        dest: 'src/fonts/'
      }
    },
    assemble: {
      options: {
        flatten: true,
        assets: 'src/assets',
        layout: 'src/templates/layouts/default.hbs',
        partials: 'src/templates/partials/*.hbs',
        postprocess: require('pretty')
      },
      pages: {
        files:[
          {expand:true,cwd:'src/templates/pages/',src:['**/*.hbs'],dest:'src/'}
        ]
      }
    },
    useminPrepare: {
        options: {
            dest: 'build'  
        },
        html: ['src/index.html']
    },
    usemin: {
        options: {
          dirs: ['build']    
        },
        html: ['build/{,*/}*.html'],
        css: ['build/css/{,*/}*.css']
    },
    rev: {
      build: {
        files: {
            src: [
              'build/assets/js/{,*/}*.js',
              'build/assets/css/{,*/}*.css',
              'build/assets/css/fonts/*'
            ]
        }
      }
    },
    htmlmin: {
      build: {
          options: {
              // removeCommentsFromCDATA: true,
              // https://github.com/yeoman/grunt-usemin/issues/44
              // collapseWhitespace: true,
              // collapseBooleanAttributes: true,
              // removeAttributeQuotes: true,
              // removeRedundantAttributes: true,
              // useShortDoctype: true,
              // removeEmptyAttributes: true,
              // removeOptionalTags: true
          },
          files: [{
              expand: true,
              cwd: 'src',
              src: '**/*.html',
              dest: 'build'
          }]
      }
    },
    concurrent: {
      build: [
        'imagemin',
        'htmlmin'
      ],
      dev: [
        'assemble',
        'sass'
      ]
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('assemble');

  // User tasks
  grunt.registerTask('dev',['concurrent:dev']);
  grunt.registerTask('build',[
    'clean',
    'concurrent:dev',
    'useminPrepare',
    'concurrent:build',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'copy:build'
  ]);
  // Default task(s).
  grunt.registerTask('default', ['watch']);
};