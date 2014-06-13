/*
Title: Gr&aacute;fico interativo 1

Representa&ccedil;&atilde;o gr&aacute;fica de dados. O gr&aacute;fico &eacute; constru&iacute;do tendo como base os atributos de um tema e &eacute; modificado
conforme o usu&aacute;rio navega pelo mapa. A renderiza&ccedil;&atilde;o do gr&aacute;fico &eacute; feito pelo navegador por meio do aplicativo openflashchart.
Os dados que ser&atilde;o utilizados no gr&aacute;fico s&atilde;o baseados em um elemento TABLE. Esse elemento pode ser montado com base na tabela
de atributos e editada pelo usu&aacute;rio. Os dados podem tamb&eacute;m ser inseridos como par�metros na inicializa&ccedil;&atilde;o da ferramenta,
permitindo que o gr&aacute;fico seja utilizado por outras ferramentas.

Veja:

<i3GEO.analise.dialogo.graficointerativo1>

Arquivo:

i3geo/ferramentas/graficointerativo1/index.js.php

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
if (typeof (i3GEOF) === 'undefined') {
	var i3GEOF = {};
}
/*
 * Classe: i3GEOF.graficointerativo1
 *
 */
i3GEOF.graficointerativo1 = {
		/*
		 * Variavel: aguarde
		 *
		 * Estilo do objeto DOM com a imagem de aguarde existente no
		 * cabe&ccedil;alho da janela.
		 */
		aguarde : "",
		/*
		 * Propriedade: dados
		 *
		 * Dados que serao utilizados. Pode ser passado como parametro.
		 *
		 * Default: {false}
		 */
		dados : false,
		/*
		 * Propriedade: titulo
		 *
		 * T&iacute;tulo do gr&aacute;fico. Se for vazio, ser&aacute; obtido do nome
		 * do tema selecionado
		 */
		titulo : "",
		/*
		 * Propriedade: tipo
		 *
		 * Tipo de gr&aacute;fico escolhido pelo usu&aacute;rio.
		 */
		tipo : "",
		/*
		 * Propriedade: acumula
		 *
		 * Acumula os valores ao gerar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		acumula : false,
		/*
		 * Propriedade: relativa
		 *
		 * Utiliza valores relativos ao criar o gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		relativa : false,
		/*
		 * Propriedade: dadospuros
		 *
		 * N&atilde;o faz nenhum tipo de processamento nos dados antes de gerar o
		 * gr&aacute;fico
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		dadospuros : false,
		/*
		 * Propriedade: navegacao
		 *
		 * Ativa ou n&atilde;o a navega&ccedil;&atilde;o din�mica do mapa
		 *
		 * Type: {boolean}
		 *
		 * Default: {false}
		 */
		navegacao : false,

		/*
		 * Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o
		 * tinha dicion&aacute;rio
		 */
		criaJanelaFlutuante : function(dados) {
			if (dados) {
				i3GEOF.graficointerativo1.dados = dados;
			}
			i3GEOF.graficointerativo1.iniciaDicionario();
		},
		/*
		 * Function: iniciaDicionario
		 *
		 * Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a
		 * ferramenta
		 *
		 * O Javascript &eacute; carregado com o id
		 * i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario : function(dados) {
			if (dados) {
				i3GEOF.graficointerativo1.dados = dados;
			}
			if (typeof (i3GEOF.graficointerativo1.dicionario) === 'undefined') {
				i3GEO.util.scriptTag(i3GEO.configura.locaplic
						+ "/ferramentas/graficointerativo1/dependencias.php",
						"i3GEOF.graficointerativo1.iniciaJanelaFlutuante()",
				"i3GEOF.graficointerativo1.dicionario_script");
			} else {
				i3GEOF.graficointerativo1.iniciaJanelaFlutuante(dados);
			}
		},
		/*
		 * Function: inicia
		 *
		 * Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante
		 *
		 * Parametros:
		 *
		 * iddiv {String} - id do div que receber&aacute; o conteudo HTML da
		 * ferramenta
		 *
		 * dados {JSON} - dados para o gr&aacute;fico (opcional) exemplo
		 * ["n;x","'Argentina';33796870","'Paraguay';4773464","'Brazil';151525400","'Chile';13772710"]
		 */
		inicia : function(iddiv) {
			// try{
			$i(iddiv).innerHTML += i3GEOF.graficointerativo1.html();
			$i("i3GEOgraficointerativo1Acumula").checked = i3GEOF.graficointerativo1.acumula;
			$i("i3GEOgraficointerativo1Relativa").checked = i3GEOF.graficointerativo1.relativa;
			$i("i3GEOgraficointerativo1DadosPuros").checked = i3GEOF.graficointerativo1.dadospuros;
			if (i3GEOF.graficointerativo1.navegacao === true) {
				i3GEOF.graficointerativo1.ativaNavegacao(true);
			}
			// eventos das guias

			//tipos de graficos
			$i("i3GEOgraficointerativo1guia1").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1",
				"i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			//dados para o grafico
			$i("i3GEOgraficointerativo1guia2").onclick = function() {
				if(i3GEOF.graficointerativo1.tipo === ""){
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia2","i3GEOgraficointerativo1guia");
				i3GEOF.graficointerativo1.configuraDados();
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			//propriedades adicionais
			$i("i3GEOgraficointerativo1guia3").onclick = function() {
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia3",
				"i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			//mostra o grafico
			$i("i3GEOgraficointerativo1guia4").onclick = function() {
				if(i3GEOF.graficointerativo1.tipo === ""){
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if($i("i3GEOgraficointerativo1Dados").innerHTML === ""){
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia4","i3GEOgraficointerativo1guia");
				var t = $i("i3GEOgraficointerativo1Grafico");
				t.style.display = "block";
				t.style.position = "relative";
				t.style.top = "-5px";
				t.visibility = "visible";
				i3GEOF.graficointerativo1.tabela2dados();
			};
			$i("i3GEOgraficointerativo1guia5").onclick = function() {
				if(i3GEOF.graficointerativo1.tipo === ""){
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if($i("i3GEOgraficointerativo1Dados").innerHTML === ""){
					return;
				}
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia5","i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
				$i("i3GEOgraficointerativo1guia5obj").innerHTML = "<textarea rows='20' cols='52' >"
					+ (i3GEOF.graficointerativo1.tabela2csv()).join("\n")
					+ "</textarea>";
			};
			$i("i3GEOgraficointerativo1guia6").onclick = function() {
				if(i3GEOF.graficointerativo1.tipo === ""){
					alert($trad(4, i3GEOF.graficointerativo1.dicionario));
					return;
				}
				if($i("i3GEOgraficointerativo1Dados").innerHTML === ""){
					return;
				}
				var w,h,form = $i("i3GEOgraficointerativo1PNG"),
				isvg = form.getElementsByTagName("input")[0],
				svg = $i("i3GEOgraficointerativo1guia4objCanvas").firstChild;
				h = svg.getAttributeNS(null, 'height');
				w = svg.getAttributeNS(null, 'width');
				if (typeof XMLSerializer != "undefined"){
					svg = (new XMLSerializer()).serializeToString(svg);
				} else {
					svg = svg.html();
				}
				isvg.value = svg;
				form.action = form.action+"?"+"w="+w+"&h="+h;
				form.submit();
			};
			i3GEOF.graficointerativo1.ativaFoco();
			i3GEOF.graficointerativo1.comboTemas();
			new YAHOO.widget.Button("i3GEOgraficointerativo1botao1", {
				onclick : {
					fn : i3GEOF.graficointerativo1.obterDados
				}
			});
			if (i3GEOF.graficointerativo1.dados && i3GEOF.graficointerativo1.dados != "undefined") {
				i3GEOF.graficointerativo1.montaTabelaDados(i3GEOF.graficointerativo1.dados);
				$i("i3GEOgraficointerativo1guia4").onclick.call();
			}
			else{
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1","i3GEOgraficointerativo1guia");
			}
		},
		/*
		 * Function: html
		 *
		 * Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das
		 * op&ccedil;&otilde;es da ferramenta
		 *
		 * Retorno:
		 *
		 * String com o c&oacute;digo html
		 */
		html : function() {
			var locaplic = i3GEO.configura.locaplic, ins = ''
				+ '<div id=i3GEOgraficointerativo1guiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">'
				+ '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia3" style="text-align:center;left:0px;" ><img class="ticPropriedades2" style="height:14px" title="'
				+ $trad("p13")
				+ '" src="'
				+ i3GEO.configura.locaplic
				+ '/imagens/visual/default/branco.gif"></div></em></a></li>'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia1" style="text-align:center;left:0px;" >'
				+ $trad(1, i3GEOF.graficointerativo1.dicionario)
				+ '</div></em></a></li>'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia2" style="text-align:center;left:0px;" >'
				+ $trad(2, i3GEOF.graficointerativo1.dicionario)
				+ '</div></em></a></li>'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia4" style="text-align:center;left:0px;" >'
				+ $trad(3, i3GEOF.graficointerativo1.dicionario)
				+ '</div></em></a></li>'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia5" style="text-align:center;left:0px;" >CSV'
				+ '</div></em></a></li>'
				+ '		<li><a  ><em><div id="i3GEOgraficointerativo1guia6" style="text-align:center;left:0px;" >PNG'
				+ '</div></em></a></li>'
				+ '	</ul>'
				+ '</div><br>'
				//tipos de grafico
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia1obj" style="left:1px;display:none;">'
				+ '	<p class=paragrafo >'
				+ $trad(4, i3GEOF.graficointerativo1.dicionario)
				+ ': </p>'
				+ '	<table class=lista6 >'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-pie-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="pizza_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(5, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-area-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="area_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(6, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-scatter-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="ponto_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(7, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-line-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="linha_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(8, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-bar-icon-t.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="arvore_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(9, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="bar_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(10, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '		<tr><td>&nbsp;</td></tr>'
				+ '		<tr><td><img style=cursor:text; src="'
				+ locaplic
				+ '/imagens/oxygen/22x22/Actions-office-chart-bar-icon-h.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="bar_2" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>'
				+ $trad(11, i3GEOF.graficointerativo1.dicionario)
				+ '</td></tr>'
				+ '	</table>'
				+ '</div> '
				//obtencao dos dados e parametros
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia2obj" style="left:1px;display:none;top:-5px">'
				+ '	<p class=paragrafo >'
				+ $trad(12, i3GEOF.graficointerativo1.dicionario)
				+ ': </p>'
				+ '	<p class=paragrafo >'
				+ $trad(13, i3GEOF.graficointerativo1.dicionario)
				+ ':</p>'
				+ '	<div class=paragrafo id=i3GEOgraficointerativo1ComboTemas ></div>'
				+ '	<p class=paragrafo >'
				+ $trad(50, i3GEOF.graficointerativo1.dicionario)
				+ ':<br>'
				+ $inputText("", "", "i3GEOgraficointerativo1Titulo", "", 40,"")
				+ '	<p class=paragrafo >'
				+ $trad(51, i3GEOF.graficointerativo1.dicionario)
				+ ':<br>'
				+ $inputText("", "", "i3GEOgraficointerativo1TituloX", "", 40,"")
				+ '	<p class=paragrafo >'
				+ $trad(52, i3GEOF.graficointerativo1.dicionario)
				+ ':<br>'
				+ $inputText("", "", "i3GEOgraficointerativo1TituloY", "", 40,"")

				+ '	<div class=paragrafo id=i3GEOgraficointerativo1ComboXlinha >'
				+ '		<p class=paragrafo >'
				+ $trad(14, i3GEOF.graficointerativo1.dicionario)
				+ ':</p>'
				+ '		<div class=paragrafo id=i3GEOgraficointerativo1ComboX ></div>'
				+ '	</div>'
				+ '	<div id=i3GEOgraficointerativo1ComboYlinha style=display:block >'
				+ '		<p class=paragrafo >'
				+ $trad(15, i3GEOF.graficointerativo1.dicionario)
				+ ': </p>'
				+ '		<div class=paragrafo id=i3GEOgraficointerativo1ComboY ></div>'
				+ '	</div>'
				+ '	<p class=paragrafo >'
				+ $trad(16, i3GEOF.graficointerativo1.dicionario)
				+ ': '
				+ $inputText("", "", "i3GEOgraficointerativo1excluir", "", 3,
				"")
				+ '	<p class=paragrafo ><input type=checkbox style="cursor:pointer;top:3px;position:relative;" id=i3GEOgraficointerativo1CoresA /> '
				+ $trad(17, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input id=i3GEOgraficointerativo1botao1 type="buttom" value="'
				+ $trad(18, i3GEOF.graficointerativo1.dicionario)
				+ '" /></p>'
				+ '	<div id=i3GEOgraficointerativo1Dados ></div>'
				+ '	<div class=paragrafo id=i3GEOgraficointerativo1AjudaPizza >'
				+ $trad(19, i3GEOF.graficointerativo1.dicionario)
				+ '</div>'
				+ '</div>'
				//propriedades adicionais
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia3obj" style="left:1px;display:none;top:-5px">'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1xInclinado checked /> '
				+ $trad(20, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1AdLinhas checked /> '
				+ $trad(21, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1Acumula /> '
				+ $trad(22, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1Relativa /> '
				+ $trad(23, i3GEOF.graficointerativo1.dicionario)
				+ ' (%)</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1OrdenaX checked /> '
				+ $trad(24, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1DadosPuros /> '
				+ $trad(25, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOFgraficointerativo1ativaNavegacao onclick="i3GEOF.graficointerativo1.ativaNavegacao(this.checked)" /> '
				+ $trad(47, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOFgraficointerativo1ativaStacked /> '
				+ $trad(48, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOFgraficointerativo1ativaRowsInColumns /> '
				+ $trad(49, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><select onchange="i3GEOF.graficointerativo1.obterDados()" id="i3GEOgraficointerativo1TipoAgregacao" ><option value="soma">'
				+ $trad(26, i3GEOF.graficointerativo1.dicionario)
				+ '</option><option value="media">'
				+ $trad(27, i3GEOF.graficointerativo1.dicionario)
				+ '</option></select> '
				+ $trad(28, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '	<p class=paragrafo ><input style=cursor:pointer;width:50px; value=0 type=text id=i3GEOgraficointerativo1FatorTamanho /> '
				+ $trad(29, i3GEOF.graficointerativo1.dicionario)
				+ '</p>'
				+ '</div>'
				//aqui vai o grafico
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia4obj" style="left:1px;display:none;top:-10px">'
				+ '	<a style=position:absolute;left:50px; href="#" onclick="i3GEOF.graficointerativo1.novaJanela()" >'
				+ $trad(30, i3GEOF.graficointerativo1.dicionario)
				+ '</a>'
				+ ' <img onclick="i3GEOF.graficointerativo1.alteraFatorPixel(\'menos\')" style=position:absolute; src="'+i3GEO.configura.locaplic+'/imagens/player_volta.png" />'
				+ ' <img onclick="i3GEOF.graficointerativo1.alteraFatorPixel(\'mais\')" style=position:absolute;left:20px; src="'+i3GEO.configura.locaplic+'/imagens/player_avanca.png" />'
				+ '	<div id=i3GEOgraficointerativo1guia4objCanvas style="top:15px;"></div>'
				+ '</div>'
				//csv
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia5obj" style="font-size:10px;left:10px;display:none;top:-0px">'
				+ '</div>'
				//png
				+ '<div class=guiaobj id="i3GEOgraficointerativo1guia6obj" style="font-size:10px;left:10px;display:none;top:-0px">'
				+ ' <form method=post action="'+i3GEO.configura.locaplic+'/pacotes/svg2img.php" id="i3GEOgraficointerativo1PNG" target="_blank" >'
				+ ' <input type=hidden name="svg" value="" />'
				+ ' </form>'
				+ '</div>'
				+ '<div id="i3GEOgraficointerativo1Grafico" style="position:relative;top:-5px;display:none"></div>';
			return ins;
		},
		/*
		 * Function: iniciaJanelaFlutuante
		 *
		 * Cria a janela flutuante para controle da ferramenta.
		 *
		 * Parametro
		 *
		 * dados {JSON} - dados para o gr&aacute;fico
		 */
		iniciaJanelaFlutuante : function(dados) {
			if (dados) {
				i3GEOF.graficointerativo1.dados = dados;
			}
			var minimiza, cabecalho, janela, divid, temp, titulo;
			// cria a janela flutuante
			cabecalho = function() {
				i3GEOF.graficointerativo1.ativaFoco();
			};
			minimiza = function() {
				i3GEO.janela.minimiza("i3GEOF.graficointerativo1");
			};
			mudaTamanhoGrafico = function(){
				var t = $i("i3GEOgraficointerativo1Grafico");
				if(t.style.display === "block"){
					i3GEOF.graficointerativo1.tabela2dados();
				}
			};
			titulo = "&nbsp;&nbsp;&nbsp;"
				+ $trad("t37b")
				+ " <a class=ajuda_usuario target=_blank href='"
				+ i3GEO.configura.locaplic
				+ "/ajuda_usuario.php?idcategoria=3&idajuda=84' >&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
					"480px",
					"450px", 
					"", 
					"", 
					"", 
					titulo,
					"i3GEOF.graficointerativo1", 
					false, 
					"hd", 
					cabecalho, 
					minimiza, 
					mudaTamanhoGrafico,
					true,
					i3GEO.configura.locaplic+"/imagens/oxygen/16x16/view-statistics.png"
				);
			divid = janela[2].id;
			i3GEOF.graficointerativo1.aguarde = $i("i3GEOF.graficointerativo1_imagemCabecalho").style;
			$i("i3GEOF.graficointerativo1_corpo").style.backgroundColor = "white";
			$i("i3GEOF.graficointerativo1_corpo").style.overflow = "auto";
			i3GEOF.graficointerativo1.inicia(divid);
			if (i3GEO.Interface) {
				temp = function() {
					if (i3GEO.Interface.ATUAL !== "googlemaps"
						&& i3GEO.Interface.ATUAL !== "googleearth") {
						i3GEO.eventos.NAVEGAMAPA
						.remove("i3GEOF.graficointerativo1.obterDados()");
					}
					if (i3GEO.Interface.ATUAL == "googlemaps") {
						google.maps.event.removeListener(graficointerativo1Dragend);
						google.maps.event.removeListener(graficointerativo1Zoomend);
					}
					if (i3GEO.Interface.ATUAL === "googleearth") {
						google.earth.removeEventListener(graficointerativo1Dragend);
					}
					if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search(
					"i3GEOF.graficointerativo1.comboTemas()") > 0) {
						i3GEO.eventos.ATUALIZAARVORECAMADAS
						.remove("i3GEOF.graficointerativo1.comboTemas()");
					}
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
				if (i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search(
				"i3GEOF.graficointerativo1.comboTemas()") < 0) {
					i3GEO.eventos.ATUALIZAARVORECAMADAS
					.push("i3GEOF.graficointerativo1.comboTemas()");
				}
			}
			janela[0].bringToTop();
		},
		/*
		 * Function: ativaFoco
		 *
		 * Refaz a interface da ferramenta quando a janela flutuante tem seu foco
		 * ativado
		 */
		ativaFoco : function() {
			if (i3GEO.Interface) {
				i3GEO.barraDeBotoes.ativaIcone("graficointerativo1");
			}
			var i = $i("i3GEOF.graficointerativo1_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = i3GEO.janela.ULTIMOZINDEX;
		},
		novaJanela : function() {
			var janela = "", divid, g = $i("i3GEOgraficointerativo1guia4objCanvas"), v = g
			.cloneNode(true), cabecalho = function() {
			}, id = YAHOO.util.Dom.generateId(), minimiza = function() {
				i3GEO.janela.minimiza(id);
			}, titulo = "&nbsp;&nbsp;&nbsp;" + i3GEOF.graficointerativo1.titulo;
			janela = i3GEO.janela.cria("380px", "280px", "", "", "", titulo, id,
					false, "hd", cabecalho, minimiza);
			divid = janela[2].id;
			$i(divid).style.marginTop = "0px";
			v.id = id + "ngrafico";
			v.style.marginTop = "0px";
			$i(divid).appendChild(v);
		},
		/*
		 * Function: comboTemas
		 *
		 * Monta o combo para escolha do tema que ser&aacute; utilizado no
		 * gr&aacute;fico
		 */
		comboTemas : function() {
			if (!i3GEO.Interface) {
				return;
			}
			i3GEO.util
			.comboTemas(
					"i3GEOgraficointerativo1ComboTemasId",
					function(retorno) {
						$i("i3GEOgraficointerativo1ComboTemas").innerHTML = retorno.dados;
						$i("i3GEOgraficointerativo1ComboTemas").style.display = "block";
						if ($i("i3GEOgraficointerativo1ComboTemasId")) {
							$i("i3GEOgraficointerativo1ComboTemasId").onchange = function() {
								i3GEO.mapa
								.ativaTema($i("i3GEOgraficointerativo1ComboTemasId").value);
								i3GEOF.graficointerativo1.comboItensSel();
							};
						}
						if (i3GEO.temaAtivo !== "") {
							$i("i3GEOgraficointerativo1ComboTemasId").value = i3GEO.temaAtivo;
							$i("i3GEOgraficointerativo1ComboTemasId").onchange
							.call();
						}
					}, "i3GEOgraficointerativo1ComboTemas", "", false,
					"ligados", "font-size:12px;width:350px");
		},
		/*
		 * Function: ativaTipo
		 *
		 * Define a vari&aacute;vel com o tipo de gr&aacute;fico e mostra a guia 2
		 */
		ativaTipo : function(obj) {
			if(obj){
				i3GEOF.graficointerativo1.tipo = obj.value;
			}
			if(i3GEOF.graficointerativo1.tipo == "ponto_1"){
				$i("i3GEOgraficointerativo1DadosPuros").checked = true;
			}
			else{
				$i("i3GEOgraficointerativo1DadosPuros").checked = false;
			}
			if (!$i("i3GEOgraficointerativo1tabeladados") || $i("i3GEOgraficointerativo1tabeladados").innerHTML == "") {
				$i("i3GEOgraficointerativo1guia2").onclick.call();
			} else {
				$i("i3GEOgraficointerativo1guia4").onclick.call();
			}
		},
		alteraFatorPixel: function(tipo){
			var delta = 20,
			temp = $i("i3GEOgraficointerativo1FatorTamanho"),
			v = parseInt(temp.value,10);
			if(temp.value >= 0){
				if(tipo === "mais"){
					temp.value = v + delta;
				}
				else{
					temp.value = v - delta;
				}
			}
			if(parseInt(temp.value,10) < 0){
				temp.value = 0;
			}
			$i("i3GEOgraficointerativo1guia4").onclick.call();
		},
		/*
		 * Function: configuraDados
		 *
		 * Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para
		 * cada tipo de gr&aacute;fico
		 */
		configuraDados : function() {
			var ativa = function(comboxlinha, comboylinha, ajudapizza) {
				try {
					$i("i3GEOgraficointerativo1ComboXlinha").style.display = comboxlinha;
					$i("i3GEOgraficointerativo1ComboYlinha").style.display = comboylinha;
					$i("i3GEOgraficointerativo1AjudaPizza").style.display = ajudapizza;
				} catch (e) {}
			};
			if (i3GEOF.graficointerativo1.tipo === "") {
				i3GEO.janela.tempoMsg($trad(31,
						i3GEOF.graficointerativo1.dicionario));
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1",
				"i3GEOgraficointerativo1guia");
				return;
			}
			if (i3GEOF.graficointerativo1.tipo === "pizza2d") {
				ativa.call("block", "block", "block");
			}
		},
		/*
		 * Function: comboItensSel
		 *
		 * Cria um combo para selecionar os itens do tema escolhido
		 *
		 * Veja:
		 *
		 * <i3GEO.util.comboItens>
		 */
		comboItensSel : function() {
			var adicionaFilho = function(){},
			tema = $i("i3GEOgraficointerativo1ComboTemasId").value;
			i3GEO.util
			.comboItens(
					"i3GEOgraficointerativo1ComboXid",
					tema,
					function(retorno) {
						if (retorno.tipo === "erro") {
							$i("i3GEOgraficointerativo1ComboX").innerHTML = "<br><br><span style='color:red'>"
								+ $trad(
										32,
										i3GEOF.graficointerativo1.dicionario)
										+ "</span><br><br>";
							$i("i3GEOgraficointerativo1ComboY").innerHTML = "<br><br><span style='color:red'>"
								+ $trad(
										32,
										i3GEOF.graficointerativo1.dicionario)
										+ "</span><br><br>";
						} else {
							$i("i3GEOgraficointerativo1ComboY").innerHTML = "<div>"
								+ retorno.dados
								+ "&nbsp;<input title='"
								+ $trad(33,i3GEOF.graficointerativo1.dicionario)
								+ "' class=digitar type=text size=20 id=i3GEOgraficointerativo1ComboYidTitulo value='' />"
								+ "&nbsp;<input id='i3GEOgraficointerativo1ComboYidcor' class=digitar type=text size=8 value='' />"
								+ "<img alt='aquarela.gif' style=position:relative;top:3px;left:3px;cursor:pointer src='"
								+ i3GEO.configura.locaplic
								+ "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\"i3GEOgraficointerativo1ComboYidcor\")' /></div>";

							$i("i3GEOgraficointerativo1ComboXid").id = "i3GEOgraficointerativo1ComboYid";
							$i("i3GEOgraficointerativo1ComboX").innerHTML = "<div>"
								+ retorno.dados
								+ "&nbsp;<input title='"
								+ $trad(33,	i3GEOF.graficointerativo1.dicionario)
								+ "' class=digitar type=text size=20 id=i3GEOgraficointerativo1ComboXidTitulo value='' /></div>";
							$i("i3GEOgraficointerativo1ComboXid").style.width = "160px";
							$i("i3GEOgraficointerativo1ComboYid").style.width = "160px";

							adicionaFilho = function() {
								var no = document.createElement("div"),
								id = "CorG"+parseInt(Math.random()*100000,10),
								novoselect;
								no.innerHTML = retorno.dados
								+ "&nbsp;<input title='"
								+ $trad(33,	i3GEOF.graficointerativo1.dicionario)
								+ "' class=digitar type=text size=20 value='' />"
								+ "&nbsp;<input id='"
								+ id
								+ "' class=digitar type=text size=8 value='' />"
								+ "<img alt='aquarela.gif' style=position:relative;top:3px;left:3px;cursor:pointer src='"
								+ i3GEO.configura.locaplic
								+ "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\""
								+ id
								+ "\")' /><br>";
								novoselect = no.getElementsByTagName("select")[0];
								novoselect.id = "";
								novoselect.onchange = adicionaFilho;
								novoselect.style.width = "160px";
								$i("i3GEOgraficointerativo1ComboY").appendChild(no);
							};
							$i("i3GEOgraficointerativo1ComboYid").onchange = adicionaFilho;
						}
					}, "i3GEOgraficointerativo1ComboX", "");
		},
		/*
		 * Function: obterDados
		 *
		 * Obt&eacute;m os dados que ser&atilde;o utilizados no gr&aacute;fico
		 *
		 * Veja:
		 *
		 * <GRAFICOSELECAO>
		 */
		obterDados : function() {
			if (!i3GEO.Interface) {
				return;
			}
			if (i3GEOF.graficointerativo1.aguarde.visibility === "visible") {
				return;
			}
			var tema = $i("i3GEOgraficointerativo1ComboTemasId").value, excluir = $i("i3GEOgraficointerativo1excluir").value, cp = new cpaint(), tipo = $i("i3GEOgraficointerativo1TipoAgregacao").value, ordenax = "sim", monta, p, x, y, i, n, temp;

			// pega os itens
			temp = $i("i3GEOgraficointerativo1ComboX");
			x = temp.getElementsByTagName("select")[0].value;
			temp = $i("i3GEOgraficointerativo1ComboY");
			temp = temp.getElementsByTagName("select");
			n = temp.length;
			if (n === 1) {
				y = temp[0].value;
			} else {
				y = [];
				for (i = 0; i < n; i++) {
					if (temp[i].value != "") {
						y.push(temp[i].value);
					}
				}
				y = y.join(",");
			}
			p = i3GEO.configura.locaplic
			+ "/ferramentas/graficointerativo1/exec.php?g_sid="
			+ i3GEO.configura.sid + "&funcao=graficoSelecao&tema=" + tema
			+ "&itemclasses=" + x + "&itemvalores=" + y + "&exclui="
			+ excluir + "&ext=" + i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);

			if ($i("i3GEOgraficointerativo1DadosPuros").checked) {
				tipo = "nenhum";
			} else {
				if (x === y) {
					tipo = "conta";
				}
			}
			if (!$i("i3GEOgraficointerativo1OrdenaX").checked) {
				ordenax = "nao";
			}

			if (tema === "") {
				i3GEO.janela.tempoMsg($trad(34,
						i3GEOF.graficointerativo1.dicionario));
				return;
			}
			if (x === "") {
				i3GEO.janela.tempoMsg($trad(35,
						i3GEOF.graficointerativo1.dicionario));
				return;
			}
			if (y === "") {
				i3GEO.janela.tempoMsg($trad(36,
						i3GEOF.graficointerativo1.dicionario));
				return;
			}
			monta = function(retorno) {
				i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
				i3GEOF.graficointerativo1.montaTabelaDados(retorno);
				$i("i3GEOgraficointerativo1guia4").onclick.call();
				// verifica para nao ficar mostrando a janela toda vez que redesenha
				// o mapa
				if ($i("i3GEOFgraficointerativo1ativaNavegacao").checked == false) {
					i3GEO.janela.tempoMsg($trad(37,
							i3GEOF.graficointerativo1.dicionario));
				}
			};
			i3GEOF.graficointerativo1.aguarde.visibility = "visible";
			cp.set_response_type("JSON");
			cp.call(p + "&tipo=" + tipo + "&ordenax=" + ordenax, "graficoSelecao",
					monta);
		},
		/*
		 * Pega os nomes das colunas
		 */
		nomesColunas: function(){
			//pega os nomes das clunas
			var i,n,p,
			temp = $i("i3GEOgraficointerativo1ComboX"),
			colunas,
			cores,
			alias;
			if(temp.getElementsByTagName("select")[0]){
				cores = [];
				colunas = [temp.getElementsByTagName("select")[0].value];
				alias = [temp.getElementsByTagName("input")[0].value];
			}
			else{
				//caso os dados tenham sido definidos como parametros
				colunas = ["-","-"];
				alias = colunas;
				cores = ["#29C152","#29C152"];
			}
			temp = $i("i3GEOgraficointerativo1ComboY");
			temp = temp.getElementsByTagName("select");
			n = temp.length;
			for(i=0;i<n;i++){
				if(temp[i].value != ""){
					colunas.push(temp[i].value);
					//pega o alias
					p = temp[i].parentNode.getElementsByTagName("input");
					if(p[0].value != ""){
						alias.push(p[0].value);
					}
					else{
						alias.push(temp[i].value);
					}
					if(p[1].value != ""){
						cores.push(p[1].value);
					}
					else{
						cores.push("#29C152");
					}
				}
			}
			return [colunas,alias,cores];
		},
		/*
		 * Function: montaTabelaDados
		 *
		 * Monta a tabela com os dados que ser&atilde;o utilizados no gr&aacute;fico
		 *
		 * Parametro:
		 *
		 * retorno {JSON} - dados no formato JSON
		 */
		montaTabelaDados : function(retorno) {
			var colunas = [],
			ncolunas,
			dados,
			n,
			v,
			ins = [],
			i,
			j,
			id,
			cor = "#C11515";
			if (!retorno.dados && retorno.data != undefined) {
				dados = retorno.data.dados;
			} else {
				dados = retorno;
			}
			ins.push("<p class=paragrafo >"
					+ $trad(38, i3GEOF.graficointerativo1.dicionario)
					+ "</p><table class=lista4 id=i3GEOgraficointerativo1tabeladados ><tr><td></td>");
			//pega os nomes das clunas
			colunas = i3GEOF.graficointerativo1.nomesColunas()[0];
			ncolunas = colunas.length;
			for(i=0;i<ncolunas;i++){
				ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo1.ordenaColuna(this,1)' src='"
						+ i3GEO.configura.locaplic
						+ "/imagens/ordena1.gif' title='ordena' /> "
						+ colunas[i]
						+ "</td>");
			}
			ins.push("<td style=background-color:yellow >"
					+ $trad(41, i3GEOF.graficointerativo1.dicionario)
					+ "</td><td></td></tr>");
			n = dados.length;
			for (i = 1; i < n; i++) {
				v = dados[i].split(";");
				// ins += v[0]+" "+v[1];
				id = "i3GEOgraficointerativo1Dados" + i; // layer+indice da classe
				ins.push("<tr><td>");
				ins.push("<img style='cursor:pointer' onclick='i3GEOF.graficointerativo1.excluilinha(this)' src='"
						+ i3GEO.configura.locaplic
						+ "/imagens/x.gif' title='"
						+ $trad(42, i3GEOF.graficointerativo1.dicionario)
						+ "' /></td>");
				ins.push("</td>");
				for(j=0;j<ncolunas;j++){
					v[j] = v[j].replace("'", "");
					v[j] = v[j].replace("'", "");
					ins.push("<td>");
					ins.push($inputText("", "", id + colunas[j], $trad(43,
							i3GEOF.graficointerativo1.dicionario), 20, v[j], colunas[j]));
					ins.push("</td>");
				}

				ins.push("<td>");
				if ($i("i3GEOgraficointerativo1CoresA").checked) {
					cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
				}
				// verifica se no objeto com os dados existe um terceiro valor com
				// as cores
				if (v[ncolunas + 1]) {
					cor = i3GEO.util.rgb2hex(v[ncolunas + 1]);
				}
				ins.push($inputText("", "", id + "_cor", "", 12, cor, $trad(41,
						i3GEOF.graficointerativo1.dicionario)));
				ins.push("</td><td>");
				ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"
						+ i3GEO.configura.locaplic
						+ "/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\""
						+ id + "_cor\")' />");
				ins.push("</td></tr>");
			}
			ins.push("</table><br>");
			$i("i3GEOgraficointerativo1Dados").innerHTML = ins.join("");
		},
		/*
		 * Function: tabela2csv
		 *
		 * Obt&eacute;m os dados da tabela em CSV
		 */
		tabela2csv : function() {
			var colunas = i3GEOF.graficointerativo1.nomesColunas(),
			ncolunas = colunas[0].length,
			inputs = $i("i3GEOgraficointerativo1Dados").getElementsByTagName("input"),
			ninputs = inputs.length,
			i,j,
			temp,
			csv = [];

			csv.push(colunas[0].join(";"));
			for (i = 0; i < ninputs; i = (i + 1 + ncolunas)){
				temp = [];
				for(j=0;j<ncolunas;j++){
					temp.push(inputs[i + j].value);
				}
				csv.push(temp.join(";"));
			}
			return csv;
		},
		/*
		 * Function: tabela2dados
		 *
		 * Obt&eacute;m os dados da tabela para compor o gr&aacute;fico
		 */
		tabela2dados : function() {
			if (i3GEOF.graficointerativo1.aguarde.visibility === "visible") {
				return;
			}
			i3GEOF.graficointerativo1.aguarde.visibility = "visible";
			var colunas = i3GEOF.graficointerativo1.nomesColunas(),
			ncolunas = colunas[0].length,
			temp = 0,
			ultimo = 0,
			inputs = $i("i3GEOgraficointerativo1Dados").getElementsByTagName("input"),
			ninputs = inputs.length,
			tipoColuna = "String",
			metadados = [],
			i,j,acumulado = [], acum, cores = [], par = [], total = 0,
			menor = 0, maior = 0, legendaX = "", legendaY = "", dados = {}, xInclinado = $i("i3GEOgraficointerativo1xInclinado").checked;

			if(ninputs > 0){
				menor = inputs[1].value * 1;
			}
			if ($i("i3GEOgraficointerativo1ComboTemasId")) {
				titulo = $i("i3GEOgraficointerativo1ComboTemasId").options[$i("i3GEOgraficointerativo1ComboTemasId").options.selectedIndex].text;
			}
			if (i3GEOF.graficointerativo1.titulo != "") {
				titulo = i3GEOF.graficointerativo1.titulo;
			}
			if ($i("i3GEOgraficointerativo1ComboXid")) {
				legendaX = $i("i3GEOgraficointerativo1ComboXidTitulo").value;
			}
			if ($i("i3GEOgraficointerativo1ComboYid")) {
				legendaY = $i("i3GEOgraficointerativo1ComboYidTitulo").value;
			}
			if(ncolunas === 2){
				for (i = 0; i < ninputs; i = i + 3) {
					temp = inputs[i + 1].value * 1;
					total += temp;
					cores.push(inputs[i + 2].value);
				}
				for (i = 0; i < ninputs; i = (i + 1 + ncolunas)) {
					temp = inputs[i + 1].value * 1;
					acum = ultimo + temp;
					acumulado.push(acum);
					ultimo = ultimo + temp;
					if (temp > maior) {
						maior = temp;
					}
					if (temp < menor) {
						menor = temp;
					}
					temp = inputs[i + 1].value * 1;
					if ($i("i3GEOgraficointerativo1Acumula").checked) {
						temp = acum;
					}
					if ($i("i3GEOgraficointerativo1Relativa").checked) {
						temp = (temp * 100) / total;
					}
					par.push([ inputs[i].value + " ", temp ]);
				}
				if ($i("i3GEOgraficointerativo1Acumula").checked) {
					maior = 0;
				}
			}
			else{
				total = 0;
				for (i = 0; i < ninputs; i = (i + 1 + ncolunas)){
					temp = [];
					for(j=0;j<ncolunas;j++){
						temp.push(inputs[i + j].value);
					}
					par.push(temp);
				}
				cores = colunas[2];
			}
			if (legendaX == legendaY && (legendaX != "" && legendaY != "")) {
				menor = 0;
				legendaX += " (" + $trad(45, i3GEOF.graficointerativo1.dicionario)
				+ ")";
				legendaY += " (" + $trad(46, i3GEOF.graficointerativo1.dicionario)
				+ ")";
			}

			for(j=0;j<ncolunas;j++){
				metadados.push({
					"colIndex" : j,
					"colType" : tipoColuna,
					"colName" : colunas[1][j]
				});
				tipoColuna = "Numeric";
			}
			dados = {
					"resultset" : par,
					"metadata" : metadados
			};
			switch (i3GEOF.graficointerativo1.tipo) {
			case "bar_1":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(dados, maior, cores, legendaY,
						legendaX, xInclinado, "vertical");
				break;
			case "bar_2":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(dados, maior, cores, legendaY,
						legendaX, xInclinado, "horizontal");
				break;
			case "linha_1":
				legendaX = "";
				i3GEOF.graficointerativo1.linhas(dados, maior, cores, legendaY,
						legendaX, xInclinado);
				break;
			case "pizza_1":
				legendaX = "";
				i3GEOF.graficointerativo1.pizzas(dados, maior, cores, legendaY,
						legendaX);
				break;
			case "ponto_1":
				i3GEOF.graficointerativo1.pontos(dados, maior, cores, legendaY,
						legendaX);
				break;
			case "area_1":
				legendaX = "";
				i3GEOF.graficointerativo1.areas(dados, maior, cores, legendaY,
						legendaX, xInclinado);
				break;
			case "arvore_1":
				i3GEOF.graficointerativo1.arvores(dados, maior, cores, legendaY,
						legendaX);
				break;
			default:
				//alert($trad(4, i3GEOF.graficointerativo1.dicionario));
			}
		},
		/*
		 * Function: excluilinha
		 *
		 * Exclui uma linha da tabela de dados
		 */
		excluilinha : function(celula) {
			var p = celula.parentNode.parentNode;
			do {
				p.removeChild(p.childNodes[0]);
			} while (p.childNodes.length > 0);
			p.parentNode.removeChild(p);
		},
		/*
		 * Function: corj
		 *
		 * Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
		 */
		corj : function(obj) {
			i3GEO.util.abreCor("", obj, "hex");
		},
		/*
		 * Function: ordenaColuna
		 *
		 * Ordena uma coluna da tabela
		 */
		ordenaColuna : function(coluna, cid) {
			var tabela = $i("i3GEOgraficointerativo1Dados").getElementsByTagName(
			"table")[0], trs, ntrs = 0, psort = [], t = 0, ins = "", p = 0, e, temp, chaves = [], numero = false;

			trs = tabela.getElementsByTagName("tr");
			ntrs = trs.length;

			function sortNumber(a, b) {
				return a - b;
			}
			for (t = 1; t < ntrs; t++) {
				temp = trs[t].childNodes[cid];
				if (temp) {
					psort.push(temp.childNodes[0].value);
					chaves[temp.childNodes[0].value] = t;
					if (temp.childNodes[0].value * 1) {
						numero = true;
					}
				}
			}
			// recosntroi a tabela
			if (numero === true) {
				psort = psort.sort(sortNumber);
			} else {
				psort = psort.sort();
			}
			ins = "<tr>" + trs[0].innerHTML + "</tr>";
			for (p = 0; p < psort; p++) {
				e = chaves[psort[p]];
				if (trs[e] !== undefined) {
					ins += "<tr>" + trs[e].innerHTML + "</tr>";
				}
			}
			tabela.innerHTML = ins;
		},
		/*
		 * Function: ativaNavegacao
		 *
		 * Ativa ou desativa a atualiza&ccedil;&atilde;o autom&aacute;tica ao
		 * navegar no mapa
		 */
		ativaNavegacao : function(obj) {
			if (!i3GEO.Interface) {
				return;
			}
			if (obj === true) {
				if (i3GEO.Interface.ATUAL !== "googlemaps"
					&& i3GEO.Interface.ATUAL !== "googleearth") {
					i3GEO.eventos.NAVEGAMAPA
					.push("i3GEOF.graficointerativo1.obterDados()");
				}
				if (i3GEO.Interface.ATUAL === "googlemaps") {
					graficointerativo1Dragend = GEvent.addListener(i3GeoMap,
							"dragend", function() {
						i3GEOF.graficointerativo1.obterDados();
					});
					graficointerativo1Zoomend = GEvent.addListener(i3GeoMap,
							"zoomend", function() {
						i3GEOF.graficointerativo1.obterDados();
					});
				}
				if (i3GEO.Interface.ATUAL === "googleearth") {
					graficointerativo1Dragend = google.earth.addEventListener(
							i3GeoMap.getView(), "viewchangeend", function() {
								i3GEOF.graficointerativo1.obterDados();
							});
				}
			} else {
				if (i3GEO.Interface.ATUAL !== "googlemaps"
					&& i3GEO.Interface.ATUAL !== "googleearth") {
					i3GEO.eventos.NAVEGAMAPA
					.remove("i3GEOF.graficointerativo1.obterDados()");
				}
				if (i3GEO.Interface.ATUAL === "googlemaps") {
					GEvent.removeListener(graficointerativo1Dragend);
					GEvent.removeListener(graficointerativo1Zoomend);
				}
				if (i3GEO.Interface.ATUAL === "googleearth") {
					google.earth.removeEventListener(graficointerativo1Dragend);
				}
			}
		},
		configDefault : function(dados, maior, cores, legendaY, legendaX) {
			var temp,config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
					height : parseInt($i("i3GEOF.graficointerativo1_corpo").style.height, 10) - 80,
					orthoAxisTitle : legendaY,
					valuesFont : 'normal 9px sans-serif ',
					baseAxisTitle : legendaX,
					baseAxisTitleAlign : 'center',
					tooltipEnabled : true,
					tooltipArrowVisible : true,
					tooltipFade : false,
					tooltipFollowMouse : false,
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
						return "<span style=color:yellow >" + cat + "</span><br>"
						+ format("#.###,", val);
					},
					baseAxisTitleFont : '9px sans-serif',
					yAxisTickFormatter : function(valor) {
						valor = valor + "";
						valor = format("#.###,", valor);
						return valor;
					},
					valueFormat : function(valor) {
						valor = valor + "";
						valor = format("#.###,", valor);
						return valor;
					},
					valuesAnchor : 'top',
					valuesVisible : false,
					orthoAxisOriginIsZero : false,
					titleAlign : 'center',
					titleFont:  'bold 14px sans-serif',
					baseAxisTitleFont : '12px sans-serif',
					orthoAxisTitleFont : '12px sans-serif',
					titlePosition: "top",
					orientation : 'vertical',
					baseAxisTicks : true,
					stacked : false,
					animate : true,
					hoverable : false,
					axisGrid : true,
					contentMargins : 5,
					axisOffset : 0.02,
					panelSizeRatio : 0.8,
					orthoAxisLabelSpacingMin : 2,
					selectable : false,
					extensionPoints : {
						continuousAxisTicks_strokeStyle : 'gray',
						axisGrid_strokeStyle : 'lightgray',
						xAxisLabel_textStyle : 'black',
						label_textBaseline : "bottom",
						xAxisLabel_font : 'normal 10px sans-serif'
					}
			};
			if(maior > 0){
				config.orthoAxisFixedMax = maior;
			}
			if($i("i3GEOgraficointerativo1Titulo").value != ""){
				config.title = $i("i3GEOgraficointerativo1Titulo").value;
			}
			if($i("i3GEOgraficointerativo1TituloX").value != ""){
				config.baseAxisTitle = $i("i3GEOgraficointerativo1TituloX").value;
			}
			if($i("i3GEOgraficointerativo1TituloY").value != ""){
				config.orthoAxisTitle = $i("i3GEOgraficointerativo1TituloY").value;
			}
			temp = $i("i3GEOgraficointerativo1FatorTamanho");
			if(temp && temp.value > 0){
				config.width = dados.resultset.length * temp.value;
			}
			else{
				config.width = parseInt($i("i3GEOF.graficointerativo1").style.width,10) - 20;
			}
			return config;
		},
		barras : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = true,
			sr = false,
			config = i3GEOF.graficointerativo1.configDefault(dados, maior, cores,legendaY, legendaX);
			if (tipo === "horizontal") {
				config.orientation = 'horizontal';
			}
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			if(dados.resultset[0].length > 2){
				config.stacked = $i("i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i("i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			else{
				if(cores != ""){
					config.extensionPoints.bar_fillStyle = function(d) {
						return cores[this.index];
					};
				}
			}
			new pvc.BarChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows: sr
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		linhas : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false,
			sr = false,
			config = i3GEOF.graficointerativo1.configDefault(dados, maior, cores,
					legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;

			if(dados.resultset[0].length > 2){
				config.stacked = $i("i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i("i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows: sr
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		areas : function(dados, maior, cores, legendaY, legendaX, xInclinado, tipo) {
			var ct = false,
			sr = false,
			config = i3GEOF.graficointerativo1.configDefault(dados, maior, cores,
					legendaY, legendaX);
			if (xInclinado == true) {
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI / 3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			config.areasVisible = true;

			if(dados.resultset[0].length > 2){
				config.stacked = $i("i3GEOFgraficointerativo1ativaStacked").checked;
				config.legend = true;
				ct = true;
				sr = $i("i3GEOFgraficointerativo1ativaRowsInColumns").checked;
				config.colors = cores;
			}
			new pvc.LineChart(config).setData(dados, {
				crosstabMode : ct,
				seriesInRows: sr
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		arvores : function(dados, maior, cores, legendaY, legendaX, tipo) {

			config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
							title : legendaY,
							titleFont : 'italic 14px sans-serif',
							selectable : true,
							hoverable : true,
							legend : false,
							tooltipEnabled : true,
							legendPosition : 'right',
							rootCategoryLabel : legendaX,
							tooltipFormat : function(scene) {
								var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms.size.value;
								return "<span style=color:yellow >" + cat + "</span><br>"
								+ format("#.###,", val);
							}
			};
			if(cores != ""){
				config.colors = cores;
			}
			new pvc.TreemapChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		pizzas : function(dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(dados, maior, cores,
					legendaY, legendaX);
			var config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
					animate : true,
					selectable : true,
					hoverable : true,
					valuesVisible : true,
					valuesLabelStyle : 'inside',
					valuesMask : "{category}",
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
						return "<span style=color:yellow >" + cat + "</span><br>"
						+ format("#.###,", val);
					},
					extensionPoints : {
						slice_strokeStyle : 'white'
					}
			};
			if(cores != ""){
				config.colors = cores;
			}
			new pvc.PieChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		pontos: function(dados, maior, cores, legendaY, legendaX, tipo) {
			config = i3GEOF.graficointerativo1.configDefault(dados, maior, cores,
					legendaY, legendaX);
			var config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
							animate : true,
							selectable : true,
							hoverable : true,
							valuesVisible : false,
							orthoAxisTitle : legendaY,
							valuesFont : 'normal 9px sans-serif ',
							baseAxisTitle : legendaX,
							yAxisTickFormatter : function(valor) {
								valor = valor + "";
								valor = format("#.###,", valor);
								return valor;
							},
							valueFormat : function(valor) {
								valor = valor + "";
								valor = format("#.###,", valor);
								return valor;
							},
							tooltipFormat : function(scene) {
								var cat = this.scene.datum.atoms['category'].value, val = this.scene.datum.atoms['value'].value;
								return "<span style=color:yellow >X: " + cat + "</span><br>Y: "
								+ format("#.###,", val);
							}
			};
			if(cores != ""){
				config.colors = cores;
			}
			new pvc.DotChart(config).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		}
};
