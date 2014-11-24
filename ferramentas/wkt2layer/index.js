if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.wkt2layer
 */
i3GEOF.wkt2layer =
{
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function(wkt) {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.wkt2layer.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["wkt"] = wkt;
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
	inicia : function(iddiv,wkt) {
		$i(iddiv).innerHTML = i3GEOF.wkt2layer.html(wkt);
		new YAHOO.widget.Button("i3GEOFwkt2layerShp", {
			onclick : {
				fn : function() {
					var wkt = $i("i3GEOFwkt2layerWkt").value;
					if(wkt.length < 5){
						i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
					}
				}
			}
		});
		new YAHOO.widget.Button("i3GEOFwkt2layerInterno", {
			onclick : {
				fn : function() {
					var wkt = $i("i3GEOFwkt2layerWkt").value;
					if(wkt.length < 5){
						i3GEO.janela.tempoMsg($trad("mensagem",i3GEOF.wkt2layer.dicionario));
					}
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
	html : function(wkt) {
		var ins = Mustache.render(i3GEOF.wkt2layer.MUSTACHE, i3GEOF.wkt2layer.mustacheHash(wkt));
		return ins;
	},
	/*
	 * Function: criaJanelaFlutuante
	 *
	 * Cria a janela flutuante para controle da ferramenta.
	 */
	iniciaJanelaFlutuante : function(wkt) {
		var minimiza, cabecalho, janela, divid, temp, titulo;

		cabecalho = function() {
		};
		minimiza = function() {
			i3GEO.janela.minimiza("i3GEOFwkt2layer");
		};
		// cria a janela flutuante
		titulo = $trad("wkt2layer",i3GEOF.wkt2layer.dicionario);
		janela =
			i3GEO.janela.cria(
				"280px",
				"180px",
				"",
				"",
				"",
				titulo,
				"i3GEOF.wkt2layer",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true
			);
		divid = janela[2].id;
		$i("i3GEOF.wkt2layer_corpo").style.backgroundColor = "white";
		i3GEOF.wkt2layer.inicia(divid,wkt);
	}
};
