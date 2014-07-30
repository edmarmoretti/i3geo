
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Gr&aacute;fico interativo

Representa&ccedil;&atilde;o gr&aacute;fica de dados. O gr&aacute;fico &eacute; constru&iacute;do tendo como base os atributos de um tema e &eacute; modificado
conforme o usu&aacute;rio navega pelo mapa. A renderiza&ccedil;&atilde;o do gr&aacute;fico &eacute; feito pelo navegador por meio do aplicativo openflashchart.
Os dados que ser&atilde;o utilizados no gr&aacute;fico s&atilde;o baseados em um elemento TABLE. Esse elemento pode ser montado com base na tabela
de atributos e editada pelo usu&aacute;rio. Os dados podem tamb&eacute;m ser inseridos como par�metros na inicializa&ccedil;&atilde;o da ferramenta,
permitindo que o gr&aacute;fico seja utilizado por outras ferramentas.

Veja:

<i3GEO.analise.dialogo.graficoInterativo>

Arquivo:

i3geo/ferramentas/graficointerativo/index.js.php

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
Classe: i3GEOF.graficointerativo (Versao em flash. Depreciado. Utilize graficointerativo1)

*/
i3GEOF.graficointerativo = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: dados

	Dados que serao utilizados. Pode ser passado como parametro.

	Default:
	{false}
	*/
	dados:false,
	/*
	Propriedade: titulo

	T&iacute;tulo do gr&aacute;fico. Se for vazio, ser&aacute; obtido do nome do tema selecionado
	*/
	titulo: "",
	/*
	Propriedade: tipo

	Tipo de gr&aacute;fico escolhido pelo usu&aacute;rio.
	*/
	tipo: "",
	/*
	Propriedade: acumula

	Acumula os valores ao gerar o gr&aacute;fico

	Type:
	{boolean}

	Default:
	{false}
	*/
	acumula: false,
	/*
	Propriedade: relativa

	Utiliza valores relativos ao criar o gr&aacute;fico

	Type:
	{boolean}

	Default:
	{false}
	*/
	relativa: false,
	/*
	Propriedade: dadospuros

	N&atilde;o faz nenhum tipo de processamento nos dados antes de gerar o gr&aacute;fico

	Type:
	{boolean}

	Default:
	{false}
	*/
	dadospuros: false,
	/*
	Propriedade: navegacao

	Ativa ou n&atilde;o a navega&ccedil;&atilde;o din�mica do mapa

	Type:
	{boolean}

	Default:
	{false}
	*/
	navegacao:false,

	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(dados){
		if(dados){
			i3GEOF.graficointerativo.dados = dados;
		}
		i3GEOF.graficointerativo.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(dados){
		if(dados){
			i3GEOF.graficointerativo.dados = dados;
		}
		if(typeof(i3GEOF.graficointerativo.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/graficointerativo/dicionario.js",
				"i3GEOF.graficointerativo.iniciaJanelaFlutuante()",
				"i3GEOF.graficointerativo.dicionario_script"
			);
		}
		else{
			i3GEOF.graficointerativo.iniciaJanelaFlutuante(dados);
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametros:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	dados {JSON} - dados para o gr&aacute;fico (opcional) exemplo ["n;x","'Argentina';33796870","'Paraguay';4773464","'Brazil';151525400","'Chile';13772710"]
	*/
	inicia: function(iddiv){
		//try{
			$i(iddiv).innerHTML += i3GEOF.graficointerativo.html();
			$i("i3GEOgraficointerativoAcumula").checked = i3GEOF.graficointerativo.acumula;
			$i("i3GEOgraficointerativoRelativa").checked = i3GEOF.graficointerativo.relativa;
			$i("i3GEOgraficointerativoDadosPuros").checked = i3GEOF.graficointerativo.dadospuros;
			if(i3GEOF.graficointerativo.navegacao === true)
			{i3GEOF.graficointerativo.ativaNavegacao(true);}
			//eventos das guias
			$i("i3GEOgraficointerativoguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
				$i("i3GEOgraficointerativoGrafico").style.display = "none";
			};
			$i("i3GEOgraficointerativoguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia2","i3GEOgraficointerativoguia");
				i3GEOF.graficointerativo.configuraDados();
				$i("i3GEOgraficointerativoGrafico").style.display = "none";
			};
			$i("i3GEOgraficointerativoguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia3","i3GEOgraficointerativoguia");
				$i("i3GEOgraficointerativoGrafico").style.display = "none";
			};
			$i("i3GEOgraficointerativoguia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia4","i3GEOgraficointerativoguia");
				function outputStatus(e) {
					//alert("oi");
				}
				swfobject.embedSWF(
					i3GEO.configura.locaplic+"/pacotes/openflashchart/open-flash-chart.swf",
					"i3GEOgraficointerativoGrafico",
					"95%",
					"88%",
					"9.0.0",
					"expressInstall.swf",
					{
						"get-data":"i3GEOF.graficointerativo.tabela2dados",
						"loading":"Criando grafico..."
					},
					false,
					false,
					outputStatus
				);
				var t = $i("i3GEOgraficointerativoGrafico");
				t.style.display = "block";
				t.style.position = "relative";
				t.style.top = "-5px";
				t.visibility = "visible";
			};
			$i("i3GEOgraficointerativoguia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia5","i3GEOgraficointerativoguia");
				$i("i3GEOgraficointerativoGrafico").style.display = "none";
				$i("i3GEOgraficointerativoguia5obj").innerHTML = "<textarea rows='20' cols='52' >"+(i3GEOF.graficointerativo.tabela2csv()).join("\n")+"</textarea>";
			};

			i3GEOF.graficointerativo.ativaFoco();
			i3GEOF.graficointerativo.comboTemas();
			new YAHOO.widget.Button(
				"i3GEOgraficointerativobotao1",
				{onclick:{fn: i3GEOF.graficointerativo.obterDados}}
			);
			if(i3GEOF.graficointerativo.dados && i3GEOF.graficointerativo.dados != "undefined"){
				//i3GEOF.graficointerativo.tipo = "pizza2d";
				//var retorno = {"attributes":{"id":""},"data":{"dados":["n;x","'4';3839572","'8';81710320","'7';24631314","'2';10967753","'1';24496400","'3';18752482","'5';13574480","'6';216507515"]}};
				i3GEOF.graficointerativo.montaTabelaDados(i3GEOF.graficointerativo.dados);
				$i("i3GEOgraficointerativoguia4").onclick.call();
			}
			else{
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
			}
		//}
		//catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var locaplic = i3GEO.configura.locaplic,
		ins = '' +
		'<div id=i3GEOgraficointerativoguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a  ><em><div id="i3GEOgraficointerativoguia3" style="text-align:center;left:0px;" ><img class="ticPropriedades2" style="height:14px" title="'+$trad("p13")+'" src="'+i3GEO.configura.locaplic+'/imagens/visual/default/branco.gif"></div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOgraficointerativoguia1" style="text-align:center;left:0px;" >Tipo</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOgraficointerativoguia2" style="text-align:center;left:0px;" >Dados</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOgraficointerativoguia4" style="text-align:center;left:0px;" >Gr&aacute;fico</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOgraficointerativoguia5" style="text-align:center;left:0px;" >CSV</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia1obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo >Escolha o tipo de gr&aacute;fico: </p>' +
		'	<table class=lista6 >' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-pie-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="pizza2d" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>pizza 2d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-area-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="area" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>&aacute;rea 2d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-scatter-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="scatter" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>distribui&ccedil;&atilde;o de pontos</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-line-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="line" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>linha</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-polar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="radar" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>radar</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_filled" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras simples</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_glass" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras 2 cores</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_3d" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras 3d</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_sketch" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras rascunho</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_cylinder" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras cilindro</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_cylinder_outline" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras cilindro com contorno</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_round_glass" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras c&uacute;pula</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="bar_round" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras p&iacute;lula</td></tr>' +
		'		<tr><td>&nbsp;</td></tr>' +
		'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo.ativaTipo(this)" value="hbar" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras horizontais</td></tr>' +
		'	</table>' +
		'</div> ' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia2obj" style="left:1px;display:none;top:-5px">' +
		'	<p class=paragrafo >Escolha os dados que compor&atilde;o o gr&aacute;fico: </p>' +
		'	<p class=paragrafo >Tema:</p>' +
		'	<div class=paragrafo id=i3GEOgraficointerativoComboTemas ></div>' +
		'	<div class=paragrafo id=i3GEOgraficointerativoComboXlinha >' +
		'		<p class=paragrafo >Item com as classes ou eixo X:</p>' +
		'		<div class=paragrafo id=i3GEOgraficointerativoComboX ></div>' +
		'	</div>'+
		'	<div id=i3GEOgraficointerativoComboYlinha style=display:block >'+
		'		<p class=paragrafo >Item com os valores ou eixo Y: </p>'+
		'		<div class=paragrafo id=i3GEOgraficointerativoComboY ></div>' +
		'	</div>' +
		'	<p class=paragrafo >Excluir o seguinte valor: ' +
		$inputText("","","i3GEOgraficointerativoexcluir","",3,"") +
		'	<p class=paragrafo ><input type=checkbox style="cursor:pointer;top:3px;position:relative;" id=i3GEOgraficointerativoCoresA /> gera cores aleat&oacute;rias</p>' +
		'	<p class=paragrafo ><input id=i3GEOgraficointerativobotao1 type="buttom" value="Obter dados" /></p>'+
		'	<div id=i3GEOgraficointerativoDados ></div>'+
		'	<div class=paragrafo id=i3GEOgraficointerativoAjudaPizza >Se vc escolher para X e Y o mesmo item, ser&aacute; considerada a frequ&ecirc;ncia das ocorr&ecirc;ncias para compor cada parte da pizza. Caso contr&aacute;rio, ser&aacute; feita a soma dos valores existentes em Y para cada ocorr&ecirc;ncia existente em X.</div>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia3obj" style="left:1px;display:none;top:-5px">' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoAdLinhas checked /> Adiciona as linhas em gr&aacute;ficos de barras</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoAcumula /> Utiliza valores acumulados</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoRelativa /> Utiliza valores relativos (%)</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoOrdenaX checked /> Ordena o eixo X</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativoDadosPuros /> N&atilde;o processa os valores ao obter os dados (mant&eacute;m os dados como est&atilde;o na tabela de atributos) - essa op&ccedil;&atilde;o &eacute; &uacute;til nos gr&aacute;ficos de distribui&ccedil;&atilde;o de pontos</p>' +
		'	<p class=paragrafo ><input style=cursor:pointer type=checkbox onclick="i3GEOF.graficointerativo.ativaNavegacao(this.checked)" /> Atualiza o gr&aacute;fico ao navegar pelo mapa</p>' +
		'	<p class=paragrafo ><select onchange="i3GEOF.graficointerativo.obterDados()" id="i3GEOgraficointerativoTipoAgregacao" ><option value="soma">Soma</option><option value="media">M&eacute;dia</option></select> Tipo de agrega&ccedil;&atilde;o dos valores do eixo Y</p>' +
		'</div>'+
		'<div class=guiaobj id="i3GEOgraficointerativoguia4obj" style="left:1px;display:none;top:-10px">' +
		'	<a href="#" onclick="i3GEOF.graficointerativo.novaJanela()" >abrir em uma janela separada</a>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOgraficointerativoguia5obj" style="font-size:10px;left:10px;display:none;top:-0px">' +
		'</div>' +
		'<div id="i3GEOgraficointerativoGrafico" style="position:relative;top:-5px;display:none"></div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro

	dados {JSON} - dados para o gr&aacute;fico
	*/
	iniciaJanelaFlutuante: function(dados){
		if(dados){
			i3GEOF.graficointerativo.dados = dados;
		}
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.graficointerativo.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.graficointerativo");
		};
		titulo = "&nbsp;&nbsp;&nbsp;"+$trad("t37b")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=84' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"380px",
			"310px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.graficointerativo",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			i3GEO.configura.locaplic+"/imagens/oxygen/16x16/view-statistics.png"
		);
		if(!janela){
			return;
		}
		divid = janela[2].id;
		i3GEOF.graficointerativo.aguarde = $i("i3GEOF.graficointerativo_imagemCabecalho").style;
		$i("i3GEOF.graficointerativo_corpo").style.backgroundColor = "white";
		$i("i3GEOF.graficointerativo_corpo").style.overflow = "auto";
		i3GEOF.graficointerativo.inicia(divid);
		if(i3GEO.Interface){
			temp = function(){
				if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
					i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo.obterDados()");
				}
				if(i3GEO.Interface.ATUAL == "googlemaps"){
					google.maps.event.removeListener(graficointerativoDragend);
					google.maps.event.removeListener(graficointerativoZoomend);
				}
				if(i3GEO.Interface.ATUAL === "googleearth"){
	   				google.earth.removeEventListener(graficointerativoDragend);
				}
				if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.graficointerativo.comboTemas()") > 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.graficointerativo.comboTemas()");}
			};
			YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.graficointerativo.comboTemas()") < 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.graficointerativo.comboTemas()");}
		}
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(i3GEO.Interface){
			i3GEO.barraDeBotoes.ativaIcone("graficointerativo");
		}
		var i = $i("i3GEOF.graficointerativo_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = i3GEO.janela.ULTIMOZINDEX;
	},
	novaJanela: function(){
		var janela = "",
			divid,
			g = $i("i3GEOgraficointerativoGrafico"),
			v = g.cloneNode(true),
			cabecalho = function(){},
			id = YAHOO.util.Dom.generateId(),
			minimiza = function(){
				i3GEO.janela.minimiza(id);
			},
			titulo = "&nbsp;&nbsp;&nbsp;"+i3GEOF.graficointerativo.titulo;
		janela = i3GEO.janela.cria(
			"380px",
			"280px",
			"",
			"",
			"",
			titulo,
			id,
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i(divid).style.marginTop = "0px";
		v = g.cloneNode(true);
		v.id = id+"ngrafico";
		v.style.marginTop = "0px";
		$i(divid).appendChild(v);
	},
	/*
	Function: comboTemas

	Monta o combo para escolha do tema que ser&aacute; utilizado no gr&aacute;fico
	*/
	comboTemas: function(){
		if(!i3GEO.Interface){return;}
		i3GEO.util.comboTemas(
			"i3GEOgraficointerativoComboTemasId",
			function(retorno){
				$i("i3GEOgraficointerativoComboTemas").innerHTML = retorno.dados;
				$i("i3GEOgraficointerativoComboTemas").style.display = "block";
				if ($i("i3GEOgraficointerativoComboTemasId")){
					$i("i3GEOgraficointerativoComboTemasId").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOgraficointerativoComboTemasId").value);
						i3GEOF.graficointerativo.comboItensSel();
					};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOgraficointerativoComboTemasId").value = i3GEO.temaAtivo;
					$i("i3GEOgraficointerativoComboTemasId").onchange.call();
				}
			},
			"i3GEOgraficointerativoComboTemas",
			"",
			false,
			"ligados",
			"font-size:12px;width:350px"
		);
	},
	/*
	Function: ativaTipo

	Define a vari&aacute;vel com o tipo de gr&aacute;fico e mostra a guia 2
	*/
	ativaTipo: function(obj){
		i3GEOF.graficointerativo.tipo = obj.value;
		if($i("i3GEOgraficointerativoGrafico").innerHTML === "" || $i("i3GEOgraficointerativotabeladados").innerHTML == "")
		{$i("i3GEOgraficointerativoguia2").onclick.call();}
		else
		{$i("i3GEOgraficointerativoguia4").onclick.call();}
	},
	/*
	Function: configuraDados

	Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para cada tipo de gr&aacute;fico
	*/
	configuraDados: function(){
		var ativa = function(comboxlinha,comboylinha,ajudapizza){
				try{
					$i("i3GEOgraficointerativoComboXlinha").style.display = comboxlinha;
					$i("i3GEOgraficointerativoComboYlinha").style.display = comboylinha;
					$i("i3GEOgraficointerativoAjudaPizza").style.display = ajudapizza;
				}catch(e){}
			};
		if (i3GEOF.graficointerativo.tipo === ""){
			i3GEO.janela.tempoMsg("Escolha um tipo de grafico");
			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativoguia1","i3GEOgraficointerativoguia");
			return;
		}
		if(i3GEOF.graficointerativo.tipo === "pizza2d"){
			ativa.call("block","block","block");
		}
	},
	/*
	Function: comboItensSel

	Cria um combo para selecionar os itens do tema escolhido

	Veja:

	<i3GEO.util.comboItens>
	*/
	comboItensSel: function(){
		var tema = $i("i3GEOgraficointerativoComboTemasId").value;
		i3GEO.util.comboItens(
			"i3GEOgraficointerativoComboXid",
			tema,
			function(retorno){
				if(retorno.tipo === "erro"){
		 			$i("i3GEOgraficointerativoComboX").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
		 			$i("i3GEOgraficointerativoComboY").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
		 		}
		 		else{
		 			$i("i3GEOgraficointerativoComboY").innerHTML = retorno.dados + "&nbsp;<input title='Digite o t&iacute;tulo' class=digitar type=text size=20 id=i3GEOgraficointerativoComboYidTitulo value='' />";
		 			$i("i3GEOgraficointerativoComboXid").id = "i3GEOgraficointerativoComboYid";
		 			$i("i3GEOgraficointerativoComboX").innerHTML = retorno.dados + "&nbsp;<input title='Digite o t&iacute;tulo' class=digitar type=text size=20 id=i3GEOgraficointerativoComboXidTitulo value='' />";
		 			$i("i3GEOgraficointerativoComboXid").style.width = "160px";
		 			$i("i3GEOgraficointerativoComboYid").style.width = "160px";
		 			$i("i3GEOgraficointerativoComboXid").onchange = function(){
		 				var combo = $i("i3GEOgraficointerativoComboXid");
		 				$i("i3GEOgraficointerativoComboXidTitulo").value = combo.options[combo.selectedIndex].label;
		 			};
		 			$i("i3GEOgraficointerativoComboYid").onchange = function(){
		 				var combo = $i("i3GEOgraficointerativoComboYid");
		 				$i("i3GEOgraficointerativoComboYidTitulo").value = combo.options[combo.selectedIndex].label;
		 			};
		 		}
			},
			"i3GEOgraficointerativoComboX",
			""
		);
	},
	/*
	Function: obterDados

	Obt&eacute;m os dados que ser&atilde;o utilizados no gr&aacute;fico

	Veja:

	<GRAFICOSELECAO>
	*/
	obterDados: function(){
		if(!i3GEO.Interface){
			return;
		}
		if(i3GEOF.graficointerativo.aguarde.visibility === "visible")
		{return;}
		var tema = $i("i3GEOgraficointerativoComboTemasId").value,
			x = $i("i3GEOgraficointerativoComboXid").value,
			y = $i("i3GEOgraficointerativoComboYid").value,
			excluir = $i("i3GEOgraficointerativoexcluir").value,
			p = i3GEO.configura.locaplic+"/ferramentas/graficointerativo/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficoSelecao&tema="+tema+"&itemclasses="+x+"&itemvalores="+y+"&exclui="+excluir+"&ext="+i3GEO.parametros.mapexten,
			cp = new cpaint(),
			tipo = $i("i3GEOgraficointerativoTipoAgregacao").value,
			ordenax = "sim",
			monta;

		if(i3GEOF.graficointerativo.tipo == "scatter"){
			$i("i3GEOgraficointerativoDadosPuros").checked = true;
		}
		if($i("i3GEOgraficointerativoDadosPuros").checked){
			tipo = "nenhum";
		}
		else{
			if(x === y)
			{tipo = "conta";}
		}
		if(!$i("i3GEOgraficointerativoOrdenaX").checked)
		{ordenax = "nao";}

		if(tema === "")
		{i3GEO.janela.tempoMsg("Escolha um tema");return;}
		if(x === "")
		{i3GEO.janela.tempoMsg("Escolha um item para X");return;}
		if(y === "")
		{i3GEO.janela.tempoMsg("Escolha um item para Y");return;}
		monta = function(retorno){
			i3GEOF.graficointerativo.aguarde.visibility = "hidden";
			i3GEOF.graficointerativo.montaTabelaDados(retorno);
			$i("i3GEOgraficointerativoguia4").onclick.call();
			i3GEO.janela.tempoMsg("Os dados utilizados referem-se apenas &agrave; regi&atilde;o atual mostrada no mapa");
		};
		i3GEOF.graficointerativo.aguarde.visibility = "visible";
		cp.set_response_type("JSON");
		cp.call(p+"&tipo="+tipo+"&ordenax="+ordenax,"graficoSelecao",monta);
	},
	/*
	Function: montaTabelaDados

	Monta a tabela com os dados que ser&atilde;o utilizados no gr&aacute;fico

	Parametro:

	retorno {JSON} - dados no formato JSON
	*/
	montaTabelaDados: function(retorno){
		var dados,
			n,
			v,
			ins = [],
			i,
			id,
			cor = "#C11515";
		if(!retorno.dados && retorno.data != undefined)
		{dados = retorno.data.dados;}
		else
		{dados = retorno;}
		n = dados.length;
		ins.push("<p class=paragrafo >Tabela de dados para o gr&aacute;fico. Os valores podem ser editados</p><table class=lista4 id=i3GEOgraficointerativotabeladados ><tr><td></td>");
		ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,1)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> nome</td>");
		ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo.ordenaColuna(this,2)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> valor</td>");
		ins.push("<td style=background-color:yellow >cor</td><td></td></tr>");
		for (i=1;i<n; i++){
			v = dados[i].split(";");
			v[0] = v[0].replace("'","");
			v[0] = v[0].replace("'","");
			//ins += v[0]+" "+v[1];
			id = "i3GEOgraficointerativoDados"+i; //layer+indice da classe
			ins.push("<tr><td>");
			ins.push("<img style='cursor:pointer' title='clique para excluir' onclick='i3GEOF.graficointerativo.excluilinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='excluir' /></td>");
			ins.push("</td><td>");
			ins.push($inputText("","",id+"_nome","digite o novo nome",20,v[0],"nome"));
			ins.push("</td><td>");
			ins.push($inputText("","",id+"_valor","digite o novo valor",12,v[1],"valor"));
			ins.push("</td><td>");
			if($i("i3GEOgraficointerativoCoresA").checked){
				cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
			}
			//verifica se no objeto com os dados existe um terceiro valor com as cores
			if(v[2]){
				cor = i3GEO.util.rgb2hex(v[2]);
			}
			ins.push($inputText("","",id+"_cor","",12,cor,"cor"));
			ins.push("</td><td>");
			ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo.corj(\""+id+"_cor\")' />");
			ins.push("</td></tr>");
		}
		ins.push("</table><br>");
		$i("i3GEOgraficointerativoDados").innerHTML = ins.join("");
	},
	/*
	Function: tabela2csv

	Obt&eacute;m os dados da tabela em CSV
	*/
	tabela2csv: function(){
		var inputs = $i("i3GEOgraficointerativoDados").getElementsByTagName("input"),
			ninputs = inputs.length,
			i,
			legendaX = "",
			legendaY = "",
			csv = [];
		if($i("i3GEOgraficointerativoComboXid"))
		{legendaX = $i("i3GEOgraficointerativoComboXid").value;}
		if($i("i3GEOgraficointerativoComboYid"))
		{legendaY = $i("i3GEOgraficointerativoComboYid").value;}
		csv.push(legendaX+";"+legendaY);
		for(i=0;i<ninputs;i = i + 3){
			csv.push(inputs[i].value+";"+inputs[i+1].value * 1);
		}
		return csv;
	},
	/*
	Function: tabela2dados

	Obt&eacute;m os dados da tabela para compor o gr&aacute;fico
	*/
	tabela2dados: function(){
		var temp = 0,
			ultimo = 0,
			inputs = $i("i3GEOgraficointerativoDados").getElementsByTagName("input"),
			ninputs = inputs.length,
			n,
			i,
			parametros = [],
			valores = [],
			valoresS = [],
			acumulado = [],
			acum,
			nomes = [],
			cores = [],
			indice = "",
			titulo = "",
			par = [],
			parcor = [],
			soma = 0,
			total = 0,
			menor = inputs[1].value * 1,
			maior = 0,
			menorNome = inputs[0].value * 1,
			maiorNome = 0,
			alpha = 0.8,
			stroke = 2,
			gradient = true,
			tituloSize = "15px",
			tituloCor = "#000000",
			tituloAlinhamento = "center",
			corunica = "#C11515",
			outlinecolor = "#577261",
			corGrid = "#D7E4A3",
			divisoesY = 10,
			rotacaoX = 270,
			legendaX = "",
			legendaY = "",
			fill = "#C4B86A",
			pointSize = 4;
		if($i("i3GEOgraficointerativoComboTemasId")){
			indice = $i("i3GEOgraficointerativoComboTemasId").options.selectedIndex;
			titulo = $i("i3GEOgraficointerativoComboTemasId").options[indice].text;
		}
		if(i3GEOF.graficointerativo.titulo != "")
		{titulo = i3GEOF.graficointerativo.titulo;}
		if($i("i3GEOgraficointerativoComboXid"))
		{legendaX = $i("i3GEOgraficointerativoComboXidTitulo").value;}
		if($i("i3GEOgraficointerativoComboYid"))
		{legendaY = $i("i3GEOgraficointerativoComboYidTitulo").value;}
		for(i=0;i<ninputs;i = i + 3){
			temp = inputs[i+1].value * 1;
			total += temp;
		}
		for(i=0;i<ninputs;i = i + 3){
			nomes.push(inputs[i].value+" ");
			cores.push(inputs[i+2].value);
			temp = inputs[i+1].value * 1;
			valores.push(temp);
			valoresS.push(temp+" ");
			acum = ultimo + temp;
			acumulado.push(acum);
			ultimo = ultimo + temp;
			soma += temp;
			if(temp > maior)
			{maior = temp;}
			if(temp < menor)
			{menor = temp;}
			temp = inputs[i].value * 1;
			if(temp > maiorNome)
			{maiorNome = temp;}
			if(temp < menorNome)
			{menorNome = temp;}
			par.push({"value":inputs[i+1].value * 1,"label":inputs[i].value+" "});

			temp = inputs[i+1].value * 1;
			if($i("i3GEOgraficointerativoAcumula").checked)
			{temp = acum;}
			if($i("i3GEOgraficointerativoRelativa").checked)
			{temp = (temp * 100) / total;}
			parcor.push({"colour":inputs[i+2].value,"value":temp,"label":inputs[i].value+" "});
		}
		if($i("i3GEOgraficointerativoAcumula").checked){
			valores = acumulado;
			maior = soma;
		}
		if(legendaX == legendaY){
			menor = 0;
			legendaX += " (casos)";
			legendaY += " (n. de casos)";
		}
		if($i("i3GEOgraficointerativoRelativa").checked){
			n = valores.length;
			for(i=0;i<n;i++){
				valores[i] = (valores[i] * 100) / soma;
			}
			maior = 100;
			menor = 0;
		}
		if(i3GEOF.graficointerativo.tipo === "pizza2d"){
			parametros = {
				"elements":[{
					"type":      "pie",
					"start-angle": 180,
					"colours":   cores,
					"alpha":     alpha,
					"stroke":    stroke,
					"animate":   1,
					"values" :   par,
					"tip": "#val# de #total#<br>#percent# de 100%",
					"gradient-fill": gradient
				}],
				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
	  			},
				"num_decimals": 2,
				"is_fixed_num_decimals_forced": true,
				"is_decimal_separator_comma": true,
				"is_thousand_separator_disabled": true,
				"x_axis": null
			};
		}
		if(i3GEOF.graficointerativo.tipo === "line" || i3GEOF.graficointerativo.tipo === "scatter" || i3GEOF.graficointerativo.tipo === "hbar" || i3GEOF.graficointerativo.tipo === "area" || i3GEOF.graficointerativo.tipo === "bar_round" || i3GEOF.graficointerativo.tipo === "bar_round_glass" || i3GEOF.graficointerativo.tipo === "bar_filled" || i3GEOF.graficointerativo.tipo === "bar_glass" || i3GEOF.graficointerativo.tipo === "bar_3d" || i3GEOF.graficointerativo.tipo === "bar_sketch" || i3GEOF.graficointerativo.tipo === "bar_cylinder" || i3GEOF.graficointerativo.tipo === "bar_cylinder_outline"){
			temp = valores;
			if(i3GEOF.graficointerativo.tipo === "line" || i3GEOF.graficointerativo.tipo === "scatter" || i3GEOF.graficointerativo.tipo === "area")
			{temp = parcor;}
			parametros = {
				"elements":[
				{
					"type":      i3GEOF.graficointerativo.tipo,
					"start-angle": 180,
					"colour":   corunica,
					"outlinecolor": outlinecolor,
					"alpha":     alpha,
					"stroke":    stroke,
					"animate":   1,
					"values" :   temp,
					"tip": "#val#",
					"gradient-fill": gradient,
					"fill": fill,
					"fill-alpha": alpha,
					"dot-style": { "type": "solid-dot", "colour": "#9C0E57", "dot-size": pointSize }
				}
				],
				"x_axis": {
					"colour": "#A2ACBA",
					"grid-colour": corGrid,
					"offset": true,
					"steps": 1,
					"labels": {
						"steps": 1,
						"rotate": rotacaoX,
						"colour": "#000000",
						"labels": nomes
					}
				},
				"y_axis": {
					"min": menor,
					"max": maior,
					"steps": parseInt((parseInt(maior - menor,10) / divisoesY),10)
				},
				"x_legend": {
					"text": legendaX,
					"style": "{font-size: 12px; color: #778877}"
				},
				"y_legend": {
					"text": legendaY,
					"style": "{font-size: 12px; color: #778877}"
				},
				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
	  			}
			};
			if($i("i3GEOgraficointerativoAdLinhas").checked){
				parametros.elements.push({
					"type":      "line",
					"colour":	"#FFFFFF",
					"start-angle": 180,
					"alpha":     0,
					"stroke":    0,
					"width": 0,
					"animate":   1,
					"values" :   parcor,
					"dot-style": { "type": "solid-dot", "colour": "#9C0E57", "dot-size": pointSize }
				});
			}
			if(i3GEOF.graficointerativo.tipo === "hbar"){
				n = valores.length;
				temp = [];
				for(i=0;i<n;i++){
					temp.push({"left":0,right:valores[i]});
				}
				parametros.elements[0].values = temp;

				parametros.x_axis = {
					"min": 0,
					"max": maior,
					"steps": parseInt((maior / divisoesY),10)
				};
				parametros.y_axis = {
    				"offset": 1,
    				"labels": nomes
				};
				parametros.x_legend.text = legendaY;
				parametros.y_legend.text = legendaX;
			}
			if(i3GEOF.graficointerativo.tipo === "scatter"){
				n = valores.length;
				temp = [];
				for(i=0;i<n;i++){
					temp.push({"x":nomes[i],"y":valores[i]});
				}
				parametros.elements[0].values = temp;
				parametros.x_axis = {
					"min": menor,
					"max": maior,
					"steps": parseInt(((maior - menor) / divisoesY),10)
				};
				parametros.x_axis = {
					"min": menorNome,
					"max": maiorNome,
					"steps": parseInt(((maiorNome - menorNome) / divisoesY),10)
				};
				parametros.elements[0].tip = "#x#  -  #y#";
			}
		}
		if(i3GEOF.graficointerativo.tipo === "radar"){
			parametros = {
				"elements": [{
					"type": "area",
					"width": 1,
					"dot-style": { "type": "anchor", "colour": "#9C0E57", "dot-size": pointSize },
					"colour": "#45909F",
					"fill": "#45909F",
					"fill-alpha": 0.4,
					"loop": true,
					"values": parcor
				}],
				"radar_axis": {
					"max": maior,
					"steps": parseInt(((maior - menor) / divisoesY),10),
					"colour": "#EFD1EF",
					"grid-colour": "#EFD1EF",
					"spoke-labels": {
						"labels": nomes,
						"colour": "#9F819F"
					}
				},
				"title":{
					"text": titulo,
					"style": "{font-size: "+tituloSize+"; color:"+tituloCor+"; text-align: "+tituloAlinhamento+";}"
  				},
  				"bg_colour": "#DFFFEC"
			};
		}
		return( JSON1.stringify(parametros));
	},
	/*
	Function: excluilinha

	Exclui uma linha da tabela de dados
	*/
	excluilinha: function(celula){
		var p = celula.parentNode.parentNode;
		do{
			p.removeChild(p.childNodes[0]);
		} while (p.childNodes.length > 0);
		p.parentNode.removeChild(p);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj,"hex");},
	/*
	Function: ordenaColuna

	Ordena uma coluna da tabela
	*/
	ordenaColuna: function(coluna,cid){

			var tabela = $i("i3GEOgraficointerativoDados").getElementsByTagName("table")[0],
				trs = tabela.getElementsByTagName("tr"),
				ntrs = trs.length,
				psort = [],
				t,
				psortfim,
				npsortfim,
				ins,
				p,
				e,
				temp,
				chaves = [],
				numero = false;

			function sortNumber(a,b)
			{return a - b;}

			for (t=1;t<ntrs;t++)
			{
				temp = trs[t].childNodes[cid];
				if (temp){
					psort.push(temp.childNodes[0].value);
					chaves[temp.childNodes[0].value] = t;
					if(temp.childNodes[0].value *1)
					{numero = true;}
				}
			}
			//recosntroi a tabela
			if(numero)
			{psortfim = psort.sort(sortNumber);}
			else
			{psortfim = psort.sort();}
			ins = "<tr>" + trs[0].innerHTML + "</tr>";
			npsortfim = psortfim.length;
			for (p=0;p<npsortfim;p++)
			{
				e = chaves[psortfim[p]];
				//e = psortfim[p].split("+")[1] * 1;
				if (trs[e] !== undefined)
				{ins += "<tr>" + trs[e].innerHTML + "</tr>";}
			}
			tabela.innerHTML = ins;

	},
	/*
	Function: ativaNavegacao

	Ativa ou desativa a atualiza&ccedil;&atilde;o autom&aacute;tica ao navegar no mapa
	*/
	ativaNavegacao: function(obj){
		if(!i3GEO.Interface){
			return;
		}
		if(obj === true){
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo.obterDados()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
   				graficointerativoDragend = GEvent.addListener(i3GeoMap, "dragend", function() {i3GEOF.graficointerativo.obterDados();});
   				graficointerativoZoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {i3GEOF.graficointerativo.obterDados();});
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
   				graficointerativoDragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.graficointerativo.obterDados();});
			}
		}
		else{
			if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
				i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo.obterDados()");
			}
			if(i3GEO.Interface.ATUAL === "googlemaps"){
				GEvent.removeListener(graficointerativoDragend);
				GEvent.removeListener(graficointerativoZoomend);
			}
			if(i3GEO.Interface.ATUAL === "googleearth"){
				google.earth.removeEventListener(graficointerativoDragend);
			}
		}
	}
};
//pacotes/openflashchart/json2.js
if (!this.JSON1) {
    JSON1 = function () {

        function f(n) {    // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }
        Date.prototype.toJSON = function () {
            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };
        var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
            gap = 0,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep = 0;
        function quote(string) {
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) +
                                               (c % 16).toString(16);
                }) + '"' :
                '"' + string + '"';
        }
        function str(key, holder) {
            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];
            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap + partial.join(',\n' + gap) +
                                  '\n' + mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        v = str(k, value, rep);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) +
                              '\n' + mind + '}' :
                          '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }
        return {
            stringify: function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (space) {
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
                }
                if (!replacer) {
                    rep = function (key, value) {
                        if (!Object.hasOwnProperty.call(this, key)) {
                            return undefined;
                        }
                        return value;
                    };
                } else if (typeof replacer === 'function' ||
                        (typeof replacer === 'object' &&
                         typeof replacer.length === 'number')) {
                    rep = replacer;
                } else {
                    throw new Error('JSON.stringify');
                }
                return str('', {'': value});
            },
            parse: function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            },
            quote: quote
        };
    }();
}




/*	SWFObject v2.2 <http://code.google.com/p/swfobject/>
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
