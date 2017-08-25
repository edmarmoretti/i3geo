/*
Title: Grade de pol&iacute;gonos

Cria e adiciona um novo tema ao mapa contendo uma grade de pol&iacute;gonos com espa&ccedil;amento regular.

Veja:

<i3GEO.analise.dialogo.gradePol>

Arquivo:

i3geo/ferramentas/gradepol/index.js.php

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
Classe: i3GEOF.gradeDePoligonos

*/
i3GEOF.gradeDePoligonos = {
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.gradeDePoligonos.dicionario);
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
		if(i3GEOF.gradeDePoligonos.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/gradepol/template_mst.html", function(template) {
				i3GEOF.gradeDePoligonos.MUSTACHE = template;
				i3GEOF.gradeDePoligonos.inicia(iddiv);
			});
			return;
		}
			$i(iddiv).innerHTML = i3GEOF.gradeDePoligonos.html();
			i3GEOF.gradeDePoligonos.t0();
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = Mustache.render(i3GEOF.gradeDePoligonos.MUSTACHE, i3GEOF.gradeDePoligonos.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo,temp;
		if($i("i3GEOF.gradeDePoligonos")){
			return;
		}
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("u7") + "</span></div>";
		cabecalho = function(){
			i3GEO.navega.ativaPan();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePoligonos",200);
		};
		janela = i3GEO.janela.cria(
			"400px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDePoligonos",
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
		janela[0].setFooter("<div id=i3GEOF.gradeDePoligonos_rodape class='i3GeoRodapeJanela' ></div>");
		i3GEOF.gradeDePoligonos.aguarde = $i("i3GEOF.gradeDePoligonos_imagemCabecalho").style;
		i3GEOF.gradeDePoligonos.inicia(divid);
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.gradeDePoligonos.capturaPonto()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function(){
		var ins = $i("i3GEOgradedepoligonosT0").innerHTML;
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePoligonos.t1()",ins,"i3GEOF.gradeDePoligonos.t0","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	t1: function(){
		var ins = "";
		//false para nao criar dois ids iguais
		if($i("i3GEOgradedepoligonosProj").checked){
			ins = $i("i3GEOgradedepoligonosT1a").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t0()","i3GEOF.gradeDePoligonos.t2()",ins,"i3GEOF.gradeDePoligonos.t1a","i3GEOgradedepoligonosresultado",false,"i3GEOF.gradeDePoligonos_rodape");
		}
		else{
			ins = $i("i3GEOgradedepoligonosT1b").innerHTML;
			i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t0()","i3GEOF.gradeDePoligonos.t2()",ins,"i3GEOF.gradeDePoligonos.t1b","i3GEOgradedepoligonosresultado",false,"i3GEOF.gradeDePoligonos_rodape");
		}
	},
	t2: function(){
		var ins = $i("i3GEOgradedepoligonosT2").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t1()","i3GEOF.gradeDePoligonos.t3()",ins,"i3GEOF.gradeDePoligonos.t2","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.gradeDePoligonos.capturaPonto()"]);
	},
	t3: function(){
		var ins = $i("i3GEOgradedepoligonosT3").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t2()","i3GEOF.gradeDePoligonos.t4()",ins,"i3GEOF.gradeDePoligonos.t3","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	t4: function(){
		var ins = $i("i3GEOgradedepoligonosT4").innerHTML;
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t3()","",ins,"i3GEOF.gradeDePoligonos.t4","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	/*
	Function: criaGrade

	Cria a grade e adiciona um novo tema ao mapa

	Veja:

	<GRADEDEPOL>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDePoligonos.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDePoligonos.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp,proj="nao";
			if(!$i("i3GEOgradedepoligonosProj").checked){
				dx = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosxg").value,$i("i3GEOgradedepoligonosxm").value,$i("i3GEOgradedepoligonosxs").value);
				dy = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosyg").value,$i("i3GEOgradedepoligonosym").value,$i("i3GEOgradedepoligonosys").value);
			}
			else{
				proj = "sim";
				dx = $i("i3GEOgradedepoligonosxg").value;
				dy = $i("i3GEOgradedepoligonosyg").value;
			}
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosixg").value,$i("i3GEOgradedepoligonosixm").value,$i("i3GEOgradedepoligonosixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedepoligonosiyg").value,$i("i3GEOgradedepoligonosiym").value,$i("i3GEOgradedepoligonosiys").value);
			nptx = $i("i3GEOgradedepoligonosnptx").value;
			npty = $i("i3GEOgradedepoligonosnpty").value;
			if ((dx == 0) || (dy == 0))
			{i3GEO.janela.tempoMsg($trad('msg',i3GEOF.gradeDePoligonos.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradeDePoligonos.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.gradeDePoligonos.dicionario));return;}
			fim = function(retorno){
				i3GEOF.gradeDePoligonos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepoligonosfim").innerHTML = "<p class='paragrafo'>Erro. ";}
				else{
					i3GEO.atualiza();
				}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/gradepol/exec.php?g_sid="+i3GEO.configura.sid+"&proj="+proj+"&funcao=gradedepol&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDePoligonos",fim);
		}
		catch(e){$i("i3GEOgradedepoligonosfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEOF.gradeDePoligonos.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto

	Captura um ponto no mapa e preenche os campos de coordenadas de in&iacute;cio da grade
	*/
	capturaPonto: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepoligonosixg",
			"i3GEOgradedepoligonosixm",
			"i3GEOgradedepoligonosixs",
			"i3GEOgradedepoligonosiyg",
			"i3GEOgradedepoligonosiym",
			"i3GEOgradedepoligonosiys"
		);
	}
};
