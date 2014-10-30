/*
Title: N&uacute;mero de pontos em pol&iacute;gonos

Calcula quantos pontos existem em cada pol&iacute;gono cruzando dois temas.

Veja:

<i3GEO.analise.nptPol>

Arquivo:

i3geo/ferramentas/nptpol/index.js.php

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
Classe: i3GEOF.nptpol
*/
i3GEOF.nptpol = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.nptpol.iniciaDicionario();
	},
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.nptpol.dicionario);
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
			$i(iddiv).innerHTML += i3GEOF.nptpol.html();
			i3GEOF.nptpol.t0();
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
		var ins = Mustache.render(i3GEOF.nptpol.MUSTACHE, i3GEOF.nptpol.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = $trad("u12")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=19' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.nptpol");
		};
		janela = i3GEO.janela.cria(
			"420px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.nptpol",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.nptpol_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.nptpol.aguarde = $i("i3GEOF.nptpol_imagemCabecalho").style;
		i3GEOF.nptpol.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.nptpol.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.nptpol.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.nptpol.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.nptpol.t0()");}
	},
	t0: function()
	{
		i3GEO.util.proximoAnterior("","i3GEOF.nptpol.t1()","","i3GEOFgradeDePontost0","i3GEOnptpolresultado",true,"i3GEOF.nptpol_rodape");
	},
	t1: function(){
		i3GEO.util.proximoAnterior("i3GEOF.nptpol.t0()","i3GEOF.nptpol.t2()","","i3GEOF.nptpol.t1","i3GEOnptpolresultado",true,"i3GEOF.nptpol_rodape");
		i3GEOF.nptpol.comboTemasPontos();
		i3GEOF.nptpol.comboTemasPoligonos();
	},
	t2: function(){
		i3GEO.util.proximoAnterior("i3GEOF.nptpol.t1()","","","i3GEOF.nptpol.t2","i3GEOnptpolresultado",true,"i3GEOF.nptpol_rodape");
		var b = new YAHOO.widget.Button(
			"i3GEOnptpolbotao1",
			{onclick:{fn: i3GEOF.nptpol.calcula}}
		);
		b.addClass("rodar");
	},
	/*
	Function: calcula

	Faz o cruzamento entre os temas

	Veja:

	<NPTPOL>
	*/
	calcula: function(){
		try{
			if(i3GEOF.nptpol.aguarde.visibility === "visible")
			{return;}
			i3GEOF.nptpol.aguarde.visibility = "visible";
			var p,
				cp,
				somaritem = $i("i3GEOnptpoltemasItem").value,
				fim = function(retorno){
					if (retorno.data==undefined )
					{$i("i3GEOnptpolfim").innerHTML = "<p class='paragrafo' >Erro";}
					else
					{i3GEO.atualiza();}
					i3GEOF.nptpol.aguarde.visibility = "hidden";
				},
				ext;
			if(i3GEO.Interface.ATUAL === "googlemaps")
			{ext = i3GEO.Interface.googlemaps.bbox();}
			else
			{ext = i3GEO.parametros.mapexten;}
			ext = i3GEO.util.extOSM2Geo(ext);
			p = i3GEO.configura.locaplic+"/ferramentas/nptpol/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=nptPol&temaPt="+$i("i3GEOnptpolPontos").value+"&temaPo="+$i("i3GEOnptpolPoligonos").value+"&ext="+ext;
			p += "&somaritem="+somaritem;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"nptpol",fim);
		}
		catch(e){$i("i3GEOnptpolfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.nptpol.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasPontos

	Cria um combo com a lista de temas pontuais

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemasPontos: function(){
		i3GEO.util.comboTemas(
			"i3GEOnptpolPontos",
			function(retorno){
				$i("i3GEOnptpolDivPontos").innerHTML = retorno.dados;
				$i("i3GEOnptpolDivPontos").style.display = "block";
				if ($i("i3GEOnptpolPontos")){
					$i("i3GEOnptpolPontos").onchange = function(){
						var v = $i("i3GEOnptpolPontos").value;
						i3GEO.mapa.ativaTema(v);
						if(v != ""){
							i3GEOF.nptpol.comboItens();
						}
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOnptpolPontos").value = i3GEO.temaAtivo;
					i3GEOF.nptpol.comboItens();
				}
			},
			"i3GEOnptpolDivPontos",
			"",
			false,
			"pontos",
			" "
		);
	},
	/*
	Function: comboTemasPoligonos

	Cria um combo com a lista de temas poligonais

	Veja:

	<i3GEO.util.comboTemas>
	*/
	comboTemasPoligonos: function(){
		i3GEO.util.comboTemas(
			"i3GEOnptpolPoligonos",
			function(retorno){
				$i("i3GEOnptpolDivPoligonos").innerHTML = retorno.dados;
				$i("i3GEOnptpolDivPoligonos").style.display = "block";
				if ($i("i3GEOnptpolPoligonos")){
					$i("i3GEOnptpolPoligonos").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOnptpolPoligonos").value);
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOnptpolPoligonos").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOnptpolDivPoligonos",
			"",
			false,
			"poligonos",
			" "
		);
	},
	/*
	Function: comboItens

	Cria um combo para escolha de um item do tema

	Veja:

	<i3GEO.util.comboItens>

	*/
	comboItens: function(){
		var tema = $i("i3GEOnptpolPontos").value;
		if(tema != ""){
			i3GEO.util.comboItens(
				"i3GEOnptpoltemasItem",
				tema,
				function(retorno){
					$i("i3GEOnptpolondeItens").innerHTML = retorno.dados;
					$i("i3GEOnptpolondeItens").style.display = "block";
				},
				"i3GEOnptpolondeItens"
			);
		}
		else{
			$i("i3GEOnptpolondeItens").innerHTML = "-";
		}
	}
};