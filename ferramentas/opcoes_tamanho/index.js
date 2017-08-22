/*
Title: Tamanho do mapa

Veja:

<i3GEO.mapa.dialogo.tamanho>

Arquivo:

i3geo/ferramentas/opcoes_tamanho/index.js.php

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
Classe: i3GEOF.opcoesTamanho

*/
i3GEOF.opcoesTamanho = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesTamanho.dicionario);
		dicionario["Tamanhol"] = i3GEO.parametros.w;
		dicionario["Tamanhoa"] = i3GEO.parametros.h;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.opcoesTamanho.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/opcoes_tamanho/template_mst.html", function(template) {
				i3GEOF.opcoesTamanho.MUSTACHE = template;
				i3GEOF.opcoesTamanho.inicia(iddiv);
			});
			return;
		}
		var b,box;
		try{
			$i(iddiv).innerHTML = i3GEOF.opcoesTamanho.html();
			i3GEO.janela.tempoMsg($trad('msg',i3GEOF.opcoesTamanho.dicionario));
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
		var ins = Mustache.render(i3GEOF.opcoesTamanho.MUSTACHE, i3GEOF.opcoesTamanho.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.opcoesTamanho")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesTamanho",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("p5") + "</span></div>";
		janela = i3GEO.janela.cria(
			"210px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesTamanho",
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
			"4"
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesTamanho_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesTamanho_corpo").style.textAlign = "left";
		i3GEOF.opcoesTamanho.aguarde = $i("i3GEOF.opcoesTamanho_imagemCabecalho").style;
		i3GEOF.opcoesTamanho.inicia(divid);
		temp = function(){
			i3GEO.util.escondeBox();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: executa

	Altera o tamanho do mapa

	Veja:

	<MUDATAMANHO>
	*/
	executa: function(){
		if(i3GEOF.opcoesTamanho.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesTamanho.aguarde.visibility = "visible";
		var l = $i("i3GEOopcoesTamanhol").value,
			a = $i("i3GEOopcoesTamanhoa").value,
			temp,
			p,
			cp;
		if ((l > 5) && (a > 5)){
			i3GEO.parametros.w = l;
			i3GEO.parametros.h = a;

			temp = function(){
				i3GEOF.opcoesTamanho.aguarde.visibility = "hidden";
			};
			p = i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=mudatamanho&altura="+a+"&largura="+l;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"mudatamanho",temp);
		}
	}
};