i3GEO.configura.locaplic = i3GEO.util.protocolo()+"://"+window.location.host+"/i3geo";
i3GEO.configura.autotamanho = false;
i3GEO.Interface.ATUAL = "openlayers";
i3GEO.Interface.IDCORPO = "contemImg";
//ativa ou desativa o balao de info ao clicar no mapa
i3GEO.eventos.cliquePerm.ativo = true;
//
//define a funcao que sera executada ao clicar no mapa
//default (balao do tipo etiqueta)
i3GEO.eventos.MOUSECLIQUEPERM = [i3GEO.configura.funcaoTip];
//alternativo (janela de identificacao
//i3GEO.eventos.MOUSECLIQUEPERM = [i3GEO.configura.funcaoIdentifica];
//
i3GEO.Interface.openlayers.GADGETS = {
		PanZoomBar:true,
		PanZoom:false,
		LayerSwitcher:false,
		ScaleLine:true,
		OverviewMap:false
	};
i3GEO.Interface.openlayers.TILES = true;
i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.finaliza = 'if($i("omenudataInterface1")){i3GEOoMenuBar.getMenuItem("omenudataInterface1").cfg.setProperty("text", " ");}';
i3GEO.configura.mapaRefDisplay = "none";
i3GEO.barraDeBotoes.OFFSET = -3;
i3GEO.configura.oMenuData["submenus"]["janelas"] = [];
i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.permiteLogin = false;
i3GEO.ajuda.ATIVAJANELA = false;
i3GEO.idioma.IDSELETOR = "seletorIdiomas";

i3GEO.arvoreDeTemas.TIPOBOTAO = "radio";

i3GEO.arvoreDeTemas.OPCOESADICIONAIS.comentarios = false;
i3GEO.arvoreDeCamadas.VERIFICAABRANGENCIATEMAS = false;
i3GEO.arvoreDeCamadas.MOSTRALISTAKML = false;
i3GEO.arvoreDeCamadas.FINALIZA = "i3GEO.arvoreDeCamadas.ARVORE.collapseAll()";
i3GEO.mapa.AUTORESIZE = true;
OpenLayers.ImgPath = "../../../pacotes/openlayers/img/";
//
//adiciona camadas que podem ser ativadas como fundo do mapa
//
(function(){
	var oce = new OpenLayers.Layer.ArcGIS93Rest(
		"ESRI Ocean Basemap",
		"http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/export",
		{format:"jpeg"},
		{isBaseLayer:true,visibility:false}
	);
	var ims = new OpenLayers.Layer.ArcGIS93Rest(
		"ESRI Imagery World 2D",
		"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/export",
		{format:"jpeg"},
		{isBaseLayer:true,visibility:false}
	);
	var wsm = new OpenLayers.Layer.ArcGIS93Rest(
		"ESRI World Street Map",
		"http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer/export",
		{format:"jpeg"},
		{isBaseLayer:true,visibility:false}
	);
	var tms = new OpenLayers.Layer.TMS(
			"OSGEO",
			"http://tilecache.osgeo.org/wms-c/Basic.py/",
			{
					layername: "basic",
					type: "png",
					// set if different than the bottom left of map.maxExtent
					tileOrigin: new OpenLayers.LonLat(-180,-90),
					isBaseLayer:true,
					visibility:false
			}
	);
	i3GEO.Interface.openlayers.LAYERSADICIONAIS = [oce,ims,wsm,tms];
})();
i3GEO.finaliza = function(){
	if($i("i3GEOlogoMarca"))
	{$i("i3GEOlogoMarca").style.display = "none";}
	i3GEO.mapa.insereDobraPagina("googlemaps","../../../imagens/dobragooglemaps.png");
};
i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir = false;
i3GEO.janela.TRANSICAOSUAVE = true;
//menu
i3GEO.configura.oMenuData.menu = [
	{nome:$trad("s1"),id:"ajudaMenu"},
	{nome:$trad("s2"),id:"analise"},
	{nome:$trad("u15a"),id:"ferramentas"}
];
var b = i3GEOF.metaestat.analise.botoes,
	n = b.length;
i3GEO.configura.oMenuData.submenus.ferramentas = [];
for(var i=0;i<n;i++){
	i3GEO.configura.oMenuData.submenus.ferramentas.push({
		id:"omenudataFerramentas"+i,
		text: b[i].titulo,
		url: "javascript:"+b[i].onclick
	});
}
