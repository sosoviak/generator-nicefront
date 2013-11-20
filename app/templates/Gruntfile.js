module.exports = function(grunt) {
  // Project configuration.
  var pkg, cssFiles, jsFiles;

  pkg = grunt.file.readJSON('config.json');

  cssFiles = ['bower_components/bower-bourbon/_bourbon.scss', 
    pkg.source_folder + '/scss/main.scss'];
  if (<%= gs %>)
    cssFiles.push('bower_components/csswizardry-grids/csswizardry-grids.scss');
  if (<%= lightbox %>)
    cssFiles.push('bower_components/magnific-popup/dist/magnific-popup.css');
  
  var jsFiles = ['bower_components/jquery/jquery.js','bower_components/jquery.easing/js/jquery.easing.min.js'];
  if (<%= transit %>)
    jsFiles.push('bower_components/jquery.transit/jquery.transit.js');
  if (<%= lightbox %>)
    jsFiles.push('bower_components/magnific-popup/dist/jquery.magnific-popup.js');

  jsFiles.push('bower_components/mediator-js/mediator.min.js',
              'bower_components/jsface/dist/jsface.js',
              'bower_components/jquery.imgpreload/jquery.imgpreload.js',
              pkg.source_folder + '/js/plugins.js');

  grunt.initConfig({
    pkg: pkg,
    watch: {
      dev: {
        files: [
          '<%%= pkg.source_folder %>/**/*'
        ],
        tasks: ['dev'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      images: {
        files: ['<%%= pkg.source_folder %>/images/**'],
        tasks: ['images'],
        options: {
          spawn: true
        }
      }
    },
    sass:{
      dev: {
        files:{
          '<%%= pkg.build_folder %>/css/main.css':cssFiles
        }
      },
      build: {
        options: {
          style: 'compressed'
        },
        files:{
          '<%%= pkg.build_folder %>/css/main.css':cssFiles
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dev:{
        files: [
          {
            dest:'<%%= pkg.build_folder %>/js/main.js',
            src:jsFiles
          }
        ]
      }
    },
    bake:{
      dev:{
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/layouts/',src:['**/*.html','**/*.php'],dest:'<%%= pkg.build_folder %>/'}
        ]
      }
    },
    uglify: {
      dev: {
        files: {
          '<%%= pkg.build_folder %>/js/main.js':'<%%= pkg.build_folder %>/js/main.js'
        }
      }
    },
    imagemin: {
      build: {
        options:{
          optimizationLevel : 3
        },
        files:[{
          expand: true,
          cwd:'<%%= pkg.source_folder %>/images/',
          src: ['**/*.png','**/*.jpg'],
          dest:'<%%= pkg.build_folder %>/images'
        }]
      }
    },
    copy:{
      dev:{
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/fonts/',src:['**'],dest:'<%%= pkg.build_folder %>/fonts/'},
        ]
      },
      build:{
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/images/',src:['**/*.gif'],dest:'<%%= pkg.build_folder %>/images/'}
        ]
      },
      images:{
        files:[
          {expand:true,cwd:'<%%= pkg.source_folder %>/images/',src:['**'],dest:'<%%= pkg.build_folder %>/images/'}
        ]
      }
    },
    clean: {
      dev:['<%%= pkg.build_folder %>/**/*','!<%%= pkg.build_folder %>/images/**','!<%%= pkg.build_folder %>/**'],
      build:['<%%= pkg.build_folder %>/images/**']
    },
    webfont: {
      icons: {
        stylesheet: 'scss',
        destCss: '<%%= pkg.build_folder %>/css/',
        src: 'production/icons/*.svg',
        dest: '<%%= pkg.source_folder %>/fonts/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bake');
  grunt.loadNpmTasks('grunt-webfont');
  // User tasks
  grunt.registerTask('dev',['clean:dev','copy:dev','sass:dev','concat','bake']);
  grunt.registerTask('images',['clean:build','copy:images']);
  grunt.registerTask('build',['clean:build','sass:build','uglify','imagemin','copy:build']);
  // Default task(s).
  grunt.registerTask('default', ['watch']);
};