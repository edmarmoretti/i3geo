
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Centr&oacute;ide

Calcula os centr&oacute;ides dos elementos de um tema e adiciona ao mapa um novo tema com os pontos.

Veja:

<i3GEO.analise.dialogo.centroide>

Arquivo:

i3geo/ferramentas/centroide/index.js.php

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
Class: i3GEOF.centroide
*/
i3GEOF.centroide = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.centroide.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.centroide.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/centroide/dicionario.js",
				"i3GEOF.centroide.iniciaJanelaFlutuante()",
				"i3GEOF.centroide.dicionario_script"
			);
		}
		else{
			i3GEOF.centroide.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.centroide.html();
			i3GEOF.centroide.t0();
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
		ins +=	'<div style="padding:5px;background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOcentroideresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOcentroidefim" >';
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
		titulo = $trad("u11")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=21' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.centroide");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.centroide",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.centroide_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.centroide.aguarde = $i("i3GEOF.centroide_imagemCabecalho").style;
		i3GEOF.centroide.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.centroide.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.centroide.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.centroide.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.centroide.t0()");}
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/centroide/exemplo.png' />" +
			"<p class='paragrafo' >"+$trad(1,i3GEOF.centroide.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.centroide.t1()",ins,"i3GEOFgradeDePontost0","i3GEOcentroideresultado",true,"i3GEOF.centroide_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>"+$trad(2,i3GEOF.centroide.dicionario);
		ins += "<div id='i3GEOcentroideSelTemas' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.centroide.t0()","i3GEOF.centroide.t2()",ins,"i3GEOF.centroide.t1","i3GEOcentroideresultado",true,"i3GEOF.centroide_rodape");
		i3GEOF.centroide.comboTemasSel();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>"+$trad(3,i3GEOF.centroide.dicionario);
		ins += "<br><br><input id=i3GEOcentroidebotao1 type='buttom' value='"+$trad(4,i3GEOF.centroide.dicionario)+"' />";
		i3GEO.util.proximoAnterior("i3GEOF.centroide.t2()","",ins,"i3GEOF.centroide.t3","i3GEOcentroideresultado",true,"i3GEOF.centroide_rodape");
		new YAHOO.widget.Button(
			"i3GEOcentroidebotao1",
			{onclick:{fn: i3GEOF.centroide.criacentroide}}
		);
	},
	/*
	Function: criacentroide

	Executa a opera&ccedil;&atilde;o de c&aacute;lculo dos centr&oacute;ides

	Veja:

	<CRIACENTROIDE>
	*/
	criacentroide: function(){
		try{
			if(i3GEOF.centroide.aguarde.visibility === "visible")
			{return;}
			var tema = $i("i3GEOcentroidetemasComSel").value,
				p,
				fim,
				cp;
			i3GEOF.centroide.aguarde.visibility = "visible";
			fim = function(retorno){
				i3GEOF.centroide.aguarde.visibility = "hidden";
				if (retorno.data === undefined )
				{$i("i3GEOcentroidefim").innerHTML = $trad(5,i3GEOF.centroide.dicionario);}
				else
				{i3GEO.atualiza();}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/centroide/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=criaCentroide&tema="+tema;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criaCentroide",fim);
		}
		catch(e){$i("i3GEOcentroidefim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.centroide.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSel

	Cria um combo com a lista de temas com elementos selecionados

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemasSel: function(){
		i3GEO.util.comboTemas(
			"i3GEOcentroidetemasComSel",
			function(retorno){
				$i("i3GEOcentroideSelTemas").innerHTML = retorno.dados;
				$i("i3GEOcentroideSelTemas").style.display = "block";
				if ($i("i3GEOcentroidetemasComSel")){
					$i("i3GEOcentroidetemasComSel").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOcentroidetemasComSel").value);
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOcentroidetemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEOcentroidetemasComSel").onchange.call();
				}
			},
			"i3GEOcentroideSelTemas",
			"",
			false,
			"selecionados"
		);
	}
};
