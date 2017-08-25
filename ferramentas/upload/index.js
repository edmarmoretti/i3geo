/*
Title: Upload de arquivo shapefile

Envia para o servidor um arquivo shapefile local e insere como uma camada no mapa.

Veja:

<i3GEO.arvoreDeTemas.dialogo.upload>

Arquivo: i3geo/ferramentas/upload/index.js.php

About: Licen&ccedil;a

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
Classe: i3GEOF.upload
*/
i3GEOF.upload = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	MUSTACHE: "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.upload.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["sid"] = i3GEO.configura.sid;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.upload.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/upload/template_mst.html", function(template) {
				i3GEOF.upload.MUSTACHE = template;
				i3GEOF.upload.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.upload.html();
		i3GEO.util.radioEpsg(
			function(retorno){
				$i("i3GEOuploadListaepsg").innerHTML = retorno.dados;
			},
			"i3GEOuploadListaepsg",
			"upload",
			"nao"
		);
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = Mustache.render(i3GEOF.upload.MUSTACHE, i3GEOF.upload.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.upload")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.upload",200);
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("a2") + "</span></div>";
		janela = i3GEO.janela.cria(
			"400px",
			"480px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.upload",
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
			"27"
		);
		divid = janela[2].id;
		$i("i3GEOF.upload_corpo").style.backgroundColor = "white";
		i3GEOF.upload.aguarde = $i("i3GEOF.upload_imagemCabecalho").style;
		i3GEOF.upload.inicia(divid);
	},
	/*
	Function: submete

	Submete o arquivo ao servidor
	*/
	submete: function(){
		if(i3GEOF.upload.aguarde.visibility==="visible")
		{return;}
		i3GEOF.upload.aguarde.visibility="visible";
		$i("i3GEOuploadf").submit();
	},
	selNavegador: function(onde){
		i3GEO.util.navegadorDir(onde,false,false,false);
	}
};

