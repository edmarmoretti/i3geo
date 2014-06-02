
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Grade de hex&aacute;gonos

Cria e adiciona um novo tema ao mapa contendo uma grade de hex&aacute;gonos com espa&ccedil;amento regular.

Veja:

<i3GEO.analise.dialogo.gradeHex>

Arquivo:

i3geo/ferramentas/gradehex/index.js.php

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
Classe: i3GEOF.gradeDeHex

*/
i3GEOF.gradeDeHex = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.gradeDeHex.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.gradeDeHex.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/gradehex/dicionario.js",
				"i3GEOF.gradeDeHex.iniciaJanelaFlutuante()",
				"i3GEOF.gradeDeHex.dicionario_script"
			);
		}
		else{
			i3GEOF.gradeDeHex.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.gradeDeHex.html();
			i3GEOF.gradeDeHex.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOgradedehexresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOgradedehexfim" >';
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
		titulo = $trad("u9")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=16' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){
			i3GEO.barraDeBotoes.execBotao("pan");
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.gradeDeHex");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDeHex",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.gradeDeHex_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.gradeDeHex.aguarde = $i("i3GEOF.gradeDeHex_imagemCabecalho").style;
		i3GEOF.gradeDeHex.inicia(divid);
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDeHex.capturaPonto()");
			i3GEO.eventos.cliquePerm.ativa();
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >"+$trad(1,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'>"+$trad(2,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'>"+$trad(3,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'><input type=checkbox id=i3GEOgradedehexProj style='cursor:pointer;position:relative;top:2px;' />&nbsp;"+$trad(14,i3GEOF.gradeDeHex.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDeHex.t1()",ins,"i3GEOF.gradeDeHex.t0()","i3GEOgradedehexresultado",true,"i3GEOF.gradeDeHex_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>"+$trad(4,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'> ";
		if($i("i3GEOgradedehexProj").checked){
			ins += $trad(15,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxg' title='metros' type=text size=6 value='100000'/>";
		}
		else{
			ins += $trad(5,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxg' title='grau' type=text size=3 value='1'/>";
			ins += $trad(6,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxm' title='minuto' type=text size=5 value='00'/>";
			ins += $trad(7,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexxs' title='segundo' type=text size=5 value='00.00'/>";
		}
		/*
		ins += "<p class='paragrafo'>Y: ";
		ins += $trad(5,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexyg' title='grau' type=text size=3 value='1'/>";
		ins += $trad(6,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexym' title='minuto' type=text size=5 value='00'/>";
		ins += $trad(7,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexys' title='segundo' type=text size=5 value='00.00'/>";
		*/
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t0()","i3GEOF.gradeDeHex.t2()",ins,"i3GEOF.gradeDeHex.t1()","i3GEOgradedehexresultado",true,"i3GEOF.gradeDeHex_rodape");
	},
	t2: function(){
		var ins = "<p class='paragrafo'>"+$trad(8,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'>X: ";
		ins += $trad(5,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixg' title='grau'  type=text size=3 value='-00'/>";
		ins += $trad(6,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixm' title='minuto'  type=text size=5 value='00'/>";
		ins += $trad(7,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>Y: ";
		ins += $trad(5,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += $trad(6,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiym' title='minuto'  type=text size=5 value='00'/>";
		ins += $trad(7,i3GEOF.gradeDeHex.dicionario)+"<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t1()","i3GEOF.gradeDeHex.t3()",ins,"i3GEOF.gradeDeHex.t2()","i3GEOgradedehexresultado",true,"i3GEOF.gradeDeHex_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDeHex.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDeHex.capturaPonto()");}
	},
	t3: function(){
		var ins = "<p class='paragrafo'>"+$trad(9,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'>X: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'>Y: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedehexnpty' title='pontos em y'  type=text size=3 value='10'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t2()","i3GEOF.gradeDeHex.t4()",ins,"i3GEOF.gradeDeHex.t3()","i3GEOgradedehexresultado",true,"i3GEOF.gradeDeHex_rodape");
	},
	t4: function(){
		var ins = "<p class='paragrafo'>"+$trad(10,i3GEOF.gradeDeHex.dicionario);
		ins += "<p class='paragrafo'><input id=i3GEOgradedehexbotao1 size=18 class=executar type='button' value='"+$trad(11,i3GEOF.gradeDeHex.dicionario)+"' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDeHex.t3()","",ins,"i3GEOF.gradeDeHex.t4()","i3GEOgradedehexresultado",true,"i3GEOF.gradeDeHex_rodape");
		new YAHOO.widget.Button(
			"i3GEOgradedehexbotao1",
			{onclick:{fn: i3GEOF.gradeDeHex.criaGrade}}
		);
	},
	/*
	Function: criaGrade

	Cria a grade e adiciona um novo tema ao mapa

	Veja:

	<GRADEDEHEX>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.gradeDeHex.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeDeHex.aguarde.visibility = "visible";
			var dx,ix,iy,nptx,npty,fim,p,cp,proj = "nao";
			if(!$i("i3GEOgradedehexProj").checked){
				dx = i3GEO.calculo.dms2dd($i("i3GEOgradedehexxg").value,$i("i3GEOgradedehexxm").value,$i("i3GEOgradedehexxs").value);
			}
			else{
				proj = "sim";
				dx = $i("i3GEOgradedehexxg").value;
			}
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedehexixg").value,$i("i3GEOgradedehexixm").value,$i("i3GEOgradedehexixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedehexiyg").value,$i("i3GEOgradedehexiym").value,$i("i3GEOgradedehexiys").value);
			nptx = $i("i3GEOgradedehexnptx").value;
			npty = $i("i3GEOgradedehexnpty").value;
			if ((dx == 0))
			{i3GEO.janela.tempoMsg($trad(12,i3GEOF.gradeDeHex.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad(13,i3GEOF.gradeDeHex.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad(13,i3GEOF.gradeDeHex.dicionario));return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDeHex.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedehexfim").innerHTML = "<p class='paragrafo'>Erro. ";}
				else
				{i3GEO.atualiza();}
			};

			p = i3GEO.configura.locaplic+"/ferramentas/gradehex/exec.php?g_sid="+i3GEO.configura.sid+"&proj="+proj+"&funcao=gradedehex&dd="+dx+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeDeHex",fim);
		}
		catch(e){$i("i3GEOgradedehexfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEOF.gradeDeHex.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto

	Captura um ponto no mapa e preenche os campos de coordenadas de in&iacute;cio da grade
	*/
	capturaPonto: function(){
		var temp = g_tipoacao;
		g_tipoacao = "capturaponto";
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOgradedehexixg",
			"i3GEOgradedehexixm",
			"i3GEOgradedehexixs",
			"i3GEOgradedehexiyg",
			"i3GEOgradedehexiym",
			"i3GEOgradedehexiys"
		);
		g_tipoacao = temp;
	}
};