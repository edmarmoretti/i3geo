
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Gr&aacute;fico interativo 1

Representa&ccedil;&atilde;o gr&aacute;fica de dados. O gr&aacute;fico &eacute; constru&iacute;do tendo como base os atributos de um tema e &eacute; modificado
conforme o usu&aacute;rio navega pelo mapa. A renderiza&ccedil;&atilde;o do gr&aacute;fico &eacute; feito pelo navegador por meio do aplicativo openflashchart.
Os dados que ser&atilde;o utilizados no gr&aacute;fico s&atilde;o baseados em um elemento TABLE. Esse elemento pode ser montado com base na tabela
de atributos e editada pelo usu&aacute;rio. Os dados podem tamb&eacute;m ser inseridos como parâmetros na inicializa&ccedil;&atilde;o da ferramenta,
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
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.graficointerativo1

 */
i3GEOF.graficointerativo1 = {
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

	Ativa ou n&atilde;o a navega&ccedil;&atilde;o dinâmica do mapa

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
				i3GEOF.graficointerativo1.dados = dados;
			}
			i3GEOF.graficointerativo1.iniciaDicionario();
		},
		/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
		 */
		iniciaDicionario: function(dados){
			if(dados){
				i3GEOF.graficointerativo1.dados = dados;
			}
			if(typeof(i3GEOF.graficointerativo1.dicionario) === 'undefined'){
				i3GEO.util.scriptTag(
						i3GEO.configura.locaplic+"/ferramentas/graficointerativo1/dependencias.php",
						"i3GEOF.graficointerativo1.iniciaJanelaFlutuante()",
						"i3GEOF.graficointerativo1.dicionario_script"
				);
			}
			else{
				i3GEOF.graficointerativo1.iniciaJanelaFlutuante(dados);
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
			$i(iddiv).innerHTML += i3GEOF.graficointerativo1.html();
			$i("i3GEOgraficointerativo1Acumula").checked = i3GEOF.graficointerativo1.acumula;
			$i("i3GEOgraficointerativo1Relativa").checked = i3GEOF.graficointerativo1.relativa;
			$i("i3GEOgraficointerativo1DadosPuros").checked = i3GEOF.graficointerativo1.dadospuros;
			if(i3GEOF.graficointerativo1.navegacao === true)
			{i3GEOF.graficointerativo1.ativaNavegacao(true);}
			//eventos das guias
			$i("i3GEOgraficointerativo1guia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1","i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			$i("i3GEOgraficointerativo1guia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia2","i3GEOgraficointerativo1guia");
				i3GEOF.graficointerativo1.configuraDados();
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			$i("i3GEOgraficointerativo1guia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia3","i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
			};
			$i("i3GEOgraficointerativo1guia4").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia4","i3GEOgraficointerativo1guia");
				var t = $i("i3GEOgraficointerativo1Grafico"),
				dados = i3GEOF.graficointerativo1.tabela2dados();
				t.style.display = "block";
				t.style.position = "relative";
				t.style.top = "-5px";
				t.visibility = "visible";
			};
			$i("i3GEOgraficointerativo1guia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia5","i3GEOgraficointerativo1guia");
				$i("i3GEOgraficointerativo1Grafico").style.display = "none";
				$i("i3GEOgraficointerativo1guia5obj").innerHTML = "<textarea rows='20' cols='52' >"+(i3GEOF.graficointerativo1.tabela2csv()).join("\n")+"</textarea>";
			};

			i3GEOF.graficointerativo1.ativaFoco();
			i3GEOF.graficointerativo1.comboTemas();
			new YAHOO.widget.Button(
					"i3GEOgraficointerativo1botao1",
					{onclick:{fn: i3GEOF.graficointerativo1.obterDados}}
			);
			if(i3GEOF.graficointerativo1.dados && i3GEOF.graficointerativo1.dados != "undefined"){
				//i3GEOF.graficointerativo1.tipo = "pizza2d";
				//var retorno = {"attributes":{"id":""},"data":{"dados":["n;x","'4';3839572","'8';81710320","'7';24631314","'2';10967753","'1';24496400","'3';18752482","'5';13574480","'6';216507515"]}};
				i3GEOF.graficointerativo1.montaTabelaDados(i3GEOF.graficointerativo1.dados);
				$i("i3GEOgraficointerativo1guia4").onclick.call();
			}
			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1","i3GEOgraficointerativo1guia");
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
			'<div id=i3GEOgraficointerativo1guiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
			'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
			'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativo1guia3" style="text-align:center;left:0px;" ><img class="ticPropriedades2" style="height:14px" title="'+$trad("p13")+'" src="'+i3GEO.configura.locaplic+'/imagens/visual/default/branco.gif"></div></em></a></li>' +
			'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativo1guia1" style="text-align:center;left:0px;" >Tipo</div></em></a></li>' +
			'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativo1guia2" style="text-align:center;left:0px;" >Dados</div></em></a></li>' +
			'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativo1guia4" style="text-align:center;left:0px;" >Gr&aacute;fico</div></em></a></li>' +
			'		<li><a href="#ancora"><em><div id="i3GEOgraficointerativo1guia5" style="text-align:center;left:0px;" >CSV</div></em></a></li>' +
			'	</ul>' +
			'</div><br>' +
			'<div class=guiaobj id="i3GEOgraficointerativo1guia1obj" style="left:1px;display:none;">' +
			'	<p class=paragrafo >Escolha o tipo de gr&aacute;fico: </p>' +
			'	<table class=lista6 >' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-pie-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="pizza_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>pizza 2d</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-area-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="area_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>&aacute;rea simples</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-scatter-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="ponto_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>distribui&ccedil;&atilde;o de pontos</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-line-stacked-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="linha_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>linhas simples</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon-t.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="arvore_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>&Aacute;rvore</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="bar_1" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras verticais</td></tr>' +
			'		<tr><td>&nbsp;</td></tr>' +
			'		<tr><td><img style=cursor:text; src="'+locaplic+'/imagens/oxygen/22x22/Actions-office-chart-bar-icon-h.png" /></td><td><input type=radio onclick="i3GEOF.graficointerativo1.ativaTipo(this)" value="bar_2" name="tipoGrafico" style="border:0px solid white;cursor:pointer" > </td><td>barras horizontais</td></tr>' +
			'	</table>' +
			'</div> ' +
			'<div class=guiaobj id="i3GEOgraficointerativo1guia2obj" style="left:1px;display:none;top:-5px">' +
			'	<p class=paragrafo >Escolha os dados que compor&atilde;o o gr&aacute;fico: </p>' +
			'	<p class=paragrafo >Tema:</p>' +
			'	<div class=paragrafo id=i3GEOgraficointerativo1ComboTemas ></div>' +
			'	<div class=paragrafo id=i3GEOgraficointerativo1ComboXlinha >' +
			'		<p class=paragrafo >Item com as classes ou eixo X:</p>' +
			'		<div class=paragrafo id=i3GEOgraficointerativo1ComboX ></div>' +
			'	</div>'+
			'	<div id=i3GEOgraficointerativo1ComboYlinha style=display:block >'+
			'		<p class=paragrafo >Item com os valores ou eixo Y: </p>'+
			'		<div class=paragrafo id=i3GEOgraficointerativo1ComboY ></div>' +
			'	</div>' +
			'	<p class=paragrafo >Excluir o seguinte valor: ' +
			$inputText("","","i3GEOgraficointerativo1excluir","",3,"") +
			'	<p class=paragrafo ><input type=checkbox style="cursor:pointer;top:3px;position:relative;" id=i3GEOgraficointerativo1CoresA /> gera cores aleat&oacute;rias</p>' +
			'	<p class=paragrafo ><input id=i3GEOgraficointerativo1botao1 type="buttom" value="Obter dados" /></p>'+
			'	<div id=i3GEOgraficointerativo1Dados ></div>'+
			'	<div class=paragrafo id=i3GEOgraficointerativo1AjudaPizza >Se vc escolher para X e Y o mesmo item, ser&aacute; considerada a frequ&ecirc;ncia das ocorr&ecirc;ncias para compor cada parte da pizza. Caso contr&aacute;rio, ser&aacute; feita a soma dos valores existentes em Y para cada ocorr&ecirc;ncia existente em X.</div>' +
			'</div>' +
			'<div class=guiaobj id="i3GEOgraficointerativo1guia3obj" style="left:1px;display:none;top:-5px">' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1xInclinado checked /> Inclina os textos do eixo X</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1AdLinhas checked /> Adiciona as linhas em gr&aacute;ficos de barras</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1Acumula /> Utiliza valores acumulados</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1Relativa /> Utiliza valores relativos (%)</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1OrdenaX checked /> Ordena o eixo X</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOgraficointerativo1DadosPuros /> N&atilde;o processa os valores ao obter os dados (mant&eacute;m os dados como est&atilde;o na tabela de atributos) - essa op&ccedil;&atilde;o &eacute; &uacute;til nos gr&aacute;ficos de distribui&ccedil;&atilde;o de pontos</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer type=checkbox id=i3GEOFgraficointerativo1ativaNavegacao onclick="i3GEOF.graficointerativo1.ativaNavegacao(this.checked)" /> Atualiza o gr&aacute;fico ao navegar pelo mapa</p>' +
			'	<p class=paragrafo ><select onchange="i3GEOF.graficointerativo1.obterDados()" id="i3GEOgraficointerativo1TipoAgregacao" ><option value="soma">Soma</option><option value="media">M&eacute;dia</option></select> Tipo de agrega&ccedil;&atilde;o dos valores do eixo Y</p>' +
			'	<p class=paragrafo ><input style=cursor:pointer;width:50px; value=40 type=text id=i3GEOgraficointerativo1FatorTamanho /> Fator de c&aacute;lculo da largura do gr&aacute;fico. O n&uacute;mero de ocorr&ecirc;ncias ser&aacute; multiplicado por esse fator para calcular o tamanho final do gr&aacute;fico em pixels.</p>' +

			'</div>'+
			'<div class=guiaobj id="i3GEOgraficointerativo1guia4obj" style="left:1px;display:none;top:-10px">' +
			'	<a href="#" onclick="i3GEOF.graficointerativo1.novaJanela()" >abrir em uma janela separada</a>' +
			'	<div id=i3GEOgraficointerativo1guia4objCanvas ></div>' +
			'</div>' +
			'<div class=guiaobj id="i3GEOgraficointerativo1guia5obj" style="font-size:10px;left:10px;display:none;top:-0px">' +
			'</div>' +
			'<div id="i3GEOgraficointerativo1Grafico" style="position:relative;top:-5px;display:none"></div>';
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
				i3GEOF.graficointerativo1.dados = dados;
			}
			var minimiza,cabecalho,janela,divid,temp,titulo;
			//cria a janela flutuante
			cabecalho = function(){
				i3GEOF.graficointerativo1.ativaFoco();
			};
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.graficointerativo1");
			};
			titulo = "&nbsp;&nbsp;&nbsp;"+$trad("t37b")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=84' >&nbsp;&nbsp;&nbsp;</a>";
			janela = i3GEO.janela.cria(
					"380px",
					"310px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.graficointerativo1",
					false,
					"hd",
					cabecalho,
					minimiza
			);
			divid = janela[2].id;
			i3GEOF.graficointerativo1.aguarde = $i("i3GEOF.graficointerativo1_imagemCabecalho").style;
			$i("i3GEOF.graficointerativo1_corpo").style.backgroundColor = "white";
			$i("i3GEOF.graficointerativo1_corpo").style.overflow = "auto";
			i3GEOF.graficointerativo1.inicia(divid);
			if(i3GEO.Interface){
				temp = function(){
					if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
						i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo1.obterDados()");
					}
					if(i3GEO.Interface.ATUAL == "googlemaps"){
						google.maps.event.removeListener(graficointerativo1Dragend);
						google.maps.event.removeListener(graficointerativo1Zoomend);
					}
					if(i3GEO.Interface.ATUAL === "googleearth"){
						google.earth.removeEventListener(graficointerativo1Dragend);
					}
					if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.graficointerativo1.comboTemas()") > 0)
					{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.graficointerativo1.comboTemas()");}
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
				if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.graficointerativo1.comboTemas()") < 0)
				{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.graficointerativo1.comboTemas()");}
			}
		},
		/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
		 */
		ativaFoco: function(){
			if(i3GEO.Interface){
				i3GEO.barraDeBotoes.ativaIcone("graficointerativo1");
			}
			var i = $i("i3GEOF.graficointerativo1_c").style;
			i3GEO.janela.ULTIMOZINDEX++;
			i.zIndex = i3GEO.janela.ULTIMOZINDEX;
		},
		novaJanela: function(){
			var janela = "",
			divid,
			g = $i("i3GEOgraficointerativo1guia4objCanvas"),
			v = g.cloneNode(true),
			cabecalho = function(){},
			id = YAHOO.util.Dom.generateId(),
			minimiza = function(){
				i3GEO.janela.minimiza(id);
			},
			titulo = "&nbsp;&nbsp;&nbsp;"+i3GEOF.graficointerativo1.titulo;
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
					"i3GEOgraficointerativo1ComboTemasId",
					function(retorno){
						$i("i3GEOgraficointerativo1ComboTemas").innerHTML = retorno.dados;
						$i("i3GEOgraficointerativo1ComboTemas").style.display = "block";
						if ($i("i3GEOgraficointerativo1ComboTemasId")){
							$i("i3GEOgraficointerativo1ComboTemasId").onchange = function(){
								i3GEO.mapa.ativaTema($i("i3GEOgraficointerativo1ComboTemasId").value);
								i3GEOF.graficointerativo1.comboItensSel();
							};
						}
						if(i3GEO.temaAtivo !== ""){
							$i("i3GEOgraficointerativo1ComboTemasId").value = i3GEO.temaAtivo;
							$i("i3GEOgraficointerativo1ComboTemasId").onchange.call();
						}
					},
					"i3GEOgraficointerativo1ComboTemas",
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
			i3GEOF.graficointerativo1.tipo = obj.value;
			if($i("i3GEOgraficointerativo1Grafico").innerHTML === "" || $i("i3GEOgraficointerativo1tabeladados").innerHTML == "")
			{$i("i3GEOgraficointerativo1guia2").onclick.call();}
			else
			{$i("i3GEOgraficointerativo1guia4").onclick.call();}
		},
		/*
	Function: configuraDados

	Configura o formul&aacute;rio para obten&ccedil;&atilde;o dos dados para cada tipo de gr&aacute;fico
		 */
		configuraDados: function(){
			var ativa = function(comboxlinha,comboylinha,ajudapizza){
				try{
					$i("i3GEOgraficointerativo1ComboXlinha").style.display = comboxlinha;
					$i("i3GEOgraficointerativo1ComboYlinha").style.display = comboylinha;
					$i("i3GEOgraficointerativo1AjudaPizza").style.display = ajudapizza;
				}catch(e){}
			};
			if (i3GEOF.graficointerativo1.tipo === ""){
				i3GEO.janela.tempoMsg("Escolha um tipo de grafico");
				i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficointerativo1guia1","i3GEOgraficointerativo1guia");
				return;
			}
			if(i3GEOF.graficointerativo1.tipo === "pizza2d"){
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
			var tema = $i("i3GEOgraficointerativo1ComboTemasId").value;
			i3GEO.util.comboItens(
					"i3GEOgraficointerativo1ComboXid",
					tema,
					function(retorno){
						if(retorno.tipo === "erro"){
							$i("i3GEOgraficointerativo1ComboX").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
							$i("i3GEOgraficointerativo1ComboY").innerHTML = "<br><br><span style='color:red'>erro ao ler os itens do tema de origem</span><br><br>";
						}
						else{
							$i("i3GEOgraficointerativo1ComboY").innerHTML = retorno.dados + "&nbsp;<input title='Digite o t&iacute;tulo' class=digitar type=text size=20 id=i3GEOgraficointerativo1ComboYidTitulo value='' />";
							$i("i3GEOgraficointerativo1ComboXid").id = "i3GEOgraficointerativo1ComboYid";
							$i("i3GEOgraficointerativo1ComboX").innerHTML = retorno.dados + "&nbsp;<input title='Digite o t&iacute;tulo' class=digitar type=text size=20 id=i3GEOgraficointerativo1ComboXidTitulo value='' />";
							$i("i3GEOgraficointerativo1ComboXid").style.width = "160px";
							$i("i3GEOgraficointerativo1ComboYid").style.width = "160px";
							$i("i3GEOgraficointerativo1ComboXid").onchange = function(){
								var combo = $i("i3GEOgraficointerativo1ComboXid");
								$i("i3GEOgraficointerativo1ComboXidTitulo").value = combo.options[combo.selectedIndex].label;
							};
							$i("i3GEOgraficointerativo1ComboYid").onchange = function(){
								var combo = $i("i3GEOgraficointerativo1ComboYid");
								$i("i3GEOgraficointerativo1ComboYidTitulo").value = combo.options[combo.selectedIndex].label;
							};
						}
					},
					"i3GEOgraficointerativo1ComboX",
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
			if(i3GEOF.graficointerativo1.aguarde.visibility === "visible")
			{return;}
			var tema = $i("i3GEOgraficointerativo1ComboTemasId").value,
			x = $i("i3GEOgraficointerativo1ComboXid").value,
			y = $i("i3GEOgraficointerativo1ComboYid").value,
			excluir = $i("i3GEOgraficointerativo1excluir").value,
			p = i3GEO.configura.locaplic+"/ferramentas/graficointerativo1/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=graficoSelecao&tema="+tema+"&itemclasses="+x+"&itemvalores="+y+"&exclui="+excluir+"&ext="+i3GEO.parametros.mapexten,
			cp = new cpaint(),
			tipo = $i("i3GEOgraficointerativo1TipoAgregacao").value,
			ordenax = "sim",
			monta;

			if($i("i3GEOgraficointerativo1DadosPuros").checked)
			{tipo = "nenhum";}
			else{
				if(x === y)
				{tipo = "conta";}
			}
			if(!$i("i3GEOgraficointerativo1OrdenaX").checked)
			{ordenax = "nao";}

			if(tema === "")
			{i3GEO.janela.tempoMsg("Escolha um tema");return;}
			if(x === "")
			{i3GEO.janela.tempoMsg("Escolha um item para X");return;}
			if(y === "")
			{i3GEO.janela.tempoMsg("Escolha um item para Y");return;}
			monta = function(retorno){
				i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
				i3GEOF.graficointerativo1.montaTabelaDados(retorno);
				$i("i3GEOgraficointerativo1guia4").onclick.call();
				//verifica para nao ficar mostrando a janela toda vez que redesenha o mapa
				if($i("i3GEOFgraficointerativo1ativaNavegacao").checked == false){
					i3GEO.janela.tempoMsg("Os dados utilizados referem-se apenas &agrave; regi&atilde;o atual mostrada no mapa");
				}
			};
			i3GEOF.graficointerativo1.aguarde.visibility = "visible";
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
			ins.push("<p class=paragrafo >Tabela de dados para o gr&aacute;fico. Os valores podem ser editados</p><table class=lista4 id=i3GEOgraficointerativo1tabeladados ><tr><td></td>");
			ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo1.ordenaColuna(this,1)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> nome</td>");
			ins.push("<td style=background-color:yellow >&nbsp;<img style=cursor:pointer onclick='i3GEOF.graficointerativo1.ordenaColuna(this,2)' src='"+i3GEO.configura.locaplic+"/imagens/ordena1.gif' title='ordena' /> valor</td>");
			ins.push("<td style=background-color:yellow >cor</td><td></td></tr>");
			for (i=1;i<n; i++){
				v = dados[i].split(";");
				v[0] = v[0].replace("'","");
				v[0] = v[0].replace("'","");
				//ins += v[0]+" "+v[1];
				id = "i3GEOgraficointerativo1Dados"+i; //layer+indice da classe
				ins.push("<tr><td>");
				ins.push("<img style='cursor:pointer' title='clique para excluir' onclick='i3GEOF.graficointerativo1.excluilinha(this)' src='"+i3GEO.configura.locaplic+"/imagens/x.gif' title='excluir' /></td>");
				ins.push("</td><td>");
				ins.push($inputText("","",id+"_nome","digite o novo nome",20,v[0],"nome"));
				ins.push("</td><td>");
				ins.push($inputText("","",id+"_valor","digite o novo valor",12,v[1],"valor"));
				ins.push("</td><td>");
				if($i("i3GEOgraficointerativo1CoresA").checked){
					cor = i3GEO.util.rgb2hex(i3GEO.util.randomRGB());
				}
				//verifica se no objeto com os dados existe um terceiro valor com as cores
				if(v[2]){
					cor = i3GEO.util.rgb2hex(v[2]);
				}
				ins.push($inputText("","",id+"_cor","",12,cor,"cor"));
				ins.push("</td><td>");
				ins.push("<img alt='aquarela.gif' style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick='i3GEOF.graficointerativo1.corj(\""+id+"_cor\")' />");
				ins.push("</td></tr>");
			}
			ins.push("</table><br>");
			$i("i3GEOgraficointerativo1Dados").innerHTML = ins.join("");
		},
		/*
	Function: tabela2csv

	Obt&eacute;m os dados da tabela em CSV
		 */
		tabela2csv: function(){
			var inputs = $i("i3GEOgraficointerativo1Dados").getElementsByTagName("input"),
			ninputs = inputs.length,
			i,
			legendaX = "",
			legendaY = "",
			csv = [];
			if($i("i3GEOgraficointerativo1ComboXid"))
			{legendaX = $i("i3GEOgraficointerativo1ComboXid").value;}
			if($i("i3GEOgraficointerativo1ComboYid"))
			{legendaY = $i("i3GEOgraficointerativo1ComboYid").value;}
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
			if(i3GEOF.graficointerativo1.aguarde.visibility === "visible")
			{return;}
			i3GEOF.graficointerativo1.aguarde.visibility = "visible";
			var temp = 0,
			ultimo = 0,
			inputs = $i("i3GEOgraficointerativo1Dados").getElementsByTagName("input"),
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
			pointSize = 4,
			metadata = [],
			dados = {},
			xInclinado = $i("i3GEOgraficointerativo1xInclinado").checked;
			if($i("i3GEOgraficointerativo1ComboTemasId")){
				titulo = $i("i3GEOgraficointerativo1ComboTemasId").options[$i("i3GEOgraficointerativo1ComboTemasId").options.selectedIndex].text;
			}
			if(i3GEOF.graficointerativo1.titulo != "")
			{titulo = i3GEOF.graficointerativo1.titulo;}
			if($i("i3GEOgraficointerativo1ComboXid"))
			{legendaX = $i("i3GEOgraficointerativo1ComboXidTitulo").value;}
			if($i("i3GEOgraficointerativo1ComboYid"))
			{legendaY = $i("i3GEOgraficointerativo1ComboYidTitulo").value;}
			for(i=0;i<ninputs;i = i + 3){
				temp = inputs[i+1].value * 1;
				total += temp;
			}
			for(i=0;i<ninputs;i = i + 3){
				//nomes.push(inputs[i].value+" ");
				cores.push(inputs[i+2].value);
				temp = inputs[i+1].value * 1;
				//valores.push(temp);
				//valoresS.push(temp+" ");
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
				//par.push({"value":inputs[i+1].value * 1,"label":inputs[i].value+" "});
				par.push([inputs[i].value+" ",inputs[i+1].value * 1]);
				temp = inputs[i+1].value * 1;
				if($i("i3GEOgraficointerativo1Acumula").checked)
				{temp = acum;}
				if($i("i3GEOgraficointerativo1Relativa").checked)
				{temp = (temp * 100) / total;}
				//parcor.push({"colour":inputs[i+2].value,"value":temp,"label":inputs[i].value+" "});
				parcor.push([inputs[i].value+" ",temp,inputs[i+2].value]);
			}
			if($i("i3GEOgraficointerativo1Acumula").checked){
				valores = acumulado;
				maior = soma;
			}
			if(legendaX == legendaY){
				menor = 0;
				legendaX += " (casos)";
				legendaY += " (n. de casos)";
			}
			if($i("i3GEOgraficointerativo1Relativa").checked){
				n = valores.length;
				for(i=0;i<n;i++){
					valores[i] = (valores[i] * 100) / soma;
				}
				maior = 100;
				menor = 0;
			}
			dados = {
					"resultset": par,
					"metadata": [
											{"colIndex":0,"colType":"String","colName":"X"},
											{"colIndex":1,"colType":"Numeric","colName":"Y"}
											]
			};
			switch(i3GEOF.graficointerativo1.tipo){
			case "bar_1":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(dados,maior,cores,legendaY,legendaX,xInclinado,"vertical");
				break;
			case "bar_2":
				legendaX = "";
				i3GEOF.graficointerativo1.barras(dados,maior,cores,legendaY,legendaX,xInclinado,"horizontal");
				break;
			case "linha_1":
				legendaX = "";
				i3GEOF.graficointerativo1.linhas(dados,maior,cores,legendaY,legendaX,xInclinado);
				break;
			case "pizza_1":
				legendaX = "";
				i3GEOF.graficointerativo1.pizzas(dados,maior,cores,legendaY,legendaX);
				break;
			case "ponto_1":
				i3GEOF.graficointerativo1.pontos(dados,maior,cores,legendaY,legendaX);
				break;
			case "area_1":
				legendaX = "";
				i3GEOF.graficointerativo1.areas(dados,maior,cores,legendaY,legendaX,xInclinado);
				break;
			case "arvore_1":
				i3GEOF.graficointerativo1.arvores(dados,maior,cores,legendaY,legendaX);
				break;
			default:
				alert("Escolha um tipo de gr&aacute;fico");
			}
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
			try{
				var tabela = $i("i3GEOgraficointerativo1Dados").getElementsByTagName("table")[0],
				trs = tabela.getElementsByTagName("tr"),
				ntrs = trs.length,
				psort = [],
				t = 0,
				npsortfim,
				ins = "",
				p = 0,
				e,
				temp,
				chaves = [],
				numero = false;

				function sortNumber(a,b)
				{return a - b;}
				for(t=1;t<ntrs;t++){
					temp = trs[t].childNodes[cid];
					if(temp){
						psort.push(temp.childNodes[0].value);
						chaves[temp.childNodes[0].value] = t;
						if(temp.childNodes[0].value *1)
						{numero = true;}
					}
				}
				//recosntroi a tabela
				if(numero)
				{psort = psort.sort(sortNumber);}
				else
				{psort = psort.sort();}
				ins = "<tr>" + trs[0].innerHTML + "</tr>";
				npsortfim = psort.length;
				for (p=0;p<psort;p++)
				{
					e = chaves[psort[p]];
					if (trs[e] !== undefined)
					{ins += "<tr>" + trs[e].innerHTML + "</tr>";}
				}
				tabela.innerHTML = ins;
			}
			catch(e){}
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
					i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.graficointerativo1.obterDados()");
				}
				if(i3GEO.Interface.ATUAL === "googlemaps"){
					graficointerativo1Dragend = GEvent.addListener(i3GeoMap, "dragend", function() {i3GEOF.graficointerativo1.obterDados();});
					graficointerativo1Zoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {i3GEOF.graficointerativo1.obterDados();});
				}
				if(i3GEO.Interface.ATUAL === "googleearth"){
					graficointerativo1Dragend = google.earth.addEventListener(i3GeoMap.getView(), "viewchangeend", function() {i3GEOF.graficointerativo1.obterDados();});
				}
			}
			else{
				if(i3GEO.Interface.ATUAL !== "googlemaps" && i3GEO.Interface.ATUAL !== "googleearth"){
					i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.graficointerativo1.obterDados()");
				}
				if(i3GEO.Interface.ATUAL === "googlemaps"){
					GEvent.removeListener(graficointerativo1Dragend);
					GEvent.removeListener(graficointerativo1Zoomend);
				}
				if(i3GEO.Interface.ATUAL === "googleearth"){
					google.earth.removeEventListener(graficointerativo1Dragend);
				}
			}
		},
		configDefault: function(dados,maior,cores,legendaY,legendaX){
			var config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
					width : dados.resultset.length * $i("i3GEOgraficointerativo1FatorTamanho").value,
					height : parseInt($i("i3GEOF.graficointerativo1_corpo").style.height,10) - 80,
					orthoAxisTitle: legendaY,
					orthoAxisFixedMax: maior,
					valuesFont : 'normal 9px sans-serif ',
					baseAxisTitle: legendaX,
					baseAxisTitleAlign: 'left',
					tooltipEnabled : true,
					tooltipArrowVisible: true,
					tooltipFade : false,
					tooltipFollowMouse : false,
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value,
						val = this.scene.datum.atoms['value'].value;
						return "<span style=color:yellow >"+cat+"</span><br>" + format( "#.###,", val);
					},
					baseAxisTitleFont : '9px sans-serif',
					yAxisTickFormatter: function(valor){
						valor = valor+"";
						valor = format( "#.###,", valor);
						return valor;
					},
					valueFormat: function(valor){
						valor = valor+"";
						valor = format( "#.###,", valor);
						return valor;
					},
					valuesAnchor : 'top',
					valuesVisible: false,
					orthoAxisOriginIsZero:false,
					titleAlign : 'center',
					orientation: 'vertical',
					baseAxisTicks: true,
					stacked : false,
					animate : true,
					hoverable:  false,
					axisGrid:   true,
					contentMargins :5,
					axisOffset: 0.02,
					panelSizeRatio : 0.8,
					orthoAxisLabelSpacingMin : 2 ,
					selectable : false,
					extensionPoints: {
						continuousAxisTicks_strokeStyle: 'gray',
						axisGrid_strokeStyle:  'lightgray',
						xAxisLabel_textStyle: 'black',
						label_textBaseline: "bottom",
						xAxisLabel_font: 'normal 10px sans-serif'
					}
			};
			return config;
		},
		barras: function(dados,maior,cores,legendaY,legendaX,xInclinado,tipo){
			config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			config.extensionPoints.bar_fillStyle = function(d) {
				return cores[this.index];
			}
			if(tipo === "horizontal"){
				config.orientation = 'horizontal';
			}
			if(xInclinado == true){
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI/3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			new pvc.BarChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		linhas: function(dados,maior,cores,legendaY,legendaX,xInclinado,tipo){
			config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			if(xInclinado == true){
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI/3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			new pvc.LineChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		areas: function(dados,maior,cores,legendaY,legendaX,xInclinado,tipo){
			config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			if(xInclinado == true){
				config.extensionPoints.xAxisLabel_textAngle = -Math.PI/3;
				config.extensionPoints.xAxisLabel_textBaseline = 'top';
				config.extensionPoints.xAxisLabel_textAlign = 'right';
			}
			config.dotsVisible = true;
			config.areasVisible = true;
			new pvc.LineChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		arvores: function(dados,maior,cores,legendaY,legendaX,tipo){
			//config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			//config.rootCategoryLabel = legendaX;
			config = {
					canvas:     "i3GEOgraficointerativo1guia4objCanvas",
					width:      dados.resultset.length * $i("i3GEOgraficointerativo1FatorTamanho").value,
					height : parseInt($i("i3GEOF.graficointerativo1_corpo").style.height,10) - 80,
					title:      legendaY,
					titleFont:  'italic 14px sans-serif',
					selectable: true,
					hoverable:  true,
					legend:     false,
					tooltipEnabled : true,
					legendPosition: 'right',
					rootCategoryLabel: legendaX,
					colors: cores,
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value,
						val = this.scene.datum.atoms.size.value;
						return "<span style=color:yellow >"+cat+"</span><br>" + format( "#.###,", val);
					}
			};
			new pvc.TreemapChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		pizzas: function(dados,maior,cores,legendaY,legendaX,tipo){
			config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			var config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
					width : dados.resultset.length * $i("i3GEOgraficointerativo1FatorTamanho").value,
					height : parseInt($i("i3GEOF.graficointerativo1_corpo").style.height,10) - 80,
					animate:    true,
					selectable: true,
					hoverable:  true,
					valuesVisible: true,
					valuesLabelStyle: 'inside',
					valuesMask: "{category}",
					colors: cores,
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value,
						val = this.scene.datum.atoms['value'].value;
						return "<span style=color:yellow >"+cat+"</span><br>" + format( "#.###,", val);
					},
					extensionPoints: {
						slice_strokeStyle: 'white'
					}
			};
			new pvc.PieChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		},
		pontos: function(dados,maior,cores,legendaY,legendaX,tipo){
			config = i3GEOF.graficointerativo1.configDefault(dados,maior,cores,legendaY,legendaX);
			var config = {
					canvas : "i3GEOgraficointerativo1guia4objCanvas",
					width : dados.resultset.length * $i("i3GEOgraficointerativo1FatorTamanho").value,
					height : parseInt($i("i3GEOF.graficointerativo1_corpo").style.height,10) - 80,
					animate:    true,
					selectable: true,
					hoverable:  true,
					valuesVisible: false,
					colors: cores,
					orthoAxisTitle: legendaY,
					valuesFont : 'normal 9px sans-serif ',
					baseAxisTitle: legendaX,
					yAxisTickFormatter: function(valor){
						valor = valor+"";
						valor = format( "#.###,", valor);
						return valor;
					},
					valueFormat: function(valor){
						valor = valor+"";
						valor = format( "#.###,", valor);
						return valor;
					},
					tooltipFormat : function(scene) {
						var cat = this.scene.datum.atoms['category'].value,
						val = this.scene.datum.atoms['value'].value;
						return "<span style=color:yellow >X: "+cat+"</span><br>Y: " + format( "#.###,", val);
					}
			};
			new pvc.DotChart(
					config
			).setData(dados, {
				crosstabMode : false
			}).render();
			i3GEOF.graficointerativo1.aguarde.visibility = "hidden";
		}
};

