botoesIni = [];
botoesIni.push({
	"img":"certificate-server.png",
	"href":"../testainstal.php",
	"titulo":$trad(2,g_traducao_init),
	"subtitulo": "Verifica se a instalação do i3Geo está correta e mostra algumas das características do servidor, como as versões dos softwares básicos instalados.",
	"fa": "check",
	"atalho": false
},{
	"img":"applications-development-web.png",
	"href":"../admin",
	"titulo":$trad(3,g_traducao_init),
	"subtitulo": "",
	"fa": "cogs",
	"atalho": true
},{
	"img":"openlayers.png",
	"href":"../<?php echo $customDir; ?>/black_ol.htm",
	"titulo":$trad(4,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": true
},{
	"img":"openlayersdebug.png",
	"href":"../<?php echo $customDir; ?>/openlayersdebug.htm",
	"titulo":$trad(5,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": true
},{
	"img":"osm.png",
	"href":"../<?php echo $customDir; ?>/black_osm.htm",
	"titulo":$trad(23,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": true
},{
	"img":"mashup.png",
	"href":"../mashups",
	"titulo":$trad(18,g_traducao_init) + "<br><a href='../mashups/osm.php?temas=&largura=800&altura=500' target=_blank >OSM</a>" + " - <a href='../mashups/openlayers.php?temas=&largura=800&altura=500' target=_blank >OpenLayers</a>",
	"subtitulo": "",
	"fa": "map-o",
	"atalho": false
},{
	"img":"googlemaps.png",
	"href":"../<?php echo $customDir; ?>/black_gm.phtml",
	"titulo":$trad(6,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": true
},{
	"img":"googlemaps_noite.png",
	"href":"../<?php echo $customDir; ?>/googlemaps_noite.phtml",
	"titulo":$trad(22,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": false
},{
	"img":"googleearth.png",
	"href":"../<?php echo $customDir; ?>/googleearth.phtml",
	"titulo":$trad(7,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": false
},{
	"img":"cartogramas.png",
	"href":"../<?php echo $customDir; ?>/black_carto_ol.htm",
	"titulo":$trad(8,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": false
},{
	"img":"editor.png",
	"href":"../ferramentas/metaestat/editorlimites.php",
	"titulo":$trad(9,g_traducao_init),
	"subtitulo": "",
	"fa": "map-o",
	"atalho": false
},{
	"img":"window-duplicate.png",
	"href":"../ferramentas/salvamapa/lista.htm",
	"titulo":$trad(34,g_traducao_init),
	"subtitulo": "",
	"fa": "list",
	"atalho": true
},{
	"img":"svn-update.png",
	"href":"../datadownload.htm",
	"titulo":$trad(10,g_traducao_init),
	"subtitulo": "",
	"fa": "download",
	"atalho": false
},{
	"img":"ogc_logo.jpg",
	"href":"../ogc.htm",
	"titulo":$trad(11,g_traducao_init),
	"subtitulo": "",
	"fa": "download",
	"atalho": true
},{
	"img":"application-vnd-google-earth-kml.png",
	"href":"../kml.php",
	"titulo":$trad(12,g_traducao_init),
	"subtitulo": "",
	"fa": "download",
	"atalho": false
},{
	"img":"../imagens/saiku_free_small.png",
	"href":"../ferramentas/saiku/esquemaxml.php?locaplic="+window.location.href.replace("/init/index.php",""),
	"titulo":$trad(25,g_traducao_init),
	"subtitulo": " <a style='cursor:pointer;' target=_blank src='https://medium.com/innovative-business-intelligence/so-people-who-land-on-our-community-download-page-will-notice-a-subtle-difference-when-they-click-1b61aca316c5' >"+$trad(29,g_traducao_init)+"</a>",
	"fa": "bar-chart",
	"atalho": false
},{
	"img":"../imagens/gvsig.jpg",
	"href":"../pacotes/gvsig/gvsig2mapfile/upload.htm",
	"titulo":$trad(26,g_traducao_init),
	"subtitulo": "",
	"fa": "upload",
	"atalho": false
},{
	"img":"insert-link.png",
	"href":"../geradordelinks.htm",
	"titulo":$trad(13,g_traducao_init),
	"subtitulo": "",
	"fa": "link",
	"atalho": false
},{
	"img":"atlas.png",
	"href":"../atlas",
	"titulo":$trad(27,g_traducao_init),
	"subtitulo": "",
	"fa": "list",
	"atalho": false
},{
	"img":"folder-image.png",
	"href":"../exemplos",
	"titulo":$trad(14,g_traducao_init),
	"subtitulo": "",
	"fa": "graduation-cap",
	"atalho": false
},{
	"img":"applications-development.png",
	"href":"../pacotes/utils/index.php",
	"titulo":$trad(33,g_traducao_init),
	"subtitulo": "",
	"fa": "wrench"
},{
	"img":"accessories-dictionary.png",
	"href":"../guia_de_migracao.txt",
	"titulo":$trad(17,g_traducao_init),
	"subtitulo": "",
	"fa": "book",
	"atalho": false
},{
	"img":"accessories-dictionary.png",
	"href":"../documentacao",
	"titulo":$trad(24,g_traducao_init),
	"subtitulo": "",
	"fa": "book",
	"atalho": false
},{
	"img":"accessories-dictionary.png",
	"href":"http://moodle.gvsig-training.com/course/view.php?id=11",
	"titulo":$trad(28,g_traducao_init),
	"subtitulo": "",
	"fa": "book",
	"atalho": true
},{
	"img":"tools-report-bug.png",
	"href":"https://softwarepublico.gov.br/gitlab/i3geo/i3geo/issues",
	"titulo":$trad(16,g_traducao_init),
	"subtitulo": "",
	"fa": "bug",
	"atalho": false
},{
	"img":"../imagens/apple-touch-icon.png",
	"href":"https://softwarepublico.gov.br/gitlab/groups/i3geo",
	"titulo":$trad(30,g_traducao_init),
	"subtitulo": "",
	"fa": "group",
	"atalho": true
},{
	"img":"logo_psp.png",
	"href":"https://portal.softwarepublico.gov.br/social/i3geo/",
	"titulo":$trad(31,g_traducao_init),
	"subtitulo": "",
	"fa": "group",
	"atalho": false
},{
	"img":"mailman.jpg",
	"href":"http://lists.osgeo.org/cgi-bin/mailman/listinfo/i3geo",
	"titulo":$trad(32,g_traducao_init),
	"subtitulo": "",
	"fa": "envelope",
	"atalho": true
}
);
function mostraBotoes(){
	$i("mensagemLogin").innerHTML = men;

	i3GEO.configura = {"locaplic" : ".."};
	i3GEO.idioma.IDSELETOR = "bandeiras";
	i3GEO.idioma.mostraSeletor();
	//i3GEO.barraDeBotoes.ATIVA = false;
	var ins = [],i,n = botoesIni.length,texto;
	for(i=0;i<n;i++){
		texto = '<div class="r" ><div class="ri" ><a target=_blank href="'+botoesIni[i].href+'" ><img style="max-height:77px;" src="'+botoesIni[i].img+'" /><br><br>'+botoesIni[i].titulo+'</a>';
		if(botoesIni[i].subtitulo){
			texto += botoesIni[i].subtitulo;
		}
		texto += '</div></div>';
		ins.push(texto);
	}
	$i("botoes").innerHTML = ins.join("");
	$i("conteudo").style.height = i3GEO.util.getScrollHeight() + "px";
}
function mostraBotoesBT(template,men){
	$i("mensagemLogin").innerHTML = men;
	$i("jumbotron").innerHTML = "<img src='../imagens/i3Geo_bigTransp.png' style='float:left;width:80px;margin:5px;' /><p>"+$trad(35,g_traducao_init)+"</p>";
	i3GEO.configura = {"locaplic" : ".."};
	i3GEO.idioma.IDSELETOR = "bandeiras";
	i3GEO.idioma.mostraSeletor();
	//i3GEO.barraDeBotoes.ATIVA = false;
	var atalhos = [], ins = [],i,n = botoesIni.length;
	for(i=0;i<n;i++){
		ins.push(Mustache.render(template, botoesIni[i]));
		if(botoesIni[i].atalho){
			atalhos.push(Mustache.render('<a href="{{{href}}}" target="_blank" class="btn btn-raised">{{{titulo}}}</a>', botoesIni[i]));
		}
	}
	$i("botoes").innerHTML = ins.join("");
	//$i("atalhos").innerHTML = atalhos.join("");
}
