function mostraBotoesBT(men){
	var html = "";
	//menu
	i3GEO.configura = {"locaplic" : ".."};
	html = Mustache.to_html(
			"{{#d}}" + $("#botoesTpl").html() + "{{/d}}",
			{"d":botoesIni,"abrir" : $trad(36,g_traducao_init)}
	);
	$("#botoesTpl").html(html);
}
function mostraBotoesBT(){
	var r, p;

	r = function(d){
		d = d.data;
		var html = "", n, camadas = [], i;
		n = d.mapas.length;
		for(i=0; i<n; i++){
			d.mapas[i] = verificaMapa(d.mapas[i]);
		}
		html = Mustache.to_html(
				"{{#mapas}}" + $("#botoesTpl").html() + "{{/mapas}}",
				d
		);

		$("#botoesTpl").html(html);
		d.mapas.push({
			"ID_MAPA": "topo",
			"NOME": "Topo"
		});
		//indice
		html = Mustache.to_html(
				"{{#mapas}}" + $("#indiceTpl").html() + "{{/mapas}}",
				d
		);
		$("#indice").html(html);
		$('[data-toggle="quadroQrcode"]').popover({
			html: true,
			placement: "bottom",
			trigger: "focus",
			container: "body",
			content: function(){
				var urlqr = "../pacotes/qrcode/php/qr_img.php?host=" + window.location.host + "&u=" + $(this).attr("data-url");
				return "<a title='click' href='"+ $(this).attr("data-url") +"'><img style='width:200px; height: 200px;' src='" + urlqr + "' '></a>";
			}
		});
	};
	//cpJSON vem de class_php.js
	cpJSON.call("../classesphp/mapa_controle.php?map_file=&funcao=pegaMapas&g_sid=", "foo", r);
}
function verificaMapa(mapa){
	var link, nome, combo, links = [], html;
	//imagem dinamica ou nao
	if(mapa.IMAGEM == ""){
		mapa.IMAGEM = i3GEO.configura.locaplic
		+ "/ferramentas/salvamapa/geraminiatura.php?w=100&h=90&restauramapa="
		+ mapa.ID_MAPA;
	}
	//constroi o link para o mapa
	if(mapa.LINK != ""){
		link = i3GEO.configura.locaplic + "/ms_criamapa.php?temasa=" + mapa.TEMAS + "&layers=" + mapa.LIGADOS;
		if (mapa.EXTENSAO !== "") {
			link += "&mapext=" + mapa.EXTENSAO;
		}
		if (mapa.OUTROS !== "") {
			link += "&" + mapa.OUTROS;
		}
		mapa.LINK = link;
		links.push({
			"nome": "Default",
			"link": mapa.LINK,
			"copiado": $trad("copiado",g_traducao_mapas)
		});
	}
	// verifica se o mapfile esta salvo no banco
	// diretamente
	if (mapa.CONTEMMAPFILE != "nao") {
		links = [
		         {
		        	 "copiado": $trad("copiado",g_traducao_mapas),
		        	 "nome": "Como foi salvo",
		        	 "link": mapa.LINK
		         },{
		        	 "copiado": $trad("copiado",g_traducao_mapas),
		        	 "nome": "Openlayers com todos os botoes",
		        	 "link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA
		         },{
		        	 "copiado": $trad("copiado",g_traducao_mapas),
		        	 "nome": "Sem o fundo",
		        	 "link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA + "&fundo=est_wms"
		         },{
		        	 "copiado": $trad("copiado",g_traducao_mapas),
		        	 "nome": "Com botoes principais",
		        	 "link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA + "&fundo=e_wsm&botoes=legenda pan zoombox zoomtot zoomin zoomout distancia area identifica"
		         },{
		        	 "copiado": $trad("copiado",g_traducao_mapas),
		        	 "nome": "Botoes de navegacao",
		        	 "link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA
		         }
		         ];

	}
	html = Mustache.to_html(
			"{{#d}}" + $("#templateLinks").html() + "{{/d}}",
			{"d":links}
	);
	mapa.subtitulo = html;
	return mapa;
}
function alerta(texto,d){
	if(!d){
		d = 500;
	}
	var a = $(".alert");
	a.html(texto);
	a.slideDown(d)
	a.delay(d).slideUp(d)
}

