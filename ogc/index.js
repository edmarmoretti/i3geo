function listaDoNivelMenu(templateMenus,templateGrupos,templateSubGrupos,templateCamadas){
	var r = function(retorno) {
		var menus = retorno.data,
		nmenus = menus.length, i = 0, s = [], camadasRaiz, dataMenu, htmlMenus, grupos;
		for(i=0; i<nmenus; i++){
			camadasRaiz = "";
			dataMenu = menus[i];
			if(dataMenu.temas){
				camadasRaiz = ckCamada(dataMenu.temas,templateCamadas,"tema");
				dataMenu["camadas"] = camadasRaiz;
			}
			htmlMenus = Mustache.to_html(
					templateMenus,
					dataMenu
			);
			s.push(htmlMenus);
		}
		$("#arvore").html(s.join(""));
		//pega os grupos do menu
		for(i=0; i<nmenus; i++){
			grupos = function(retorno){
				if(retorno.data){
					var gr = retorno.data.grupos,
					c, i = 0, g = [], camadas, htmlGrupos, subgrupos, nsubgrupos, j, htmlSubGrupos;
					//verifica se existem dados na raiz e grupos
					if(gr[0].length == 0 && gr[1].temasraiz.length == 0){
						$("#gruposMenu"+retorno.data.idmenu).html("");
						return;
					}
					c = gr.length - 3;
					g = [];
					i = 0;
					//camadas na raiz do grupo
					for (i = 0; i < c; i++) {
						if(gr[i].temasgrupo){
							camadas = ckCamada(gr[i].temasgrupo,templateCamadas,"tema");
							gr[i]["camadas"] = camadas;
						} else {
							gr[i]["camadas"] = "";
						}
						g.push(gr[i]);
					}
					if(g){
						htmlGrupos = Mustache.to_html(
								"{{#grupos}}" + templateGrupos + "{{/grupos}}",
								{"grupos":g}
						);
					}
					$("#gruposMenu"+retorno.data.idmenu).html(htmlGrupos);
					for (i = 0; i < c; i++) {
						subgrupos = gr[i].subgrupos;
						id_n1 = gr[i]["id_n1"];

						nsubgrupos = subgrupos.length;
						j = 0;
						for( j = 0; j < nsubgrupos; j++){
							subgrupos[j]["id_n1"] = id_n1;
							subgrupos[j]["idmenu"] = retorno.data.idmenu;
						}
						htmlSubGrupos = Mustache.to_html(
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
	};
	i3GEO.php.pegalistademenus(r);
}
function listaCamadasSubgrupo(idmenu,id_n1,id_n2){
	//console.info(id_n2)
	var corpo = $("#corpoSubGrupo"+id_n2),
	camadas;
	if(corpo.html().trim()+"x" == "x"){
		corpo.html('<div class="panel-body"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Aguarde</span></div>')

	}
	var r = function(retorno){
		camadas = ckCamada(retorno.data.temas,$("#templateCamadas").html(),"tema");
		corpo.html('<div class="panel-body">' + camadas + "</div>");
	}
	i3GEO.php.pegalistadetemas(r, idmenu, id_n1, id_n2);
}
function listaMetaestat (onde,templateCamadas){
	var r, p;
	r = function(d){
		var html = "", n, camadas = [], i, t;
		n = d.length;
		if(n > 0){
			for(i=0; i<n; i++){
				t = d[i];
				camadas.push({
					"nome": t.nomemedida,
					"hidden": "",
					"codigo_tema": t.id_medida_variavel
				});
			}

			html = Mustache.to_html(
					onde.html(),
					{
						"nomemeta":$trad("nomemeta",g_traducao_ogc),
						"camadasmeta": ckCamada(camadas,templateCamadas,"meta"),
						"hidden": "hidden"
					}
			);
		}
		onde.html(html);
	};
	//cpJSON vem de class_php.js
	cpJSON.call("../admin/php/metaestat.php?funcao=listaMedidaVariavel&codigo_variavel=&g_sid=", "foo", r);


}
function ckCamada(camadas,templateCamadas,tipo){
	var ncamadas = [],
	html;
	//marca as camadas que nao sao ogc
	$(camadas).each(function() {
		if(tipo == "tema" && this.ogc_tema != "NAO"){
			if(this.link_tema == ""){
				this.hidden = "hidden";
			}
			this.tipo = tipo;
			ncamadas.push(this);
		}
		if(tipo == "meta"){
			this.hidden = "hidden";
			this.tipo = tipo;
			ncamadas.push(this);
		}
	});
	html = Mustache.to_html(
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
function mostraLinksServico(tema,tipo){
	var html;

	if(tipo == "meta"){
		tradLinks["tema"] = "metaestat_"+tema;
		tradLinks["id_medida_variavel"] = "&id_medida_variavel="+tema;
	}
	else{
		tradLinks["tema"] = tema;
	}

	html = Mustache.to_html(
			$("#templateLinks").html(),
			tradLinks
	);
	$(".modal-body").html(html);
}