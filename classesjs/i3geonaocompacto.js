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
"../pacotes/yui252/build/yahoo/yahoo-min.js",
"../pacotes/yui252/build/yahoo-dom-event/yahoo-dom-event.js",
"../pacotes/yui252/build/dom/dom-min.js",
"../pacotes/yui252/build/container/container_core-min.js",
"../pacotes/yui252/build/menu/menu-min.js",
"../pacotes/yui252/build/logger/logger-min.js",
"../pacotes/yui252/build/dragdrop/dragdrop-min.js",
"../pacotes/yui252/build/slider/slider-debug.js",
"../pacotes/yui252/build/animation/animation-min.js",
"../pacotes/yui252/build/container/container-min.js",
"../pacotes/yui252/build/element/element-beta.js",
"../pacotes/yui252/build/tabview/tabview-min.js",
"../pacotes/yui252/build/utilities/utilities.js",
"../pacotes/cpaint/cpaint2.inc.compressed.js",
"../pacotes/yui252/build/treeview/treeview-min.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon.config.js",
"../pacotes/balloon-tooltips/htdocs/js/balloon.js",
"classe_php.js",
"classe_configura.js",
"depreciados.js",
"classe_util.js",
"classe_calculo.js",
"classe_desenho.js",
"classe_interface.js",
"classe_mapa.js",
"classe_tema.js",
"classe_analise.js",
"classe_maparef.js",
"dicionario.js",
"classe_idioma.js",
"classe_ajuda.js",
"classe_janela.js",
"classe_guias.js",
"classe_arvoredecamadas.js",
"classe_navega.js",
"classe_selecao.js",
"classe_eventos.js",
"classe_arvoredetemas.js",
"configura.js",
"classe_barradebotoes.js",
"redesenho.js",
"iniciamma.js",
"menususpenso.js",
"../pacotes/richdraw/richdraw_tudo_compacto.js",
"classe_gadgets.js"
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