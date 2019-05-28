if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
var cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
cpJSON.set_transfer_mode("POST");
/*
            i3GEO.request.get({
                snackbar: false,
                snackbarmsg: false,
                btn: false,
                par: {
                    filtraOgc: "nao",
                    filtraDown: "nao",
                    idioma: i3GEO.idioma.ATUAL,
                    funcao: "pegalistademenus"
                },
                prog: "/serverapi/catalog/",
                fn: function(data){
                    if (after){
                        after.call(after, data);
                    }
                }
            });
 */
i3GEO.php =
{
	verifica : function() {
	},
	excluitema : function() {
	    console.error("Veja i3GEO.tema.exclui()");
	},
	reordenatemas : function() {
	    console.error("Veja i3GEO.arvoredecamadas.reordenatemas()");
	},
	criaLegendaHTML : function(funcao, tema, template) {
	    console.error("criaLegendaHTML removido");
	},
	criaLegendaJSON : function() {
	    console.error("Veja i3GEO.legenda.criaLegendaJSON()");
	},
	inverteStatusClasse : function() {
	    console.error("Veja i3GEO.legenda.inverteStatusClasse()");
	},
	ligatemas : function() {
	    console.error("Veja i3GEO.arvoreDeCamadas.ligatemas()");
	},
	pegalistademenus : function() {
	    console.error("Veja i3GEO.catalogoMenus.getMenus()");
	},
	pegalistadegrupos : function() {
	    console.error("Veja i3GEO.catalogoMenus.listaDeGrupos()");
	},
	pegalistadeSubgrupos : function(funcao, id_menu, id_grupo) {
	    console.error("Veja i3GEO.catalogoMenus.getSubGrupos()");
	},
	pegalistadetemas : function(funcao, id_menu, id_grupo, id_subgrupo) {
	    console.error("Veja i3GEO.catalogoMenus.getTemas()");
	},
	listaTemas : function(funcao, tipo, locaplic, sid) {
	    console.error("Removido na versao 8");
	},
	listaTemasEditaveis : function(funcao, locaplic, sid) {
	    console.error("Removido na versao 8");
	},
	listaTemasComSel : function(funcao, locaplic, sid) {
	    console.error("Removido na versao 8");
	},
	listatemasTipo : function(funcao, tipo, locaplic, sid) {
	    console.error("Removido na versao 8");
	},
	pegaSistemas : function(funcao) {
	    console.error("Veja i3GEO.catalogoSistemas.listaDeTemas()");
	},
	listadrives : function(funcao) {
	    console.error("Veja i3GEO.catalogoDir.getDrives()");
	},
	listaarquivos : function(funcao, caminho) {
	    console.error("Veja i3GEO.catalogoDir.getFiles()");
	},
	mudatamanho : function(funcao, altura, largura) {
	    console.error("Veja i3GEO.mapa.mudatamanho()");
	},
	ativalogo : function(funcao, altura, largura) {
	    console.error("Removido na versao 8");
	},
	insereAnnotation : function() {
	    console.error("Removido na versao 8");
	},
	identificaunico : function(funcao, xy, tema, item) {
	    console.error("Removido na versao 8");
	},
	recuperamapa : function(funcao) {
	    console.error("Removido na versao 8");
	},
	criaLegendaImagem : function(funcao) {
	    console.error("Removido na versao 8");
	},
	referenciadinamica : function(funcao, zoom, tipo, w, h) {
	    console.error("Removido na versao 8");
	},
	pan : function(funcao, escala, tipo, x, y) {
	    console.error("Removido na versao 8");
	},
	zoomponto : function(funcao, x, y, tamanho, simbolo, cor) {
	    console.error("Veja i3GEO.navega.zoomponto()");
	},
	localizaIP : function(funcao) {
	    console.error("Removido na versao 8");
	},
	mudaext : function(funcao, tipoimagem, ext, locaplic, sid, atualiza, geo) {
	    console.error("Veja i3GEO.Interface.zoom2ext()");
	},
	mudaescala : function(funcao, escala) {
	    console.error("Removido na versao 8");
	},
	aplicaResolucao : function(funcao, resolucao) {
	    console.error("Removido na versao 8");
	},
	geradestaque : function(funcao, tema, ext) {
	    console.error("Removido na versao 8");
	},
	sobetema : function(funcao, tema) {
	    console.error("Veja i3GEO.mapa.moveLayerUp()");
	},
	descetema : function(funcao, tema) {
	    console.error("Veja i3GEO.mapa.moveLayerDown()");
	},
	fontetema : function(funcao, tema) {
	    console.error("Removido na versao 8");
	},
	zoomtema : function(funcao, tema) {
	    console.error("Veja i3GEO.mapa.extentToLayer()");
	},
	zoomsel : function(funcao, tema) {
	    console.error("Veja i3GEO.tema.zoomsel()");
	},
	limpasel : function(funcao, tema) {
	    console.error("Veja i3GEO.tema.limpasel()");
	},
	invertestatuslegenda : function(funcao, tema) {
	    console.error("Veja i3GEO.tema.invertestatuslegenda()");
	},
	aplicaCorClasseTema : function(funcao, idtema, idclasse, rgb) {
	    console.error("Veja i3GEO.tema.alteracorclasse()");
	},
	mudatransp : function(funcao, tema, valor) {
	    console.error("Removido na versao 8");
	},
	copiatema : function(funcao, tema) {
	    console.error("Veja i3GEO.tema.copia()");
	},
	mudanome : function(funcao, tema, valor) {
	    console.error("Veja i3GEO.tema.mudanome()");
	},
	contorno : function(funcao,tema) {
	    console.error("Removido na versao 8");
	},
	adicionaTemaWMS : function(){
	    console.error("Veja i3GEO.mapa.adicionaTemaWMS()");
	},
	adicionaTemaSHP : function(funcao, path) {
	    console.error("Veja i3GEO.mapa.adicionaTemaSHP()");
	},
	adicionaTemaIMG : function(funcao, path) {
	    console.error("Veja i3GEO.mapa.adicionaTemaIMG()");
	},
	identifica : function(funcao, x, y, resolucao, opcao, locaplic, sid, tema, ext, listaDeTemas, wkt) {
	    console.error("Veja i3GEO.mapa.identifica()");
	},
	reiniciaMapa : function(funcao) {
	    console.error("Removido na versao 8");
	},
	procurartemas2 : function(funcao, procurar, locaplic) {
	    console.error("Removido na versao 8");
	},
	procurartemasestrela : function(funcao, nivel, fatorestrela, locaplic) {
	    console.error("Veja i3GEO.catalogoEstrelas.identifica()");
	},
	adtema : function(funcao, temas, locaplic, sid) {
	    console.error("Veja i3GEO.mapa.adtema()");
	},
	escalagrafica : function(funcao) {
	    console.error("Removido na versao 8");
	},
	googlemaps : function(funcao) {
	    console.error("Removido na versao 8");
	},
	openlayers : function(funcao) {
	    console.error("Removido na versao 8");
	},
	corpo : function(funcao, tipoimagem) {
	    console.error("Veja i3GEO.mapa.refresh()");
	},
	converte2googlemaps : function(funcao) {
	    console.error("Removido na versao 8");
	},
	converte2openlayers : function(funcao) {
	    console.error("Removido na versao 8");
	},
	criamapa : function(funcao, parametros) {
	    console.error("Removido na versao 8");
	},
	inicia : function(funcao, w, h) {
	    console.error("Removido na versao 8");
	},
	chaveGoogle : function(funcao) {
	    console.error("Removido na versao 8");
	},
	listaRSSwsARRAY : function(funcao, tipo) {
	    console.error("Removido na versao 8");
	},
	listaLayersWMS : function(funcao, servico, nivel, id_ws, nomelayer, tipo_ws) {
	    console.error("Removido na versao 8");
	},
	listaLayersARCGISREST : function(funcao, id_ws, nomelayer) {
	    console.error("Removido na versao 8");
	},
	buscaRapida : function(funcao, locaplic, servico, palavra) {
	    console.error("Veja i3GEO.busca.getData");
	},
	listaItensTema : function(funcao, tema) {
	    console.error("Veja i3GEO.tema.itens");
	},
	listaValoresItensTema : function(funcao, tema, itemTema) {
	    console.error("Veja i3GEO.tema.valoresItem");
	},
	extRegistros : function(funcao, tema, reg) {
	    console.error("Removido na versao 8");
	},
	listaFontesTexto : function(funcao) {
	    console.error("Veja i3GEO.mapa.textFont");
	},
	listaEpsg : function(funcao) {
	    console.error("Veja i3GEO.mapa.epsglist");
	},
	pegaData : function(funcao, tema) {
	    console.error("Removido na versao 8");
	},
	pegaMetaData : function(funcao, tema) {
	    console.error("Removido na versao 8");
	},
	alteraData : function(funcao, tema, data, removemeta) {
	    console.error("Removido na versao 8");
	},
	dadosPerfilRelevo : function(funcao, opcao, pontos, amostragem, item) {
	    console.error("Removido na versao 8");
	},
	funcoesGeometriasWkt : function(funcao, listaWkt, operacao) {
	    console.error("Veja i3GEO.editor.funcoesGeometriasWkt");
	},
	listaVariavel : function(funcao, filtro_esquema) {
	    console.error("Veja i3GEO.catalogoMetaestat.getVariables");
	},
	listaMedidaVariavel : function(codigo_variavel, funcao) {
	    console.error("Veja i3GEO.catalogoMetaestat.getMeasuresVariable");
	},
        listaRegioesMedidaVariavel : function(id_medida_variavel, funcao) {
            console.error("Veja i3GEO.catalogoMetaestat.getRegionsMeasure");
        },
        listaClassificacaoMedida : function(id_medida_variavel, funcao) {
            console.error("Veja i3GEO.catalogoMetaestat.getClassificationsMeasure");
        },
	listaParametrosMedidaVariavel : function(id_medida_variavel, funcao) {
	    console.error("Veja i3GEO.catalogoMetaestat.getParametersMeasure");
	},
	listaValoresParametroMedidaVariavel : function(id_parametro_medida, funcao) {
	    console.error("Veja i3GEO.catalogoMetaestat.getParametersMeasureValues");
	},
	relatorioVariavel : function(codigo_variavel, funcao) {
	    console.error("Removido na versao 8");
	},
	listaClasseClassificacao : function(id_classificacao, funcao) {
	    console.error("Removido na versao 8");
	},
	mapfileMedidaVariavel : function(funcao, id_medida_variavel, filtro, todasascolunas, tipolayer, titulolayer, id_classificacao,
		agruparpor, codigo_tipo_regiao, opacidade) {
	    console.error("Removido na versao 8");
	},
	listaTipoRegiao : function(funcao, codigo_tipo_regiao) {
	    console.error("Veja i3GEO.catalogoRegioes.getRegions");
	},
	mapfileTipoRegiao : function(funcao, codigo_tipo_regiao, outlinecolor, width, nomes) {
	    console.error("Removido na versao 8");
	},
	listaHierarquiaRegioes : function(funcao, codigo_tipo_regiao, codigoregiaopai, valorregiaopai) {
	    console.error("Veja i3GEO.catalogoRegioes.getRegionsTree");
	},
	aplicaFiltroRegiao : function(funcao, codigo_tipo_regiao, codigo_regiao) {
	    console.error("Removido na versao 8");
	},
	listaCamadasMetaestat : function(funcao) {
	    console.error("Removido na versao 8");
	},
	listaGruposMapaMetaestat : function(funcao, id_mapa) {
	    console.error("Removido na versao 8");
	},
	listaTemasMapaMetaestat : function(funcao, id_mapa_grupo) {
	    console.error("Removido na versao 8");
	},
	marcadores2shp : function(funcao) {
	    console.error("Removido na versao 8");
	},
	listaInterfaces : function(funcao) {
	    console.error("Removido na versao 8");
	}
};
