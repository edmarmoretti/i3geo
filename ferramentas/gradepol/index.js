
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

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
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.gradeDePoligonos.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.gradeDePoligonos.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/gradepol/dicionario.js",
				"i3GEOF.gradeDePoligonos.iniciaJanelaFlutuante()",
				"i3GEOF.gradeDePoligonos.dicionario_script"
			);
		}
		else{
			i3GEOF.gradeDePoligonos.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"default",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
			$i(iddiv).innerHTML += i3GEOF.gradeDePoligonos.html();
			i3GEOF.gradeDePoligonos.t0();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedepoligonosresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedepoligonosfim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo,temp;
		//cria a janela flutuante
		titulo = $trad("u7")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=14' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){
			i3GEO.barraDeBotoes.execBotao("pan");
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePoligonos");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"190px",
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
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.gradeDePoligonos_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.gradeDePoligonos.aguarde = $i("i3GEOF.gradeDePoligonos_imagemCabecalho").style;
		i3GEOF.gradeDePoligonos.inicia(divid);
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDePoligonos.capturaPonto()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/gradepol/exemplo.png' />" +
		"<p class='paragrafo' >"+$trad(1,i3GEOF.gradeDePoligonos.dicionario) +
		"<p class='paragrafo'>"+$trad(2,i3GEOF.gradeDePoligonos.dicionario) +
		"<p class='paragrafo'>"+$trad(3,i3GEOF.gradeDePoligonos.dicionario) +
		"<p class='paragrafo'><input type=checkbox id=i3GEOgradedepoligonosProj style='cursor:pointer;position:relative;top:2px;' />&nbsp;"+$trad(14,i3GEOF.gradeDePoligonos.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePoligonos.t1()",ins,"i3GEOF.gradeDePoligonos.t0","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(4,i3GEOF.gradeDePoligonos.dicionario)+"</b>";
		if($i("i3GEOgradedepoligonosProj").checked){
			ins += "<p class='paragrafo'>"+$trad(15,i3GEOF.gradeDePoligonos.dicionario)+" X:<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxg' title='metros' type=text size=6 value='100000'/>";
			ins += "<p class='paragrafo'>"+$trad(15,i3GEOF.gradeDePoligonos.dicionario)+" Y:<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosyg' title='metros' type=text size=6 value='100000'/>";
		}
		else{
			ins += "<p class='paragrafo'>X: ";
			ins += "<label>"+$trad(5,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxg' title='grau' type=text size=3 value='1'/>";
			ins += "<label>"+$trad(6,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxm' title='minuto' type=text size=5 value='00'/>";
			ins += "<label>"+$trad(7,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosxs' title='segundo' type=text size=5 value='00.00'/>";
			ins += "<p class='paragrafo'>Y: ";
			ins += "<label>"+$trad(5,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosyg' title='grau' type=text size=3 value='1'/>";
			ins += "<label>"+$trad(6,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosym' title='minuto' type=text size=5 value='00'/>";
			ins += "<label>"+$trad(7,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosys' title='segundo' type=text size=5 value='00.00'/>";
		}
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t0()","i3GEOF.gradeDePoligonos.t2()",ins,"i3GEOF.gradeDePoligonos.t1","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	t2: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(8,i3GEOF.gradeDePoligonos.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X: ";
		ins += "<label>"+$trad(5,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixg' title='grau'  type=text size=3 value='-00'/>";
		ins += "<label>"+$trad(6,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixm' title='minuto'  type=text size=5 value='00'/>";
		ins += "<label>"+$trad(7,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>Y: ";
		ins += "<label>"+$trad(5,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += "<label>"+$trad(6,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiym' title='minuto'  type=text size=5 value='00'/>";
		ins += "<label>"+$trad(7,i3GEOF.gradeDePoligonos.dicionario)+"</label><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";

		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t1()","i3GEOF.gradeDePoligonos.t3()",ins,"i3GEOF.gradeDePoligonos.t2","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDePoligonos.capturaPonto()") < 0){
			i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDePoligonos.capturaPonto()");
		}
	},
	t3: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(9,i3GEOF.gradeDePoligonos.dicionario)+"</b>";
		ins += "<p class='paragrafo'><label>X: </label>";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'><label>Y: </label>";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepoligonosnpty' title='pontos em y'  type=text size=3 value='10'/>";

		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t2()","i3GEOF.gradeDePoligonos.t4()",ins,"i3GEOF.gradeDePoligonos.t3","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
	},
	t4: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(10,i3GEOF.gradeDePoligonos.dicionario)+"</b>";
		ins += "<p class='paragrafo'><input id=i3GEOgradedepoligonosbotao1 size=18 class=executar type='button' value='"+$trad(11,i3GEOF.gradeDePoligonos.dicionario)+"' />";

		i3GEO.util.proximoAnterior("i3GEOF.gradeDePoligonos.t3()","",ins,"i3GEOF.gradeDePoligonos.t4","i3GEOgradedepoligonosresultado",true,"i3GEOF.gradeDePoligonos_rodape");
		new YAHOO.widget.Button(
			"i3GEOgradedepoligonosbotao1",
			{onclick:{fn: i3GEOF.gradeDePoligonos.criaGrade}}
		);
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
			{i3GEO.janela.tempoMsg($trad(12,i3GEOF.gradeDePoligonos.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad(13,i3GEOF.gradeDePoligonos.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad(13,i3GEOF.gradeDePoligonos.dicionario));return;}
			fim = function(retorno){
				i3GEOF.gradeDePoligonos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepoligonosfim").innerHTML = "<p class='paragrafo'>Erro. ";}
				else
				{i3GEO.atualiza("");}
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
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepoligonosixg",
			"i3GEOgradedepoligonosixm",
			"i3GEOgradedepoligonosixs",
			"i3GEOgradedepoligonosiyg",
			"i3GEOgradedepoligonosiym",
			"i3GEOgradedepoligonosiys"
		);
		g_tipoacao = temp;
	}
};
