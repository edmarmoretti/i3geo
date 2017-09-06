if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.conectarservicos
 */
i3GEOF.conectarservicos =
{
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.conectarservicos.dicionario);
			dicionario["locaplic"] = i3GEO.configura.locaplic;
			return dicionario;
		},
		/*
		 * Function: iniciaDicionario (Depreciado na versao 6.0)
		 *
		 */
		iniciaDicionario : function() {
			i3GEOF.conectarservicos.iniciaJanelaFlutuante();
		},
		/*
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametro:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia : function(iddiv) {
			if(i3GEOF.conectarservicos.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/conectarservicos/template_mst.html", function(template) {
					i3GEOF.conectarservicos.MUSTACHE = template;
					i3GEOF.conectarservicos.inicia(iddiv);
				});
				return;
			}
			$i(iddiv).innerHTML = i3GEOF.conectarservicos.html();
			//i3GEO.janela.applyScrollBar("#" + iddiv +" .customScrollBar");
		},
		geojson: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/conectargeojson/dependencias.php",
					"i3GEOF.conectargeojson.iniciaJanelaFlutuante()",
			"i3GEOF.conectargeojson_script");
		},
		georss: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/conectargeorss/dependencias.php",
					"i3GEOF.conectargeorss.iniciaJanelaFlutuante()",
			"i3GEOF.conectargeorss_script");
		},
		wmst: function(){
            i3GEO.util.scriptTag(i3GEO.configura.locaplic
                    + "/ferramentas/wmstime/dependencias.php",
                    "i3GEOF.wmstime.iniciaJanelaFlutuante()",
            "i3GEOF.wmstime_script");
		},
		wms: function(){
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/conectarwms/dependencias.php",
					"i3GEOF.conectarwms.iniciaJanelaFlutuante()",
			"i3GEOF.conectarwms_script");
		},
		kml: function() {
			i3GEO.util.scriptTag(i3GEO.configura.locaplic
					+ "/ferramentas/carregakml/dependencias.php",
					"i3GEOF.carregakml.iniciaJanelaFlutuante()",
			"i3GEOF.carregakml_script");
		},
		/*
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function() {
			var ins = Mustache.render(i3GEOF.conectarservicos.MUSTACHE, i3GEOF.conectarservicos.mustacheHash());
			return ins;
		},
		/*
		 * Function: criaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var cabecalho, janela, divid, titulo;
			if($i("i3GEOF-conectarservicos")){
				return;
			}
			cabecalho = function() {
			};
			// cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("conexao",i3GEOF.conectarservicos.dicionario) + "</span></div>";
			janela =
				i3GEO.janela.cria(
						"280px",
						"300px",
						"",
						"",
						"",
						titulo,
						"i3GEOF-conectarservicos",
						false,
						"hd",
						cabecalho,
						"",
						"",
						true,
						"",
						"",
						"",
						""
				);
			divid = janela[2].id;
			i3GEOF.conectarservicos.inicia(divid);
		}
};
