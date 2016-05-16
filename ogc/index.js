function listaDoNivelMenu(templateMenus,templateGrupos,templateSubGrupos,templateCamadas){
	var r = function(retorno) {
		var menus = retorno.data;
		var nmenus = menus.length;
		var i = 0;
		var s = [];
		for(i=0; i<nmenus; i++){
			var camadasRaiz = "",
				dataMenu = menus[i];
			if(dataMenu.temas){
				camadasRaiz = ckCamada(dataMenu.temas,templateCamadas);
				dataMenu["camadas"] = camadasRaiz;
			}
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
				if(retorno.data){
					var gr = retorno.data.grupos;
					//verifica se existem dados na raiz e grupos
					if(gr[0].length == 0 && gr[1].temasraiz.length == 0){
						$("#gruposMenu"+retorno.data.idmenu).html("");
						return;
					}
					var c = gr.length - 3;
					var g = [];
					var i = 0;
					//camadas na raiz do grupo
					for (i = 0; i < c; i++) {
						if(gr[i].temasgrupo){
							var camadas = ckCamada(gr[i].temasgrupo,templateCamadas);
							gr[i]["camadas"] = camadas;
						} else {
							gr[i]["camadas"] = "";
						}
						g.push(gr[i]);
					}
					if(g){
						var htmlGrupos = Mustache.to_html(
								"{{#grupos}}" + templateGrupos + "{{/grupos}}",
								{"grupos":g}
						);
					}
					$("#gruposMenu"+retorno.data.idmenu).html(htmlGrupos);
					for (i = 0; i < c; i++) {
						var subgrupos = gr[i].subgrupos;
						id_n1 = gr[i]["id_n1"];

						var nsubgrupos = subgrupos.length;
						var j = 0;
						for( j = 0; j < nsubgrupos; j++){
							subgrupos[j]["id_n1"] = id_n1;
							subgrupos[j]["idmenu"] = retorno.data.idmenu;
						}
						var htmlSubGrupos = Mustache.to_html(
								"{{#s}}" + templateSubGrupos + "{{/s}}",
								{"s":subgrupos}
						);
						if(id_n1){
							$("#subGruposGrupo"+id_n1).html(htmlSubGrupos);
						}
					}
				}
			};
			i3GEO.php.pegalistadegrupos(grupos, menus[i]["idmenu"], "sim");
		}
		//$.material.init();
	};
	i3GEO.php.pegalistademenus(r);
}
function listaCamadasSubgrupo(idmenu,id_n1,id_n2){
	//console.info(id_n2)
	var corpo = $("#corpoSubGrupo"+id_n2);
	if(corpo.html().trim()+"x" == "x"){
		corpo.html('<div class="panel-body"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span></div>')

	}
	var r = function(retorno){
		var camadas = ckCamada(retorno.data.temas,$("#templateCamadas").html());
		corpo.html('<div class="panel-body">' + camadas + "</div>");
	}
	i3GEO.php.pegalistadetemas(r, idmenu, id_n1, id_n2);
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
