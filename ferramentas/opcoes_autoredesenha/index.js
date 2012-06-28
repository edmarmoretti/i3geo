
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
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
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
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
	/*
	Function: inicia
	
	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.opcoesTempo.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesTempobotao1",
				{onclick:{fn: i3GEOF.opcoesTempo.executa}}
			);
			new YAHOO.widget.Button(
				"i3GEOopcoesTempobotao2",
				{onclick:{fn: i3GEO.navega.autoRedesenho.desativa}}
			);
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta
	
	Retorno:
	
	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '<table summary="" class=lista width="100%">' +
		'<table summary="" class=lista > '+
		'	<tr><td>Tempo em segundos ap&oacute;s o qual o mapa ser&aacute; redesenhado automaticamente:</td><td>' +
		$inputText("","","i3GEOopcoesTempoT","",8,"") +
		'</table><br>' +
	  	'<p class=paragrafo ><input id=i3GEOopcoesTempobotao1 size=16  type=button value="Aplicar"/>' +
	  	'&nbsp;<input id=i3GEOopcoesTempobotao2 size=16 type=button value="Parar"/>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,titulo;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesTempo");
		};
		//cria a janela flutuante
		titulo = "Temporizador <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=9' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"110px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesTempo",
			false,
			"hd",
			cabecalho,
			minimiza
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
