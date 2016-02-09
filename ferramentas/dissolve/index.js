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
Classe: i3GEOF.dissolve
*/
i3GEOF.dissolve = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
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
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.dissolve.dicionario);
		dicionario["aguarde"] = $trad("o1");
		dicionario["locaplic"] = i3GEO.configura.locaplic;
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
			$i(iddiv).innerHTML += i3GEOF.dissolve.html();
			i3GEOF.dissolve.t0();
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
		var ins = Mustache.render(i3GEOF.dissolve.MUSTACHE, i3GEOF.dissolve.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.dissolve")){
			return;
		}
		//cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>" + $trad("u25")+"<a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=22' ><b> </b></a></div>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.dissolve");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"160px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.dissolve",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.dissolve_rodape class='i3GeoRodapeJanela' ></div>");
		i3GEOF.dissolve.aguarde = $i("i3GEOF.dissolve_imagemCabecalho").style;
		i3GEOF.dissolve.inicia(divid);
		temp = function(){
			i3GEO.eventos.removeEventos("ATUALIZAARVORECAMADAS",["i3GEOF.dissolve.t0()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.eventos.adicionaEventos("ATUALIZAARVORECAMADAS",["i3GEOF.dissolve.t0()"]);
	},
	t0: function()
	{
		i3GEO.util.proximoAnterior("","i3GEOF.dissolve.t1()","","i3GEOFgradeDePontost0","i3GEOdissolveresultado",true,"i3GEOF.dissolve_rodape");
	},
	t1: function(){

		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t0()","i3GEOF.dissolve.t2()","","i3GEOF.dissolve.t1","i3GEOdissolveresultado",true,"i3GEOF.dissolve_rodape");
		i3GEOF.dissolve.comboTemasSel();
	},
	t2: function(){

		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t1()","i3GEOF.dissolve.t3()","","i3GEOF.dissolve.t2","i3GEOdissolveresultado",true,"i3GEOF.dissolve_rodape");
		i3GEOF.dissolve.comboItem();
	},
	t3: function(){
		i3GEO.util.proximoAnterior("i3GEOF.dissolve.t2()","","","i3GEOF.dissolve.t3","i3GEOdissolveresultado",true,"i3GEOF.dissolve_rodape");
		var b = new YAHOO.widget.Button(
			"i3GEOdissolvebotao1",
			{onclick:{fn: i3GEOF.dissolve.criadissolve}}
		);
		b.addClass("rodar");
	},
	/*
	Function: criadissolve

	Executa a opera&ccedil;&atilde;o de dissolve

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
				{$i("i3GEOdissolvefim").innerHTML = $trad(6,i3GEOF.dissolve.dicionario);}
				else
				{i3GEO.atualiza();}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/dissolve/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=dissolvePoligono&tema="+tema+"&item="+item;
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
			"poligonosSelecionados",
			" "
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