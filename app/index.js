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
      message: '¿Cuál es el nombre del proyecto?'
    },
    {
      name: 'sourceFolder',
      message: 'Nombre de la carpeta de desarrollo',
      default: 'src'
    },
    {
      name: 'buildFolder',
      message: 'Nombre de la carpeta de producción',
      default: 'build'
    },
    {
      type: 'confirm',
      name: 'ie8',
      message: '¿Será compatible con IE8?',
      default: true
    },
    {
      type: 'confirm',
      name: 'gs',
      message: '¿Necesitas un Grid System?',
      default: false
    },
    {
      type: 'confirm',
      name: 'transit',
      message: '¿Instalo un motor de animaciones css (transit)?',
      default: false
    },
    {
      type: 'confirm',
      name: 'lightbox',
      message: '¿Instalo un plugin para lightbox (Magnific)?',
      default: false
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.sourceFolder = props.sourceFolder;
    this.buildFolder = props.buildFolder;
    this.ie8 =  props.ie8;
    this.gs = props.gs;
    this.transit = props.transit;
    this.lightbox = props.lightbox;

    cb();
  }.bind(this));
};

NicefrontGenerator.prototype.app = function app() {
  this.mkdir('source');
  this.mkdir('source/js');
  this.mkdir('source/scss');
  this.mkdir('source/images');
  this.mkdir('source/layouts');
  this.mkdir('source/includes');
  this.mkdir('source/fonts');
  this.mkdir('build/includes');
  
  this.template('files/html/index.html','source/layouts/index.html');
  this.copy('files/html/head.html','source/includes/head.html');
  this.copy('files/html/scripts.html','source/includes/scripts.html');
  this.copy('files/js/plugins.js', 'source/js/plugins.js');
  this.directory('files/scss/','source/scss');
  this.copy('files/htaccess', 'build/.htaccess');
  this.copy('files/robots.txt', 'build/robots.txt');

  var bowerPaks = [];
  if (this.ie8){
    bowerPaks.push('jquery#1.10.2');    
  } else {
    bowerPaks.push('jquery');
  }
  if (this.gs)
    bowerPaks.push('csswizardry-grids');
  if (this.transit)
    bowerPaks.push('jquery.transit');
  if (this.lightbox)
    bowerPaks.push('magnific-popup');

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
