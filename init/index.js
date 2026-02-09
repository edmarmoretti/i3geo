botoesIni = [
	{
		"img": "imagens/openlayers.png",
		"href": location.href.replace("init/index.php" + window.location.search, "") + customDir + "/ol.php",
		"titulo": $trad(4, g_traducao_init),
		"subtitulo": $trad("4a", g_traducao_init),
		"fa": "map-o",
		"target": "_blank"
	}, {
		"img": "imagens/osm.png",
		"href": location.href.replace("init/index.php" + window.location.search, "") + customDir + "/osm.php",
		"titulo": $trad(23, g_traducao_init),
		"subtitulo": $trad("23a", g_traducao_init),
		"fa": "map-o",
		"target": "_blank"
	}, {
		"img": "imagens/window-duplicate.png",
		"href": "../mapas/index.php",
		"titulo": $trad(34, g_traducao_init),
		"subtitulo": $trad("34a", g_traducao_init),
		"fa": "map-o",
		"target": "_self"
	}, {
		"img": "imagens/ogc_logo.png",
		"href": "../ogc/index.php",
		"titulo": $trad(11, g_traducao_init),
		"subtitulo": $trad("11a", g_traducao_init),
		"fa": "download",
		"target": "_self"
	}, {
		"img": "imagens/application-vnd-google-earth-kml.png",
		"href": "../kml.php?tipoxml=kml",
		"titulo": $trad(12, g_traducao_init),
		"subtitulo": $trad("12a", g_traducao_init),
		"fa": "download",
		"target": "_self"
	}, {
		"img": "imagens/applications-development-web.png",
		"href": "../admin/index.php",
		"titulo": $trad(3, g_traducao_init),
		"subtitulo": $trad("3a", g_traducao_init),
		"fa": "cogs",
		"target": "_self"
	}
];
//TODO um dia, remover as imagens da pasta init e deixar apenas as da pasta init/imagens
function mostraBotoesBT(men) {
	var html = "";
	//menu
	html = Mustache.to_html(
		$("#menuTpl").html(),
		i3GEO.idioma.objetoIdioma(g_traducao_init)
	);
	$("#menuTpl").html(html);
	//
	$("#mensagemLogin").html(men);
	html = Mustache.to_html(
		$("#jumbotron").html(),
		{
			"jumbotron": $trad(35, g_traducao_init),
			"host": location.host,
			"href": location.href
		}
	);
	$("#jumbotron").html(html);
	i3GEO.configura = { "locaplic": ".." };
	html = Mustache.to_html(
		"{{#d}}" + $("#botoesTpl_template").html() + "{{/d}}",
		{ "d": botoesIni, "abrir": $trad(36, g_traducao_init) }
	);
	$("#botoesTpl").html(html);
}
function findBootstrapDeviceSize() {
	var dsize = ['lg', 'md', 'sm', 'xs'];
	for (var i = dsize.length - 1; i >= 0; i--) {

		// Need to add &nbsp; for Chrome. Works fine in Firefox/Safari/Opera without it.
		// Chrome seem to have an issue with empty div's
		$el = $('<div id="sizeTest" class="hidden-' + dsize[i] + '">&nbsp;</div>');
		$el.appendTo($('body'));

		if ($el.is(':hidden')) {
			$el.remove();
			return dsize[i];
		}
	}
	return 'unknown';
}


