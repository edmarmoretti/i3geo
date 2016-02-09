function atlasInicia() {
	if ($i("guia6")) {
		$i("guia6").onclick = function() {
			g_guiaativa = "guia6";
			mostraguiaf(6);
		};
	}
	objmapa = new Mapa();
	objmapa.inicializa();

	// corrige a altura da guia 6
	$i("guia6obj").style.height = objmapa.h;
}
function atlasMapa(mapa, temas) {
	if ($i(mapa)) {
		$i("atlasTexto").innerHTML = $i(mapa).innerHTML;
	} else {
		$i("atlasTexto").innerHTML = "";
	}
	if ($i("guia1obj")) {
		// desliga todos
		var iguias = $i("guia1obj").getElementsByTagName("input");
		for (var i = 0; i < iguias.length; i++) {
			if (iguias[i].type == "checkbox") {
				iguias[i].checked = false;
			}
		}
		// liga o que interessa
		temas = temas.split(",");
		for (var i = 0; i < temas.length; i++) {
			for (var j = 0; j < iguias.length; j++) {
				if (iguias[j].type == "checkbox") {
					if (iguias[j].value == temas[i]) {
						iguias[j].checked = true;
					}
				}
			}
		}
		// sempre ligados
		temas = new Array("estadosl", "zee", "mundo", "brasil", "estados");
		for (i = 0; i < temas.length; i++) {
			for (j = 0; j < iguias.length; j++) {
				if (iguias[j].type == "checkbox") {
					if (iguias[j].value == temas[i]) {
						iguias[j].checked = true;
					}
				}
			}
		}
	}
	remapaf();
}
