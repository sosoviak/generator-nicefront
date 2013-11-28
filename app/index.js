'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var NicefrontGenerator = module.exports = function NicefrontGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ 
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NicefrontGenerator, yeoman.generators.Base);

NicefrontGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      name: 'projectName',
      message: 'Project name:'
    },
    {
      name: 'sourceFolder',
      message: 'Source folder name:',
      default: 'src'
    },
    {
      name: 'buildFolder',
      message: 'Build folder name:',
      default: 'build'
    },
    {
      type: 'confirm',
      name: 'ie8',
      message: 'Compatible with IE8?',
      default: true
    },
    {
      type:'list',
      name: 'cssFramework',
      message: 'Choose a CSS Framework',
      choices: [
        {
          name: 'Pure CSS',
          value: 'pure'
        },
        {
          name: 'Inuit',
          value: 'inuit'
        }
      ]    
    },
    {
      type: 'checkbox',
      name: 'extras',
      message: 'What extras you want to install?',
      choices: [{
          value: 'extra-transit',
          name: 'Transit',
          checked: false
        },
        {
          value: 'extra-lightbox',
          name: 'Magnific Popup',
          checked: false
        }
      ]
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.sourceFolder = props.sourceFolder;
    this.buildFolder = props.buildFolder;
    this.ie8 =  props.ie8;
    this.cssFramework =  props.cssFramework;

    var hasExtra = function (mod) { return props.extras.indexOf(mod) !== -1; };
    this.transit = hasExtra('extra-transit');
    this.lightbox = hasExtra('extra-lightbox');

    cb();
  }.bind(this));
};

NicefrontGenerator.prototype.readIndex = function readIndex(){
  this.indexFile = this.engine(this.read('files/templates/layouts/default.hbs'), this);
};

NicefrontGenerator.prototype.app = function app() {
  var bowerPaks = [];
  var scriptsSrcs = [];
  var cssSrcs = [];

  this.mkdir('src');
  this.mkdir('src/assets');
  this.mkdir('src/assets/js');
  this.mkdir('src/assets/images');
  this.mkdir('src/assets/css');
  this.mkdir('src/assets/css/fonts');
  
  this.directory('files/templates/','src/templates');

  // CSS
  if (this.cssFramework === 'pure'){
    this.directory('files/scss/','src/scss');
    this.copy('file/pure-min.css','src/assets/css/pure-min.css');
    cssSrcs.push('{{assets}}/css/pure-min.css');
  } else {
    bowerPaks.push('inuit.css');
    this.mkdir('src/scss');
    this.copy('file/main-inuit.scss', 'src/scss/main.scss');
  }
  cssSrcs.push('{{assets}}/css/main.css');

  // JS
  this.copy('files/js/plugins.js', 'src/assets/js/plugins.js');
  scriptsSrcs.push('{{assets}}/bower_components/jquery/jquery.js');
  scriptsSrcs.push('{{assets}}/bower_components/jquery.easing/js/jquery.easing.js');
  scriptsSrcs.push('{{assets}}/js/plugins.js');

  this.copy('files/htaccess', 'build/.htaccess');
  this.copy('files/robots.txt', 'build/robots.txt');

  
  if (this.ie8){
    bowerPaks.push('jquery#1.10.2');    
  } else {
    bowerPaks.push('jquery');
  }

  if (this.transit)
    bowerPaks.push('jquery.transit');
    scriptsSrcs.push('{{assets}}/bower_components/jquery.transit/jquery.transit.js');
  if (this.lightbox)
    bowerPaks.push('magnific-popup');
    scriptsSrcs.push('{{assets}}/bower_components/magnific-popup/dist/jquery.magnific-popup.js');

  this.bowerInstall(bowerPaks,{save:true});
};

NicefrontGenerator.prototype.projectfiles = function projectfiles() {
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('_config.json', 'config.json');
  this.template('Gruntfile.js');
  this.copy('bowerrc', '.bowerrc');
  this.copy('gitignore', '.gitignore');
};
