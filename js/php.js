/**
 * Title: PHP
 *
 * Chamadas em AJAX que executam programas no lado do servidor
 *
 * Muitos dos parametros exigidos pelos programas em PHP s&atilde;o obtidos da vari&aacute;vel de se&ccedil;&atilde;o aberta no servidor
 * quando o i3Geo &eacute; inicializado, &eacute; o caso por exemplo do nome do arquivo correspondente ao mapfile atualmente em uso
 *
 * Quando classe_php.js &eacute; carregado, &eacute; criado o objeto cpJSON que necessita da biblioteca CPAINT. Esse objeto &eacute;
 * utilizado nas chamadas AJAX.
 *
 * O objeto cpJSON possu&iacute; um m&eacute;todo .call que executa a opera&ccedil;&atilde;o AJAX. Esse m&eacute;todo utiliza basicamente
 * dois parametros, sendo o primeiro o endere&ccedil;o do programa PHP que ser&aacute; executado no servidor e o outro &eacute; o nome da
 * fun&ccedil;&atilde;o que ir&aacute; receber e processar os resultados do programa. Exemplo:
 *
 * cpJSON.call(p,"",funcao);
 *
 * "p" &eacute; a URL e funcao o nome da fun&ccedil;&atilde;o
 *
 * Para compor "p" o i3geo utiliza normalmente a vari&aacute;vel i3GEO.configura.locaplic e i3GEO.configura.sid, por exemplo:
 *
 * var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&g_sid="+i3GEO.configura.sid
 *
 * Para mais detalhes sobre as fun&ccedil;&otilde;es, veja <mapa_controle.php>
 *
 * Namespace:
 *
 * i3GEO.php
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_php.js>
 */

/**
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
/**
 * Object: cpJSON
 *
 * Objeto CPAINT (ver biblioteca CPAINT) utilizado nas chamadas AJAX ass&iacute;ncronas com retorno no formato JSON
 *
 * Exemplo:
 *
 * cpJSON.call()
 *
 * Return:
 *
 * O objeto CPAINT retorna os dados encapsulados em um objeto JSON. Os programas PHP que fazem uso dessa biblioteca (CPAINT) devem fazer o
 * include da mesma. Os dados de interesse retornados no objeto JSON, ficam embutidos na propriedade "data", por exemplo:
 *
 * var temp = function(retorno){alert(retorno.data);}
 *
 * cpJSON.call(p,"teste",temp);
 *
 * onde, p cont&eacute;m o nome do programa PHP e seus parametros "teste" &eacute; o nome da fun&ccedil;&atilde;o PHP (no caso do i3Geo,
 * isso n&atilde;o afeta em nada) e temp &eacute; a fun&ccedil;&atilde;o que tratar&aacute; o retorno dos dados.
 *
 */
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

	/**
	 * Function: insereSHP
	 *
	 * Insere um ponto em um shapefile
	 */
	insereSHP : function(funcao, tema, item, valoritem, xy, projecao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/ferramentas/inserexy2/exec.php", par =
		"funcao=insereSHP&item=" + item + "&valor=" + valoritem + "&tema=" + tema + "&xy=" + xy + "&projecao=" + projecao
		+ "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		i3GEO.janela.fechaAguarde("insereSHPgrafico");
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "insereSHP", retorno, par);
	},
	/**
	 * Function: pegaMensagens
	 *
	 * Pega as mensagens do metadata 'mensagem'
	 */
	pegaMensagens : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=pegaMensagens&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "pegaMensagem", funcao, par);
	},
	/**
	 * Function: areaPixel
	 *
	 * Calcula a &aacute;rea de um pixel da imagem do mapa
	 */
	areaPixel : function(funcao, g_celula) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=areaPixel&celsize=" + g_celula + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "areaPixel", funcao, par);
	},
	/**
	 * Function: excluitema
	 *
	 * Exclui temas do mapa
	 */
	excluitema : function(funcao, temas) {
	    var layer, retorno, p, n, i, par;
	    i3GEO.php.verifica();
	    retorno = function(retorno) {
		n = temas.length;
		for (i = 0; i < n; i++) {
		    if (i3GEO.Interface.ATUAL === "openlayers") {
			layer = i3geoOL.getLayersByName(temas[i]);
			if (layer.length > 0) {
			    i3geoOL.removeLayer(layer[0]);
			}
		    }
		    if (i3GEO.Interface.ATUAL === "googlemaps") {
			indice = i3GEO.Interface.googlemaps.retornaIndiceLayer(temas[i]);
			if (indice !== false) {
			    i3GeoMap.overlayMapTypes.removeAt(indice);
			}
		    }
		}
		funcao.call(funcao, retorno);
	    };
	    p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php";
	    par = "funcao=excluitema&temas=" + temas + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "excluitema", retorno, par);
	},
	/**
	 * Function: reordenatemas
	 *
	 * Reordena os temas
	 */
	reordenatemas : function(funcao, lista) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=reordenatemas&lista=" + lista + "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "reordenatemas", retorno, par);
	},
	/**
	 * Function: criaLegendaHTML
	 *
	 * Obtem a legenda de um tema
	 */
	criaLegendaHTML : function(funcao, tema, template) {
	    i3GEO.php.verifica();
	    if (arguments.length === 1) {
		tema = "";
		template = "legenda2.htm";
	    }
	    if (arguments.length === 2) {
		template = "legenda2.htm";
	    }
	    cpJSON.call(
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php",
		    "criaLegendaHTML",
		    funcao,
		    "funcao=criaLegendaHTML&tema=" + tema + "&templateLegenda=" + template + "&g_sid=" + i3GEO.configura.sid);
	},
	criaLegendaJSON : function(funcao, tema, w, h) {
	    i3GEO.php.verifica();
	    if (arguments.length === 1) {
		tema = "";
	    }
	    cpJSON.call(
		    i3GEO.configura.locaplic + "/classesphp/mapa_controle.php",
		    "criaLegendaHTML",
		    funcao,
		    "funcao=criaLegendaJSON&tema=" + tema + "&g_sid=" + i3GEO.configura.sid + "&w=" + w + "&h=" + h);
	},
	/**
	 * Function: inverteStatusClasse
	 *
	 * Inverte o status de uma classe de um layer
	 */
	inverteStatusClasse : function(funcao, tema, classe) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=inverteStatusClasse&g_sid=" + i3GEO.configura.sid + "&tema=" + tema + "&classe=" + classe, retorno =
		    function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "inverteStatusClasse", retorno, par);
	},
	/**
	 * Function: ligatemas
	 *
	 * Liga e desliga uma lista de temas
	 */
	ligatemas : function(funcao, desligar, ligar, adicionar) {
	    i3GEO.php.verifica();
	    if (arguments.length === 3) {
		adicionar = "nao";
	    }
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=ligatemas&desligar=" + desligar + "&ligar=" + ligar + "&adicionar=" + adicionar + "&g_sid=" + i3GEO.configura.sid, retorno =
		    function(retorno) {
		// i3GEO.janela.fechaAguarde("ligatemas");
		funcao.call(funcao, retorno);
	    };
	    // i3GEO.janela.abreAguarde("ligatemas",$trad("o1"));
	    cpJSON.call(p, "ligaDesligaTemas", retorno, par);
	},
	/**
	 * Function: pegalistademenus
	 *
	 * Obtem a lista de menus
	 */
	pegalistademenus : function(funcao,filtraOgc,filtraDown) {
	    i3GEO.php.verifica();
	    if(!filtraOgc){
		filtraOgc = "nao";
	    }
	    if(!filtraDown){
		filtraDown = "nao";
	    }
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=pegalistademenus&g_sid=" + i3GEO.configura.sid
		+ "&map_file=&idioma=" + i3GEO.idioma.ATUAL
		+ "&filtraOgc=" + filtraOgc
		+ "&filtraDown=" + filtraDown;
	    cpJSON.call(p, "pegalistademenus", funcao, par);
	},
	/**
	 * Function: pegalistadegrupos
	 *
	 * Obtem a lista de grupos de um menu
	 */
	pegalistadegrupos : function(funcao, id_menu, listasgrupos, ordenaNome, filtraOgc, filtraDown) {
	    i3GEO.php.verifica();
	    if(!ordenaNome){
		ordenaNome = "nao";
	    }
	    if(!filtraOgc){
		filtraOgc = "nao";
	    }
	    if(!filtraDown){
		filtraDown = "nao";
	    }
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=pegalistadegrupos&map_file=&g_sid=" + i3GEO.configura.sid + "&idmenu=" + id_menu +
		"&filtraOgc=" + filtraOgc +
		"&filtraDown=" + filtraDown +
		"&ordenaNome=" + ordenaNome + "&listasistemas=nao&listasgrupos=" + listasgrupos + "&idioma=" + i3GEO.idioma.ATUAL;
	    //tipo de filtragem
	    if(i3GEO.arvoreDeTemas){
		if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD === true){
		    par += "&filtro=download";
		}
		else if	(i3GEO.arvoreDeTemas.FILTRAOGC === true){
		    par += "&filtro=ogc";
		}
	    }
	    cpJSON.call(p, "pegalistadegrupos", funcao, par);
	},
	/**
	 * Function: pegalistadeSubgrupos
	 *
	 * Obtem a lista de subgrupos
	 */
	pegalistadeSubgrupos : function(funcao, id_menu, id_grupo) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=pegalistadeSubgrupos&g_sid=" + i3GEO.configura.sid + "&idmenu=" + id_menu + "&grupo=" + id_grupo
		+ "&map_file=&idioma=" + i3GEO.idioma.ATUAL;
	    //tipo de filtragem
	    if(i3GEO.arvoreDeTemas){
		if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD === true){
		    par += "&filtro=download";
		}
		else if	(i3GEO.arvoreDeTemas.FILTRAOGC === true){
		    par += "&filtro=ogc";
		}
	    }
	    cpJSON.call(p, "pegalistadeSubgrupos", funcao, par);
	},
	/**
	 * Function: pegalistadetemas
	 *
	 * Obtem a lista de temas de um item do catalogo
	 */
	pegalistadetemas : function(funcao, id_menu, id_grupo, id_subgrupo) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=pegalistadetemas&g_sid=" + i3GEO.configura.sid + "&idmenu=" + id_menu + "&grupo=" + id_grupo + "&subgrupo="
		+ id_subgrupo + "&map_file=&idioma=" + i3GEO.idioma.ATUAL;
	    cpJSON.call(p, "pegalistadetemas", funcao, par);
	},
	/**
	 * Function: listaTemas
	 *
	 * Lista os temas existentes no mapa
	 */
	listaTemas : function(funcao, tipo, locaplic, sid) {
	    if (arguments.length === 2) {
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
	    }
	    var p = locaplic + "/classesphp/mapa_controle.php", par = "funcao=listatemas&g_sid=" + sid + "&tipo=" + tipo;
	    cpJSON.call(p, "listaTemas", funcao, par);
	},
	/**
	 * Function: listaTemasEditaveis
	 *
	 * Lista os temas guardados na pasta temporaria (temas locais)
	 */
	listaTemasEditaveis : function(funcao, locaplic, sid) {
	    if (arguments.length === 1) {
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
	    }
	    var p = locaplic + "/classesphp/mapa_controle.php", par = "funcao=listatemaslocais&g_sid=" + sid;
	    cpJSON.call(p, "listatemaslocais", funcao, par);
	},
	/**
	 * Function: listaTemasComSel
	 *
	 * Lista os temas que possuem selecao
	 */
	listaTemasComSel : function(funcao, locaplic, sid) {
	    if (arguments.length === 1) {
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
	    }
	    var p = locaplic + "/classesphp/mapa_controle.php", par = "funcao=listatemascomsel&g_sid=" + sid;
	    cpJSON.call(p, "listaTemasComSel", funcao, par);
	},
	/**
	 * Function: listatemasTipo
	 *
	 * Lista os temas de um determinado tipo
	 */
	listatemasTipo : function(funcao, tipo, locaplic, sid) {
	    if (arguments.length === 2) {
		locaplic = i3GEO.configura.locaplic;
		sid = i3GEO.configura.sid;
	    }
	    var p = locaplic + "/classesphp/mapa_controle.php", par = "funcao=&funcao=listatemasTipo&tipo=" + tipo + "&g_sid=" + sid;
	    cpJSON.call(p, "listatemasTipo", funcao, par);
	},
	/**
	 * Function: pegaSistemas
	 *
	 * Pega a lista de sistemas de adicao de temas
	 */
	pegaSistemas : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=pegaSistemas&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "pegaSistemas", funcao, par);
	},
	/**
	 * Function: listadrives
	 *
	 * Lista o drives que permitem navegacao
	 */
	listadrives : function(funcao) {
	    var p = i3GEO.configura.locaplic + "/ferramentas/navegarquivos/exec.php", par =
		"funcao=listaDrives&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "listaDrives", funcao, par);
	},
	/**
	 * Function: listaarquivos
	 *
	 * Lista os arquivos no servidor em um determinado caminho
	 */
	listaarquivos : function(funcao, caminho) {
	    var p = i3GEO.configura.locaplic + "/ferramentas/navegarquivos/exec.php", par =
		"g_sid=" + i3GEO.configura.sid + "&funcao=listaArquivos&diretorio=" + caminho;
	    cpJSON.call(p, "listaArquivos", funcao, par);
	},
	/**
	 * Function: geo2utm
	 */
	geo2utm : function(funcao, x, y) {
	    i3GEO.php.verifica();
	    if ($i("aguardeGifAberto") || x < -180) {
		return;
	    }
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=geo2utm&x=" + x + "&y=" + y + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "geo2utm", funcao, par);
	},
	/**
	 * Function: desativacgi
	 *
	 * Desativa o uso do modo CGI
	 */
	desativacgi : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=desativacgi&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "desativacgi", funcao, par);
	},
	/**
	 * Function: pegaMapas
	 *
	 * Pega a lista de mapas cadastrados
	 */
	pegaMapas : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"&map_file=&funcao=pegaMapas&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "pegaMapas", funcao, par);
	},
	/**
	 * Function: mudatamanho
	 *
	 * Muda o tamanho do mapa
	 */
	mudatamanho : function(funcao, altura, largura) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/ferramentas/opcoes_tamanho/exec.php", par =
		"funcao=mudatamanho&altura=" + altura + "&largura=" + largura + "&g_sid=" + i3GEO.configura.sid, retorno =
		    function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "pegaSistemas", retorno, par);
	},
	/**
	 * Function: ativalogo
	 *
	 * Ativa a logomarca
	 */
	ativalogo : function(funcao, altura, largura) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=ativalogo&g_sid=" + i3GEO.configura.sid, retorno =
		function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "ativalogo", retorno, par);
	},
	/**
	 * Function: insereAnnotation
	 *
	 * Insere uma feature
	 */
	insereAnnotation : function(funcao, pin, xy, texto, position, partials, offsetx, offsety, minfeaturesize, mindistance, force,
		shadowcolor, shadowsizex, shadowsizey, outlinecolor, cor, sombray, sombrax, sombra, fundo, angulo, tamanho, fonte) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=inserefeature&pin=" + pin + "&tipo=ANNOTATION&xy=" + xy + "&texto=" + texto + "&position=" + position
		+ "&partials=" + partials + "&offsetx=" + offsetx + "&offsety=" + offsety + "&minfeaturesize=" + minfeaturesize
		+ "&mindistance=" + mindistance + "&force=" + force + "&shadowcolor=" + shadowcolor + "&shadowsizex=" + shadowsizex
		+ "&shadowsizey=" + shadowsizey + "&outlinecolor=" + outlinecolor + "&cor=" + cor + "&sombray=" + sombray + "&sombrax="
		+ sombrax + "&sombra=" + sombra + "&fundo=" + fundo + "&angulo=" + angulo + "&tamanho=" + tamanho + "&fonte=" + fonte
		+ "&g_sid=" + i3GEO.configura.sid, retorno = function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "inserefeature", retorno, par);
	},
	/**
	 * Function: identificaunico
	 *
	 * Idetifica um onto em um unico tema
	 */
	identificaunico : function(funcao, xy, tema, item) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=identificaunico&xy=" + xy + "&resolucao=5&tema=" + tema + "&item=" + item + "&g_sid=" + i3GEO.configura.sid
		+ "&ext=" + i3GEO.parametros.mapexten;
	    cpJSON.call(p, "identificaunico", funcao, par);
	},
	/**
	 * Function: recuperamapa
	 *
	 * Recupera o mapa atual
	 */
	recuperamapa : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=recuperamapa&g_sid=" + i3GEO.configura.sid, retorno =
		function(retorno) {
		funcao.call(funcao, retorno);
	    };
	    cpJSON.call(p, "recuperamapa", retorno, par);
	},
	/**
	 * Function: criaLegendaImagem
	 *
	 * Pega a legenda atual na forma de imagem
	 */
	criaLegendaImagem : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=criaLegendaImagem&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "criaLegendaImagem", funcao, par);
	},
	/**
	 * Function: referenciadinamica
	 *
	 * Obtem a imagem do mapa de referencia
	 */
	referenciadinamica : function(funcao, zoom, tipo, w, h) {
	    i3GEO.php.verifica();
	    if (!w) {
		w = "";
	    }
	    if (!h) {
		h = "";
	    }
	    if (arguments.length === 2) {
		tipo = "dinamico";
	    }
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=referenciadinamica&g_sid=" + i3GEO.configura.sid + "&zoom=" + zoom + "&tipo=" + tipo + "&ext="
		+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten) + "&w=" + w + "&h=" + h;
	    cpJSON.call(p, "retornaReferenciaDinamica", funcao, par);
	},
	/**
	 * Function: pan
	 *
	 * <PAN>
	 */
	pan : function(funcao, escala, tipo, x, y) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=pan&escala=" + escala + "&tipo=" + tipo + "&x=" + x + "&y=" + y + "&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "pan", funcao, par);
	},
	/**
	 * Function: zoomponto
	 *
	 * Zoom para um ponto
	 */
	zoomponto : function(funcao, x, y, tamanho, simbolo, cor) {
	    i3GEO.php.verifica();
	    if (!simbolo) {
		simbolo = "ponto";
	    }
	    if (!tamanho) {
		tamanho = 15;
	    }
	    if (!cor) {
		cor = "255 0 0";
	    }
	    var retorno = function(retorno) {
		if (i3GEO.Interface.ATUAL === "openlayers") {
		    i3GEO.Interface.openlayers.pan2ponto(x, y);
		}
		if (i3GEO.Interface.ATUAL === "googlemaps") {
		    i3GEO.Interface.googlemaps.pan2ponto(x, y);
		}
		funcao.call(funcao, retorno);
	    }, p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par =
		"funcao=zoomponto&pin=pin&xy=" + x + " " + y + "&g_sid=" + i3GEO.configura.sid + "&marca=" + simbolo + "&tamanho="
		+ tamanho + "&cor=" + cor;
	    cpJSON.call(p, "zoomponto", retorno, par);
	},
	/**
	 * Function: localizaIP
	 *
	 * Localiza por um IP
	 */
	localizaIP : function(funcao) {
	    i3GEO.php.verifica();
	    var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php", par = "funcao=localizaIP&g_sid=" + i3GEO.configura.sid;
	    cpJSON.call(p, "localizaIP", funcao, par);
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
		i3GEO.Interface.openlayers.zoom2ext(ext);
		funcao.call(funcao, retorno);
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
		"funcao=crialente&resolucao=" + resolucao + "&g_sid=" + i3GEO.configura.sid + "&ext=" + i3GEO.parametros.mapexten;
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
		    i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);
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
		locaplic, sid, checked) {
	    var s, p, camadaArvore, par, ck;
	    if(funcao === ""){
		funcao = function() {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: $trad("camadaadic")});
		    i3GEO.atualiza();
		};
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
		+ suportasld + "&formatosinfo=" + formatosinfo;
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
	 * Function: identifica3
	 *
	 * Identifica um ponto no mapa
	 */
	identifica3 : function(funcao, x, y, resolucao, opcao, locaplic, sid, tema, ext, listaDeTemas, wkt) {
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.php.identifica3()");

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
		"funcao=identifica3&wkt=" + wkt + "&opcao=" + opcao + "&xy=" + x + "," + y + "&resolucao=" + resolucao + "&g_sid=" + sid + "&ext=" + ext
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
		"g_sid=" + i3GEO.configura.sid + "&funcao=listaitens&tema=" + tema + "&ext=" + i3GEO.parametros.mapexten;
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
		+ i3GEO.parametros.mapexten;
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
	},
	/**
	 * Function: vinde
	 *
	 * Obtem os dados do visualizador da INDE
	 */
	inde : function(funcao) {
	    var p = i3GEO.configura.locaplic+"/ferramentas/vinde/wmsindejson.php";
	    cpJSON.call(p, "foo", funcao);
	}
};
