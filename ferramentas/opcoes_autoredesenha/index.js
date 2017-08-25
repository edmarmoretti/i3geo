/*
Title: Auto redesenho

Inicia ou altera o temporizador de redesenho do mapa.

Ao ativar o temporizador, &eacute; mostrado um contador de tempo no mapa. Ap&oacute;s o tempo decorrido, o mapa &eacute; redesenhado.

Veja:

<i3GEO.mapa.dialogo.autoredesenha>

Arquivo:

i3geo/ferramentas/opcoes_autoredesenho/index.js.php

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
Classe: i3GEOF.opcoesTempo
*/
i3GEOF.opcoesTempo = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesTempo.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opcoesTempo.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_autoredesenha/template_mst.html", function(template) {
				i3GEOF.opcoesTempo.MUSTACHE = template;
				i3GEOF.opcoesTempo.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.opcoesTempo.html();
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
		var ins = Mustache.render(i3GEOF.opcoesTempo.MUSTACHE, i3GEOF.opcoesTempo.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		if ($i("i3GEOF.opcoesTempo")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesTempo");
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p12") + "</span></div>";
		janela = i3GEO.janela.cria(
			"300px",
			"160px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesTempo",
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
			"9"
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesTempo_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesTempo_corpo").style.textAlign = "left";
		i3GEOF.opcoesTempo.aguarde = $i("i3GEOF.opcoesTempo_imagemCabecalho").style;
		i3GEOF.opcoesTempo.inicia(divid);
	},
	/*
	Function: executa

	Ativa ou desativa o temporizador. Se o valor de tempo for igual a 0, o temporizador &eacute; desativado.
	*/
	executa: function(){
		i3GEO.navega.autoRedesenho.desativa();
		var i = $i("i3GEOopcoesTempoT");
		i3GEO.navega.autoRedesenho.INTERVALO = i.value * 1000;
		if ((i.value == 0) || (i.value == ""))
		{i3GEO.navega.autoRedesenho.desativa();}
		else
		{i3GEO.navega.autoRedesenho.ativa();}
	}
};