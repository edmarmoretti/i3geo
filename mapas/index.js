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
	i3GEO.configura = {"locaplic" : ".."};
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
		html = Mustache.to_html(
				"{{#mapas}}" + $("#indice").html() + "{{/mapas}}",
				d
		);
		$("#indice").html(html);
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
	lkd = mapa.LINK;
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
		            "nome": "",
		            "link": mapa.LINK
		});
	}
	// verifica se o mapfile esta salvo no banco
	// diretamente
	mapa.NOME =  mapa.NOME + " (" + mapa.ID_MAPA + ")";
	if (mapa.CONTEMMAPFILE != "nao") {
		links = [
		            {
		            	"nome": "Como foi salvo",
		            	"link": mapa.LINK
		            },{
		            	"nome": "Openlayers com todos os botoes",
		            	"link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA
		            },{
		            	"nome": "Sem o fundo",
		            	"link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA + "&fundo=est_wms"
		            },{
		            	"nome": "Com botoes principais",
		            	"link": i3GEO.configura.locaplic + "/mashups/openlayers.php?numzoomlevels=18&restauramapa=" + mapa.ID_MAPA + "&fundo=e_wsm&botoes=legenda pan zoombox zoomtot zoomin zoomout distancia area identifica"
		            },{
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

