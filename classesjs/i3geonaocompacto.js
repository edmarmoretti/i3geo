/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
var $i = function(id)
{return document.getElementById(id);};
/*
Function: $trad

Pega o termo traduzido para uma lingua específica

Parameters:

id - id que identifica o texto na variável g_linguagem, definida em configura.js
*/
var $trad = function(id)
{
	return eval("g_traducao."+id+"[0]."+g_linguagem+";");
};

var mostradicasf = function(){};
var scriptLocation = "";
var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; i++) {
	var src = scripts[i].getAttribute('src');
	if (src) {
		var index = src.lastIndexOf("i3geonaocompacto.js");
		// is it found, at the end of the URL?
		if ((index > -1) && (index + "i3geonaocompacto.js".length == src.length)) {
			scriptLocation = src.slice(0, -"i3geonaocompacto.js".length);
			break;
		}
	}
}
var allScriptTags = "";
var jsfiles = new Array(
"../pacotes/yui231/build/yahoo/yahoo-min.js",
"../pacotes/yui231/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui231/build/dom/dom-min.js",
"../pacotes/yui231/build/container/container_core-min.js",
"../pacotes/yui252/build/menu/menu-min.js",
"../pacotes/yui231/build/logger/logger-min.js",
"../pacotes/yui231/build/dragdrop/dragdrop-min.js",
"../pacotes/yui231/build/slider/slider-debug.js",
"../pacotes/yui231/build/animation/animation-min.js",
"../pacotes/yui231/build/container/container-min.js",
"../pacotes/yui231/build/element/element-beta.js",
"../pacotes/yui252/build/tabview/tabview-min.js",
"../pacotes/yui231/build/utilities/utilities.js",
"../pacotes/cpaint/cpaint2.inc.compressed.js",
"../pacotes/jsobjects/jsUI-Global/common.js",
"../pacotes/jsobjects/jsUI-Global/uiCommon.js",
"../pacotes/jsobjects/jsUI-Treeview/component_i3geo.js",
"classe_util.js",
"funcoes.js",
"dicionario.js",
"classe_idioma.js",
"configura.js",
"ferramentas.js",
"redesenho.js",
"iniciamma.js",
"menususpenso.js",
"../pacotes/richdraw/richdraw_tudo_compacto.js"
);
for (i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
//css
var allCssTags = "";
var cssfiles = new Array(
"../css/i3geo.css.php"
);
for (i = 0; i < cssfiles.length; i++)
{
	var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
	allCssTags += currentCssTag;
}

document.write(allCssTags);
document.write(allScriptTags);