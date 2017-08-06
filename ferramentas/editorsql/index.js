/*
Title: Editor de SQL

Permite alterar os parametros de conex&atilde;o com banco de dados do tema.

Opera apenas em temas baseados em conex&otilde;es com bancos de dados.

Veja:

<i3GEO.tema.dialogo.editorsql>

Arquivo:

i3geo/ferramentas/editorsql/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.editorsql
*/
//TODO incluir editor de filtro
i3GEOF.editorsql = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.editorsql.dicionario);
		dicionario["aguarde"] = $trad("p14");
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.editorsql.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/editorsql/template_mst.html", function(template) {
				i3GEOF.editorsql.MUSTACHE = template;
				i3GEOF.editorsql.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.editorsql.html();
			new YAHOO.widget.Button(
				"i3GEOeditorsqlbotao1",
				{onclick:{fn: i3GEOF.editorsql.altera}}
			);
			i3GEOF.editorsql.pega();

			i3GEO.util.comboItens(
				"i3GEOeditorsqlItem",
				i3GEO.temaAtivo,
				function(retorno){
			 		$i("i3GEOeditorsqlDivItem").innerHTML = retorno.dados;
			 		$i("i3GEOeditorsqlItem").onchange = function(){
						i3GEO.util.comboValoresItem(
							"i3GEOeditorsqlitens",
							i3GEO.temaAtivo,
							$i("i3GEOeditorsqlItem").value,
							function(retorno){
								$i("i3GEOeditorsqlvalores").innerHTML = "<p class=paragrafo >"+$trad('valores',i3GEOF.editorsql.dicionario)+"<br><br>"+retorno.dados+"</p>";
							},
							"i3GEOeditorsqlvalores"
						);

			 		};
				},
				"i3GEOeditorsqlDivItem"
			);

		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.editorsql.MUSTACHE, i3GEOF.editorsql.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		if($i("i3GEOF.editorsql")){
			return;
		}
		//cria a janela flutuante
		titulo = "</div><a class='i3GeoTituloJanelaBs' href='javascript:void(0)' onclick='i3GEO.ajuda.ferramenta(86)' >" + $trad("t41")+"</a>";
		janela = i3GEO.janela.cria(
			"550px",
			"360px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.editorsql",
			true,
			"hd"
		);
		divid = janela[2].id;
		$i("i3GEOF.editorsql_corpo").style.backgroundColor = "white";
		$i("i3GEOF.editorsql_corpo").style.textAlign = "left";
		i3GEOF.editorsql.aguarde = $i("i3GEOF.editorsql_imagemCabecalho").style;
		i3GEOF.editorsql.inicia(divid);
	},
	/*
	Function: pega

	Pega o SQL

	Veja:

	<i3GEO.php.pegaData>
	*/
	pega: function(){
		if(i3GEOF.editorsql.aguarde.visibility === "visible")
		{return;}
		i3GEOF.editorsql.aguarde.visibility = "visible";
		var temp = function(retorno){
			i3GEOF.editorsql.aguarde.visibility = "hidden";
			$i("i3GEOeditorsqlSQL").innerHTML = retorno.data;
		};
		i3GEO.php.pegaData(temp,i3GEO.temaAtivo);
	},
	/*
	Function: altera

	Altera o SQL

	Veja:

	<i3GEO.php.alteraData>
	*/
	altera: function(){
		if(i3GEOF.editorsql.aguarde.visibility === "visible")
		{return;}
		i3GEOF.editorsql.aguarde.visibility = "visible";
		var removemeta = $i("i3GEOeditorsqlRemoveMeta"),
			temp = function(){
				i3GEOF.editorsql.aguarde.visibility = "hidden";
				i3GEO.Interface.atualizaTema("",i3GEO.temaAtivo);
			};
		if(removemeta.checked == true){
			removemeta = "sim";
		}
		else{
			removemeta = "nao";
		}
		i3GEO.php.alteraData(temp,i3GEO.temaAtivo,$i("i3GEOeditorsqlSQL").value,removemeta);
	}
};
