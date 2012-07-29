
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Dissolve elementos de um tema

Elimina divisas entre pol&iacute;gonos de um tema.

Veja:

<i3GEO.analise.dialogo.dissolve>

Arquivo:

i3geo/ferramentas/dissolve/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.dissolve
*/
i3GEOF.dissolve = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.dissolve.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario
	
	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta
	
	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/	
	iniciaDicionario: function(){
		if(typeof(i3GEOF.dissolve.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/dissolve/dicionario.js",
				"i3GEOF.dissolve.iniciaJanelaFlutuante()",
				"i3GEOF.dissolve.dicionario_script"
			);
		}
		else{
			i3GEOF.dissolve.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.dissolve.html();
			i3GEOF.dissolve.t0();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta
	
	Retorno:
	
	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOdissolveresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOdissolvefim" >';
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
		titulo = "Dissolve <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=22' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.dissolve");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.dissolve",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.dissolve.aguarde = $i("i3GEOF.dissolve_imagemCabecalho").style;
		i3GEOF.dissolve.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.dissolve.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.dissolve.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.dissolve.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.dissolve.t0()");}
	},
	t0: function()
	{
		var ins = "<p class='paragrafo'>Essa ferramenta transforma v&aacute;rios pol&iacute;gonos em um s&oacute; eliminando as divisas entre eles. Caso seja escolhido um item da tabela de atributos, os pol&iacute;gonos que possu&iacute;rem o mesmo valor serão considerados no mesmo grupo e suas divisas eliminadas e caso não tenha sido escolhido nenhum item, todas os pol&iacute;gonos serão agrupados em um s&oacute;. O resultado final ser&aacute; um novo tema com pol&iacute;gonos diferentes dos originais e cuja tabela de atributos conter&aacute; apenas um item.";
		i3GEO.util.proximoAnterior("","i3GEOF.dissolve.t1()",ins,"i3GEOFgradeDePontost0","i3GEOdissolveresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Tema, com sele&ccedil;&atilde;o, que ser&aacute; utilizado:";
		ins += "<div id='i3GEOdissolveSelTemas' style='text-align:left;'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t0()","i3GEOF.dissolve.t2()",ins,"i3GEOF.dissolve.t1","i3GEOdissolveresultado");
		i3GEOF.dissolve.comboTemasSel();
	},
	t2: function(){
		var ins = "<p class='paragrafo' >Escolha o item que ser&aacute; utilizado (opcional)</p>";
		ins += "<div style='text-align:left;' id='i3GEOdissolveDivItem' >Aguarde...</div>";
		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t1()","i3GEOF.dissolve.t3()",ins,"i3GEOF.dissolve.t2","i3GEOdissolveresultado");	
		i3GEOF.dissolve.comboItem();
	},
	t3: function(){
		var ins = "<p class='paragrafo'>O tema com as divisas eliminadas ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEOdissolvebotao1 type='buttom' value='Dissolver' />";
		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t2()","",ins,"i3GEOF.dissolve.t3","i3GEOdissolveresultado");
		new YAHOO.widget.Button(
			"i3GEOdissolvebotao1",
			{onclick:{fn: i3GEOF.dissolve.criadissolve}}
		);		
	},
	/*
	Function: criadissolve
	
	Executa a opera&ccedil;ão de dissolve
	
	Veja:
	
	<DISSOLVEPOLIGONO>
	*/
	criadissolve: function(){
		try{
			if(i3GEOF.dissolve.aguarde.visibility === "visible")
			{return;}
			var item = $i("i3GEOdissolveItem").value,
				tema = $i("i3GEOdissolvetemasComSel").value,
				p,
				fim,
				cp;
			i3GEOF.dissolve.aguarde.visibility = "visible";
			fim = function(retorno){
				i3GEOF.dissolve.aguarde.visibility = "hidden";
				if (retorno.data === undefined )
				{$i("i3GEOdissolvefim").innerHTML = "Erro. A opera&ccedil;ão demorou muito.";}
				else
				{i3GEO.atualiza();}
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=dissolvePoligono&tema="+tema+"&item="+item;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criadissolve",fim);
		}
		catch(e){$i("i3GEOdissolvefim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.dissolve.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSel
	
	Cria um combo com a lista de temas com elementos selecionados

	Veja:
	
	<i3GEO.util.comboTemas>

	*/
	comboTemasSel: function(){
		i3GEO.util.comboTemas(
			"i3GEOdissolvetemasComSel",
			function(retorno){
		 		$i("i3GEOdissolveSelTemas").innerHTML = retorno.dados;
		 		$i("i3GEOdissolveSelTemas").style.display = "block";
		 		if ($i("i3GEOdissolvetemasComSel")){
		 			$i("i3GEOdissolvetemasComSel").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOdissolvetemasComSel").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOdissolvetemasComSel").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOdissolveSelTemas",
			"",
			false,
			"poligonosSelecionados"
		);	
	},
	/*
	Function: comboItem
	
	Cria um combo para escolha de um item do tema de origem

	Veja:
	
	<i3GEO.util.comboItens>

	*/
	comboItem: function(){
		i3GEO.util.comboItens(
			"i3GEOdissolveItem",
			$i("i3GEOdissolvetemasComSel").value,
			function(retorno){
		 		$i("i3GEOdissolveDivItem").innerHTML = retorno.dados;
		 		$i("i3GEOdissolveDivItem").style.display = "block";
			},
			"i3GEOdissolveDivItem"
		);
	}
};
