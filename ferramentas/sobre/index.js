if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.sobre
 */
i3GEOF.sobre =
	{
		/*
		 * Variavel: aguarde
		 *
		 * Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			//var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.sobre.dicionario);
			return i3GEO.idioma.OBJETOIDIOMA;
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
			if(i3GEOF.sobre.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/sobre/template_mst.html", function(template) {
					i3GEOF.sobre.MUSTACHE = template;
					i3GEOF.sobre.inicia(iddiv);
				});
				return;
			}
			$i(iddiv).innerHTML = i3GEOF.sobre.html();
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
			var ins = Mustache.render(i3GEOF.sobre.MUSTACHE, i3GEOF.sobre.mustacheHash());
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante : function() {
			var janela, divid, titulo, cabecalho, minimiza;
			if ($i("i3GEOF.sobre")) {
				return;
			}
			cabecalho = function() {
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.sobre",200);
			};
			// cria a janela flutuante
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u1") + "</span></div>";
			janela = i3GEO.janela.cria(
					"400px",
					"350px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.sobre",
					false,
					"hd",
					cabecalho,
					minimiza,
					"",
					true,
					"",
					"",
					"",
					"",
					""
				);
			divid = janela[2].id;
			i3GEOF.sobre.aguarde = $i("i3GEOF.sobre_imagemCabecalho").style;
			i3GEOF.sobre.inicia(divid);
		}
	};