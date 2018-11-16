(function(){
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
	"../pacotes/jsts/jsts_min.js",
	"../pacotes/mobileesp/mdetect.js",
	"../pacotes/proj4js/lib/proj4js-compressed.js",
	"../pacotes/yui290/build/yahoo/yahoo-min.js",
	"../pacotes/yui290/build/yahoo-dom-event/yahoo-dom-event.js",
	"../pacotes/yui290/build/dom/dom-min.js",
	"../pacotes/yui290/build/utilities/utilities.js",
	"../pacotes/yui290/build/container/container_core.js",
	"../pacotes/yui290/build/dragdrop/dragdrop-min.js",
	"../pacotes/yui290/build/slider/slider-min.js",
	"../pacotes/yui290/build/animation/animation-min270.js", //a 290 nao funciona direito
	"../pacotes/yui290/build/container/container.js",
	"../pacotes/yui290/build/element/element-min.js",
	"../pacotes/cpaint/cpaint2.inc.js",
	"../pacotes/yui290/build/resize/resize-min.js",
	"../pacotes/yui290/build/selector/selector-min.js",
	"../pacotes/wicket/wicket.js",
	"../pacotes/mustache.js-master/mustache.js",
	"../pacotes/jquery/dist/jquery.min.js",
	"../pacotes/jquery/jquery-number/jquery.number.min.js",
	"../pacotes/jquery/jquery-ui/jquery-ui.min.js",
	//"../pacotes/jquery/jquery.ui.touch-punch/jquery.ui.touch-punch.min.js",
	//"../pacotes/jquery/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js",
	"../pacotes/bootstrap/js/bootstrap.min.js",
	"../pacotes/bootstrap-material-design/dist/js/material.min.js",
	"../pacotes/nouislider/nouislider.min.js",
	"../pacotes/bootstrap-material-design/snackbarjs-1.1.0/dist/snackbar.min.js",
	"ini_i3geo.js",
	"util.js",
	"dicionario.js",
	"idioma.js",
	"php.js",
	"configura.js",
	"calculo.js",
	"desenho.js",
	"interface.js",
	"mapa.js",
	"tema.js",
	"analise.js",
	"maparef.js",
	"ajuda.js",
	"janela.js",
	"guias.js",
	"arvoredecamadas.js",
	"navega.js",
	"social.js",
	"eventos.js",
	"arvoredetemas.js",
	"editor.js",
	"coordenadas.js",
	"login.js",
	"marcador.js",
	"plugini3geo.js",
	"catalogoMenus.js",
	"catalogoInde.js",
	"catalogoOgc.js",
	"catalogoRegioes.js",
	"catalogoMetaestat.js",
	"catalogoMapas.js",
	"catalogoEstrelas.js",
	"catalogoSistemas.js",
	"catalogoDir.js",
	"legenda.js",
	"busca.js",
	"template.js",
	"caixaDeFerramentas.js"
	);
	var nocache = new Date().getTime();
	for (i = 0; i < jsfiles.length; i++)
	{
		var currentScriptTag = "<script type='text/javascript' src='" + scriptLocation + jsfiles[i] + "?time=" + nocache + "'></script>";
		allScriptTags += currentScriptTag;
	}
	//css
	var allCssTags = "";
	var cssfiles = new Array(
	"../css/input.css",
	"../css/geral.css",
	"../pacotes/yui290/build/fonts/fonts-min.css",
	"../pacotes/yui290/build/reset-fonts-grids/reset-fonts-grids.css",
	"../pacotes/yui290/build/grids/grids-min.css",
	"../pacotes/yui290/build/container/assets/skins/sam/container.css",
	"../pacotes/yui290/build/tabview/assets/skins/sam/tabview.css",
	"../pacotes/yui290/build/slider/assets/skins/sam/slider.css",
	"../pacotes/yui290/build/resize/assets/skins/sam/resize.css",
	//"../pacotes/jquery/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css",
	"../mashups/openlayers.css"
	);
	for (i = 0; i < cssfiles.length; i++)
	{
		var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i]  + "?" + nocache + "'/>";
		allCssTags += currentCssTag;
	}
	allCssTags += "<link rel='stylesheet' type='text/css' href='../pacotes/jquery/jquery-ui/jquery-ui.min.css'/>";
	allCssTags += "<link rel='stylesheet' type='text/css' href='../css/font/material-icons.css'/>";
	allCssTags += "<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>";
	document.write(allCssTags);
	document.write(allScriptTags);

})();
