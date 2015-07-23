botoesIni = [];
botoesIni.push({
	"img":"certificate-server.png",
	"href":"../testainstal.php",
	"titulo":$trad(2,g_traducao_init)
	},{
	"img":"applications-development-web.png",
	"href":"../admin",
	"titulo":$trad(3,g_traducao_init)
	},{
	"img":"openlayers.png",
	"href":"../<?php echo $customDir; ?>/black_ol.htm",
	"titulo":$trad(4,g_traducao_init)
	},{
	"img":"openlayersdebug.png",
	"href":"../<?php echo $customDir; ?>/openlayersdebug.htm",
	"titulo":$trad(5,g_traducao_init)
	},{
		"img":"osm.png",
		"href":"../<?php echo $customDir; ?>/black_osm.htm",
		"titulo":$trad(23,g_traducao_init)
	},{
	"img":"mashup.png",
	"href":"../mashups",
	"titulo":$trad(18,g_traducao_init) + "<br><a href='../mashups/osm.php?temas=&largura=800&altura=500' target=_blank >OSM</a>" + " - <a href='../mashups/openlayers.php?temas=&largura=800&altura=500' target=_blank >OpenLayers</a>"
	},{
	"img":"googlemaps.png",
	"href":"../<?php echo $customDir; ?>/black_gm.phtml",
	"titulo":$trad(6,g_traducao_init)
	},{
	"img":"googlemaps_noite.png",
	"href":"../<?php echo $customDir; ?>/googlemaps_noite.phtml",
	"titulo":$trad(22,g_traducao_init)
	},{
	"img":"googleearth.png",
	"href":"../<?php echo $customDir; ?>/googleearth.phtml",
	"titulo":$trad(7,g_traducao_init)
	},{
	"img":"cartogramas.png",
	"href":"../<?php echo $customDir; ?>/black_carto_ol.htm",
	"titulo":$trad(8,g_traducao_init)
	},{
	"img":"editor.png",
	"href":"../ferramentas/metaestat/editorlimites.php",
	"titulo":$trad(9,g_traducao_init)
	},{
	"img":"window-duplicate.png",
	"href":"../ferramentas/salvamapa/lista.htm",
	"titulo":$trad(34,g_traducao_init)
	},{
	"img":"svn-update.png",
	"href":"../datadownload.htm",
	"titulo":$trad(10,g_traducao_init)
	},{
	"img":"ogc_logo.jpg",
	"href":"../ogc.htm",
	"titulo":$trad(11,g_traducao_init)
	},{
	"img":"application-vnd-google-earth-kml.png",
	"href":"../kml.php",
	"titulo":$trad(12,g_traducao_init)
	},{
	"img":"../imagens/saiku_free_small.png",
	"href":"../ferramentas/saiku/esquemaxml.php?locaplic="+window.location.href.replace("/init/index.php",""),
	"titulo":$trad(25,g_traducao_init),
	"subtitulo": " <a style='cursor:pointer;' target=_blank src='https://medium.com/innovative-business-intelligence/so-people-who-land-on-our-community-download-page-will-notice-a-subtle-difference-when-they-click-1b61aca316c5' >"+$trad(29,g_traducao_init)+"</a>",
	},{
	"img":"../imagens/gvsig.jpg",
	"href":"../pacotes/gvsig/gvsig2mapfile/upload.htm",
	"titulo":$trad(26,g_traducao_init)
	},{
	"img":"insert-link.png",
	"href":"../geradordelinks.htm",
	"titulo":$trad(13,g_traducao_init)
	},{
	"img":"atlas.png",
	"href":"../atlas",
	"titulo":$trad(27,g_traducao_init)
	},{
	"img":"folder-image.png",
	"href":"../exemplos",
	"titulo":$trad(14,g_traducao_init)
	},{
		"img":"applications-development.png",
		"href":"../pacotes/utils/index.php",
		"titulo":$trad(33,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../guia_de_migracao.txt",
	"titulo":$trad(17,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"../documentacao",
	"titulo":$trad(24,g_traducao_init)
	},{
	"img":"accessories-dictionary.png",
	"href":"http://moodle.gvsig-training.com/course/view.php?id=11",
	"titulo":$trad(28,g_traducao_init)
	},{
	"img":"tools-report-bug.png",
	"href":"http://svn.softwarepublico.gov.br/trac/i3geo/newticket",
	"titulo":$trad(16,g_traducao_init)
	},{
	"img":"trac_logo_mini.png",
	"href":"http://svn.softwarepublico.gov.br/trac/i3geo/wiki",
	"titulo":$trad(30,g_traducao_init)
	},{
	"img":"logo_psp.png",
	"href":"http://www.softwarepublico.gov.br/ver-comunidade?community_id=1444332",
	"titulo":$trad(31,g_traducao_init)
	},{
	"img":"mailman.jpg",
	"href":"http://lists.osgeo.org/cgi-bin/mailman/listinfo/i3geo",
	"titulo":$trad(32,g_traducao_init)
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
		texto = '<div class="r" ><div class="ri" ><a target=_blank href="'+botoesIni[i].href+'" ><img src="'+botoesIni[i].img+'" /><br><br>'+botoesIni[i].titulo+'</a>';
		if(botoesIni[i].subtitulo){
			texto += botoesIni[i].subtitulo;
		}
		texto += '</div></div>';
		ins.push(texto);
	}
	$i("botoes").innerHTML = ins.join("");
	$i("conteudo").style.height = i3GEO.util.getScrollHeight() + "px";
}
