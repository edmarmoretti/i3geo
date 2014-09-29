if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.atalhosedicao
 */
i3GEOF.atalhosedicao =
{
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.atalhosedicao.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	 * Function: iniciaDicionario (Depreciado na versao 6.0)
	 * 
	 */
	iniciaDicionario : function() {
		i3GEOF.atalhosedicao.iniciaJanelaFlutuante();
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
	inicia : function(iddiv, idjanela) {
		i3GEO.janela.comboCabecalhoTemas(
			"i3GEOFatalhosedicaoComboCabeca",
			"i3GEOFatalhosedicaoComboCabecaSel",
			"atalhosedicao",
		"ligadosComTabela");
		$i(iddiv).innerHTML = i3GEOF.atalhosedicao.html(idjanela);
		
		new YAHOO.widget.Button("i3GEOFatalhosedicaoLegenda", {
			onclick : {
				fn : function() {
					i3GEO.tema.dialogo.editaLegenda();
				}
			}
		});
		$i("i3GEOFatalhosedicaoLegenda-button").style.width = "200px";
		
		new YAHOO.widget.Button("i3GEOFatalhosedicaoSalva", {
			onclick : {
				fn : function() {
					i3GEO.tema.dialogo.salvaMapfile(i3GEO.mapa.temaAtivo);
				}
			}
		});
		$i("i3GEOFatalhosedicaoSalva-button").style.width = "200px";
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
	html : function(idjanela) {
		var ins = Mustache.render(i3GEOF.atalhosedicao.MUSTACHE, i3GEOF.atalhosedicao.mustacheHash());
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
			i3GEO.janela.minimiza("i3GEOFatalhosedicao");
		};
		// cria a janela flutuante
		titulo =
			"<div  id='i3GEOFatalhosedicaoComboCabeca' class='comboTemasCabecalho'></div>&nbsp;&nbsp;&nbsp;";
		janela =
			i3GEO.janela.cria(
				"250px",
				"300px",
				"",
				"",
				"",
				titulo,
				"i3GEOFatalhosedicao",
				false,
				"hd",
				cabecalho,
				minimiza,
				"",
				true,
				i3GEO.configura.locaplic + "/imagens/oxygen/16x16/games-config-custom.png"
			);
		divid = janela[2].id;
		janela[0].moveTo(100,60);
		$i("i3GEOFatalhosedicao_corpo").style.backgroundColor = "white";
		i3GEOF.atalhosedicao.inicia(divid, "i3GEOFatalhosedicao");
	}
};
