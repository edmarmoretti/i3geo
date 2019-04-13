if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.arvoreDeTemas = {
	/**
	 * Propriedade: IDSMENUS
	 *
	 * Array com a lista de ids de menus cadastrados que ser&atilde;o
	 * considerados na montagem da &aacute;rvore. Por default &eacute; vazio, o
	 * que significa que todos os menus serao considerados.
	 *
	 * Tipo:
	 *
	 * {Array}
	 *
	 * Default:
	 *  []
	 */
	IDSMENUS : [],

	/**
	 * Function: buscaTema2
	 *
	 * Procura temas na arvore de temas (a busca e feita no servidor e nao na
	 * arvore atual).
	 *
	 * Parametro:
	 *
	 * {String}
	 */
	buscaTema2 : function(palavra) {
	    if (palavra === "") {
		return;
	    }
	    if (typeof (console) !== 'undefined')
		console.info("i3GEO.arvoreDeTemas.buscaTema()");

	    var busca, root, nodePalavra = "";
	    resultadoProcurar = function(retorno) {
		var ig, montaTexto = function(ngSgrupo) {
		    var tempn, ngTema, tempng, mostra, d, lk = "", st, sg;
		    tempn = ngSgrupo.length;
		    for (sg = 0; sg < tempn; sg += 1) {
			ngTema = ngSgrupo[sg].temas;
			tempng = ngTema.length;
			for (st = 0; st < tempng; st += 1) {
			    mostra = true;
			    try {
				if (i3GEO.arvoreDeTemas.FILTRADOWNLOAD
					&& ngTema[st].download === "nao") {
				    mostra = false;
				}
				if (i3GEO.arvoreDeTemas.FILTRAOGC
					&& ngTema[st].ogc === "nao") {
				    mostra = false;
				}
			    } catch (e) {
				if (typeof (console) !== 'undefined')
				    console.error(e.message)

			    }
			    if (mostra) {
				d = i3GEO.arvoreDeTemas.montaTextoTema("gray",
					ngTema[st]);
				if (ngTema[st].link !== " ") {
				    lk = "<a href='" + ngTema[st].link
				    + "' target='blank'>&nbsp;fonte</a>";
				}
				if (ngSgrupo[sg].subgrupo) {
				    d += "<td style='text-allign:left'> ("
					+ (ngSgrupo[sg].subgrupo) + ") " + lk
					+ "</td>";
				} else {
				    d += "<td style='text-allign:left'> ("
					+ (ngSgrupo[sg].grupo) + ")" + lk
					+ "</td>";
				}
				//aqui vai a saida. antes era arvore
			    }
			    conta += 1;
			}
		    }
		};
	    };

	    //
	    // funcao que sera executada para buscar os temas
	    //
	    busca = function() {
		i3GEO.php.procurartemas2(resultadoProcurar, i3GEO.util
			.removeAcentos(palavra));
	    };
	},
	/**
	 * Section: i3GEO.arvoreDeTemas.dialogo
	 *
	 * Abre as janelas de dialogo com as opcoes adicionais que permitem
	 * acrescentar temas ao mapa
	 *
	 * Por exemplo, para abrir a janela de upload de arquivos dbf, utilize
	 *
	 * i3GEO.arvoreDeTemas.dialogo.uploaddbf()
	 */
	dialogo : {
	    /**
	     * Function: dialogo.uploadarquivo
	     *
	     * Abre uma janela flutunate que permite abrir outras ferramentas para o
	     * upload de arquivos de determinados tipos
	     */
	    uploadarquivo : function() {
		i3GEO.util.scriptTag(i3GEO.configura.locaplic
			+ "/ferramentas/uploadarquivos/dependencias.php",
			"i3GEOF.uploadarquivos.iniciaJanelaFlutuante()",
		"i3GEOF.uploadarquivos_script");
	    },
	    /**
	     * Function: dialogo.carouselTemas
	     *
	     * Abre a janela flutuante para o usuario adicionar temas baseado nas
	     * imagens miniatura
	     */
	    carouselTemas : function() {
		i3GEO.util.scriptTag(i3GEO.configura.locaplic
			+ "/ferramentas/carouseltemas/index.js",
			"i3GEOF.carouseltemas.criaJanelaFlutuante()",
		"i3GEOF.carouseltemas_script");
	    },
	    /**
	     * Function: dialogo.buscaInde
	     *
	     * Abre a janela flutuante para o usuario procurar metadados na INDE
	     */
	    buscaInde : function() {
		i3GEO.util.scriptTag(i3GEO.configura.locaplic
			+ "/ferramentas/buscainde/dependencias.php",
			"i3GEOF.buscainde.start()",
		"i3GEOF.buscainde_script");
	    },
	    /**
	     * Function: dialogo.nuvemTags
	     *
	     * Mostra a nuvem de tags para escolha de temas baseado nos tags
	     * registrados nos menus de temas
	     */
	    nuvemTags : function() {
		i3GEO.util.scriptTag(i3GEO.configura.locaplic
			+ "/ferramentas/nuvemtags/dependencias.php",
			"i3GEOF.nuvemtags.iniciaJanelaFlutuante()",
		"i3GEOF.nuvemtags_script");
	    },
	    /**
	     * Function: dialogo.nuvemTagsFlash
	     *
	     * Mostra a nuvem de tags para escolha de temas baseado nos tags
	     * registrados nos menus de temas.
	     *
	     * Essa ferramenta e alternativa a ferramenta nuvemTags, mostrando tbm a
	     * nuvem com um aplicativo em flash
	     */
	    nuvemTagsFlash : function() {
		i3GEO.janela.cria("550px", "350px", i3GEO.configura.locaplic
			+ "/ferramentas/nuvemtagsflash/index.htm", "", "",
			$trad("x44"));
	    },
	    /**
	     * Function: dialogo.navegacaoDir
	     *
	     * Abre a janela para adicionar temas navegando pelos diretorios do
	     * servidor
	     */
	    navegacaoDir : function() {
		i3GEO.janela
		.cria("550px", "350px", i3GEO.configura.locaplic
			+ "/ferramentas/navegacaodir/index.htm", "", "",
			"<div class='i3GeoTituloJanela'>" + $trad("x45")
			+ "</div>");
	    },
	    /**
	     * Function: dialogo.importarwmc
	     *
	     * Abre a janela para importar um arquivo WMC (Web Map Context)
	     */
	    importarwmc : function() {
		i3GEO.util.scriptTag(i3GEO.configura.locaplic
			+ "/ferramentas/importarwmc/dependencias.php",
			"i3GEOF.importarwmc.start()",
		"i3GEOF.importarwmc_script");
	    },
	    /**
	     * Function: dialogo.conectarwfs
	     *
	     * Abre a janela para adicionar temas tendo como fonte um web service do
	     * tipo wfs
	     */
	    conectarwfs : function() {
		i3GEO.janela.cria("400px", "300px", i3GEO.configura.locaplic
			+ "/ferramentas/conectarwfs/index.htm", "", "",
		"<div class='i3GeoTituloJanela'>WFS</div>");
	    },
	    /**
	     * Function: dialogo.downloadbase
	     *
	     * Abre o aplicativo datadownload
	     */
	    downloadbase : function() {
		window.open(i3GEO.configura.locaplic + "/datadownload.htm");
	    }
	}
};