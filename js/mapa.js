/**
 * Title: Mapa
 *
 * Executa opera&ccedil;&otilde;es obre o mapa principal
 *
 * Em i3GEO.mapa.dialogo estao as funcoes de abertura dos dialogos para
 * alteracao das propriedades do mapa, como cor de fundo, tipo de imagem,
 * legenda etc.
 *
 * Namespace:
 *
 * i3GEO.mapa
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_mapa.js>
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
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a P&uacute;blica
 * Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do GNU junto com
 * este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite 330, Boston, MA
 * 02111-1307 USA.
 *
 */
if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.mapa =
{
	//permite ou nao que o balao de info funcione ao clicar no mapa
	BALAOATIVO: true,
	//mostra ou nao o balao de informacoes mesmo se nao existirem dados retornados
	OPENTIPIFEMPTY: true,
	/**
	 * Propriedade: TEMASINICIAISLIGADOS
	 *
	 * Lista indicando quais temas serao adicionados ao mapa na inicializacao
	 *
	 * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
	 *
	 * Os temas sao aqueles que aparecem em i3geo/temas
	 *
	 * Tipo:
	 *
	 * {string}
	 */
	TEMASINICIAISLIGADOS : "",
	/**
	 * Propriedade: TEMASINICIAIS
	 *
	 * Lista indicando quais temas serao ligados na inicializacao
	 *
	 * Esse valor e utilizado para completar a variavel mashuppar utilizada por i3GEO.
	 *
	 * Os temas sao aqueles que aparecem em i3geo/temas
	 *
	 * Tipo:
	 *
	 * {string}
	 */
	TEMASINICIAIS : "",
	/**
	 * Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
	 *
	 * Tipo {Array}
	 */
	GEOXML : [],
	itensvisib: function(seletores){
	    $.each(seletores, function(i,v){
		if($(v).hasClass("itensvisib")){
		    $(v).removeClass("itensvisib");
		} else {
		    $(v).addClass("itensvisib");
		}
	    });
	},
	/**
	 * Function: limpasel
	 *
	 * Limpa a selecao de todos os temas do mapa
	 *
	 */
	limpasel : function({verifica = false}={}) {
	    var sel = false;
	    if(verifica == true){
		sel = i3GEO.arvoreDeCamadas.existeCamadaSel({msg: true});
	    } else {
		sel = true;
	    }
	    if(sel == true){
		i3GEO.janela.abreAguarde();
		i3GEO.php.limpasel(
			function(retorno) {
			    i3GEO.janela.fechaAguarde();
			    i3GEO.atualiza();
			    i3GEO.Interface.atualizaMapa();
			},
			""
		);
	    }
	},
	infoxy: function(x,y){
	    i3GEO.mapa.dialogo.verificaTipDefault(x,y);
	},
	/**
	 * Ativa o redimensionamento automatico do mapa sempre que o navegador for redimensionado
	 *
	 * e definido como um evento do elemento window
	 */
	ativaAutoResize : function() {
	    var ativo = true;
	    window.onresize = function() {
		var Dw, Dh;
		Dw = window.innerWidth;
		Dh = window.innerHeight;
		i3GEO.tamanhodoc = [
		    Dw, Dh
		    ];
		if (ativo === true) {
		    setTimeout(function() {
			i3GEO.reCalculaTamanho();
			i3GEO.guias.abreFecha("fecha");
			ativo = true;
		    }, 2000);
		}
		ativo = false;
	    };
	},
	ativaIdentifica: function(){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.mapa.ativaIdentifica()");

	    i3GEO.eventos.MOUSECLIQUE = ["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"];
	    i3GEO.eventos.adicionaEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
	    i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.verificaTipDefault()"]);
	    i3GEO.eventos.cliquePerm.ativa();
	},
	ativaIdentificaBalao: function(){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.mapa.ativaIdentificaBalao()");

	    //if (i3GEO.arvoreDeCamadas.filtraCamadas("etiquetas", "", "diferente", i3GEO.arvoreDeCamadas.CAMADAS) === "") {
	    //	i3GEO.janela.tempoMsg($trad("d31"));
	    //	return;
	    //}

	    i3GEO.eventos.removeEventos("MOUSECLIQUEPERM",["i3GEO.mapa.dialogo.cliqueIdentificaDefault()"]);
	    i3GEO.eventos.MOUSECLIQUE = ["i3GEO.mapa.dialogo.verificaTipDefault()"];
	    i3GEO.eventos.cliquePerm.ativa();
	},
	/**
	 * Function: ativaTema
	 *
	 * Altera a variavel i3GEO.temaAtivo e atualiza a interface em funcao do novo tema que for ativado
	 *
	 * O tema anteriormente ativo tem sua cor alterada para a cor normal e o novo tema e destacado com uma cor diferente
	 *
	 * Executa tambem as funcoes armazenadas em i3GEO.eventos.ATIVATEMA
	 *
	 * Parametros:
	 *
	 * {string} - codigo da camada
	 */
	ativaTema : function(codigo) {
	    if (codigo) {
		i3GEO.temaAtivo = codigo;
	    }
	},
	/**
	 * Function: ativaLogo
	 *
	 * Ativa ou desativa a logo marca.
	 */
	ativaLogo : function() {
	    if (i3GEO.Interface.ATUAL === "googlemaps") {
		alert($trad("x21"));
		return;
	    }
	    i3GEO.php.ativalogo(i3GEO.atualiza);
	    var cr = $i("i3GEOcopyright");
	    if (cr) {
		if (cr.style.display === "block") {
		    cr.style.display = "none";
		} else {
		    cr.style.display = "block";
		}
	    }
	},
	/**
	 * Verifica se ocorreu algum problema na atualizacao do corpo do mapa e inicia o processo de tentativa de recuperacao
	 *
	 * Parametro:
	 *
	 * {objeto} - objeto recebido da funcao PHP de atualizacao do mapa
	 */
	verifica : function(retorno) {
	    try {
		if (retorno.data) {
		    retorno = retorno.data;
		}
		if (retorno.variaveis) {
		    retorno = retorno.variaveis;
		}
		if ((retorno === "erro") || (typeof (retorno) === 'undefined')) {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.mapa.recupera.inicia();
		}
		i3GEO.mapa.recupera.TENTATIVA = 0;
	    } catch (e) {
		if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
		    i3GEO.janela.fechaAguarde();
		    return;
		}
		if (this.recupera.TENTATIVA === 0) {
		    i3GEO.janela.tempoMsg("Erro no mapa. Sera feita uma tentativa de recuperacao.");
		    i3GEO.mapa.recupera.inicia();
		} else {
		    i3GEO.janela.tempoMsg("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");
		    if (this.recupera.TENTATIVA === 1) {
			this.recupera.TENTATIVA = 2;
			i3GEO.php.reiniciaMapa(i3GEO.atualiza);
		    }
		}
	    }
	},
	/**
	 * Tenta recuperar o mapa caso ocorra algum problema
	 *
	 * O i3Geo mantem sempre uma copia do arquivo mapfile em uso. Essa funcao tenta usar essa copia para restaurar o funcionamento do
	 * mapa
	 */
	recupera : {
	    /**
	     * Armazena a quantidade de tentativas de recuperacao que foram feitas
	     *
	     * Tipo {Integer}
	     */
	    TENTATIVA : 0,
	    /**
	     * Inicia a tentativa de recuperacao
	     */
	    inicia : function() {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.mapa.inicia()");

		i3GEO.janela.fechaAguarde();
		if (this.recupera && this.recupera.TENTATIVA === 0) {
		    this.recupera.TENTATIVA++;
		    this.recupera.restaura();
		}
	    },
	    /**
	     * Restaura o mapa para a copia de seguranca existente no servidor
	     */
	    restaura : function() {
		i3GEO.php.recuperamapa(i3GEO.atualiza);
	    }
	},
	/**
	 * Controla a obtencao da legenda do mapa na forma de uma imagem
	 *
	 * e utilizado principalmente para armazenar as imagens para a funcao de obtencao do historico do mapa
	 */
	legendaIMAGEM : {
	    /**
	     * Faz a chamada em AJAX que gera a legenda
	     *
	     * O resultado e processado pela funcao passada como parametro
	     *
	     * Parametro:
	     *
	     * funcao {function} - funcao que recebera o resultado da chamada AJAX. O objeto CPAINT e enviado como parametro.
	     */
	    obtem : function(funcao) {
		i3GEO.php.criaLegendaImagem(funcao);
	    }
	},
	/**
	 * Function: compactaLayerGrafico
	 *
	 * Retorna uma string no formato base64 + JSON contendo as geometrias existentes no layer grafico do mapa Essas geometrias podem ser
	 * criadas com o editor vetorial
	 */
	compactaLayerGrafico : function() {
	    var geos = false, geometrias = [], n = 0, i, g;
	    if (i3GEO.editorOL && i3GEO.desenho.layergrafico && i3GEO.desenho.layergrafico.features) {
		geos = i3GEO.desenho.layergrafico.features;
		n = geos.length;
		for (i = 0; i < n; i++) {
		    g = {
			    "atributos" : geos[i].attributes,
			    "geometria" : geos[i].geometry.toString()
		    };
		    geometrias.push(g);
		}
	    }
	    g = JSON.stringify(geometrias);
	    return i3GEO.util.base64encode(g);
	},
	/**
	 * Function: desCompactaLayerGrafico
	 *
	 * Descompacta um layer grafico criado com compactaLayerGrafico
	 */
	desCompactaLayerGrafico : function(geometrias) {
	    geometrias = JSON.parse(geometrias);
	    // carrega o script do editor vetorial
	    if (geometrias.length > 0) {
		var inicia = function() {
		    if(!i3GEO.desenho.layergrafico){
			i3GEO.editorOL.criaLayerGrafico();
		    }
		    i3GEO.editor[i3GEO.Interface.ATUAL].ativaPainel();
		    var n = geometrias.length, i;
		    for (i = 0; i < n; i++) {
			i3GEO.editorOL.adicionaFeatureWkt(geometrias[i].geometria, geometrias[i].atributos);
		    }
		    i3GEO.editorOL.sobeLayersGraficos();
		};
		if (!i3GEO.editorOL) {
		    i3GEO.util.scriptTag(
			    i3GEO.configura.locaplic + "/classesjs/compactados/classe_editorol_compacto.js",
			    inicia,
			    "editorol.js",
			    true);
		}
	    }
	},
	/**
	 * Function: restauraGraficos
	 *
	 * Descompacta graficos salvos no mapa atual
	 */
	restauraGraficos : function(graficos) {
	    // carrega o script do editor vetorial
	    if (graficos.length > 0) {
		var inicia = function() {
		    i3GEOF.graficointerativo.restauraGraficos(graficos);
		};
		i3GEO.util.scriptTag(
			i3GEO.configura.locaplic + "/ferramentas/graficointerativo/dependencias.php",
			inicia,
			"graficointerativo",
			true);
	    }
	},
	/**
	 * Function: restauraTabelas
	 *
	 * Descompacta tabelas salvas no mapa atual
	 */
	restauraTabelas : function(tabelas) {
	    // carrega o script do editor vetorial
	    if (tabelas.length > 0) {
		var inicia = function() {
		    i3GEOF.tabela.restauraTabelas(tabelas);
		};
		i3GEO.util.scriptTag(i3GEO.configura.locaplic + "/ferramentas/tabela/dependencias.php", inicia, "tabela", true);
	    }
	},
	//
	// aplica as preferencias armazenadas localmente ou vindas de um mapa
	// salvo no banco de dados
	//
	aplicaPreferencias : function(cookies) {
	    // aplica preferencias do usuario
	    var props, nprops, i, temp = [], pint;
	    if (!cookies) {
		cookies = i3GEO.util.pegaDadosLocal("preferenciasDoI3Geo");
	    }
	    if (cookies) {
		props = cookies.split("::");
		nprops = props.length;
		// nao tente remover eval com window[], nao funciona com namespace
		for (i = 0; i < nprops; i++) {
		    try {
			temp = props[i].split("|");
			pint = parseInt(temp[1], 10);
			if (temp[1] === 'true' || temp[1] === 'false') {
			    if (temp[1] === 'true') {
				temp[1] = true;
			    }
			    if (temp[1] === 'false') {
				temp[1] = false;
			    }
			    eval(temp[0] + " = " + temp[1] + ";");
			} else if (pint + "px" == temp[1]) {
			    eval(temp[0] + " = '" + temp[1] + "';");
			} else if ($.isNumeric(pint)) {
			    eval(temp[0] + " = " + temp[1] + ";");
			} else {
			    eval(temp[0] + " = '" + temp[1] + "';");
			}
		    } catch (e) {
		    }
		}
	    }
	},
	dialogo : {
	    /**
	     * Function: wms
	     *
	     * Abre a janela de di&aacute;logo com as ferramenta de conexao com wms
	     */
	    wms : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.wms()",
			"conectarwms",
			"conectarwms",
			"dependencias.php",
		"i3GEOF.conectarwms.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: mascara
	     *
	     * Abre a janela de di&aacute;logo com as ferramenta mascara
	     */
	    mascara : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.mascara()",
			"mascara",
			"mascara",
			"dependencias.php",
		"i3GEOF.mascara.start()");
	    },
	    /**
	     * Function: html2canvas
	     *
	     * Abre uma janela com a conversão de um objeto HTML em PNG
	     *
	     * Parametros:
	     *
	     * {obj} - objeto dom contendo o html a ser convertido
	     */
	    html2canvas : function(obj) {
		var temp = function() {
		    i3GEOF.html2canvas.iniciaJanelaFlutuante(obj);
		};
		i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.html2canvas()", "html2canvas", "html2canvas", "dependencias.php", temp);
	    },
	    /**
	     * Function: wkt2layer
	     *
	     * Janela de conversao de wkt em layer
	     *
	     * Parametros:
	     *
	     * {string} - (opcional) WKT
	     *
	     * {texto} - (opcional) texto a ser incluido na feicao
	     */
	    wkt2layer : function(wkt, texto) {
		var temp = function() {
		    i3GEOF.wkt2layer.start(wkt, texto);
		};
		i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.wkt2layer()", "wkt2layer", "wkt2layer", "dependencias.php", temp);
	    },
	    /**
	     * Function: atalhosedicao
	     *
	     * Janela com as principais opcoes de edicao de um layer. Utilizado pelo sistema de administracao
	     *
	     * Parametro:
	     *
	     * {string} - codigo do tema
	     */
	    atalhosedicao : function(idtema) {
		i3GEO.mapa.ativaTema(idtema);
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.atalhosedicao()",
			"atalhosedicao",
			"atalhosedicao",
			"dependencias.php",
		"i3GEOF.atalhosedicao.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: geolocal
	     *
	     * Abre a janela de dialogo da ferramenta de geolocalizacao do usuario
	     */
	    geolocal : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.geolocal()",
			"geolocal",
			"geolocal",
			"dependencias.php",
		"i3GEOF.geolocal.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: listaDeMapasBanco
	     *
	     * Lista os mapas cadastrados no sistema de administracao do i3geo
	     */
	    listaDeMapasBanco : function(idonde) {
		if(idonde){
		    i3GEO.guias.CONFIGURA["mapas"].click.call(this, idonde);
		    return;
		}
		if (i3GEO.guias.CONFIGURA["mapas"]) {
		    var temp, janela, id = "listaMapa" + Math.random();
		    janela = i3GEO.janela.cria(
			    "800px",
			    "500px",
			    i3GEO.configura.locaplic
			    + "/mapas/indexnomenu.php",
			    "",
			    "",
			    "<span class='i3GeoTituloJanelaBsNolink' ></span></div>",
			    id
		    );
		} else {
		    window.open(i3GEO.configura.locaplic + "/rss/rssmapas.php", "_blank");
		}
	    },
	    /**
	     * Function: congelaMapa
	     *
	     * Congela a vis&atilde;o atual do mapa mostrando-o em uma janela flutuante
	     */
	    congelaMapa : function() {
		var url = "", idjanela = i3GEO.util.generateId(), cabecalho = function() {
		}, titulo, minimiza = function() {
		    i3GEO.janela.minimiza(idjanela);
		};
		if (i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps") {
		    url =
			i3GEO.configura.locaplic + "/ferramentas/congelamapa/openlayers3.php?g_sid="
			+ i3GEO.configura.sid
			+ "&ext="
			+ i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);

		    titulo = "<span class='i3GeoTituloJanelaBsNolink' ></span></div>";

		    i3GEO.janela.cria(
			    "520px",
			    "370px",
			    url,
			    "",
			    "",
			    titulo,
			    idjanela,
			    false,
			    "hd",
			    cabecalho,
			    minimiza,
			    "",
			    "",
			    "",
			    "",
			    false,
			    "",
			    "123"
		    );
		}
	    },
	    /**
	     * Function: metaestat
	     *
	     * Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT

	     *@TODO depreciado na versao 8
	     */
	    metaestat : function(largura, altura, topo, esquerda, Interface, conexao) {
		var temp = function() {
		    i3GEOF.metaestat.MULTIPARAMETROS = true;
		    if(Interface){
			i3GEOF.metaestat.INTERFACE = Interface;
		    }
		    if(conexao){
			i3GEOF.metaestat.CONEXAODEFAULT = conexao;
		    }
		    i3GEOF.metaestat.INTERFACE = "flutuante";
		    i3GEOF.metaestat.principal.inicia(null, largura, altura, topo, esquerda);
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.metaestat()",
			"metaestat",
			"metaestat",
			"dependencias.php",
			temp
		);
	    },
	    cartograma:  function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.cartograma()",
			"cartograma",
			"cartograma",
			"dependencias.php",
		"i3GEOF.cartograma.start()");
	    },
	    /**
	     * Function: metaestatListaMapas
	     *
	     * Lista os mapas publicados no METAESTAT
	     */
	    metaestatListaMapas : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.metaestatListaMapas()",
			"metaestat",
			"listamapas",
			"listamapas.js",
		"i3GEOF.listamapas.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: preferencias
	     *
	     * Preferencias do usuario
	     */
	    preferencias : function() {
		i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.preferencias()", "preferencias", "preferencias");
	    },
	    /**
	     * Function: locregiao
	     *
	     * Abre a janela de dialogo da ferramenta de busca de regiao cadastrada no METAESTAT
	     */
	    locregiao : function() {
		var temp = function(){
		    i3GEOF.locregiao._parameters.ATIVAFILTRO = false;
		    i3GEOF.locregiao.start();
		};
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.locregiao()",
			"locregiao",
			"locregiao",
			"dependencias.php",
		temp);
	    },
	    /**
	     * Function: filtraregiao
	     *
	     * Abre a janela de dialogo da ferramenta de busca de regioes cadastradas no METAESTAT com opcao de filtrar a regiao escolhida
	     */
	    filtraregiao : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.filtraregiao()",
			"locregiao",
			"locregiao",
			"dependencias.php",
			"i3GEOF.locregiao.abreComFiltro()"
		);
	    },
	    /**
	     * Function: filtraperiodo
	     * Utilizado com camadas metaestat
	     */
	    filtraperiodo : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.filtraperiodo()",
			"filtraperiodo",
			"filtraperiodo",
			"dependencias.php",
			"i3GEOF.filtraperiodo.iniciaJanelaFlutuante()"
		);
	    },
	    /**
	     * Function: animacao
	     *
	     * Abre a janela de dialogo da ferramenta que permite animar o mapa atual
	     */
	    animacao : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.animacao()",
			"animacao",
			"animacao",
			"dependencias.php",
		"i3GEOF.animacao.start()");
	    },
	    /**
	     * Function: opacidade
	     *
	     * Abre a janela de dialogo da ferramenta de definicao da transparencia das camadas principais do mapa
	     */
	    opacidade : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opacidademapa()",
			"opacidademapa",
			"opacidademapa",
			"dependencias.php",
		"i3GEOF.opacidademapa.start()");
	    },
	    /**
	     * Function: t3d
	     *
	     * Abre a janela de dialogo da ferramenta de geracao da visualizacao em 3d
	     */
	    t3d : function() {
		i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.t3d()", "3d", "t3d");
	    },
	    /**
	     * Function: imprimir
	     *
	     * Abre a janela de dialogo da ferramenta que permite imprimir o mapa atual
	     */
	    imprimir : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.imprimir()",
			"imprimir",
			"imprimir",
			"dependencias.php",
		"i3GEOF.imprimir.start()");
	    },
	    /**
	     * Function: mostraExten
	     *
	     * Abre a janela de dialogo da ferramenta que mostra a extensao geografica atual do mapa
	     */
	    mostraExten : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.mostraExten()",
			"mostraexten",
			"mostraExten",
			"dependencias.php",
		"i3GEOF.mostraExten.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: outputformat
	     *
	     * Abre a janela de dialogo da ferramenta outputformat
	     */
	    outputformat : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.outputformat()",
			"outputformat",
			"outputformat",
			"dependencias.php",
		"i3GEOF.outputformat.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: autoredesenha
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_autoredesenha
	     */
	    autoredesenha : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.autoredesenha()",
			"opcoes_autoredesenha",
			"opcoesTempo",
			"dependencias.php",
		"i3GEOF.opcoesTempo.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: salvaMapa
	     *
	     * Abre a janela de dialogo da ferramenta salvamapa
	     */
	    salvamapa : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.salvamapa()",
			"salvamapa",
			"salvamapa",
			"dependencias.php",
		"i3GEOF.salvamapa.start()");
	    },
	    /**
	     * Function: carregamapa
	     *
	     * Abre a janela de dialogo da ferramenta carregamapa
	     */
	    carregamapa : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.carregamapa()",
			"carregamapa",
			"carregamapa",
			"dependencias.php",
		"i3GEOF.carregamapa.start()");
	    },
	    /**
	     * Function: convertews
	     *
	     * Abre a janela de dialogo da ferramenta convertews
	     */
	    convertews : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.convertews()",
			"convertews",
			"convertews",
			"dependencias.php",
		"i3GEOF.convertews.start()");
	    },
	    /**
	     * Function: convertekml
	     *
	     * Abre a janela de dialogo da ferramenta convertemapakml
	     */
	    convertemapakml : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.convertekml()",
			"convertemapakml",
			"convertemapakml",
			"dependencias.php",
		"i3GEOF.convertemapakml.start()");
	    },
	    /**
	     * Function: queryMap
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_querymap
	     */
	    queryMap : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.queryMap()",
			"opcoes_querymap",
			"opcoesQuery",
			"dependencias.php",
		"i3GEOF.opcoesQuery.iniciaJanelaFlutuante()");
	    },
	    /**
	     * Function: template
	     *
	     * Abre a janela de dialogo da ferramenta template
	     */
	    template : function() {
		i3GEO.janela.cria(
			"300px",
			"400px",
			i3GEO.configura.locaplic + "/ferramentas/template/index.htm",
			"",
			"",
			"<div class='i3GeoTituloJanela'>Template<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic
			+ "/ajuda_usuario.php?idcategoria=1&idajuda=8' ><b> </b></a></div>");
	    },
	    /**
	     * Function: tamanho
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_tamanho
	     */
	    opcoestamanho : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opcoestamanho()",
			"opcoestamanho",
			"opcoestamanho",
			"dependencias.php",
		"i3GEOF.opcoestamanho.start()");
	    },
	    /**
	     * Function: tipoimagem
	     *
	     * Abre a janela de dialogo da ferramenta tipoimagem
	     */
	    tipoimagem : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.tipoimagem()",
			"tipoimagem",
			"tipoimagem",
			"dependencias.php",
		"i3GEOF.tipoimagem.start()");
	    },
	    /**
	     * Function: corfundo
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_fundo
	     */
	    opcoesfundo : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opcoesfundo()",
			"opcoesfundo",
			"opcoesfundo",
			"dependencias.php",
		"i3GEOF.opcoesfundo.start()");
	    },
	    /**
	     * Function: opcoesEscala
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_escala
	     */
	    opcoesescala : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opcoesescala()",
			"opcoesescala",
			"opcoesescala",
			"dependencias.php",
		"i3GEOF.opcoesescala.start()");
	    },
	    /**
	     * Function: opcoeslegenda
	     *
	     * Abre a janela de dialogo da ferramenta opcoeslegenda
	     */
	    opcoeslegenda : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opcoeslegenda()",
			"opcoeslegenda",
			"opcoeslegenda",
			"dependencias.php",
		"i3GEOF.opcoeslegenda.start()");
	    },
	    /**
	     * Function: opcoesMapaRef
	     *
	     * Abre a janela de dialogo da ferramenta opcoes_maparef
	     */
	    opcoesmaparef : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.opcoesmaparef()",
			"opcoesmaparef",
			"opcoesmaparef",
			"dependencias.php",
		"i3GEOF.opcoesmaparef.start()");
	    },
	    /**
	     * Function: gradeCoord
	     *
	     * Abre a janela de dialogo da ferramenta gradecoord
	     */
	    gradecoord : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.gradecoord()",
			"gradecoord",
			"gradecoord",
			"dependencias.php",
		"i3GEOF.gradecoord.start()");
	    },
	    /**
	     * Function: inseretxt
	     *
	     * Abre a janela de dialogo da ferramenta inseretxt
	     */
	    inseretxt : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.inseretxt()",
			"inseretxt",
			"inseretxt",
			"dependencias.php",
		"i3GEOF.inseretxt.start()");
	    },
	    /**
	     * Function: selecao
	     *
	     * Abre a janela de dialogo da ferramenta selecao
	     */
	    selecao : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.selecao()",
			"selecao",
			"selecao",
			"dependencias.php",
			"i3GEOF.selecao.iniciaJanelaFlutuante()"
		);
	    },
	    /**
	     * Function: inserexy2
	     *
	     * Abre a janela de dialogo da ferramenta inserexy2
	     */
	    inserexy2 : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.inserexy2()",
			"inserexy2",
			"inserexy2",
			"dependencias.php",
		"i3GEOF.inserexy2.start()");
	    },
	    /**
	     * Function: cliqueGrafico
	     *
	     * Abre a janela de dialogo da ferramenta inseregrafico
	     */
	    inseregrafico : function() {
		i3GEO.util.dialogoFerramenta(
			"i3GEO.mapa.dialogo.inseregrafico()",
			"inseregrafico",
			"inseregrafico",
			"dependencias.php",
		"i3GEOF.inseregrafico.start()");
	    },
	    /**
	     * Function: cliqueIdentificaDefault
	     *
	     * Abre a janela de dialogo da ferramenta identifica
	     *
	     *
	     * Parametros:
	     *
	     * {numerico} - (opcional) coordenada x
	     *
	     * {numerco} - (opcional) coordenada y
	     *
	     */
	    cliqueIdentificaDefault : function(x, y, tema) {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.mapa.dialogo.cliqueIdentificaDefault()");

		if(!x){
		    x = objposicaocursor.ddx;
		    y = objposicaocursor.ddy;
		}
		var temp = function() {
		    i3GEOF.identifica.start({"x":x,"y":y,"tema": tema});
		};
		// javascript nao foi carregado
		if (typeof (i3GEOF.identifica) === 'undefined') {
		    // javascript que sera carregado
		    var js = i3GEO.configura.locaplic + "/ferramentas/identifica/dependencias.php";
		    // carrega o script
		    i3GEO.util.scriptTag(js, temp, "i3GEOF.identifica_script");
		} else {
		    temp();
		}
	    },
	    /**
	     * Mostra etiquetas no mapa com informacoes sobre os temas com etiquetas ativas
	     *
	     * Essa e a funcao padrao definida em i3GEO.configura
	     */
	    verificaTipDefault : function(x,y) {
		if (typeof (console) !== 'undefined')
		    console.info("i3GEO.mapa.dialogo.verificaTipDefault()" + x + " " + y );

		if(i3GEO.mapa.BALAOATIVO == false){
		    if (typeof (console) !== 'undefined')
			console.info("balao desativado");

		    return;
		}
		if(!x){
		    x = objposicaocursor.ddx;
		}
		if(!y){
		    y = objposicaocursor.ddy;
		}
		if(x === -1 || y === -1 || i3GEO.eventos.cliquePerm.ativo === false || i3GEO.eventos.cliquePerm.status === false){
		    return;
		}
		i3GEO.eventos.cliquePerm.status = false;
		//para evitar duplo clique
		objposicaocursor.ddx = -1;
		objposicaocursor.ddy = -1;
		var ntemas = i3GEO.arvoreDeCamadas.CAMADAS.length;
		var etiquetas = false;
		for (var j = 0; j < ntemas; j += 1) {
		    if (i3GEO.arvoreDeCamadas.CAMADAS[j].etiquetas !== "" || i3GEO.arvoreDeCamadas.CAMADAS[j].identifica == "SIM") {
			etiquetas = true;
		    }
		}
		if (etiquetas === false) {
		    return;
		}
		if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url != "" && i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal == ""){
		    $.get( i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url + "&xx=" + x + "&yy=" + y, function( data ) {
			i3GEO.janela.closeMsg(data);
		    });
		    return;
		}
		if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal != ""){
		    if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url != ""){
			var temp = i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.url + "&xx=" + x + "&yy=" + y;
			temp = i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal.replace("{{{url}}}",temp);
			i3GEO.janela.closeMsg(temp);
		    } else {
			i3GEO.janela.closeMsg(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.templateModal);
		    }
		    return;
		}
		var b = i3GEO.mapa.createWaitOverlay(x,y);
		var temp = function(retorno){
		    i3geoOL.removeOverlay(b);
		    i3GEO.mapa.montaTip(retorno,x,y);
		};
		i3GEO.php.identifica3(
			temp,
			x,
			y,
			i3GEO.configura.ferramentas.identifica.resolution,
			"tip",
			i3GEO.configura.locaplic,
			i3GEO.configura.sid,
			"ligados",
			i3GEO.parametros.mapexten,
			"",
		"sim");
	    }
	},
	createWaitOverlay: function(x,y){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.mapa.createWaitOverlay()" );

	    var res = i3GEO.configura.ferramentas.identifica.resolution;
	    var bdiv = document.createElement("div");
	    bdiv.className = "waitInfoWindow";
	    bdiv.style.width = res+"px";
	    bdiv.style.height = res+"px";
	    bdiv.style.top = (res/2 * -1) + "px";

	    var b = new ol.Overlay({
		element : bdiv,
		stopEvent : true,
		autoPan : false,
		origem: "balao",
		autoPanAnimation : false,
		positioning: "center-center",
		position: i3GEO.util.projGeo2OSM(new ol.geom.Point([x, y])).getCoordinates()
	    });
	    i3geoOL.addOverlay(b);
	    return b;
	},
	montaTip: function (retorno,xx,yy){
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.mapa.montaTip()");

	    var textCopy = [],textoSimples = "", textoTempSimples = "", x, y, temp, n, mostra, res, temas, ntemas, titulo, tips, j, ntips, r, ds, nds, s, configura =
		i3GEO.configura, wkts = [];

	    i3GEO.eventos.cliquePerm.status = true;
	    mostra = false;
	    if(retorno.data){
		retorno = retorno.data;
		temp = retorno[0].xy.split(",");
		x = temp[0]*1;
		y = temp[1]*1;
	    } else {
		x = xx;
		y = yy;
		mostra = true;
		textoSimples = "";//$trad("balaoVazio");
		wkt = [];
		if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.openTipNoData == false){
		    mostra = false;
		}
	    }
	    if (retorno !== "") {
		res = "";
		ntemas = 0;
		temas = retorno;
		if (temas) {
		    ntemas = temas.length;
		}
		for (j = 0; j < ntemas; j += 1) {
		    titulo = temas[j].nome;
		    textCopy.push(titulo);
		    //para os nomes de funcoes embutidas
		    //funcoes sao configuradas no mapfile
		    //exemplo do METADATA
		    //"FUNCOESJS" '[{"tipo":"layer","titulo":"teste fake"},{"tipo":"registro","titulo":"teste de nome de uma função","script":"../aplicmap/dados/testefuncaojs.js","funcao":"funcao1","parametros":["FIPS_CNTRY","LONG_NAME"]}]'
		    var temp1 = [];
		    $.each( temas[j].funcoesjs, function( key, value ) {
			if(value.tipo == "layer"){
			    var parametros = [x,y,temas[j].tema];
			    $.each( value.parametros, function( key1, value1 ) {
				parametros.push(ds[s][value1].valor);
			    });
			    parametros = "\"" + parametros.join("\",\"") + "\"";
			    temp1.push("<a class='toolTipBalaoFuncoes' href='javascript:void(0);' onclick='" + value.funcao + "(" + parametros + ")' >" + value.titulo + "</a><br>");

			    //adiciona o javascript que contem a funcao
			    if(value.script && value.script != ""){
				i3GEO.util.scriptTag(value.script, "", "funcaolayer"+value.funcao, false);
			    }
			}
		    });
		    temp1 = temp1.join(" ");

		    var mais = "<button style='margin: 2px;padding: 0px;vertical-align: middle;position: relative;top: -7px;' class='btn btn-default btn-xs' onclick=\"i3GEO.mapa.dialogo.cliqueIdentificaDefault(" + x + "," + y + ",'" + temas[j].tema + "');return false;\" ><span style='opacity:0.5;vertical-align: middle;padding: 0px;' class='material-icons'>info</span></button>";
		    if(ntemas == 1){
			mais = "";
		    }
		    titulo = "<div class='toolTipBalaoTitulo'>" + mais + " <b>" + titulo + "</b><br>" + temp1 + "</div>";
		    tips = temas[j].resultado.todosItens;
		    ntips = tips.length;
		    ins = "";
		    textoTempSimples = "";
		    ds = temas[j].resultado.dados;
		    if (ds !== " " && ds[0] && ds[0] != " ") {
			try {
			    nds = ds.length;
			    for (s = 0; s < nds; s += 1) {
				textoTempSimples += "<div class='toolTipBalaoTexto'>";
				for (r = 0; r < ntips; r += 1) {
				    try {
					temp = "";
					var alias = ds[s][tips[r]].alias;
					var valor = ds[s][tips[r]].valor;
					var link = ds[s][tips[r]].link;
					var img = ds[s][tips[r]].img;
					var estilo = "tooltip-"+temas[j].tema;
					if (valor !== "" && link === "") {
					    temp += "<span class='"+estilo+"'><label>" + alias + ": </label>" + valor + "</span><br>";
					    textCopy.push(alias + ":" + valor);
					}
					if (valor !== "" && link !== "") {
					    temp +=
						"<span class='"+estilo+"'><label>" + alias
						+ " : </label><a style='color:blue;cursor:pointer' target=_blanck href='"
						+ link
						+ "' >"
						+ valor
						+ "</a></span><br>";
					    textCopy.push(alias + ":" + valor);
					}
					if (img !== "") {
					    temp += img + "<br>";
					}
					if (ds[s][tips[r]].tip.toLowerCase() === "sim") {
					    textoTempSimples += temp;
					}
					mostra = true;
				    } catch (e) {}
				}
				//para os nomes de funcoes embutidas
				//funcoes sao configuradas no mapfile
				//exemplo do METADATA
				//"FUNCOESJS" '[{"tipo":"layer","titulo":"teste fake"},{"tipo":"registro","titulo":"teste de nome de uma função","script":"../aplicmap/dados/testefuncaojs.js","funcao":"funcao1","parametros":["FIPS_CNTRY","LONG_NAME"]}]'
				var temp1 = [];
				$.each( temas[j].funcoesjs, function( key, value ) {
				    if(value.tipo == "registro"){
					var parametros = [x,y,temas[j].tema];
					$.each( value.parametros, function( key1, value1 ) {
					    parametros.push(ds[s][value1].valor);
					});
					parametros = "\"" + parametros.join("\",\"") + "\"";
					temp1.push("<a class='toolTipBalaoFuncoes' href='javascript:void(0);' onclick='" + value.funcao + "(" + parametros + ")' >" + value.titulo + "</a><br>");
					//adiciona o javascript que contem a funcao
					if(value.script && value.script != ""){
					    i3GEO.util.scriptTag(value.script, "", "funcaolayer"+value.funcao, false);
					}
				    }
				});
				temp1 = temp1.join(" ");
				textoTempSimples += temp1 + "</div>";
				//insere o wkt se existir
				if(ds[s].wkt && ds[s].wkt.valor != ""){
				    ds[s].tema = temas[j].tema;
				    ds[s].titulo = temas[j].nome;
				    wkts.push(ds[s]);
				}
			    }
			} catch (e) {
			}
		    }
		    if (textoTempSimples !== "") {
			textoSimples += titulo + textoTempSimples;
		    }
		}
		//caso seja um vetor
		var pixel = i3geoOL.getPixelFromCoordinate([x,y]);
		var html = [];
		i3geoOL.forEachFeatureAtPixel(pixel, function(feature, layer) {
		    if (typeof (console) !== 'undefined')
			console.info("i3geoOL.forEachFeatureAtPixel " + layer.get("name"));

		    var texto = "";
		    var chaves = feature.getKeys();
		    var prop = feature.getProperties();
		    var c = chaves.length;
		    for (var i = 0; i < c; i++) {
			if (chaves[i] != "geometry" && chaves[i] != "styleUrl") {
			    if(chaves[i] == "fat"){
				$.each(prop[chaves[i]],function( index, element ){
				    if(element.item != undefined){
					texto += element.item + ": " + element.valor + "<br>";
				    }
				});
			    } else {
				texto += chaves[i] + ": " + prop[chaves[i]] + "<br>";
			    }
			}
		    }
		    html.push(texto);
		    mostra = true;
		    //para nao incluir mais de uma vez a geometria
		    wkts = [];
		});
		textoSimples += html.join("<br>");
		textCopy += html.join("<br>");
		if (mostra === true) {
		    if(i3GEO.Interface[i3GEO.Interface.ATUAL].BALAOPROP.modal == true){
			i3GEO.janela.closeMsg(textoSimples);
			return;
		    } else {
			i3GEO.Interface[i3GEO.Interface.ATUAL].balao(textoSimples, textCopy, x, y, true, wkts.length);
		    }
		}
	    }
	    if (typeof (console) !== 'undefined')
		console.info("adicionando WKT");

	    n = wkts.length;
	    if(n > 0){
		i3GEO.desenho.openlayers.criaLayerGrafico();
		var g, format, f, idunico,c = i3GEO.desenho.layergrafico.getSource();
		format = new ol.format.WKT();
		for(r = 0; r < n; r += 1){
		    f = format.readFeatures(wkts[r].wkt.valor);
		    f = f[0];
		    g = f.getGeometry();
		    g = i3GEO.util.projGeo2OSM(g);
		    f.setGeometry(g);
		    f.setId(i3GEO.util.uid());
		    i3GEO.editor.setStyleByTypeFeature(f);
		    i3GEO.editor.setStyleDefault(f);
		    wkts[r].wkt = "",
		    //atributos
		    f.setProperties({
			fat : wkts[r],
			origem : "pin"
		    });
		    c.addFeature(f);
		}
	    }
	}
};