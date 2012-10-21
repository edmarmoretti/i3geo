
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
		var minimiza,cabecalho,janela,divid,titulo;
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
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeDePontos",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.gradeDePontos.aguarde = $i("i3GEOF.gradeDePontos_imagemCabecalho").style;
		i3GEOF.gradeDePontos.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >A grade &eacute; formada por pontos espa&ccedil;ados conforme os par&acirc;metros de x e y.";
		ins += "<p class='paragrafo'>A grade criada &eacute; adicionada como um novo tema no mapa, podendo ser utilizada em opera&ccedil;&otilde;es como o cruzamento entre pontos e pol&iacute;gonos.";
		ins += "<p class='paragrafo'>O ponto inicial da grade deve ser definido pelo usu&aacute;rio e o ponto final (inferior direito) &eacute; definido em fun&ccedil;&atilde;o da abran&ecirc;ncia do mapa ou da quantidade de pontos.";
		i3GEO.util.proximoAnterior("","i3GEOF.gradeDePontos.t1()",ins,"i3GEOFgradeDePontost0","i3GEOgradedepontosresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Espa&ccedil;amento da grade";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxm' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosxs' title='segundo' type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosyg' title='grau' type=text size=3 value='1'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosym' title='minuto' type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosys' title='segundo' type=text size=5 value='00.00'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t0()","i3GEOF.gradeDePontos.t2()",ins,"i3GEOF.gradeDePontos.t1","i3GEOgradedepontosresultado");
	},
	t2: function(){
		var temp,
			ins = "<p class='paragrafo'>Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>";
		ins += "<p class='paragrafo'>em X: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixm' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosixs' title='segundo'  type=text size=5 value='00.00'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "Grau<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiyg' title='grau'  type=text size=3 value='-00'/>";
		ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiym' title='minuto'  type=text size=5 value='00'/>";
		ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosiys' title='segundo'  type=text size=5 value='00.00'/>";
		g_tipoacao = "capturaponto";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t1()","i3GEOF.gradeDePontos.t3()",ins,"i3GEOF.gradeDePontos.t2","i3GEOgradedepontosresultado");
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.gradeDePontos.capturaPonto()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.gradeDePontos.capturaPonto()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.gradeDePontos.capturaPonto()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t3: function(){
		var ins = "<p class='paragrafo'>N&uacute;mero de pontos. Total m&aacute;ximo de 10.000";
		ins += "<p class='paragrafo'>em X: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnptx' title='pontos em x'  type=text size=3 value='10'/>";
		ins += "<p class='paragrafo'>em Y: ";
		ins += "<input onclick='javascript:this.select();' class=digitar id='i3GEOgradedepontosnpty' title='pontos em y'  type=text size=3 value='10'/>";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t2()","i3GEOF.gradeDePontos.t4()",ins,"i3GEOF.gradeDePontos.t3","i3GEOgradedepontosresultado");
	},
	t4: function(){
		var ins = "<p class='paragrafo'>A grade ser&aacute; acrescentada como um novo tema no mapa";
		ins += "<p class='paragrafo'><input id=i3GEOgradedepontosbotao1 size=18 class=executar type='button' value='Criar grade' />";
		i3GEO.util.proximoAnterior("i3GEOF.gradeDePontos.t3()","",ins,"i3GEOF.gradeDePontos.t4","i3GEOgradedepontosresultado");
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
			var dx,dy,ix,iy,nptx,npty,fim,p,cp;
			dx = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosxg").value,$i("i3GEOgradedepontosxm").value,$i("i3GEOgradedepontosxs").value);
			dy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosyg").value,$i("i3GEOgradedepontosym").value,$i("i3GEOgradedepontosys").value);
			ix = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosixg").value,$i("i3GEOgradedepontosixm").value,$i("i3GEOgradedepontosixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOgradedepontosiyg").value,$i("i3GEOgradedepontosiym").value,$i("i3GEOgradedepontosiys").value);
			nptx = $i("i3GEOgradedepontosnptx").value;
			npty = $i("i3GEOgradedepontosnpty").value;
			if ((dx == 0) || (dy == 0))
			{i3GEO.janela.tempoMsg("Distância entre os pontos n&atilde;o pode ser 0");return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg("N&uacute;mero de pontos n&atilde;o pode ser 0");return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg("N&uacute;mero de pontos n&atilde;o pode ser maior que 10.000");return;}
			fim = function(retorno)
			{
				i3GEOF.gradeDePontos.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOgradedepontosfim").innerHTML = "<p class='paragrafo'>Erro. A opera&ccedil;&atilde;o demorou muito(?).";}
				else
				{i3GEO.atualiza("");}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/gradepontos/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=gradedepontos&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
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

