
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Dist�ncia entre pontos

Calcula a dist�ncia entre os pontos de um tema e os pontos de outro tema criando uma nova camada.
Al&eacute;m da dist�ncia, podem ser escolhidos itens dos temas de origem e de destino que ir&atilde;o ser mantidos na nova camada.

Veja:

<i3GEO.analise.dialogo.distanciaptpt>

Arquivo:

i3geo/ferramentas/distanciaptpt/index.js.php

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
Classe: i3GEOF.distanciaptpt
*/
i3GEOF.distanciaptpt = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.distanciaptpt.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.distanciaptpt.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/dicionario.js",
				"i3GEOF.distanciaptpt.iniciaJanelaFlutuante()",
				"i3GEOF.distanciaptpt.dicionario_script"
			);
		}
		else{
			i3GEOF.distanciaptpt.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.distanciaptpt.html();
			i3GEOF.distanciaptpt.t0();
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
		ins +=	'<div style="padding:5px;background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOdistanciaptptresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOdistanciaptptfim" >';
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
		titulo = $trad("u11a")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=17' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.distanciaptpt");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.distanciaptpt",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.distanciaptpt_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.distanciaptpt.aguarde = $i("i3GEOF.distanciaptpt_imagemCabecalho").style;
		i3GEOF.distanciaptpt.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.distanciaptpt.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.distanciaptpt.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.distanciaptpt.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.distanciaptpt.t0()");}
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/exemplo.png' />" +
		"<p class='paragrafo'>" + $trad('ajuda',i3GEOF.distanciaptpt.dicionario) +
		"<p class='paragrafo'>" + $trad('ajuda2',i3GEOF.distanciaptpt.dicionario) +
		"<p class='paragrafo'>" + $trad('ajuda3',i3GEOF.distanciaptpt.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.distanciaptpt.t1()",ins,"i3GEOFgradeDePontost0","i3GEOdistanciaptptresultado",true,"i3GEOF.distanciaptpt_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo' >" + $trad('temaOrigem',i3GEOF.distanciaptpt.dicionario)+"<br>";
		ins += "<div style='text-align:left;' id='i3GEOdistanciaptptSelTemasOrigem' ></div><br>";
		ins += "<p class='paragrafo' >" + $trad('temaDestino',i3GEOF.distanciaptpt.dicionario)+"<br>";
		ins += "<div style='text-align:left;' id='i3GEOdistanciaptptSelTemasDestino' ></div><br>";
		ins += "<p class='paragrafo' >" + $trad('distMax',i3GEOF.distanciaptpt.dicionario)+"<br>";
		ins += $inputText("","","i3GEOFdistanciaptptdistancia","",10,"100000");
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t0()","i3GEOF.distanciaptpt.t2()",ins,"i3GEOF.distanciaptpt.t1","i3GEOdistanciaptptresultado",true,"i3GEOF.distanciaptpt_rodape");
		i3GEOF.distanciaptpt.comboTemasOrigem();
		i3GEOF.distanciaptpt.comboTemasDestino();
	},
	t2: function(){
		var ins = "<p class='paragrafo' >" + $trad('selecionaAtributos',i3GEOF.distanciaptpt.dicionario)+"</p>";
		ins += "<p class='paragrafo' >" + $trad('atributoOrigem',i3GEOF.distanciaptpt.dicionario)+"</p>";
		ins += "<div style='text-align:left;' id='i3GEOondeItensTemaOrigem' >"+$trad("o1")+"</div>";
		ins += "<br><p class='paragrafo' >" + $trad('atributoDestino',i3GEOF.distanciaptpt.dicionario)+"</p>";
		ins += "<div style='text-align:left;' id='i3GEOondeItensTemaDestino' >"+$trad("o1")+"</div>";
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t1()","i3GEOF.distanciaptpt.t3()",ins,"i3GEOF.distanciaptpt.t2","i3GEOdistanciaptptresultado",true,"i3GEOF.distanciaptpt_rodape");
		i3GEOF.distanciaptpt.comboItensOrigem();
		i3GEOF.distanciaptpt.comboItensDestino();
	},
	t3: function(){
		var b,ins = "<p class='paragrafo'>" + $trad('msgTema',i3GEOF.distanciaptpt.dicionario);
		ins += "<br><br><input id=i3GEOdistanciaptptbotao1 type='buttom' value='"+$trad('calcula',i3GEOF.distanciaptpt.dicionario)+"' />";
		i3GEO.util.proximoAnterior("i3GEOF.distanciaptpt.t2()","",ins,"i3GEOF.distanciaptpt.t3","i3GEOdistanciaptptresultado",true,"i3GEOF.distanciaptpt_rodape");
		b = new YAHOO.widget.Button(
			"i3GEOdistanciaptptbotao1",
			{onclick:{fn: i3GEOF.distanciaptpt.calcula}}
		);
		b.addClass("rodar");
	},
	/*
	Function: calcula

	Executa a opera&ccedil;&atilde;o de c&aacute;lculo das dist�ncias

	Veja:

	<DISTANCIAPTPT>
	*/
	calcula: function(){
		try{
			if(i3GEOF.distanciaptpt.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEOFdistanciaptptdistancia").value,
				temaOrigem = $i("i3GEOdistanciaptpttemasComSel").value,
				temaDestino = $i("i3GEOdistanciaptpttemas").value,
				fim,
				p,
				cp;
			if ((distancia*1 > 0) && (temaOrigem != "") && (temaDestino != "")){
				i3GEOF.distanciaptpt.aguarde.visibility = "visible";
				fim = function(retorno){
					if (retorno.data==undefined )
					{$i("i3GEOdistanciaptptfim").innerHTML = "<p class='paragrafo' >"+$trad('erroTempo',i3GEOF.distanciaptpt.dicionario);}
					else
					{i3GEO.atualiza();}
					i3GEOF.distanciaptpt.aguarde.visibility = "hidden";
				};
				p = i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=distanciaptpt&temaorigem="+temaOrigem+"&temadestino="+temaDestino+"&distancia="+distancia+"&itemorigem="+$i("i3GEOFdistanciaptptItemOrigem").value+"&itemdestino="+$i("i3GEOFdistanciaptptItemDestino").value+"&ext="+i3GEO.parametros.mapexten;
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"distanciaptpt",fim);
			}
			else
			{$i("i3GEOdistanciaptptfim").innerHTML = $trad('erroParametro',i3GEOF.distanciaptpt.dicionario);}
		}
		catch(e){$i("i3GEOdistanciaptptfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.distanciaptpt.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasOrigem

	Cria um combo com a lista de temas pontuais com elementos selecionados

	Veja:

	<i3GEO.util.comboTemas>

	*/
	comboTemasOrigem: function(){
		i3GEO.util.comboTemas(
			"i3GEOdistanciaptpttemasComSel",
			function(retorno){
				$i("i3GEOdistanciaptptSelTemasOrigem").innerHTML = retorno.dados;
				$i("i3GEOdistanciaptptSelTemasOrigem").style.display = "block";
				if ($i("i3GEOdistanciaptpttemasComSel")){
					$i("i3GEOdistanciaptpttemasComSel").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemasComSel").value);
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOdistanciaptpttemasComSel").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOdistanciaptptSelTemasOrigem",
			"",
			false,
			"pontosSelecionados"
		);
	},
	/*
	Function: comboTemasDestino

	Cria um combo com a lista de temas pontuais com elementos destino

	Veja:

	<i3GEO.util.comboTemas>

	*/
	comboTemasDestino: function(){
		i3GEO.util.comboTemas(
			"i3GEOdistanciaptpttemas",
			function(retorno){
				$i("i3GEOdistanciaptptSelTemasDestino").innerHTML = retorno.dados;
				$i("i3GEOdistanciaptptSelTemasDestino").style.display = "block";
				if ($i("i3GEOdistanciaptpttemas")){
					$i("i3GEOdistanciaptpttemas").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOdistanciaptpttemas").value);
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOdistanciaptpttemas").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOdistanciaptptSelTemasDestino",
			"",
			false,
			"pontos"
		);
	},
	/*
	Function: comboItensOrigem

	Cria um combo para escolha de um item do tema de origem

	Veja:

	<i3GEO.util.comboItens>

	*/
	comboItensOrigem: function(){
		i3GEO.util.comboItens(
			"i3GEOFdistanciaptptItemOrigem",
			$i("i3GEOdistanciaptpttemasComSel").value,
			function(retorno){
				$i("i3GEOondeItensTemaOrigem").innerHTML = retorno.dados;
				$i("i3GEOondeItensTemaOrigem").style.display = "block";
			},
			"i3GEOondeItensTemaOrigem"
		);
	},
	/*
	Function: comboItensDestino

	Cria um combo para escolha de um item do tema de destino

	Veja:

	<i3GEO.util.comboItens>

	*/
	comboItensDestino: function(){
		i3GEO.util.comboItens(
			"i3GEOFdistanciaptptItemDestino",
			$i("i3GEOdistanciaptpttemas").value,
			function(retorno){
				$i("i3GEOondeItensTemaDestino").innerHTML = retorno.dados;
				$i("i3GEOondeItensTemaDestino").style.display = "block";
			},
			"i3GEOondeItensTemaDestino"
		);
	}
};
