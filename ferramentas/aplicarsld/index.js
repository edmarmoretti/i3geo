/*
Title: aplicarsld

Envia para o servidor um arquivo no formato SLD local e aplica ao tema ativo.

Veja:

<i3GEO.tema.dialogo.aplicarsld>

Arquivo:

i3geo/ferramentas/aplicarsld/index.js.php

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
Classe: i3GEOF.aplicarsld
*/
i3GEOF.aplicarsld = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.aplicarsld.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["temaAtivo"] = i3GEO.temaAtivo;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.aplicarsld.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/aplicarsld/template_mst.html", function(template) {
				i3GEOF.aplicarsld.MUSTACHE = template;
				i3GEOF.aplicarsld.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.aplicarsld.html();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.aplicarsld.MUSTACHE, i3GEOF.aplicarsld.mustacheHash());
		console.info(ins)
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if($i("i3GEOF.aplicarsld")){
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.aplicarsld",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("t43") + "</span></div>";

		janela = i3GEO.janela.cria(
			"400px",
			"280px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.aplicarsld",
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
			"91"
		);
		divid = janela[2].id;
		janela[0].bringToTop();
		$i("i3GEOF.aplicarsld_corpo").style.backgroundColor = "white";
		i3GEOF.aplicarsld.aguarde = $i("i3GEOF.aplicarsld_imagemCabecalho").style;
		i3GEOF.aplicarsld.inicia(divid);
	},
	/*
	Function: submete

	Submete o arquivo ao servidor.
	*/
	submete: function(){
		if(i3GEOF.aplicarsld.aguarde.visibility==="visible")
		{return;}
		i3GEOF.aplicarsld.aguarde.visibility="visible";
		$i("i3GEOaplicarsldf").submit();
	}
};
