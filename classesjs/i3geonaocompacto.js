/*
Function: $i

Pega um objeto do documento.

Exemplo: $i("box1")

Parâmetros:

id - id do objeto

Retorno:

object - objeto javaScript
*/
$i = function(id)
{return document.getElementById(id);}
mostradicasf = function(){}
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
"../pacotes/yui/build/yahoo/yahoo-min.js",
"../pacotes/yui/build/event/event-min.js",
"../pacotes/yui/build/dom/dom-min.js",
"../pacotes/yui/build/container/container_core-min.js",
"../pacotes/yui/build/menu/menu-min.js",
"../pacotes/yui/build/logger/logger-min.js",
"../pacotes/yui/build/dragdrop/dragdrop-min.js",
"../pacotes/yui/build/slider/slider-debug.js",
"../pacotes/yui/build/animation/animation-min.js",
"../pacotes/yui/build/container/container-min.js",
"../pacotes/yui/build/container/ResizePanel.js",
"cpaint/cpaint2.inc.compressed.js",
"jsobjects/jsUI-Global/common.js",
"jsobjects/jsUI-Global/uiCommon.js",
"jsobjects/jsUI-Treeview/component.js",
"funcoes.js",
"ferramentas.js",
"redesenho.js",
"iniciamma.js",
"menususpenso.js"
);
for (var i = 0; i < jsfiles.length; i++)
{
	var currentScriptTag = "<script src='" + scriptLocation + jsfiles[i] + "'></script>";
	allScriptTags += currentScriptTag;
}
//css
var allCssTags = "";
var cssfiles = new Array(
"../css/geral.css",
"../css/botoes.css",
"../css/documentation.css",
"../css/fonts.css",
"../css/container.css",
"../css/reset.css",
"../css/grids.css",
"../css/menu.css"
);
for (var i = 0; i < cssfiles.length; i++)
{
	var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
	allCssTags += currentCssTag;
}

document.write(allCssTags);
document.write(allScriptTags);