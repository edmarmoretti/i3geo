function listaDoNivelMenu(templateMenus,templateGrupos,templateCamadas){
	var r = function(retorno) {
		var menus = retorno.data;
		var nmenus = menus.length;
		var i = 0;
		var s = [];
		for(i=0; i<nmenus; i++){
			var dataMenu = menus[i];
			var camadasRaiz = ckCamada(dataMenu.temas,templateCamadas);
			dataMenu["camadas"] = camadasRaiz;
			var htmlMenus = Mustache.to_html(
					templateMenus,
					dataMenu
			);
			s.push(htmlMenus);
		}
		$("#arvore").html(s.join(""));
		//pega os grupos do menu
		for(i=0; i<nmenus; i++){
			var grupos = function(retorno){
				var gr = retorno.data.grupos;
				var c = gr.length - 3;
				var g = [];
				var i = 0;

				for (i = 0; i < c; i++) {
					var camadas = ckCamada(gr[i].temasgrupo,templateCamadas);
					gr[i]["camadas"] = camadas;
					g.push(gr[i]);
				}

				var htmlGrupos = Mustache.to_html(
						"{{#grupos}}" + templateGrupos + "{{/grupos}}",
						{"grupos":g}
				);
				$("#gruposMenu"+retorno.data.idmenu).html(htmlGrupos);
			};
			i3GEO.php.pegalistadegrupos(grupos, menus[i]["idmenu"], "nao");
		}
		//$.material.init();
	};
	i3GEO.php.pegalistademenus(r);
}
function ckCamada(camadas,templateCamadas){
	//remove as camadas que nao sao ogc
	var ncamadas = [];
	$(camadas).each(function() {
		if(this.ogc_tema != "NAO"){
			ncamadas.push(this);
		}
	});
	var html = Mustache.to_html(
			"{{#data}}" + templateCamadas + "{{/data}}",
			{"data":ncamadas}
	);
	if(html != ""){
		return '<div class="list-group">'+html+'</div>';
	}
	else{
		return "";
	}
}
