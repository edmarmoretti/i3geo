
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

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
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.gradeDePontos.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.gradeDePontos.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/gradepontos/dicionario.js",
				"i3GEOF.gradeDePontos.iniciaJanelaFlutuante()",
				"i3GEOF.gradeDePontos.dicionario_script"
			);
		}
		else{
			i3GEOF.gradeDePontos.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.gradeDePontos.html();
			i3GEOF.gradeDePontos.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedepontosresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedepontosfim" >';
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
		titulo = $trad("u8")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=15' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){
			i3GEO.barraDeBotoes.execBotao("pan");
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDePontos");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"190px",
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
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.gradeDePontos_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.gradeDePontos.aguarde = $i("i3GEOF.gradeDePontos_imagemCabecalho").style;
		i3GEOF.gradeDePontos.inicia(divid);
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDePontos.capturaPonto()");
			i3GEO.eventos.cliquePerm.ativa();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/gradepontos/exemplo.png' />" +
			"<p class='paragrafo' >"+$trad(1,i3GEOF.gradeDePontos.dicionario) +
			"<p class='paragrafo'>"+$trad(2,i3GEOF.gradeDePontos.dicionario) +
			"<p class='paragrafo'>"+$trad(3,i3GEOF.gradeDePontos.dicionario) +
			"<p class='paragrafo'><input type=checkbox id=i3GEOgradedepontosProj style='cursor:pointer;position:relative;top:2px;' />&nbsp;"+$trad(14,i3GEOF.gradeDePontos.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePontos.t1()",ins,"i3GEOFgradeDePontost0","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(4,i3GEOF.gradeDePontos.dicionario)+"</b>";
		if($i("i3GEOgradedepontosProj").checked){
			ins += "<p class='paragrafo'>" + $trad(15,i3GEOF.gradeDePontos.dicionario)+" X:";
			ins += "<div class=styled-select ><input onclick='javascript:this.select();' id='i3GEOgradedepontosxg' title='metros' type=text  value='100000'/></div>";
			ins += "<br><p class='paragrafo'>"+$trad(15,i3GEOF.gradeDePontos.dicionario)+" Y:";
			ins += "<div class=styled-select ><input onclick='javascript:this.select();' id='i3GEOgradedepontosyg' title='metros' type=text value='100000'/></div>";
		}
		else{
			ins += "<p class='paragrafo'>X: ";
			ins += $trad(5,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(6,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(7,i3GEOF.gradeDePontos.dicionario)+"</p>";
			ins += "<div class=styled-select style='width:40px;float:left;' ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxg' title='grau' type=text value='1'/></div>";
			ins += "<div class=styled-select style='width:40px;float:left;margin-left:10px;margin-right:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosxm' title='minuto' type=text value='00'/></div>";
			ins += "<div class=styled-select style='width:60px;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosxs' title='segundo' type=text value='00.00'/></div>";

			ins += "<br><p class='paragrafo'>Y: ";
			ins += $trad(5,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(6,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(7,i3GEOF.gradeDePontos.dicionario)+"</p>";
			ins += "<div class=styled-select style='width:40px;float:left;' ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosyg' title='grau' type=text value='1'/></div>";
			ins += "<div class=styled-select style='width:40px;float:left;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosym' title='minuto' type=text value='00'/></div>";
			ins += "<div class=styled-select style='width:60px;float:left;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosys' title='segundo' type=text value='00.00'/></div>";
		}
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t0()","i3GEOF.gradeDePontos.t2()",ins,"i3GEOF.gradeDePontos.t1","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	t2: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(8,i3GEOF.gradeDePontos.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X: ";
		ins += $trad(5,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(6,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(7,i3GEOF.gradeDePontos.dicionario)+"</p>";
		ins += "<div class=styled-select style='width:40px;float:left;' ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixg' title='grau' type=text value='1'/></div>";
		ins += "<div class=styled-select style='width:40px;float:left;margin-left:10px;margin-right:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosixm' title='minuto' type=text value='00'/></div>";
		ins += "<div class=styled-select style='width:60px;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosixs' title='segundo' type=text value='00.00'/></div>";

		ins += "<br><p class='paragrafo'>Y: ";
		ins += $trad(5,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(6,i3GEOF.gradeDePontos.dicionario)+" - "+$trad(7,i3GEOF.gradeDePontos.dicionario)+"</p>";
		ins += "<div class=styled-select style='width:40px;float:left;' ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiyg' title='grau' type=text value='1'/></div>";
		ins += "<div class=styled-select style='width:40px;float:left;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosiym' title='minuto' type=text value='00'/></div>";
		ins += "<div class=styled-select style='width:60px;float:left;margin-left:10px;' ><input onclick='javascript:this.select();' id='i3GEOgradedepontosiys' title='segundo' type=text value='00.00'/></div>";

		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t1()","i3GEOF.gradeDePontos.t3()",ins,"i3GEOF.gradeDePontos.t2","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDePontos.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDePontos.capturaPonto()");}
	},
	t3: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(9,i3GEOF.gradeDePoligonos.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X</p>";
		ins += "<div class=styled-select ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnptx' title='pontos em x'  type=text value='10'/></div>";
		ins += "<br><p class='paragrafo'>Y";
		ins += "<div class=styled-select ><input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnpty' title='pontos em y'  type=text value='10'/></div>";

		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t2()","i3GEOF.gradeDePontos.t4()",ins,"i3GEOF.gradeDePontos.t3","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
	},
	t4: function(){
		var ins = "<p class='paragrafo'><b>"+$trad(10,i3GEOF.gradeDePontos.dicionario)+"</b>";
		ins += "<p class='paragrafo'><input id=i3GEOgradedepontosbotao1 size=18 class=executar type='button' value='"+$trad(11,i3GEOF.gradeDePontos.dicionario)+"' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t3()","",ins,"i3GEOF.gradeDePontos.t4","i3GEOgradedepontosresultado",true,"i3GEOF.gradeDePontos_rodape");
		new YAHOO.widget.Button(
			"i3GEOgradedepontosbotao1",
			{onclick:{fn: i3GEOF.gradeDePontos.criaGrade}}
		);
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
			{i3GEO.janela.tempoMsg($trad(12,i3GEOF.gradeDePontos.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad(12,i3GEOF.gradeDePontos.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad(13,i3GEOF.gradeDePontos.dicionario));return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDePontos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo'>Erro.";}
				else
				{i3GEO.atualiza("");}
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
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedepontosixg",
			"i3GEOgradedepontosixm",
			"i3GEOgradedepontosixs",
			"i3GEOgradedepontosiyg",
			"i3GEOgradedepontosiym",
			"i3GEOgradedepontosiys"
		);
		g_tipoacao = temp;
	}
};
