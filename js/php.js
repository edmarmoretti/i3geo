if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
var cpJSON = new cpaint();
cpJSON.set_response_type("JSON");
cpJSON.set_transfer_mode("POST");

i3GEO.php =
{
	/**
	 * Function: verifica
	 *
	 * Verifica se as vari&aacute;veis i3GEO.configura.locaplic e i3GEO.configura.sid existem
	 */
	verifica : function() {
	    if (i3GEO.configura.locaplic === undefined) {
		i3GEO.janela.tempoMsg("i3GEO.php diz: variavel i3GEO.configura.locaplic n&atilde;o esta definida");
	    }
	    if (i3GEO.configura.sid === undefined) {
		i3GEO.janela.tempoMsg("i3GEO.php diz: variavel i3GEO.configura.sid n&atilde;o esta definida");
	    }
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
	/**
	 * Function: criaLegendaImagem
	 *
	 * Pega a legenda atual na forma de imagem
	 */
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
	/**
	 * Function: mudaext
	 *
	 * O parametro "atualiza" &eacute; do tipo booleano e indica se o redesenho do mapa ser&aacute; feito ou n&atilde;o.
	 *
	 * O parametro "geo" &eacute; do tipo booleano e indica se as coordenadas dever&atilde;o ser convertidas para geogr&aacute;ficas ao
	 * serem salvas no mapfile
	 */
	mudaext : function(funcao, tipoimagem, ext, locaplic, sid, atualiza, geo) {
	    var retorno;
	    if (arguments.length === 3) {
		i3GEO.php.verifica();
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
		atualiza = true;
		geo = false;
	    }
	    if (geo === undefined) {
		geo = false;
	    }
	    if (atualiza === undefined) {
		atualiza = true;
	    }
	    if (ext === undefined) {
		i3GEO.janela.tempoMsg("extensao nao definida");
		return;
	    }
	    retorno = function(retorno) {
		i3GEO.Interface.zoom2ext(ext);
		if(funcao){
		    funcao.call(funcao, retorno);
		}
	    };
	    var p = locaplic + "/classesphp/mapa_controle.php";
	    var par = "funcao=mudaext&tipoimagem=" + tipoimagem + "&ext=" + ext + "&g_sid=" + sid + "&geo=" + geo;
	    cpJSON.call(p, "mudaext", retorno, par);
	},
	/**
	 * Function: mudaescala
	 *
	 * Muda a escala do mapa
	 */
	mudaescala : function(funcao, escala) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=mudaescala&escala=" + escala + "&g_sid=" + i3GEO.configura.sid + "&tipoimagem=" + i3GEO.configura.tipoimagem, retorno =
		    function(retorno) {
		i3GEO.janela.fechaAguarde("mudaescala");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("mudaescala", $trad("o1"));
	    cpJSON.call(p, "mudaescala", retorno, par);
	},
	/**
	 * aplicaResolucao
	 */
	aplicaResolucao : function(funcao, resolucao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=crialente&resolucao=" + resolucao + "&g_sid=" + i3GEO.configura.sid + "&ext=" + i3GEO.mapa.getExtent().string;
	    cpJSON.call(p, "crialente", funcao, par);
	},
	/**
	 * geradestaque
	 */
	geradestaque : function(funcao, tema, ext) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=geradestaque&tema=" + tema + "&g_sid=" + i3GEO.configura.sid + "&ext=" + ext, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("geradestaque");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("geradestaque", $trad("o1"));
	    cpJSON.call(p, "geradestaque", retorno, par);
	},
	/**
	 * Function: sobetema
	 *
	 * Sobe um tema na hierarquia
	 */
	sobetema : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=sobetema&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("sobetema");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("sobetema", $trad("o1"));
	    cpJSON.call(p, "sobetema", retorno, par);
	},
	/**
	 * Function: descetema
	 *
	 * Desce um tema na hierarquia
	 */
	descetema : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=descetema&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("descetema");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("descetema", $trad("o1"));
	    cpJSON.call(p, "descetema", retorno, par);
	},
	/**
	 * Function: fontetema
	 *
	 * Obtem a fonte para o tema
	 */
	fontetema : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=fontetema&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "fontetema", retorno, par);
	},
	/**
	 * Function: zoomtema
	 *
	 * Zoom para um tema
	 */
	zoomtema : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var retorno, p, par;
	    retorno = function(retorno) {
		switch (i3GEO.Interface.ATUAL) {
		case "googlemaps":
		    i3GEO.Interface.googlemaps.zoom2extent(retorno.data.variaveis.mapexten);
		    i3GEO.atualizaParametros(retorno.data.variaveis);
		    break;
		case "openlayers":
		    i3GEO.Interface.openlayers.zoom2ext(retorno.data.variaveis.mapexten);
		    i3GEO.atualizaParametros(retorno.data.variaveis);
		    break;
		}
	    };
	    p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php";
	    par = "funcao=zoomtema&tema=" + tema + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "zoomtema", retorno, par);
	},
	/**
	 * Function: zoomsel
	 *
	 * Zoom para a selecao
	 */
	zoomsel : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var retorno, p, par;
	    retorno = function(retorno) {
		switch (i3GEO.Interface.ATUAL) {
		case "googlemaps":
		    i3GEO.atualizaParametros(retorno.data.variaveis);
		    i3GEO.Interface.googlemaps.zoom2extent(i3GEO.parametros.mapexten);
		    break;
		case "openlayers":
		    i3GEO.atualizaParametros(retorno.data.variaveis);
		    i3GEO.Interface.openlayers.zoom2ext(i3GEO.mapa.getExtent().string);
		    break;
		}
	    };
	    p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php";
	    par = "funcao=zoomsel&tema=" + tema + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "zoomsel", retorno, par);
	},
	/**
	 * Function: limpasel
	 *
	 * Limpa a selecao
	 */
	limpasel : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=limpasel&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "limpasel", retorno, par);
	},
	/**
	 * Function: invertestatuslegenda
	 *
	 * Liga desliga a legenda de um tema
	 */
	invertestatuslegenda : function(funcao, tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=invertestatuslegenda&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "invertestatuslegenda", retorno, par);
	},
	/**
	 * Function: aplicaCorClasseTema
	 *
	 * Aplica uma cor a uma classe
	 */
	aplicaCorClasseTema : function(funcao, idtema, idclasse, rgb) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=alteraclasse&opcao=alteracor&tema=" + idtema + "&idclasse=" + idclasse + "&cor=" + rgb + "&g_sid="
		+ i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "aplicaCorClasseTema", retorno, par);
	},
	/**
	 * Function: mudatransp
	 *
	 * Muda a transparencia de um tema
	 */
	mudatransp : function(funcao, tema, valor) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=mudatransp&tema=" + tema + "&valor=" + valor + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "mudatransp", retorno, par);
	},
	/**
	 * Function: copiatema
	 *
	 * Copia um tema
	 */
	copiatema : function(funcao, tema) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=copiatema&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("copiatema");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("copiatema", $trad("o1"));
	    cpJSON.call(p, "copiatema", retorno, par);
	},
	/**
	 * Function: mudanome
	 *
	 * Muda o nome de um tema
	 */
	mudanome : function(funcao, tema, valor) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=mudanome&tema=" + tema + "&valor=" + valor + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "mudanome", retorno, par);
	},
	/**
	 * Function: contorno
	 *
	 * Liga ou desliga o contorno das classes
	 */
	contorno : function(funcao,tema) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=contorno&tema=" + tema + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "foo", retorno, par);
	},
	/**
	 * Function: adicionaTemaWMS
	 *
	 * Adiciona tema WMS
	 */
	adicionaTemaWMS : function(funcao, servico, tema, nome, proj, formato, versao, nomecamada, tiporep, suportasld, formatosinfo,
		locaplic, sid, checked, allitens) {
	    var s, p, camadaArvore, par, ck;
	    if(funcao === ""){
		funcao = function() {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: $trad("camadaadic")});
		    i3GEO.atualiza();
		};
	    }
	    if(!allitens){
		allitens = "nao";
	    }
	    if (!locaplic || locaplic === "") {
		locaplic = i3GEO.configura.locaplic;
	    }
	    if (!sid || sid === "") {
		sid = i3GEO.configura.sid;
	    }

	    // verifica se a camada ja existe no mapa
	    if (checked || checked == false) {
		s = servico + "&layers=" + tema + "&style=" + nome;
		s = s.replace("&&", "&");
		camadaArvore = i3GEO.arvoreDeCamadas.pegaTema(s, "", "wmsurl");

		if (camadaArvore) {
		    ck = i3GEO.arvoreDeCamadas.capturaCheckBox(camadaArvore.name);
		    ck.checked = checked;
		    ck.onclick();
		    return;
		}
	    }
	    p = locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + sid + "&funcao=adicionatemawms&servico=" + servico + "&tema=" + tema + "&nome=" + nome + "&proj=" + proj
		+ "&formato=" + formato + "&versao=" + versao + "&nomecamada=" + nomecamada + "&tiporep=" + tiporep + "&suportasld="
		+ suportasld + "&formatosinfo=" + formatosinfo + "&allitens=" + allitens;
	    cpJSON.call(p, "adicionatemawms", funcao, par);
	},
	/**
	 * Function: adicionaTemaSHP
	 *
	 * Adiciona tema com base em um shapefile
	 */
	adicionaTemaSHP : function(funcao, path) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=adicionaTemaSHP&arq=" + path, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "adicionaTemaSHP", retorno, par);
	},
	/**
	 * Function: adicionaTemaIMG
	 *
	 * Adiciona tema com base em uma imagem
	 */
	adicionaTemaIMG : function(funcao, path) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=adicionaTemaIMG&arq=" + path, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "adicionaTemaIMG", retorno, par);
	},
	/**
	 * Function: identifica
	 *
	 * Identifica um ponto no mapa
	 */
	identifica : function(funcao, x, y, resolucao, opcao, locaplic, sid, tema, ext, listaDeTemas, wkt) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.php.identifica()");

	    if(x === null || y === null || (x == 0 && y == 0)){
		return;
	    }
	    if (arguments.length === 4) {
		opcao = "tip";
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
		ext = "";
		listaDeTemas = "";
		resolucao = 5;
		wkt = "nao";
	    }
	    if (arguments.length === 5) {
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
		ext = "";
		listaDeTemas = "";
		wkt = "nao";
	    }
	    if (listaDeTemas === undefined) {
		listaDeTemas = "";
	    }
	    // verifica se nao e necessario alterar as coordenadas
	    ext = i3GEO.util.extOSM2Geo(ext);
	    var p = locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=identifica&wkt=" + wkt + "&opcao=" + opcao + "&xy=" + x + "," + y + "&resolucao=" + resolucao + "&g_sid=" + sid + "&ext=" + ext
		+ "&listaDeTemas=" + listaDeTemas;
	    if (opcao !== "tip") {
		par += "&tema=" + tema;
	    }
	    cpJSON.call(p, "identifica", funcao, par);
	    return;
	},
	/**
	 * Function: reiniciaMapa
	 *
	 * Reinicia o mapa
	 */
	reiniciaMapa : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=reiniciaMapa&g_sid=" + i3GEO.configura.sid, retorno =
		function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "reiniciaMapa", retorno, par);
	},
	/**
	 * Function: procurartemas2
	 *
	 * Busca um tema pelo nome
	 */
	procurartemas2 : function(funcao, procurar, locaplic) {
	    if (arguments.length === 2) {
		locaplic = i3GEO.configura.locaplic;
	    }
	    try {
		var p = locaplic + "/classesphp/mapa_controle.php", par =
		    "funcao=procurartemas2&map_file=&procurar=" + procurar + "&idioma=" + i3GEO.idioma.ATUAL, retorno = function(retorno) {
		    i3GEO.janela.fechaAguarde("procurartemas");
		    funcao.call(funcao, retorno);
		};
		i3GEO.janela.abreAguarde("procurartemas", $trad("o1"));
		cpJSON.call(p, "procurartemas", retorno, par);
	    } catch (e) {
	    }
	},
	/**
	 * Function: procurartemasestrela
	 *
	 * Busca um tema pelo ranking
	 */
	procurartemasestrela : function(funcao, nivel, fatorestrela, locaplic) {
	    if (arguments.length === 3) {
		locaplic = i3GEO.configura.locaplic;
	    }
	    try {
		var p = locaplic + "/classesphp/mapa_controle.php", par =
		    "funcao=procurartemasestrela&map_file=&nivel=" + nivel + "&fatorestrela=" + fatorestrela + "&idioma="
		    + i3GEO.idioma.ATUAL, retorno = function(retorno) {
		    i3GEO.janela.fechaAguarde("procurartemasestrela");
		    funcao.call(funcao, retorno);
		};
		i3GEO.janela.abreAguarde("procurartemasestrela", $trad("o1"));
		cpJSON.call(p, "foo", retorno, par);
	    } catch (e) {
	    }
	},
	/**
	 * Function: adtema
	 *
	 * Adiciona tema(s) ao mapa pelo seu codigo
	 */
	adtema : function(funcao, temas, locaplic, sid) {
	    if (arguments.length === 2) {
		i3GEO.php.verifica();
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
	    }
	    var p = locaplic + "/classesphp/mapa_controle.php", par = "funcao=adtema&temas=" + temas + "&g_sid=" + sid, retorno =
		function(retorno) {
		i3GEO.janela.fechaAguarde("adtema");
		funcao.call(funcao, retorno);
		i3GEO.janela.snackBar({content:$trad("camadaadic")});
	    };
	    i3GEO.janela.abreAguarde("adtema", $trad("o1"));
	    cpJSON.call(p, "adtema", retorno, par);
	},
	/**
	 * Function: escalagrafica
	 *
	 * Retorna a escala grafica
	 */
	escalagrafica : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=escalagrafica&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "escalagrafica", funcao, par);
	},
	/**
	 * googlemaps
	 *
	 * Ativa a interface googlemaps
	 */
	googlemaps : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=googlemaps&g_sid=" + i3GEO.configura.sid, retorno =
		function(retorno) {
		i3GEO.janela.fechaAguarde("googlemaps");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("googlemaps", $trad("o1"));
	    cpJSON.call(p, "googlemaps", retorno, par);
	},
	/**
	 * openlayers
	 *
	 * Ativa a interface openlayers
	 */
	openlayers : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=openlayers&g_sid=" + i3GEO.configura.sid, retorno =
		function(retorno) {
		i3GEO.janela.fechaAguarde("openlayers");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("openlayers", $trad("o1"));
	    cpJSON.call(p, "openlayers", retorno, par);
	},
	/**
	 * desenha o corpo do mapa
	 */
	corpo : function(funcao, tipoimagem) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.php.corpo()");

	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=corpo&tipoimagem=" + tipoimagem + "&g_sid=" + i3GEO.configura.sid + "&interface=" + i3GEO.Interface.ATUAL;
	    cpJSON.call(p, "corpo", funcao, par);
	},
	/**
	 * converte2googlemaps
	 *
	 * <CONVERTE2GOOGLEMAPS>
	 */
	converte2googlemaps : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=converte2googlemaps&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("converte2googlemaps");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("converte2googlemaps", $trad("o1"));
	    cpJSON.call(p, "converte2googlemaps", retorno, par);
	},
	/**
	 * converte2openlayers
	 *
	 * <CONVERTE2OPENLAYERS>
	 */
	converte2openlayers : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=converte2openlayers&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("converte2openlayers");
		funcao.call(funcao, retorno);
	    };
	    i3GEO.janela.abreAguarde("converte2openlayers", $trad("o1"));
	    cpJSON.call(p, "converte2openlayers", retorno, par);
	},
	/**
	 * criamapa
	 *
	 * <CRIAMAPA>
	 */
	criamapa : function(funcao, parametros) {
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=criaMapa&" + parametros, cp = new cpaint();
	    cp.set_response_type("JSON");
	    //se for true da pau
	    cp.set_async(true);
	    /*
			if (i3GEO.util.versaoNavegador() === "FF3") {
				cp.set_async(true);
			} else {
				cp.set_async(false);
			}
	     */
	    cp.set_transfer_mode("POST");
	    cp.call(p, "criaMapa", funcao, par);
	},
	/**
	 * inicia
	 *
	 * <INICIA>
	 */
	inicia : function(funcao, w, h) {
	    // i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=inicia&w=" + w + "&h=" + h + "&g_sid=" + i3GEO.configura.sid + "&interface=", cp =
		    new cpaint();
	    // muda a interface na criacao
	    if (i3GEO.Interface.openlayers.googleLike === true) {
		par += "googlemaps";
	    } else {
		par += i3GEO.Interface.ATUAL;
	    }
	    cp.set_response_type("JSON");
	    cp.set_async(true);
	    /*
			if (i3GEO.util.versaoNavegador() === "FF3") {
				cp.set_async(true);
			} else {
				cp.set_async(false);
			}
	     */
	    cp.set_transfer_mode("POST");
	    cp.call(p, "iniciaMapa", funcao, par);
	},
	/**
	 * chaveGoogle
	 *
	 * <CHAVEGOOGLE>
	 */
	chaveGoogle : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=chavegoogle&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "chavegoogle", funcao, par);
	},
	/**
	 * listaRSSwsARRAY
	 *
	 * <LISTARSSWSARRAY>
	 */
	listaRSSwsARRAY : function(funcao, tipo) {
	    var p = i3GEO.configura.locaplic + "/classesphp/wscliente.php", par = "funcao=listaRSSwsARRAY&rss=" + [
		"|"
		] + "&tipo=" + tipo;
	    cpJSON.call(p, "listaRSSwsARRAY", funcao, par);
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
