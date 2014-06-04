
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Centro de massa

Calcula o centro m&eacute;dio e centro m&eacute;dio ponderado de um conjunto de pontos

Veja:

<i3GEO.analise.centromassa>

Arquivo:

i3geo/ferramentas/centromassa/index.js.php

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
Classe: i3GEOF.centromassa
*/
i3GEOF.centromassa = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.centromassa.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.centromassa.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/centromassa/dicionario.js",
				"i3GEOF.centromassa.iniciaJanelaFlutuante()",
				"i3GEOF.centromassa.dicionario_script"
			);
		}
		else{
			i3GEOF.centromassa.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.centromassa.html();
			i3GEOF.centromassa.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOcentromassaresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOcentromassafim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Centro de massa <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=94' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.centromassa");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.centromassa",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.centromassa_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.centromassa.aguarde = $i("i3GEOF.centromassa_imagemCabecalho").style;
		i3GEOF.centromassa.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.centromassa.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.centromassa.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.centromassa.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.centromassa.t0()");}
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/centromassa/exemplo.png' />" +
		"<p class='paragrafo'>"+$trad(1,i3GEOF.centromassa.dicionario)+"</p>" +
		"<p class='paragrafo'>"+$trad(2,i3GEOF.centromassa.dicionario)+"</p>";
		i3GEO.util.proximoAnterior("","i3GEOF.centromassa.t1()",ins,"i3GEOFgradeDePontost0","i3GEOcentromassaresultado",true,"i3GEOF.centromassa_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo' >"+$trad(3,i3GEOF.centromassa.dicionario)+"<br>";
		ins += "<div style='text-align:left;' id='i3GEOcentromassaDivPontos' ></div><br>";
		ins += "<p class='paragrafo' >"+$trad(4,i3GEOF.centromassa.dicionario)+"<br>";
		ins += "<div id=i3GEOondeItens style='text-align:left;display:block' ></div>";
		i3GEO.util.proximoAnterior("i3GEOF.centromassa.t0()","i3GEOF.centromassa.t2()",ins,"i3GEOF.centromassa.t1","i3GEOcentromassaresultado",true,"i3GEOF.centromassa_rodape");
		i3GEOF.centromassa.comboTemasPontos();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>"+$trad(5,i3GEOF.centromassa.dicionario);
		ins += "<br><br><input id=i3GEOcentromassabotao1 type='buttom' value='"+$trad(6,i3GEOF.centromassa.dicionario)+"' />";
		i3GEO.util.proximoAnterior("i3GEOF.centromassa.t1()","",ins,"i3GEOF.centromassa.t2","i3GEOcentromassaresultado",true,"i3GEOF.centromassa_rodape");
		new YAHOO.widget.Button(
			"i3GEOcentromassabotao1",
			{onclick:{fn: i3GEOF.centromassa.calcula}}
		);
	},
	/*
	Function: calcula

	Faz o c&aacute;lculo

	Veja:

	<centromassa>
	*/
	calcula: function(){
		try{
			if(i3GEOF.centromassa.aguarde.visibility === "visible")
			{return;}
			i3GEOF.centromassa.aguarde.visibility = "visible";
			var p,
			cp,
			fim = function(retorno){
				if (retorno.data==undefined )
				{$i("i3GEOcentromassafim").innerHTML = "<p class='paragrafo' >"+$trad(7,i3GEOF.centromassa.dicionario);}
				else
				{i3GEO.atualiza();}
				i3GEOF.centromassa.aguarde.visibility = "hidden";
			},
			tema = $i("i3GEOFcentromassaPontos").value,
			ext;
			if(i3GEO.Interface.ATUAL === "googlemaps")
			{ext = i3GEO.Interface.googlemaps.bbox();}
			else
			{ext = i3GEO.parametros.mapexten;}
			if(tema == ""){
				i3GEO.janela.tempoMsg($trad(8,i3GEOF.centromassa.dicionario));
				i3GEOF.centromassa.aguarde.visibility = "hidden";
				return;
			}
			p = i3GEO.configura.locaplic+"/ferramentas/centromassa/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=centromassa&tema="+tema+"&item="+$i("i3GEOFcentromassaItem").value+"&ext="+ext;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"centromassa",fim);
		}
		catch(e){$i("i3GEOcentromassafim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.centromassa.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasPontos

	Cria um combo com a lista de temas pontuais

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemasPontos: function(){
		i3GEO.util.comboTemas(
			"i3GEOFcentromassaPontos",
			function(retorno){
				$i("i3GEOcentromassaDivPontos").innerHTML = retorno.dados;
				var c = $i("i3GEOFcentromassaPontos");
				$i("i3GEOcentromassaDivPontos").style.display = "block";
				if (c){
					c.onchange = function(){
						$i("i3GEOondeItens").style.display = "block";
						$i("i3GEOondeItens").innerHTML = $trad("o1");
						i3GEO.mapa.ativaTema(c.value);
						i3GEOF.centromassa.comboItens();
					};
				}
				if(i3GEO.temaAtivo !== ""){
					if(c)
					{c.value = i3GEO.temaAtivo;}
					$i("i3GEOondeItens").style.display = "block";
					$i("i3GEOondeItens").innerHTML = $trad("o1");
					i3GEOF.centromassa.comboItens();
				}
			},
			"i3GEOcentromassaDivPontos",
			"",
			false,
			"pontos"
		);
	},
	/*
	Function: comboItens

	Cria um combo para escolha de um item do tema

	Veja:

	<i3GEO.util.comboItens>

	*/
	comboItens: function(){
		i3GEO.util.comboItens(
			"i3GEOFcentromassaItem",
			$i("i3GEOFcentromassaPontos").value,
			function(retorno){
				$i("i3GEOondeItens").innerHTML = retorno.dados;
				$i("i3GEOondeItens").style.display = "block";
			},
			"i3GEOondeItens"
		);
	}
};