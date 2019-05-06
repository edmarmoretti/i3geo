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