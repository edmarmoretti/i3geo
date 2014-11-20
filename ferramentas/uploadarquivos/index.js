if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.uploadarquivos
 */
i3GEOF.uploadarquivos =
{
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.uploadarquivos.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
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
		$i(iddiv).innerHTML = i3GEOF.uploadarquivos.html();
		new YAHOO.widget.Button("i3GEOFuploadarquivosShp", {
			onclick : {
				fn : function() {
					i3GEO.util.scriptTag(i3GEO.configura.locaplic
						+ "/ferramentas/upload/index.js",
						"i3GEOF.upload.criaJanelaFlutuante()",
						"i3GEOF.upload_script");
				}
			}
		});
		new YAHOO.widget.Button("i3GEOFuploadarquivosDbfCsv", {
			onclick : {
				fn : function() {
					i3GEO.util.scriptTag(i3GEO.configura.locaplic
						+ "/ferramentas/uploaddbf/dependencias.php",
						"i3GEOF.uploaddbf.iniciaJanelaFlutuante()",
						"i3GEOF.uploaddbf_script");
				}
			}
		});
		new YAHOO.widget.Button("i3GEOFuploadarquivosGpx", {
			onclick : {
				fn : function() {
					i3GEO.util.scriptTag(i3GEO.configura.locaplic
						+ "/ferramentas/uploadgpx/dependencias.php",
						"i3GEOF.uploadgpx.iniciaJanelaFlutuante()",
						"i3GEOF.uploadgpx_script");
				}
			}
		});
		new YAHOO.widget.Button("i3GEOFuploadarquivosKml", {
			onclick : {
				fn : function() {
					i3GEO.util.scriptTag(i3GEO.configura.locaplic
						+ "/ferramentas/uploadkml/dependencias.php",
						"i3GEOF.uploadkml.iniciaJanelaFlutuante()",
						"i3GEOF.uploadkml_script");
				}
			}
		});
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
		var ins = Mustache.render(i3GEOF.uploadarquivos.MUSTACHE, i3GEOF.uploadarquivos.mustacheHash());
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function() {
		var minimiza, cabecalho, janela, divid, temp, titulo;

		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOFuploadarquivos");
		};
		// cria a janela flutuante
		titulo = "<span class='i3GEOconeFerramenta i3GEOiconeUpload'></span>" + $trad("upload",i3GEOF.uploadarquivos.dicionario);
		janela =
			i3GEO.janela.cria(
				"230px",
				"180px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.uploadarquivos",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true
			);
		divid = janela[2].id;
		$i("i3GEOF.uploadarquivos_corpo").style.backgroundColor = "white";
		i3GEOF.uploadarquivos.inicia(divid);
	}
};
