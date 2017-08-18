/*
Title: Grade de pontos

Cria e adiciona um novo tema ao mapa contendo uma grade de pontos com espa&ccedil;amento regular.

Veja:

<i3GEO.analise.dialogo.gradePontos>

Arquivo:

i3geo/ferramentas/gradepontos/index.js.php

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
Classe: i3GEOF.gradeDePontos

*/
i3GEOF.gradeDePontos = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.gradeDePontos.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		if(i3GEOF.gradeDePontos.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/gradepontos/template_mst.html", function(template) {
				i3GEOF.gradeDePontos.MUSTACHE = template;
				i3GEOF.gradeDePontos.inicia(iddiv);
			});
			return;
		}

			$i(iddiv).innerHTML += i3GEOF.gradeDePontos.html();
			i3GEOF.gradeDePontos.t0();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = Mustache.render(i3GEOF.gradeDePontos.MUSTACHE, i3GEOF.gradeDePontos.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo,temp;
		if($i("i3GEOF.gradeDePontos")){
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u8") + "</span></div>";
		cabecalho = function(){
			i3GEO.navega.ativaPan();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePontos",200);
		};
		janela = i3GEO.janela.cria(
			"400px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDePontos",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			"",
			"",
			"",
			""
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.gradeDePontos_rodape class='i3GeoRodapeJanela' ></div>");
		i3GEOF.gradeDePontos.aguarde = $i("i3GEOF.gradeDePontos_imagemCabecalho").style;
		i3GEOF.gradeDePontos.inicia(divid);
		temp = function(){
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.gradeDePontos.capturaPonto()"]);
			i3GEO.eventos.cliquePerm.ativa();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function(){
		var ins = $i("i3GEOgradedepontosT0").innerHTML;
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePontos.t1()",ins,"i3GEOF.gradeDePontos.t0","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	t1: function(){
		var ins = "";
		//false para nao criar dois ids iguais
		if($i("i3GEOgradedepontosProj").checked){
			ins = $i("i3GEOgradedepontosT1a").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t0()","i3GEOF.gradeDePontos.t2()",ins,"i3GEOF.gradeDePontos.t1a","i3GEOgradedepontosresultado",false,"i3GEOF.gradeDePontos_rodape");
		}
		else{
			ins = $i("i3GEOgradedepontosT1b").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t0()","i3GEOF.gradeDePontos.t2()",ins,"i3GEOF.gradeDePontos.t1b","i3GEOgradedepontosresultado",false,"i3GEOF.gradeDePontos_rodape");
		}
	},
	t2: function(){
		var ins = $i("i3GEOgradedepontosT2").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t1()","i3GEOF.gradeDePontos.t3()",ins,"i3GEOF.gradeDePontos.t2","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.gradeDePontos.capturaPonto()"]);
	},
	t3: function(){
		var ins = $i("i3GEOgradedepontosT3").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t2()","i3GEOF.gradeDePontos.t4()",ins,"i3GEOF.gradeDePontos.t3","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	t4: function(){
		var ins = $i("i3GEOgradedepontosT4").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t3()","",ins,"i3GEOF.gradeDePontos.t4","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	/*
	Function: criaGrade

	Cria a grade e adiciona um novo tema ao mapa

	Veja:

	<GRADEDEPONTOS>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDePontos.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDePontos.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp,proj="nao";
			if(!$i("i3GEOgradedepontosProj").checked){
				dx = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosxg").value,$i("i3GEOgradedepontosxm").value,$i("i3GEOgradedepontosxs").value);
				dy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosyg").value,$i("i3GEOgradedepontosym").value,$i("i3GEOgradedepontosys").value);
			}
			else{
				proj = "sim";
				dx = $i("i3GEOgradedepontosxg").value;
				dy = $i("i3GEOgradedepontosyg").value;
			}
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosixg").value,$i("i3GEOgradedepontosixm").value,$i("i3GEOgradedepontosixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosiyg").value,$i("i3GEOgradedepontosiym").value,$i("i3GEOgradedepontosiys").value);
			nptx = $i("i3GEOgradedepontosnptx").value;
			npty = $i("i3GEOgradedepontosnpty").value;
			if ((dx == 0) || (dy == 0))
			{i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradeDePontos.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradeDePontos.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradeDePontos.dicionario));return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDePontos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo'>Erro.";}
				else
				{i3GEO.atualiza();}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/gradepontos/exec.php?g_sid="+i3GEO.configura.sid+"&proj="+proj+"&funcao=gradedepontos&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDePontos",fim);
		}
		catch(e){$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.gradeDePontos.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto

	Captura um ponto no mapa e preenche os campos de coordenadas de in&iacute;cio da grade
	*/
	capturaPonto: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepontosixg",
			"i3GEOgradedepontosixm",
			"i3GEOgradedepontosixs",
			"i3GEOgradedepontosiyg",
			"i3GEOgradedepontosiym",
			"i3GEOgradedepontosiys"
		);
	}
};
