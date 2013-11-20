// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}
Array.prototype.shuffle = function() {
    this.sort(function(){
        return (Math.round(Math.random())-0.5);
    });
    return this;
}
// Place any jQuery/helper plugins in here.
String.prototype.testDNI = function() {
    dni = this.toUpperCase();
    numero = dni.substr(0,dni.length-1);
    let = dni.substr(dni.length-1,1);
    let = let.toUpperCase();
    numero = numero % 23;
    letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
    lletra = letra.charAt(numero);

    return (lletra == let)
}
String.prototype.testNIE = function() {
    var dni = this.toUpperCase();
    var pre = dni.substr(0, 1);
    var prev = '0';
    if (pre == 'X')
       prev = '0';
    else if (pre == 'Y')
       prev = '1';
    else if (pre == 'Z')
       prev = '2';
    numero = prev + dni.substr(1,dni.length-1);
    return numero.testDNI();
}

String.prototype.removeAccents = function ()
{
	var __r = 
	{
		'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'E',
		'È':'E','É':'E','Ê':'E','Ë':'E',
		'Ì':'I','Í':'I','Î':'I',
		'Ò':'O','Ó':'O','Ô':'O','Ö':'O',
		'Ù':'U','Ú':'U','Û':'U','Ü':'U',
		'Ñ':'N'
	};
	
	return this.replace(/[ÀÁÂÃÄÅÆÈÉÊËÌÍÎÒÓÔÖÙÚÛÜÑ]/gi, function(m)
	{
		var ret = __r[m.toUpperCase()];

		if (m === m.toLowerCase())
			ret = ret.toLowerCase();

		return ret;
	});
};

String.prototype.removeAdmiration = function(){
    if (this.substr(0,1)=="!"){
        return this.substr(1,this.length - 1).toString();
    } else {
        return this.toString();
    }
}

String.prototype.removeUnits = function(){
    return this.replace(/[^-\d\.]/g, ''); 
}
String.prototype.classLess = function(){
    return this.substring(1);
}
String.prototype.removeURLParams = function(){
    return this.match(/[^?]+/);
}
var BrowserDetect = 
{
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) 
    {
        for (var i=0 ; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" },
    ]

};
BrowserDetect.init();

modernBrowser = function(){
    if (BrowserDetect.browser === 'Explorer' && BrowserDetect.version < 9) { 
        return false; 
    } else {
        return true;
    }
}

$.fn.bg = function(_imgUrl){
    $(this).css("background-image","url(" + _imgUrl + ")");
}

getRootUrl = function(){
    return location.protocol + "//" + location.host;
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}