/*
Title: Melhor caminho

Calcula o melhor caminho entre dois pontos com base em uma imagem raster

Arquivo:

i3geo/ferramentas/melhorcaminho/index.js.php

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
Classe: i3GEOF.melhorcaminho

*/
i3GEOF.melhorcaminho = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	COORDENADASTEMA: "",
	/*
	Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.melhorcaminho.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.melhorcaminho.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/melhorcaminho/dicionario.js",
				"i3GEOF.melhorcaminho.iniciaJanelaFlutuante()",
				"i3GEOF.melhorcaminho.dicionario_script"
			);
		}
		else{
			i3GEOF.melhorcaminho.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.melhorcaminho.html();
			i3GEOF.melhorcaminho.t0();
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
		ins +=	'<div style="padding:5px;background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOmelhorcaminhoresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOmelhorcaminhofim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo,temp;
		if($i("i3GEOF.melhorcaminho")){
			return;
		}
		//cria a janela flutuante
		titulo = $trad("melhorcaminho")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=14' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){
			i3GEO.barraDeBotoes.execBotao("pan");
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.melhorcaminho");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.melhorcaminho",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			false,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/accessories-calculator.png"
		);
		divid = janela[2].id;
		janela[0].setFooter("<div id=i3GEOF.melhorcaminho_rodape style=background-color:#F2F2F2; ></div>");
		i3GEOF.melhorcaminho.aguarde = $i("i3GEOF.melhorcaminho_imagemCabecalho").style;
		i3GEOF.melhorcaminho.inicia(divid);
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.eventos.removeEventos("MOUSECLIQUE",["i3GEOF.melhorcaminho.capturaPontoA()","i3GEOF.melhorcaminho.capturaPontoB()"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	t0: function()
	{
		var ins = "<img class=i3GeoExemploImg src='"+i3GEO.configura.locaplic+"/ferramentas/melhorcaminho/exemplo.png' />" +
		"<p class='paragrafo' >"+$trad('ajuda',i3GEOF.melhorcaminho.dicionario) +
		"<p class='paragrafo'>"+$trad('ajuda2',i3GEOF.melhorcaminho.dicionario) +
		"<p class='paragrafo'>"+$trad('ajuda3',i3GEOF.melhorcaminho.dicionario);
		i3GEO.util.proximoAnterior("","i3GEOF.melhorcaminho.t1()",ins,"i3GEOF.melhorcaminho.t0","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>"+$trad('raster',i3GEOF.melhorcaminho.dicionario) +" :<br>" +
			"<div class='styled-select' id='i3GEOmelhorcaminhoDivRaster'></div>" +
			"<br>";	
		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t0()","i3GEOF.melhorcaminho.t2()",ins,"i3GEOF.melhorcaminho.t1","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
		i3GEOF.melhorcaminho.comboTemasRaster();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>"+$trad('temas',i3GEOF.melhorcaminho.dicionario) +" :<br>" +
			"<div class='styled-select' id='i3GEOmelhorcaminhoDivTema'></div>" +
			"<br>";	
		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t1()","i3GEOF.melhorcaminho.t3()",ins,"i3GEOF.melhorcaminho.t2","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
		i3GEOF.melhorcaminho.comboTemas();
	},
	t3: function(){
		var ins = "<p class='paragrafo'><b>"+$trad('pti',i3GEOF.melhorcaminho.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X (long): ";
		ins += $trad('grau',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('minuto',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('segundo',i3GEOF.melhorcaminho.dicionario)+"</p>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;' ><input  id='i3GEOmelhorcaminhoxg' title='grau' type=text value='1'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;margin-right:10px;' ><input  id='i3GEOmelhorcaminhoxm' title='minuto' type=text value='00'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='margin-left:10px;' ><input  id='i3GEOmelhorcaminhoxs' title='segundo' type=text value='00.00'/></div>";

		ins += "<br><p class='paragrafo'>Y (lat): ";
		ins += $trad('grau',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('minuto',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('segundo',i3GEOF.melhorcaminho.dicionario)+"</p>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;' ><input id='i3GEOmelhorcaminhoyg' title='grau' type=text value='1'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;' ><input  id='i3GEOmelhorcaminhoym' title='minuto' type=text value='00'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;' ><input  id='i3GEOmelhorcaminhoys' title='segundo' type=text value='00.00'/></div>";

		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t2()","i3GEOF.melhorcaminho.t4()",ins,"i3GEOF.melhorcaminho.t3","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.melhorcaminho.capturaPontoA()"]);
		//calcula as coordenadas em DD
		dms = i3GEO.calculo.dd2dms(retorno.data.ax,retorno.data.ay);
		dmsx = dms[0].split(" ");
		dmsy = dms[1].split(" ");
		$i("i3GEOmelhorcaminhoxg").value = dmsx[0];
		$i("i3GEOmelhorcaminhoxm").value = dmsx[1];
		$i("i3GEOmelhorcaminhoxs").value = dmsx[2];
		$i("i3GEOmelhorcaminhoyg").value = dmsy[0];
		$i("i3GEOmelhorcaminhoym").value = dmsy[1];
		$i("i3GEOmelhorcaminhoys").value = dmsy[2];
	},
	t4: function(){
		var ins = "<p class='paragrafo'><b>"+$trad('ptf',i3GEOF.melhorcaminho.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X (long): ";
		ins += $trad('grau',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('minuto',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('segundo',i3GEOF.melhorcaminho.dicionario)+"</p>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;' ><input id='i3GEOmelhorcaminhoixg' title='grau' type=text value='1'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;margin-right:10px;' ><input  id='i3GEOmelhorcaminhoixm' title='minuto' type=text value='00'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='margin-left:10px;' ><input  id='i3GEOmelhorcaminhoixs' title='segundo' type=text value='00.00'/></div>";

		ins += "<br><p class='paragrafo'>Y (lat): ";
		ins += $trad('grau',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('minuto',i3GEOF.melhorcaminho.dicionario)+" - "+$trad('segundo',i3GEOF.melhorcaminho.dicionario)+"</p>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;' ><input id='i3GEOmelhorcaminhoiyg' title='grau' type=text value='1'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;' ><input  id='i3GEOmelhorcaminhoiym' title='minuto' type=text value='00'/></div>";
		ins += "<div class='i3geoForm100 i3geoFormIconeEdita' style='float:left;margin-left:10px;' ><input  id='i3GEOmelhorcaminhoiys' title='segundo' type=text value='00.00'/></div>";

		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t3()","i3GEOF.melhorcaminho.t5()",ins,"i3GEOF.melhorcaminho.t4","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");

		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.eventos.adicionaEventos("MOUSECLIQUE",["i3GEOF.melhorcaminho.capturaPontoB()"]);
		//calcula as coordenadas em DD
		dms = i3GEO.calculo.dd2dms(retorno.data.bx,retorno.data.by);
		dmsx = dms[0].split(" ");
		dmsy = dms[1].split(" ");
		$i("i3GEOmelhorcaminhoixg").value = dmsx[0];
		$i("i3GEOmelhorcaminhoixm").value = dmsx[1];
		$i("i3GEOmelhorcaminhoixs").value = dmsx[2];
		$i("i3GEOmelhorcaminhoiyg").value = dmsy[0];
		$i("i3GEOmelhorcaminhoiym").value = dmsy[1];
		$i("i3GEOmelhorcaminhoiys").value = dmsy[2];
	},
	t5: function(){
		var ins = "<p class='paragrafo'><b>"+$trad('numero',i3GEOF.melhorcaminho.dicionario)+"</b>";
		ins += "<p class='paragrafo'>X</p>";
		ins += "<div class='i3geoForm i3geoFormIconeEdita' ><input id='i3GEOmelhorcaminhonptx' title='pontos em x'  type=text value='10'/></div>";
		ins += "<br><p class='paragrafo'>Y";
		ins += "<div class='i3geoForm i3geoFormIconeEdita' ><input id='i3GEOmelhorcaminhonpty' title='pontos em y'  type=text value='10'/></div>";

		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t2()","i3GEOF.melhorcaminho.t4()",ins,"i3GEOF.melhorcaminho.t3","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
	},
	t6: function(){
		var b,ins = "<p class='paragrafo'><b>"+$trad('adicionaTema',i3GEOF.melhorcaminho.dicionario)+"</b>";
		ins += "<p class='paragrafo'><input id=i3GEOmelhorcaminhobotao1 size=18 class=executar type='button' value='"+$trad('criaGrade',i3GEOF.melhorcaminho.dicionario)+"' />";

		i3GEO.util.proximoAnterior("i3GEOF.melhorcaminho.t3()","",ins,"i3GEOF.melhorcaminho.t4","i3GEOmelhorcaminhoresultado",true,"i3GEOF.melhorcaminho_rodape");
		b = new YAHOO.widget.Button(
			"i3GEOmelhorcaminhobotao1",
			{onclick:{fn: i3GEOF.melhorcaminho.criaGrade}}
		);
		b.addClass("rodar");
	},
	comboTemasRaster: function(){
		i3GEO.util.comboTemas(
			"i3GEOmelhorcaminhoRaster",
			function(retorno){
				$i("i3GEOmelhorcaminhoDivRaster").innerHTML = retorno.dados;
				$i("i3GEOmelhorcaminhoDivRaster").style.display = "block";
			},
			"i3GEOmelhorcaminhoDivRaster",
			"",
			false,
			"raster",
			" "
		);
	},	
	comboTemas: function(){
		i3GEO.util.comboTemas(
			"i3GEOmelhorcaminhoTema",
			function(retorno){
				$i("i3GEOmelhorcaminhoDivTema").innerHTML = retorno.dados;
				$i("i3GEOmelhorcaminhoDivTema").style.display = "block";
				if ($i("i3GEOmelhorcaminhoTema")){
					$i("i3GEOmelhorcaminhoTema").onchange = function(){
						//captura o ponto inicial e final
						i3GEOF.melhorcaminho.shape2pontos($i("i3GEOmelhorcaminhoTema").value);
					};
				}
			},
			"i3GEOmelhorcaminhoDivTema",
			"",
			false,
			"naoraster",
			" "
		);
	},	
	shape2pontos: function(tema){
		var p, par, retorno
		p = i3GEO.configura.locaplic + "/ferramentas/melhorcaminho/exec.php?g_sid="+i3GEO.configura.sid;
		par = "funcao=shape2pontos&tema=" + tema;
		retorno = function(retorno) {
			var dms,dmsx,dmsy;
			i3GEO.janela.fechaAguarde("shape2pontos");
			i3GEOF.melhorcaminho.COORDENADASTEMA = retorno.data;
			i3GEOF.melhorcaminho.t3();
		};
		i3GEO.janela.abreAguarde("shape2pontos", $trad("o1"));
		cpJSON.call(p, "foo", retorno, par);
	},
	capturaPontoA: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOmelhorcaminhoxg",
			"i3GEOmelhorcaminhoxm",
			"i3GEOmelhorcaminhoxs",
			"i3GEOmelhorcaminhoyg",
			"i3GEOmelhorcaminhoym",
			"i3GEOmelhorcaminhoys"
		);
	},
	capturaPontoB: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOmelhorcaminhoixg",
			"i3GEOmelhorcaminhoixm",
			"i3GEOmelhorcaminhoixs",
			"i3GEOmelhorcaminhoiyg",
			"i3GEOmelhorcaminhoiym",
			"i3GEOmelhorcaminhoiys"
		);
	},
	/*
	Function: criaGrade

	Cria a grade e adiciona um novo tema ao mapa

	Veja:

	<GRADEDEPOL>
	*/
	criaGrade: function(){
		try{
			if(i3GEOF.melhorcaminho.aguarde.visibility === "visible")
			{return;}
			i3GEOF.melhorcaminho.aguarde.visibility = "visible";
			var dx,dy,ix,iy,nptx,npty,fim,p,cp,proj="nao";
			if(!$i("i3GEOmelhorcaminhoProj").checked){
				dx = i3GEO.calculo.dms2dd($i("i3GEOmelhorcaminhoxg").value,$i("i3GEOmelhorcaminhoxm").value,$i("i3GEOmelhorcaminhoxs").value);
				dy = i3GEO.calculo.dms2dd($i("i3GEOmelhorcaminhoyg").value,$i("i3GEOmelhorcaminhoym").value,$i("i3GEOmelhorcaminhoys").value);
			}
			else{
				proj = "sim";
				dx = $i("i3GEOmelhorcaminhoxg").value;
				dy = $i("i3GEOmelhorcaminhoyg").value;
			}
			ix = i3GEO.calculo.dms2dd($i("i3GEOmelhorcaminhoixg").value,$i("i3GEOmelhorcaminhoixm").value,$i("i3GEOmelhorcaminhoixs").value);
			iy = i3GEO.calculo.dms2dd($i("i3GEOmelhorcaminhoiyg").value,$i("i3GEOmelhorcaminhoiym").value,$i("i3GEOmelhorcaminhoiys").value);
			nptx = $i("i3GEOmelhorcaminhonptx").value;
			npty = $i("i3GEOmelhorcaminhonpty").value;
			if ((dx == 0) || (dy == 0))
			{i3GEO.janela.tempoMsg($trad('msg',i3GEOF.melhorcaminho.dicionario));return;}
			if ((nptx == 0) || (npty == 0))
			{i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.melhorcaminho.dicionario));return;}
			if (nptx * npty > 10000)
			{i3GEO.janela.tempoMsg($trad('msg2',i3GEOF.melhorcaminho.dicionario));return;}
			fim = function(retorno){
				i3GEOF.melhorcaminho.aguarde.visibility = "hidden";
				if (retorno.data == undefined )
				{$i("i3GEOmelhorcaminhofim").innerHTML = "<p class='paragrafo'>Erro. ";}
				else
				{i3GEO.atualiza("");}
			};
			p = i3GEO.configura.locaplic+"/ferramentas/melhorcaminho/exec.php?g_sid="+i3GEO.configura.sid+"&proj="+proj+"&funcao=gradedepol&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"melhorcaminho",fim);
		}
		catch(e){$i("i3GEOmelhorcaminhofim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEOF.melhorcaminho.aguarde.visibility = "hidden";}
	},
	/*
	Function: capturaPonto

	Captura um ponto no mapa e preenche os campos de coordenadas de in&iacute;cio da grade
	*/
	capturaPonto: function(){
		i3GEO.eventos.cliqueCapturaPt(
			"i3GEOmelhorcaminhoixg",
			"i3GEOmelhorcaminhoixm",
			"i3GEOmelhorcaminhoixs",
			"i3GEOmelhorcaminhoiyg",
			"i3GEOmelhorcaminhoiym",
			"i3GEOmelhorcaminhoiys"
		);
	}
};
