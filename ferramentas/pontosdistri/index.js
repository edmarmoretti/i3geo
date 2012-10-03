
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Distribui&ccedil;ão de pontos

Adiciona um novo tema ao mapa em fun&ccedil;ão da an&aacute;lise de distribui&ccedil;ão de pontos.
O tema com os pontos deve existir no mapa atual.

Veja:

<i3GEO.analise.dialogo.pontosdistri>

Arquivo: i3geo/ferramentas/pontosdistri/index.js.php

About: Licen&ccedil;a

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

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
Classe: i3GEOF.pontosDistri
*/
i3GEOF.pontosDistri = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que não tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.pontosDistri.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.pontosDistri.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/pontosdistri/dicionario.js",
				"i3GEOF.pontosDistri.iniciaJanelaFlutuante()",
				"i3GEOF.pontosDistri.dicionario_script"
			);
		}
		else{
			i3GEOF.pontosDistri.iniciaJanelaFlutuante();
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
			$i(iddiv).innerHTML += i3GEOF.pontosDistri.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia1","i3GEOpontosDistriguia");
			//eventos das guias
			$i("i3GEOpontosDistriguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia1","i3GEOpontosDistriguia");};
			$i("i3GEOpontosDistriguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOpontosDistriguia2","i3GEOpontosDistriguia");};
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotao4",
				{onclick:{fn: i3GEOF.pontosDistri.verCores}}
			);
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotao1",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDensidade}}
			);
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotao2",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDistancia}}
			);
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotao3",
				{onclick:{fn: i3GEOF.pontosDistri.analiseRelatorio}}
			);
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotaokernel",
				{onclick:{fn: i3GEOF.pontosDistri.analiseKernel}}
			);
			new YAHOO.widget.Button(
				"i3GEOpontosDistribotaodeldir",
				{onclick:{fn: i3GEOF.pontosDistri.analiseDeldir}}
			);
			i3GEOF.pontosDistri.ativaFoco();
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
		ins += '<div class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOpontosDistriguia1" style="text-align:center;left:0px;" >C&aacute;lculo</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOpontosDistriguia2" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div><br>';
		ins += '<div class="guiaobj" id="i3GEOpontosDistriguia1obj" style="left:1px;display:none;">';
		ins += '	<p class="paragrafo" >Escolha o tema que ser&aacute; utilizado (no caso de linhas ou pol&iacute;gonos, ser&aacute; calculado o centr&oacute;ide):</p>';
		ins += '	<div id=i3GEOpontosDistriTemas ></div>';
		ins += '	<p class="paragrafo">Restringe a an&aacute;lise aos limites de abrang&ecirc;ncia dos pontos?';
		ins += i3GEO.util.comboSimNao("i3GEOpontosDistrilimitePontos","sim");
		ins += '	<p class="paragrafo" >Extende os limites de abrang&ecirc;ncia em ';
		ins += $inputText("","","i3GEOpontosDistriextendelimite","",3,"10")+' %';
		ins += '	<p class="paragrafo" ><input id="i3GEOpontosDistribotao1" size=35  type=button value="Densidade de pontos" />&nbsp;';
		ins += '	<input id="i3GEOpontosDistribotao2" size=35  type=button value="Dist&acirc;ncia entre pontos" /></p>';
		ins += '	<p class="paragrafo"><input id=i3GEOpontosDistribotaokernel size=35  type=button value="Kernel" />';
		ins += '	&nbsp;Desvio padr&atilde;o (sigma): ';
		ins += $inputText("","","i3GEOpontosDistrisigma","",3,"")+"</p>";
		ins += '	<p class="paragrafo"><input id=i3GEOpontosDistribotaodeldir size=35  type=button value="Delaunay/Voronoi" /></p>';
		ins += '	<p class="paragrafo"><input id=i3GEOpontosDistribotao3 size=35  type=button value="Relat&oacute;rio" /></p>';
		ins += '	<div id="i3GEOpontosDistriresultado" style="display:none;position:relative;top:10px;left:0px;"></div>';
		ins += '	</div>';
		ins += '	<input type=hidden id=i3GEOpontosDistrilistadeitens value="" />';
		ins += '	<input type=hidden id=i3GEOpontosDistritema value="" />';
		ins += '</div>';
		ins += '<div class=guiaobj id="i3GEOpontosDistriguia2obj" style="left:1px;display:none;">';
		ins += '		<p class="paragrafo" >Op&ccedil;&otilde;es de cores e classes do tema resultante:</p><br>';
		ins += '		<table summary="" class=lista2 style= >';
		ins += '			<tr>';
		ins += '				<td>N&uacute;mero de classes:</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOpontosDistrinumclasses","",4,"50");
		ins += 					'</td>';
		ins += '			</tr>';
		ins += '			<tr>';
		ins += '				<td>Cor inicial:</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOpontosDistricori","",12,"0,0,0");
		ins += '				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.pontosDistri.corj(\'i3GEOpontosDistricori\')" /></td>';
		ins += '			</tr>';
		ins += '			<tr>';
		ins += '				<td>Cor final:</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOpontosDistricorf","",12,"255,255,255");
		ins += '				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.pontosDistri.corj(\'i3GEOpontosDistricorf\')" /></td>';
		ins += '			</tr>';
		ins += '		</table>';
		ins += '	<br><p class=paragrafo ><input id=i3GEOpontosDistribotao4 size=15  type=button value="Ver cores" />';
		ins += '	<div id=i3GEOpontosDistrimostracores style="display:block;" ></div>';
		ins += '</div>';
		ins += '<div class=guiaobj id="i3GEOpontosDistriguia3obj" style="left:1px;display:none;">';
		ins += '</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.pontosDistri.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.pontosDistri");
		};
		//cria a janela flutuante
		titulo = $trad("u14")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=20' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"310px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.pontosDistri",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.pontosDistri_corpo").style.backgroundColor = "white";
		i3GEOF.pontosDistri.aguarde = $i("i3GEOF.pontosDistri_imagemCabecalho").style;
		i3GEOF.pontosDistri.inicia(divid);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.pontosDistri.ativaFoco()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.pontosDistri.ativaFoco()");}
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.pontosDistri.ativaFoco()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.pontosDistri.ativaFoco()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.util.comboTemas(
			"i3GEOpontosDistritemasComSel",
			function(retorno){
		 		if(retorno.tipo !== "dados"){
		 			$i("i3GEOpontosDistriTemas").innerHTML = "<p class=paragrafo style=color:red >Nenhum tema de pontos com sele&ccedil;ão<span style=cursor:pointer;color:blue onclick='i3GEO.mapa.dialogo.selecao()' > Selecionar...</span></p>";
		 			return;
		 		}
		 		$i("i3GEOpontosDistriTemas").innerHTML = "<p class=paragrafo >"+retorno.dados + "</p>";
	 			$i("i3GEOpontosDistritemasComSel").onchange = function(){
	 				i3GEO.mapa.ativaTema($i("i3GEOpontosDistritemasComSel").value);
	 			};
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOpontosDistritemasComSel").value = i3GEO.temaAtivo;
				}
			},
			"i3GEOpontosDistriTemas",
			"",
			false,
			"selecionados"
		);
		var i = $i("i3GEOF.pontosDistri_c").style;
		i.zIndex = i3GEO.janela.ULTIMOZINDEX;
		i3GEO.janela.ULTIMOZINDEX++;
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: verCores

	Mostra as cores definidas nos intervalos de defini&ccedil;ão da paleta

	Veja:

	<VERPALETA>
	*/
	verCores: function(){
		try{
			if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
			{return;}
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=verPaleta&numclasses="+n+"&cori="+ci+"&corf="+cf,
				mostraopcoes = function(retorno){
					retorno = retorno.data.split("*");
					var ins = "<br><br>",
						i,
						n = retorno.length;
					for (i=0;i<n;i++){
						ins += "<div style=background-color:rgb("+retorno[i]+") >"+retorno[i]+"</div>";
					}
					$i("i3GEOpontosDistrimostracores").innerHTML = ins;
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				};
			cp.set_response_type("JSON");
			cp.call(p,"verPaleta",mostraopcoes);
		}catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDistancia

	Executa a an&aacute;lise de distribui&ccedil;ão de pontos

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseDistancia: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=distancia&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				alert("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDensidade

	Executa a an&aacute;lise de densidade

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseDensidade: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=densidade&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				alert("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseKernel

	Executa a an&aacute;lise de kernel

	Veja:

	<ANALISEDISTRIPT>
	*/
	analiseKernel: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=kernel&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&sigma="+$i("i3GEOpontosDistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				alert("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseDeldir

	Executa a an&aacute;lise de triangula&ccedil;ão

	Veja:

	<ANALISEDISTRIPT>

	*/
	analiseDeldir: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var tema = $i("i3GEOpontosDistritemasComSel").value,
				temp = function(){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				},
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses=&cori=&corf=&tipo=deldir&limitepontos=&extendelimite=&sigma=&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				alert("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	},
	/*
	Function: analiseRelatorio

	Abre o relat&oacute;rio de an&aacute;lise

	Veja:

	<ANALISEDISTRIPT>

	*/
	analiseRelatorio: function(){
		if(!$i("i3GEOpontosDistritemasComSel"))
		{return;}
		if(i3GEOF.pontosDistri.aguarde.visibility === "visible")
		{return;}
		i3GEOF.pontosDistri.aguarde.visibility = "visible";
		try{
			var n = $i("i3GEOpontosDistrinumclasses").value,
				ci = $i("i3GEOpontosDistricori").value,
				cf = $i("i3GEOpontosDistricorf").value,
				temp = function(retorno){
					i3GEOF.pontosDistri.aguarde.visibility = "hidden";
					window.open(retorno.data);
				},
				tema = $i("i3GEOpontosDistritemasComSel").value,
				cp = new cpaint(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=analiseDistriPt&tema2=&tema="+tema+"&numclasses="+n+"&cori="+ci+"&corf="+cf+"&tipo=relatorio&limitepontos="+$i("i3GEOpontosDistrilimitePontos").value+"&extendelimite="+$i("i3GEOpontosDistriextendelimite").value+"&sigma="+$i("i3GEOpontosDistrisigma").value+"&ext="+i3GEO.parametros.mapexten;
			if(tema === ""){
				alert("Escolha um tema");
				i3GEOF.pontosDistri.aguarde.visibility = "hidden";
				return;
			}
			cp.set_response_type("JSON");
			cp.call(p,"analiseDistriPt",temp);
		}
		catch(e){alert(e);i3GEOF.pontosDistri.aguarde.visibility = "hidden";}
	}
};
