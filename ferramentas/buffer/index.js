
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Buffer

Realiza o c&aacute;lculo de "buffer" (regi&atilde;o de entorno) dos elementos selecionados de um tema e adiciona uma nova
camada ao mapa.
Utiliza a fun&ccedil;&atilde;o buffer do Mapserver.

Veja:

<i3GEO.analise.dialogo.buffer>

Arquivo:

i3geo/ferramentas/buffer/index.js.php

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
Class: i3GEOF.buffer
*/
i3GEOF.buffer = {
	/*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.buffer.dicionario);
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["sim"] = $trad("x14");
		dicionario["nao"] = $trad("x15");
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.buffer.html();
			i3GEOF.buffer.t0();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.buffer.MUSTACHE, i3GEOF.buffer.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = $trad("u10")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=24' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		janela = i3GEO.janela.cria(
			"420px",
			"200px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.buffer",
			false,
			"hd",
			function(){},
			function(){
				i3GEO.janela.minimiza("i3GEOF.buffer");
			},
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.buffer_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.buffer.aguarde = $i("i3GEOF.buffer_imagemCabecalho").style;
		i3GEOF.buffer.inicia(divid);
		temp = function(){
			//i3GEO.janela.tempoMsg("oi");
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.buffer.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.buffer.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.buffer.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.buffer.t0()");}
	},
	t0: function(){
		i3GEO.util.proximoAnterior("","i3GEOF.buffer.t1()","","i3GEOFgradeDePontost0","i3GEObufferresultado",true,"i3GEOF.buffer_rodape");
	},
	t1: function(){
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t0()","i3GEOF.buffer.t2()","","i3GEOF.buffer.t1","i3GEObufferresultado",true,"i3GEOF.buffer_rodape");
		i3GEOF.buffer.comboTemasSel();
	},
	t2: function(){
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t1()","i3GEOF.buffer.t3()","","i3GEOF.buffer.t2","i3GEObufferresultado",true,"i3GEOF.buffer_rodape");
		i3GEOF.buffer.comboItens();
	},
	t3: function(){
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t2()","","","i3GEOF.buffer.t3","i3GEObufferresultado",true,"i3GEOF.buffer_rodape");
		var b = new YAHOO.widget.Button(
			"i3GEObufferbotao1",
			{onclick:{fn: i3GEOF.buffer.criaBuffer}}
		);
		b.addClass("rodar");
	},
	/*
	Function: criaBuffer

	Executa a opera&ccedil;&atilde;o de gera&ccedil;&atilde;o do buffer

	Veja:

	<CRIABUFFER>
	*/
	criaBuffer: function(){
		try{
			if(i3GEOF.buffer.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEObufferd").value,
				tema = $i("i3GEObuffertemasComSel").value,
				multiplicar = $i("i3GEObufferdfator").value*1,
				itemdistancia = $i("i3GEObuffertemasItem").value,
				p,
				fim,
				cp;
			if (distancia*1 !== 0 || itemdistancia != ""){
				i3GEOF.buffer.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.buffer.aguarde.visibility = "hidden";
					if (retorno.data === undefined )
					{$i("i3GEObufferfim").innerHTML = $trad('erroTempo',i3GEOF.buffer.dicionario);}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/ferramentas/buffer/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema="+tema+"&unir="+$i("i3GEObufferunir").value;
				if(itemdistancia != ""){
					p += "&distancia=0&itemdistancia="+itemdistancia+"&multiplicar="+multiplicar;
				}else{
					p += "&distancia=" + distancia*1 + "&itemdistancia=&multiplicar=1";
				}
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{i3GEO.janela.tempoMsg($trad('erroDistancia',i3GEOF.buffer.dicionario));}
		}
		catch(e){$i("i3GEObufferfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.buffer.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSel

	Cria um combo com a lista de temas com elementos selecionados

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemasSel: function(){
		i3GEO.util.comboTemas(
			"i3GEObuffertemasComSel",
			function(retorno){
				$i("i3GEObufferSelTemas").innerHTML = retorno.dados;
				$i("i3GEObufferSelTemas").style.display = "block";
				if ($i("i3GEObuffertemasComSel")){
					$i("i3GEObuffertemasComSel").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEObuffertemasComSel").value);
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEObuffertemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEObuffertemasComSel").onchange.call();
				}
			},
			"i3GEObufferSelTemas",
			"",
			false,
			"selecionados"
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
			"i3GEObuffertemasItem",
			$i("i3GEObuffertemasComSel").value,
			function(retorno){
				$i("i3GEObufferondeItens").innerHTML = "<div class=styled-select >" + retorno.dados + "</div>"
				+ "<br><br><p class=paragrafo >" + $trad('multiplica',i3GEOF.buffer.dicionario)
				+" <div class='i3geoForm i3geoFormIconeEdita' ><input id='i3GEObufferdfator' type=text value='1'/></div>";
				$i("i3GEObufferondeItens").style.display = "block";
			},
			"i3GEObufferondeItens"
		);
	}
};
