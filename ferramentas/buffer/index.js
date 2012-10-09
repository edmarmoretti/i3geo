
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
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.buffer.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.buffer.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/buffer/dicionario.js",
				"i3GEOF.buffer.iniciaJanelaFlutuante()",
				"i3GEOF.buffer.dicionario_script"
			);
		}
		else{
			i3GEOF.buffer.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.buffer.html();
			i3GEOF.buffer.t0();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEObufferresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEObufferfim" >';
		ins +=	'</div>';
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
			"400px",
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
			}
		);
		divid = janela[2].id;
		i3GEOF.buffer.aguarde = $i("i3GEOF.buffer_imagemCabecalho").style;
		i3GEOF.buffer.inicia(divid);
		temp = function(){
			//alert("oi");
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.buffer.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.buffer.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.buffer.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.buffer.t0()");}
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >O entorno, ou buffer, &eacute; um pol&iacute;gono que circunda um elemento geogr&aacute;fico em uma dist&acirc;ncia fixa.";
		ins += "<p class='paragrafo' >Para gerar o entorno, voc&ecirc; precisa selecionar alguns elementos de um tema. Utilize para isso a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de atributos do tema desejado.";
		i3GEO.util.proximoAnterior("","i3GEOF.buffer.t1()",ins,"i3GEOFgradeDePontost0","i3GEObufferresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Tema, com sele&ccedil;&atilde;o, que ser&aacute; utilizado:";
		ins += "<div id='i3GEObufferSelTemas' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t0()","i3GEOF.buffer.t2()",ins,"i3GEOF.buffer.t1","i3GEObufferresultado");
		i3GEOF.buffer.comboTemasSel();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>Dist&acirc;ncia do entorno em metros";
		ins += "<br><br><input onclick='javascript:this.select();' class=digitar id='i3GEObufferd' type=text size=10 value='0'/><br>";
		ins += "<p class='paragrafo'>Considerar os elementos selecionados como se fossem um s&oacute;?";
		ins += "<br><br><select id=i3GEObufferunir ><option value=nao selected >n&atilde;o</option><option value=sim >sim</option></select>";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t1()","i3GEOF.buffer.t3()",ins,"i3GEOF.buffer.t2","i3GEObufferresultado");
	},
	t3: function(){
		var ins = "<p class='paragrafo'>O tema com o entorno ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEObufferbotao1 type='button' value='Criar entorno' />";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t2()","",ins,"i3GEOF.buffer.t3","i3GEObufferresultado");
		new YAHOO.widget.Button(
			"i3GEObufferbotao1",
			{onclick:{fn: i3GEOF.buffer.criaBuffer}}
		);
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
				p,
				fim,
				cp;
			if (distancia*1 !== 0)
			{
				i3GEOF.buffer.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.buffer.aguarde.visibility = "hidden";
					if (retorno.data === undefined )
					{$i("i3GEObufferfim").innerHTML = "Erro. A opera&ccedil;&atilde;o demorou muito.";}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema="+tema+"&distancia="+distancia+"&unir="+$i("i3GEObufferunir").value;
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{alert("Distancia invalida");}
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
	}
};
