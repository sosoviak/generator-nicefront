module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      dev: {
        files: [
          '<%%= pkg.source_folder %>/**/*',
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
          loadPath: '<%%= pkg.source_folder %>/assets/bower_components/'
        },
        files:{
          '<%%= pkg.source_folder %>/assets/css/main.css':'<%%= pkg.source_folder %>/scss/main.scss'
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
          cwd:'<%%= pkg.source_folder %>/assets/images/',
          src: ['**/*.png','**/*.jpg'],
          dest:'<%%= pkg.build_folder %>/assets/images'
        }]
      }
    },
    copy:{
      build:{
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/assets/images/',src:['**/*.gif'],dest:'<%%= pkg.build_folder %>/assets/images/'},
          {expand:true,cwd:'<%%= pkg.source_folder %>/assets/css/fonts/',src:['*'],dest:'<%%= pkg.build_folder %>/assets/css/fonts/'}
        ]
      }
    },
    clean: {
      build:['.tmp','<%%= pkg.build_folder %>']    
    },
    webfont: {
      icons: {
        stylesheet: 'scss',
        destCss: '<%%= pkg.source_folder %>/assets/css/',
        src: 'production/icons/*.svg',
        dest: '<%%= pkg.source_folder %>/assets/css/fonts/'
      }
    },
    assemble: {
      options: {
        flatten: true,
        assets: '<%%= pkg.source_folder %>/assets',
        layout: '<%%= pkg.source_folder %>/templates/layouts/default.hbs',
        partials: '<%%= pkg.source_folder %>/templates/partials/*.hbs',
        postprocess: require('pretty')
      },
      pages: {
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/templates/pages/',src:['**/*.hbs'],dest:'<%%= pkg.source_folder %>/'}
        ]
      }
    },
    useminPrepare: {
        options: {
            dest: '<%%= pkg.build_folder %>'  
        },
        html: ['<%%= pkg.source_folder %>/index.html']
    },
    usemin: {
        options: {
          dirs: ['<%%= pkg.build_folder %>']    
        },
        html: ['<%%= pkg.build_folder %>/{,*/}*.html'],
        css: ['<%%= pkg.build_folder %>/css/{,*/}*.css']
    },
    rev: {
      build: {
        files: {
            src: [
              '<%%= pkg.build_folder %>/assets/js/{,*/}*.js',
              '<%%= pkg.build_folder %>/assets/css/{,*/}*.css',
              '<%%= pkg.build_folder %>/assets/css/fonts/*'
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
              cwd: '<%%= pkg.source_folder %>',
              src: '**/*.html',
              dest: '<%%= pkg.build_folder %>'
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