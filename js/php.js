if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
var cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
cpJSON.set_transfer_mode("POST");

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
	/**
	 * listaLayersWMS
	 *
	 * <LISTALAYERSWMS>
	 */
	listaLayersWMS : function(funcao, servico, nivel, id_ws, nomelayer, tipo_ws) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=listaLayersWMS&servico=" + servico + "&nivel=" + nivel + "&id_ws=" + id_ws + "&nomelayer=" + nomelayer
		+ "&tipo_ws=" + tipo_ws;
	    cpJSON.call(p, "listaLayersWMS", funcao, par);
	},
	listaLayersARCGISREST : function(funcao, id_ws, nomelayer) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=listaLayersARCGISREST&id_ws=" + id_ws + "&nomelayer=" + nomelayer
		+ "&tipo_ws=ARCGISREST";
	    cpJSON.call(p, "listaLayersARCGISREST", funcao, par);
	},
	/**
	 * Function: buscaRapida
	 *
	 * Busca dados em um servico
	 */
	buscaRapida : function(funcao, locaplic, servico, palavra) {
	    var p = locaplic + "/classesphp/mapa_controle.php", par =
		"map_file=&funcao=buscaRapida&palavra=" + palavra + "&servico=" + servico;
	    cpJSON.call(p, "buscaRapida", funcao, par);
	},
	/**
	 * Function: listaItensTema
	 *
	 * Lista as colunas de um tema
	 */
	listaItensTema : function(funcao, tema) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=listaitens&tema=" + tema + "&ext=" + i3GEO.mapa.getExtent().string;
	    cpJSON.call(p, "listaItensTema", funcao, par);
	},
	/**
	 * Function: listaValoresItensTema
	 *
	 * Lista os valores de uma coluna
	 */
	listaValoresItensTema : function(funcao, tema, itemTema) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=listaunica&tema=" + tema + "&item=" + itemTema + "&ext="
		+ i3GEO.mapa.getExtent().geo;
	    cpJSON.call(p, "listaRegistros", funcao, par);
	},
	/**
	 * Function: extRegistros
	 *
	 * Extensao geografica de um registro de um tema
	 */
	extRegistros : function(funcao, tema, reg) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=extregistros&registro=" + reg + "&tema=" + tema;
	    cpJSON.call(p, "listaItensTema", funcao, par);
	},
	/**
	 * listaFontesTexto
	 *
	 * <LISTATRUETYPE>
	 */
	listaFontesTexto : function(funcao) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=listatruetype";
	    cpJSON.call(p, "listaTrueType", funcao, par);
	},
	/**
	 * listaEpsg
	 *
	 * <LISTAEPSG>
	 */
	listaEpsg : function(funcao) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=listaEpsg&map_file=";
	    cpJSON.call(p, "listaEpsg", funcao, par);
	},
	/**
	 * pegaData
	 *
	 * <PEGADATA>
	 */
	pegaData : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=pegadata&tema=" + tema;
	    cpJSON.call(p, "pegadata", funcao, par);
	},
	/**
	 * pegaMetaData
	 *
	 * <PEGAMETADATA>
	 */
	pegaMetaData : function(funcao, tema) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=pegametadata&tema=" + tema;
	    cpJSON.call(p, "pegametadata", funcao, par);
	},
	/**
	 * alteraData
	 *
	 * <ALTERADATA>
	 */
	alteraData : function(funcao, tema, data, removemeta) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=alteradata&tema=" + tema + "&novodata=" + data + "&removemeta=" + removemeta;
	    cpJSON.call(p, "alteradata", funcao, par);
	},
	/**
	 * dadosPerfilRelevo
	 *
	 * <DADOSPERFILRELEVO>
	 */
	dadosPerfilRelevo : function(funcao, opcao, pontos, amostragem, item) {
	    i3GEO.php.verifica();
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid=" + i3GEO.configura.sid
		+ "&funcao=dadosPerfilRelevo&opcao=" + opcao, cp = new cpaint();
	    cp.set_transfer_mode('POST');
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", funcao, "&pontos=" + pontos + "&amostragem=" + amostragem + "&item=" + item);
	},
	/**
	 * Function: funcoesGeometriasWkt
	 *
	 * Aplica uma operacao sobre uma geometria definida em WKT
	 */
	funcoesGeometriasWkt : function(funcao, listaWkt, operacao) {
	    i3GEO.php.verifica();
	    var p =
		i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid=" + i3GEO.configura.sid
		+ "&funcao=funcoesGeometriasWkt&operacao=" + operacao, cp = new cpaint();
	    cp.set_transfer_mode('POST');
	    cp.set_response_type("JSON");
	    cp.call(p, "foo", funcao, "&geometrias=" + listaWkt);
	},
	/**
	 * listaVariavel
	 *
	 * Obt&eacute;m a lista de vari&aacute;veis do sistema de metadados estat&iacute;sticos
	 */
	listaVariavel : function(funcao, filtro_esquema) {
	    if (!filtro_esquema) {
		filtro_esquema = "";
	    }
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaVariavel&g_sid=" + i3GEO.configura.sid
		+ "&filtro_esquema=" + filtro_esquema;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaMedidaVariavel
	 *
	 * Obt&eacute;m a lista medidas de uma vari&aacute;vel do sistema de metadados estat&iacute;sticos
	 */
	listaMedidaVariavel : function(codigo_variavel, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaMedidaVariavel&codigo_variavel=" + codigo_variavel
		+ "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaParametrosMedidaVariavel
	 *
	 * Obt&eacute;m a lista de par&acirc;metros de uma medida de uma vari&aacute;vel do sistema de metadados estat&iacute;sticos
	 */
	listaParametrosMedidaVariavel : function(id_medida_variavel, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaParametro&id_medida_variavel=" + id_medida_variavel
		+ "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaRegioesMedidaVariavel
	 *
	 * Obt&eacute;m a lista de regioes de uma medida de uma vari&aacute;vel do sistema de metadados estat&iacute;sticos
	 */
	listaRegioesMedidaVariavel : function(id_medida_variavel, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaRegioesMedida&id_medida_variavel=" + id_medida_variavel
		+ "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaValoresParametroMedidaVariavel
	 *
	 * Obt&eacute;m a lista de valores de um par&acirc;metro de uma medida de uma vari&aacute;vel do sistema de metadados
	 * estat&iacute;sticos
	 */
	listaValoresParametroMedidaVariavel : function(id_parametro_medida, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaValoresParametro&id_parametro_medida="
		+ id_parametro_medida + "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * relatorioVariavel
	 *
	 * Relatorio descritivo de uma vari&aacute;vel do sistema de metadados estat&iacute;sticos
	 */
	relatorioVariavel : function(codigo_variavel, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=relatorioCompleto&codigo_variavel=" + codigo_variavel
		+ "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaClassificacaoMedida
	 *
	 * Lista as classificacoes de uma medida de variavel do sistema de metadados estat&iacute;sticos
	 */
	listaClassificacaoMedida : function(id_medida_variavel, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaClassificacaoMedida&id_medida_variavel="
		+ id_medida_variavel + "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaClasseClassificacao
	 *
	 * Lista as classes de uma classificacao de uma medida de variavel do sistema de metadados estat&iacute;sticos
	 */
	listaClasseClassificacao : function(id_classificacao, funcao) {
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaClasseClassificacao&id_classificacao=" + id_classificacao;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * mapfileMedidaVariavel
	 *
	 * Adiciona uma camada ao mapa baseado no sistema de metadados estat&iacute;sticos
	 */
	mapfileMedidaVariavel : function(funcao, id_medida_variavel, filtro, todasascolunas, tipolayer, titulolayer, id_classificacao,
		agruparpor, codigo_tipo_regiao, opacidade) {
	    if (!opacidade) {
		opacidade = "";
	    }
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=mapfileMedidaVariavel&formato=json&codigo_tipo_regiao="
		+ codigo_tipo_regiao + "&id_medida_variavel=" + id_medida_variavel + "&filtro=" + filtro + "&todasascolunas="
		+ todasascolunas + "&tipolayer=" + tipolayer + "&titulolayer=" + titulolayer + "&id_classificacao=" + id_classificacao
		+ "&agruparpor=" + agruparpor + "&opacidade=" + opacidade + "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaTipoRegiao
	 *
	 * Lista as regioes cadastradas no sistema de metadados estatisticos
	 */
	listaTipoRegiao : function(funcao, codigo_tipo_regiao) {
	    if (!codigo_tipo_regiao) {
		codigo_tipo_regiao = "";
	    }
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaTipoRegiao&codigo_tipo_regiao=" + codigo_tipo_regiao
		+ "&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * mapfileTipoRegiao
	 *
	 * Adiciona ao mapa camada baseada nas regioes cadastradas no sistema de metadados estatisticos
	 */
	mapfileTipoRegiao : function(funcao, codigo_tipo_regiao, outlinecolor, width, nomes) {
	    if (!outlinecolor) {
		outlinecolor = "255,0,0";
	    }
	    if (!width) {
		width = 1;
	    }
	    if (!nomes) {
		nome = "nao";
	    }
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=mapfileTipoRegiao&codigo_tipo_regiao=" + codigo_tipo_regiao
		+ "&g_sid=" + i3GEO.configura.sid;
	    p += "&outlinecolor=" + outlinecolor + "&width=" + width + "&nomes=" + nomes;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaHierarquiaRegioes
	 *
	 * Lista as regioes cadastradas no sistema de metadados estatisticos organizadas de forma hierarquica
	 */
	listaHierarquiaRegioes : function(funcao, codigo_tipo_regiao, codigoregiaopai, valorregiaopai) {
	    if (!codigoregiaopai) {
		codigoregiaopai = "";
	    }
	    if (!valorregiaopai) {
		valorregiaopai = "";
	    }
	    if (!codigo_tipo_regiao) {
		codigo_tipo_regiao = "";
	    }
	    var p =
		i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaHierarquiaRegioes&codigo_tipo_regiao="
		+ codigo_tipo_regiao + "&codigoregiaopai=" + codigoregiaopai + "&valorregiaopai=" + valorregiaopai + "&g_sid="
		+ i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * aplicaFiltroRegiao
	 *
	 * Aplica um filtro no SQL que define uma camada do sistema de metadados estatisticos para filtrar para uma regiao especifica
	 */
	aplicaFiltroRegiao : function(funcao, codigo_tipo_regiao, codigo_regiao) {
	    var p =
		i3GEO.configura.locaplic + "/ferramentas/metaestat/analise.php?funcao=aplicaFiltroRegiao&codigo_tipo_regiao="
		+ codigo_tipo_regiao + "&codigo_regiao=" + codigo_regiao + "&g_sid=" + i3GEO.configura.sid;
	    // p += "&tipo="+tipo+"&codigo_tipo_regiao_pai="+codigo_tipo_regiao_pai+"&codigo_regiao_pai="+codigo_regiao_pai;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaCamadasMetaestat
	 *
	 * Lista as camadas existentes no mapa e que se referem ao sistema METAESTAT
	 */
	listaCamadasMetaestat : function(funcao) {
	    var p =
		i3GEO.configura.locaplic + "/ferramentas/metaestat/analise.php?funcao=listaCamadasMetaestat&g_sid=" + i3GEO.configura.sid;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaGruposMapaMetaestat
	 *
	 * Lista os grupos cadastrados no sistema de publicacao de mapas do METAESTAT
	 */
	listaGruposMapaMetaestat : function(funcao, id_mapa) {
	    var p = i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaGruposMapa&id_mapa=" + id_mapa;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * listaTemasMapaMetaestat
	 *
	 * Lista os temas cadastrados no sistema de publicacao de mapas do METAESTAT
	 */
	listaTemasMapaMetaestat : function(funcao, id_mapa_grupo) {
	    var p = i3GEO.configura.locaplic + "/classesphp/metaestat_controle.php?funcao=listaTemasMapa&id_mapa_grupo=" + id_mapa_grupo;
	    i3GEO.util.ajaxGet(p, funcao);
	},
	/**
	 * Function: marcadores2shp
	 *
	 * Converte os marcadores de lugar em uma camada shapefile
	 */
	marcadores2shp : function(funcao) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?";
	    par = "funcao=marcadores2shp";
	    i3GEO.util.ajaxGet(p + par, funcao);
	},
	/**
	 * Function: listaInterfaces
	 *
	 * Lista as interfaces que podem ser utilizadas para abrir um mapa
	 */
	listaInterfaces : function(funcao) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"&map_file=&funcao=listainterfaces";
	    cpJSON.call(p, "foo", funcao, par);
	}

};
