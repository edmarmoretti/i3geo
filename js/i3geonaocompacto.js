(function () {
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
		"../pacotes/wicket/wicket.js",
		"../pacotes/mustache.js-master/mustache.js",
		"../pacotes/jquery/dist/jquery.min.js",
		"../pacotes/jquery/jquery-number/jquery.number.min.js",
		"../pacotes/jquery/jquery-ui/jquery-ui.min.js",
		"../pacotes/bootstrap/js/bootstrap.min.js",
		"../pacotes/bootstrap-material-design/dist/js/material.min.js",
		"../pacotes/nouislider/nouislider.min.js",
		"../pacotes/bootstrap-material-design/snackbarjs-1.1.0/dist/snackbar.min.js",
		"../pacotes/pickr/pickr.min.js",
		"ini_i3geo.js",
		"request.js",
		"util.js",
		"dicionario.js",
		"idioma.js",
		"php.js",
		"configura.js",
		"calculo.js",
		"desenho.js",
		"interface.js",
		"mapa.js",
		"identify.js",
		"tema.js",
		"analise.js",
		"maparef.js",
		"ajuda.js",
		"janela.js",
		"guias.js",
		"arvoredecamadas.js",
		"navega.js",
		"geolocal.js",
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
		"catalogoMapas.js",
		"catalogoEstrelas.js",
		"catalogoSistemas.js",
		"catalogoDir.js",
		"legenda.js",
		"busca.js",
		"template.js",
		"timer.js",
		"caixaDeFerramentas.js"
	);
	for (i = 0; i < jsfiles.length; i++) {
		var currentScriptTag = "<script type='text/javascript' src='" + scriptLocation + jsfiles[i] + "'></script>";
		allScriptTags += currentScriptTag;
	}
	//css
	var allCssTags = "";
	var cssfiles = new Array(
		//"../css/input.css",
		//"../css/geral.css",
		"../pacotes/pickr/themes/classic.min.css"
		//"../mashups/openlayers.css"
	);
	for (i = 0; i < cssfiles.length; i++) {
		var currentCssTag = "<link rel='stylesheet' type='text/css' href='" + scriptLocation + cssfiles[i] + "'/>";
		allCssTags += currentCssTag;
	}
	allCssTags += "<link rel='stylesheet' type='text/css' href='../pacotes/jquery/jquery-ui/jquery-ui.min.css'/>";
	allCssTags += "<link rel='stylesheet' type='text/css' href='../css/font/material-icons.css'/>";
	allCssTags += "<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>";
	allCssTags += "<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Gelasio'>";
	document.write(allCssTags);
	document.write(allScriptTags);
})();
