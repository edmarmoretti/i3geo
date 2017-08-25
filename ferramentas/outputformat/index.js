/*
Title: Formato de imagem

Define qual o formato de imagem ser&aacute; utilizado escolhendo o OUTPUTFORMAT existente no mapfile atual

Veja:

<i3GEO.mapa.dialogo.outputformat>

Arquivo:

i3geo/ferramentas/outputformat/index.js.php

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
Classe: i3GEOF.outputformat
*/
i3GEOF.outputformat = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.outputformat.dicionario);
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.outputformat.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/outputformat/template_mst.html", function(template) {
				i3GEOF.outputformat.MUSTACHE = template;
				i3GEOF.outputformat.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.outputformat.html();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.outputformat.MUSTACHE, i3GEOF.outputformat.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.outputformat")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.outputformat");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p15") + "</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.outputformat",
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
			"89"
		);
		divid = janela[2].id;
		$i("i3GEOF.outputformat_corpo").style.backgroundColor = "white";
		$i("i3GEOF.outputformat_corpo").style.textAlign = "left";
		i3GEOF.outputformat.aguarde = $i("i3GEOF.outputformat_imagemCabecalho").style;
		i3GEOF.outputformat.inicia(divid);
	},
	/*
	Function: aplicar

	Aplica tipo de imagem

	Veja:

	<mudaOutputFormat>
	*/
	aplicar: function(tipo){
		if(i3GEOF.outputformat.aguarde.visibility === "visible")
		{return;}
		i3GEOF.outputformat.aguarde.visibility = "visible";
		try{
			var cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=mudaOutputFormat&tipo="+tipo,
				temp = function(retorno){
					i3GEOF.outputformat.aguarde.visibility = "hidden";
					if(retorno.data != "erro"){
						i3GEO.Interface.atualizaMapa();
					}
					else
					{i3GEO.janela.tempoMsg("Nao foi possivel alterar o tipo");}
				};
			cp.set_response_type("JSON");
			cp.call(p,"void",temp);
		}
		catch(e){i3GEO.janela.tempoMsg("Nao foi possivel alterar o tipo");i3GEOF.outputformat.aguarde.visibility = "hidden";}
	}
};
