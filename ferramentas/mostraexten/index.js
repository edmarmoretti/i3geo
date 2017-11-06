/*
Title: Mostra extens&atilde;o

Mostra a extens&atilde;o geogr&aacute;fica atual do mapa permitindo tamb&eacute;m alter&aacute;-la digitando-se os valores de lat e long

Veja:

<i3GEO.mapa.dialogo.mostraExten>

Arquivo:

i3geo/ferramentas/mostraexten/index.js.php

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
Classe: i3GEOF.mostraExten
*/
i3GEOF.mostraExten = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.mostraExten.dicionario);
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.mostraExten.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/mostraexten/template_mst.html", function(template) {
				i3GEOF.mostraExten.MUSTACHE = template;
				i3GEOF.mostraExten.inicia(iddiv);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.mostraExten.html();
		i3GEOF.mostraExten.ativaFoco();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.mostraExten.MUSTACHE, i3GEOF.mostraExten.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.mostraExten")) {
			return;
		}
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.mostraExten.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraExten");
		};
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("d8t") + "</span></div>";
		janela = i3GEO.janela.cria(
			"370px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraExten",
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
			"55"
		);
		divid = janela[2].id;
		$i("i3GEOF.mostraExten_corpo").style.backgroundColor = "white";
		$i("i3GEOF.mostraExten_corpo").style.textAlign = "left";
		i3GEOF.mostraExten.aguarde = $i("i3GEOF.mostraExten_imagemCabecalho").style;
		i3GEOF.mostraExten.inicia(divid);
		i3GEO.eventos.adicionaEventos("NAVEGAMAPA",["i3GEOF.mostraExten.ativaFoco()"]);
		temp = function(){
			i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.mostraExten.ativaFoco()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Fun&ccedil;&atilde;o que &eacute; disparada quando o usu&aacute;rio clica no cabe&ccedil;alho da ferramenta
	*/
	ativaFoco: function(){
		$i("i3GEOmostraExtenatual").innerHTML = i3GEO.parametros.mapexten;
	},
	/*
	Function: executa

	Altera a extens&atilde;o atual

	Veja:

	<i3GEO.navega.zoomExt>
	*/
	executa: function(){
		try{
			var x = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxg").value,$i("i3GEOmostraExtenxm").value,$i("i3GEOmostraExtenxs").value),
				xx = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenxxg").value,$i("i3GEOmostraExtenxxm").value,$i("i3GEOmostraExtenxxs").value),
				y = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyg").value,$i("i3GEOmostraExtenym").value,$i("i3GEOmostraExtenys").value),
				yy = i3GEO.calculo.dms2dd($i("i3GEOmostraExtenyyg").value,$i("i3GEOmostraExtenyym").value,$i("i3GEOmostraExtenyys").value);
			if ((x == xx) || (y == yy)){
				//i3GEO.janela.tempoMsg($trad('msgCoordValida',i3GEOF.mostraExten.dicionario));
				//return;

				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraExtenatual").value);
				return;
			}
			if ((x > xx) || (y > yy)){
				//i3GEO.janela.tempoMsg($trad('msgCoordValida',i3GEOF.mostraExten.dicionario));
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,$i("i3GEOmostraExtenatual").value);
				return;
			}
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.parametros.tipoimagem,(x+" "+y+" "+xx+" "+yy));
		}
		catch(e){i3GEO.janela.tempoMsg(e+" Erro.");}
	}
};