/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Configurações gerais

Arquivo:

i3geo/classesjs/classe_configura.js

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.configura

Configuração do i3geo

Vc pode alterar com esta classe a maioria dos parâmetros que controlam
o funcionamento do i3geo.

Exemplo:

i3GEO.configura.embedLegenda = "nao"

i3GEO.configura.cursores.ff = "/imagens/cursores/identifica2.png"

i3GEO.configura.cursores.ie = "/imagens/cursores/identifica2.cur"

alert(i3GEO.configura.locaplic)
*/
i3GEO.configura = {
	/*
	Propriedade: grupoLayers
	
	Lista de grupos e seus respectivos layers, para montagem da árvore de camadas.
	
	Se essa propriedade estiver definida, as camadas serão agrupadas na árvore de camadas conforme os grupos definidos.

	Por exemplo
	i3GEO.configura.grupoLayers = [
		{nome:"Grupo 1",layers:["zee","estadosl"]},
		{nome:"Grupo 2",layers:["mundo"]}
	]
	
	Type:
	{JSON}
	
	Default:
	""
	*/
	grupoLayers: "",
	/*
	Propriedade: oMenuData

	Itens incluídos no menu suspenso. Define os parâmetros para o gadget menu suspenso

	Exemplo:

	oMenuData:{

		menu:[

			{nome:$trad("s1"),id:"ajudas"}

 		],

		submenus:{

			"ajudas": [ 

			{ text: $trad("u1"), url: "http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332" },

			{ text: $trad("u2"), url: "javascript:i3GEO.ajuda.abreDoc()" }

			]

		}

	}
	
	Tipo:
	{object}
	*/
	oMenuData:{
		menu:[
			{nome:$trad("s1"),id:"ajudaMenu"},	
			{nome:$trad("s2"),id:"analise"},
 			{nome:$trad("s3"),id:"janelas"},
 			{nome:$trad("s4"),id:"arquivos"},
 			{nome:$trad("d32"),id:"interface"}
 		],
		submenus:{
			"ajudaMenu": [ 
			{ id:"omenudataAjudamenu1",text: $trad("u1"), url: "http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332", target:"_blank" },
			{ id:"omenudataAjudamenu2",text: $trad("u2"), url: "javascript:i3GEO.ajuda.abreDoc()" },
			{ id:"omenudataAjudamenu3",text: $trad("u3"), url: "http://pt.wikibooks.org/wiki/I3geo", target:"_blank" },
			{ id:"omenudataAjudamenu4",text: $trad("u4"), url: "http://www.softwarepublico.gov.br/dotlrn/clubs/i3geo/file-storage/index?folder%5fid=22667525", target:"_blank" },
			{ id:"omenudataAjudamenu5",text: $trad("u5a"), url: "http://www.softwarepublico.gov.br", target:"_blank" },
			{ id:"omenudataAjudamenu7",text: $trad("u5b"), url: "../ajuda_usuario.php", target:"_blank" },
			{ id:"omenudataAjudamenu8",text: $trad("u5c"), url: "javascript:i3GEO.ajuda.redesSociais()" }
			],
			"analise": [
    		{ id:"omenudataAnalise1",text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u22")+'</b></span>',url: "#"}, 
			{ id:"omenudataAnalise2",text: $trad("u7"), url: "javascript:i3GEO.analise.dialogo.gradePol()"},
			{ id:"omenudataAnalise3",text: $trad("u8"), url: "javascript:i3GEO.analise.dialogo.gradePontos()" },
			{ id:"omenudataAnalise4",text: $trad("u9"), url: "javascript:i3GEO.analise.dialogo.gradeHex()" },
    		{ id:"omenudataAnalise5",text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u23")+'</b></span>',url: "#"}, 
			{ id:"omenudataAnalise6",text: $trad("u11a"), url: "javascript:i3GEO.analise.dialogo.distanciaptpt()" },
			{ id:"omenudataAnalise7",text: $trad("u12"), url: "javascript:i3GEO.analise.dialogo.nptPol()" },
			{ id:"omenudataAnalise8",text: $trad("u13"), url: "javascript:i3GEO.analise.dialogo.pontoempoligono()" },
			{ id:"omenudataAnalise9",text: $trad("u14"), url: "javascript:i3GEO.analise.dialogo.pontosdistri()" },
    		{ id:"omenudataAnalise10",text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u24")+'</b></span>',url: "#"}, 
			{ id:"omenudataAnalise11",text: $trad("u25"), url: "javascript:i3GEO.analise.dialogo.dissolve()" },
    		{ id:"omenudataAnalise12",text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u27")+'</b></span>',url: "#"}, 
			{ id:"omenudataAnalise13",text: $trad("u6"), url: "javascript:i3GEO.analise.dialogo.analisaGeometrias()" },
			{ id:"omenudataAnalise14",text: $trad("u10"), url: "javascript:i3GEO.analise.dialogo.buffer()" },
			{ id:"omenudataAnalise15",text: $trad("u26"), url: "javascript:i3GEO.analise.dialogo.agrupaElementos()" },
			{ id:"omenudataAnalise16",text: $trad("u11"), url: "javascript:i3GEO.analise.dialogo.centroide()" },
			{ id:"omenudataAnalise17",text: $trad("t37"), url: "javascript:i3GEO.analise.dialogo.graficoInterativo()" },
			{ id:"omenudataAnalise18",text: $trad("d30"), url: "javascript:i3GEO.analise.dialogo.linhaDoTempo()" }
			],
			"janelas": [
			{ id:"omenudataJanelas1",text: $trad("u15"), url: "javascript:initJanelaZoom('1');initJanelaZoom('2')" },
			{ id:"omenudataJanelas2",text: $trad("u16"), url: "javascript:i3GEO.ajuda.abreJanela()" }        
			],
			"arquivos": [
			{ id:"omenudataArquivos1",text: $trad("u17"), url: "javascript:i3GEO.mapa.dialogo.salvaMapa()" },
			{ id:"omenudataArquivos2",text: $trad("u18"), url: "javascript:i3GEO.mapa.dialogo.carregaMapa()" },
			{ id:"omenudataArquivos3",text: $trad("u19"), url: "javascript:i3GEO.gadgets.quadros.listaImagens()" },
			{ id:"omenudataArquivos4",text: $trad("u20"), url: "javascript:i3GEO.mapa.dialogo.convertews()" },
			{ id:"omenudataArquivos5",text: $trad("u20a"), url: "javascript:i3GEO.mapa.dialogo.convertekml()" }
			],
			"interface": [
			{ id:"omenudataInterface1",text: "Interface normal", url: "javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/'+i3GEO.parametros.interfacePadrao+'?'+i3GEO.configura.sid" },
			{ id:"omenudataInterface2",text: "OpenLayers", url: "javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/openlayers.htm?'+i3GEO.configura.sid" },
			{ id:"omenudataInterface3",text: "Flash", url: "javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/flamingo.htm?'+i3GEO.configura.sid" },
			{ id:"omenudataInterface4",text: "Google Maps", url: "javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/googlemaps.phtml?'+i3GEO.configura.sid" },
			{ id:"omenudataInterface5",text: "Google Earth", url: "javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/googleearth.phtml?'+i3GEO.configura.sid" },
			{ id:"omenudataInterface6",text: $trad("u21"), url: "javascript:var w = window.open(i3GEO.configura.locaplic+'/geradordelinks.htm')" },
			{ id:"omenudataInterface7",text: "Serviços WMS", url: "javascript:var w = window.open(i3GEO.configura.locaplic+'/ogc.htm')" },
			{ id:"omenudataInterface8",text: "Hiperbólica", url: "javascript:var w = window.open(i3GEO.configura.locaplic+'/hiperbolica.html')" },
			{ id:"omenudataInterface9",text: "Download de dados", url: "javascript:var w = window.open(i3GEO.configura.locaplic+'/datadownload.htm')" }
			]
		}
	},
	/*
	Propriedade: tipoimagem

	Indica o tipo de filtro de imagem que está ativo.
	O filtro ativo é aplicado sobre a imagem toda a vez que o mapa é refeito.
	
	Veja <classe_imagem.php> para obter os tipos possíveis
	
	Tipo:
	{string}
	
	Default:
	{"nenhum"}
	*/
	tipoimagem: "nenhum",
	/*
	Propriedade: tipotip
	
	Tipo de tip que é mostrado na função de identificação quando o usuário estaciona o mouse sobre o mapa
	
	Tipo:
	{string}
	
	Valores:
	
	completo|simples|balao
	
	Default:
	{"balao"}
	*/
	tipotip: "balao",
	/*
	Propriedade: alturatip
	
	Altura em pixel do tip que é mostrado na função de identificação quando o usuário estaciona o mouse sobre o mapa
	
	Tipo:
	{string}
	
	Default:
	{"200px"}
	*/
	alturatip: "200px",
	/*
	Propriedade: larguratip
	
	Largura em pixel do tip que é mostrado na função de identificação quando o usuário estaciona o mouse sobre o mapa
	
	Tipo:
	{string}
	
	Default:
	{"200px"}
	*/
	larguratip: "200px",
	/*
	Propriedade: funcaoTip
	
	Função que será executada na operação de identificação quando o usuário estaciona o mouse sobre o mapa
	
	Tipo:
	{String}
	
	Default:
	{"i3GEO.mapa.dialogo.verificaTipDefault()"}
	*/
	funcaoTip: "i3GEO.mapa.dialogo.verificaTipDefault()",
	/*
	Propriedade: funcaoIdentifica
	
	Função que será executada na operação de identificação quando o usuário clica no mapa
	
	Tipo:
	{String}
	
	Default:
	{"i3GEO.mapa.dialogo.cliqueIdentificaDefault()"}
	*/
	funcaoIdentifica: "i3GEO.mapa.dialogo.cliqueIdentificaDefault()",
	/*
	Propriedade: diminuixM

	Diminui a largura do mapa em pixels no caso do navegador ser o IE.
	Valores definidos em pixel.
	
	Tipo:
	{numeric}
	
	Default:
	{13}
	*/
	diminuixM: 13,
	/*
	Propriedade: diminuixN

	Diminui a largura do mapa em pixels no caso do navegador ser o FF.
	Valores definidos em pixel.
	
	Tipo:
	{numeric}
	
	Default:
	{11}
	*/
	diminuixN: 18,
	/*
	Propriedade: diminuiyM

	Diminui a altura do mapa em pixels no caso do navegador ser o IE.
	Valores definidos em pixel.
	
	Tipo:
	{numeric}
	
	Default:
	{106}
	*/
	diminuiyM: 106,
	/*
	Propriedade: diminuiyN

	Diminui a altura do mapa em pixels no caso do navegador ser o FF.
	Valores definidos em pixel.
	
	Tipo:
	{numeric}
	
	Default:
	{103}
	*/
	diminuiyN: 103,
	/*
	Propriedade: map3d

	Variável que define o nome do map_file que possuí o layer para uso na função 3d.
	Pode ser utilizado o caminho completo, se não, busca no diretório aplicmap.

	O mapfile deve conter um layer para cálculo dos valores de Z para compor o modelo do relevo
	sobre o qual o mapa será desenhado.

	Por padrão, o i3geo utiliza o mapfile aplicmpa/3dmap.map
	
	Tipo:
	{string}
	
	Default:
	{""}
	*/
	map3d: "",
	/*
	Propriedade: embedLegenda

	Indica se a legenda deve ser incluida no corpo do mapa.

	Tipo:
	{string}
	
	Valores:
	sim|nao
	
	Default:
	{nao}
	*/
	embedLegenda: "nao",
	/*
	Propriedade: templateLegenda

	Template HTML que será utilizado na geração da legenda HTML.

	A sintaxe utilizada na montagem do template é baseado na sintaxe do próprio Mapserver.
	O HTML pode ser armazenado em i3geo/aplicmap ou em um outro endereço no servidor.
	O template serve para definir o layout da legenda que é mostrada quando a guia legenda é ativada.
	Se for definido como "", é utilizado o template i3geo/aplicmap/legenda.htm.
	
	Tipo:
	{string}
	
	Default:
	{""}
	*/
	templateLegenda: "",
	/*
	Propriedade: mashuppar
	
	Define os parâmetros que devem ser aplicados no modo mashup
	
	O modo mashup possibilita que o i3Geo seja embutido dentro de uma página HTML. Nesse
	caso, o mapa não é criado no modo convencional, que utiliza o programa i3geo/ms_criamapa.php
	A variavel mashuppar deve conter os parâmetros que são utilizados pelo programa ms_criamapa
	
	Exemplo:
	
	i3GEO.configura.mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"
	
	Tipo:
	{string}
	
	Default:
	{""}
	*/
	mashuppar: "",
	/*
	Propriedade: sid
	
	Código da seção aberta pelo i3Geo no servidor.
	
	O código é gerado na inicialização do i3Geo pelo programa ms_criamapa.php
	
	Tipo:
	{String}
	*/
	sid: "",
	/*
	Propriedade: locaplic
	
	Localização da instalação do i3geo (URI)
	
	Por default, é definida na inicialização do i3Geo

	Tipo:
	{string}
	*/
	locaplic: "",
	/*
	Propriedade: mapaRefDisplay
	
	Indica se o mapa de referência deverá ser aberto quando o i3Geo for inicializado.
	
	Tipo:
	{string}
	
	Default:
	{"block"}
	
	Valores:
	block|none
	*/
	mapaRefDisplay: "block",
	/*
	Propriedade: visual
	
	Tipo de visual que será utilizado no mapa.
	
	A lista de visuais existentes é obtida na inicialização do i3geo.
	
	Veja o diretório i3geo/imagens/visual

	Tipo:
	{String}
	
	Default:
	{default}
	*/
	visual: "default",
	/*
	Propriedade: cursores
	
	Imagens utilizadas para os cursores do mouse mostrados no mapa
	
	A manipulação dos cursores é feita com i3GEO.util.mudaCursor
	
	É possível utilizar também um dos tipos default, pointer, crosshair, help, move, text	
	
	Tipo:
	{JSON}
	*/
	cursores: {
		"identifica":
		{ff:"pointer",ie:"pointer"},
		"pan":
		{ff:"/imagens/cursores/pan.png",ie:"/imagens/cursores/pan.cur"},
		"area":
		{ff:"crosshair",ie:"crosshair"},
		"distancia":
		{ff:"crosshair",ie:"crosshair"},
		"zoom":
		{ff:"/imagens/cursores/zoom.png",ie:"/imagens/cursores/zoom.cur"},
		"contexto":
		{ff:"/imagens/cursores/contexto.png",ie:"/imagens/cursores/contexto.cur"},
		"identifica_contexto":
		{ff:"pointer",ie:"pointer"},
		"pan_contexto":
		{ff:"/imagens/cursores/pan_contexto.png",ie:"/imagens/cursores/pan_contexto.cur"},
		"zoom_contexto":
		{ff:"/imagens/cursores/zoom_contexto.png",ie:"/imagens/cursores/zoom_contexto.cur"}
	},
	/*
	Propriedade: listaDePropriedadesDoMapa
	
	Lista com as funções que são incluídas no item "Propriedades do mapa"	

	Tipo:
	{JSON}
	*/
	listaDePropriedadesDoMapa: {
		"propriedades": [
		{ text: "p2", url: "javascript:i3GEO.mapa.dialogo.tipoimagem()"},
		{ text: "p15", url: "javascript:i3GEO.mapa.dialogo.outputformat()"},		
		{ text: "p3", url: "javascript:i3GEO.mapa.dialogo.opcoesLegenda()"},
		{ text: "p4", url: "javascript:i3GEO.mapa.dialogo.opcoesEscala()"},
		{ text: "p5", url: "javascript:i3GEO.mapa.dialogo.tamanho()"},
		{ text: "p6", url: "javascript:i3GEO.navega.entorno.ativaDesativa()"},
		{ text: "p7", url: "javascript:i3GEO.mapa.ativaLogo()"},
		{ text: "p8", url: "javascript:i3GEO.mapa.dialogo.queryMap()"},
		{ text: "p9", url: "javascript:i3GEO.mapa.dialogo.corFundo()"},
		{ text: "p10", url: "javascript:i3GEO.mapa.dialogo.gradeCoord()"},
		{ text: "p12", url: "javascript:i3GEO.mapa.dialogo.autoredesenha()"}
		]
	},
	/*
	Propriedade: tempoAplicar
	
	Tempo em milisegundos que será esperado até que o mapa seja desenhado automaticamente.
	
	Utilizado no botão Aplicar, quando o usuário liga/desliga ou adiciona umtema
	
	Tipo:
	{Numeric}
	
	Default:
	{4000}
	*/
	tempoAplicar: 4000,
	/*
	Propriedade: tempoMouseParado
	
	Tempo em milisegundos que será esperado para detectar que o mouse está parado.
	
	Controla o lapso de tempo utilizado para disparar as funções que ocorrem quando o mouse está parado sobre o mapa
	
	Tipo:
	{Numeric}
	
	Default:
	{3500}
	*/
	tempoMouseParado: 2500,
	/*
	Propriedade: iniciaJanelaMensagens
	
	Inicia o i3geo com a janela de mensagens aberta ou fechada.
	
	Se o cookie g_janelaMen estiver definido, essa variável não terá efeito

	Tipo:
	{Boolean}
	
	Default:
	{true}
	*/
	iniciaJanelaMensagens: true,
	/*
	Propriedade: mostraRosaDosVentos
	
	Mostra ou não a rosa dos ventos sob o mouse quando estiver parado.

	Tipo:
	{string}
	
	Valores:
	{sim|nao}
	
	Default:
	{"nao"}
	*/	
	mostraRosaDosVentos: "nao",
	/*
	Propriedade: liberaGuias
	
	Indica se as guias serão montadas em uma janela flutuante sobre o mapa
	
	Tipo:
	{string}
	
	Valores:
	{sim|nao}
	
	Default:
	{nao}
	*/
	liberaGuias: "nao",
	/*
	Propriedade: entorno (depreciado)
	
	Define se o entorno do mapa será desenhado também
	
	O desenho do entorno permite a navegação no mapa no estilo "tiles"
	
	Observação - A navegação no estilo TILES, para  a interface padrão, foi depreciada na versão 4.4.
	Se vc desejar essa forma de navegação, utilize a interface "openlayers" (veja i3geo/aplicmap/openlayers.htm
	
	Tipo:
	{string}
	
	Valores:
	{sim|nao}
	
	Default:
	{"nao"}
	*/
	entorno: "nao",
	/*
	Propriedade: funcoesBotoes

	Objeto com a lista de funcionalidades que serão adicionadas aos botões existentes no mapa.

	Essa lista pode ser modificada antes da inicialização do mapa.

	As funcionalidades apenas são incluídas se o elemento HTML indicado em iddiv existir. Por isso, caso uma função não seja desejada, basta excluir o div do HTML utilizado no mapa.

	Tipo:
	{JSON}

	*/
	funcoesBotoes: {
		"botoes": [
		{
			//Insere a opção de zoom anterior e posterior.
			iddiv:"historicozoom",
			tipo:"",
			dica:$trad("d1"),
			constroiconteudo:'i3GEO.gadgets.mostraHistoricoZoom()'
		},
		{
			//Ativa o botão que realiza a operação de zoom para a extensão total do mapa.
			iddiv:"zoomtot",
			tipo:"",
			dica:$trad("d2"),
			funcaoonclick:function(){
				if(i3GEO.Interface.ATUAL === "openlayers"){
					i3GEO.Interface.openlayers.zoom2ext(i3GEO.parametros.extentTotal);
					return;
				}
				if(i3GEO.Interface.ATUAL === "googlemaps"){
					i3GEO.Interface.googlemaps.zoom2extent(i3GEO.parametros.extentTotal);
					return;
				}
				i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.configura.tipoimagem,i3GEO.parametros.extentTotal);
				marcadorZoom = "";
			}
		},
		{
			//Ativa o botão que realiza a operação de zoom interativo.
			iddiv:"zoomli",
			tipo:"dinamico",
			dica:$trad("d3"),
			funcaoonclick:function(){
				if(i3GEO.Interface.ATUAL === "googlemaps")
				{alert("Pressione a tecla CTRL junto com o botão esquerdo do mouse");return;}				
				var temp;
				temp = "zoom";
				if(i3GEO.Interface.ATIVAMENUCONTEXTO)
				{temp = "zoom_contexto";}
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				g_operacao='navega';
				g_tipoacao='zoomli';
				i3GEO.barraDeBotoes.ativaIcone("zoomli");
				marcadorZoom = "";
				if(i3GEO.Interface.ATUAL==="openlayers"){
					OLpanel.activateControl(OLzoom);
					return;
				}
				if(!$i("i3geoboxZoom"))
				{i3GEO.navega.zoomBox.criaBox();}				
				if(i3GEO.eventos.MOUSEDOWN.toString().search("i3GEO.navega.zoomBox.inicia()") < 0)
				{i3GEO.eventos.MOUSEDOWN.push("i3GEO.navega.zoomBox.inicia()");}
				if(i3GEO.eventos.MOUSEUP.toString().search("i3GEO.navega.zoomBox.termina()") < 0)
				{i3GEO.eventos.MOUSEUP.push("i3GEO.navega.zoomBox.termina()");}
				i3GEO.barraDeBotoes.BOTAOPADRAO = "zoomli";
			}
		},
		{
			//Ativa o botão que realiza a operação de deslocamento (pan).
			iddiv:"pan",
			tipo:"dinamico",
			dica:$trad("d4"),
			funcaoonclick:function(){
				var temp;
				g_tipoacao='pan';
				g_operacao='navega';
				i3GEO.barraDeBotoes.ativaIcone("pan");
				i3GEO.barraDeBotoes.BOTAOPADRAO = "pan";
				if(i3GEO.Interface.ATUAL === "googlemaps"){
					i3GeoMap.setOptions({draggable:true});
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pan",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
					return;
				}
				if($i(i3GEO.Interface.IDMAPA)){
					$i(i3GEO.Interface.IDMAPA).title = "";
					temp = "pan";
					if(i3GEO.Interface.ATIVAMENUCONTEXTO)
					{temp = "pan_contexto";}
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				}
				marcadorZoom = "";
				if(i3GEO.Interface.ATUAL==="openlayers"){
					OLpanel.activateControl(OLpan);
					return;
				}
				panMapaInicia = function(exy){
					var k;
					leftinicial = 0;
					topinicial = 0;
					if ($i("img") && (g_tipoacao === "pan")){
						try{
							if(arguments.length > 0){
								if(navm)
								{k = event.button;}
								else
								{k = exy.button;}
								if(k === 2){return;}
							}
						}
						catch(h){
							if(typeof(console) !== 'undefined'){console.error(h);}
						}
						g_panM = "sim";
						if($i(i3GEO.Interface.IDCORPO)){
							leftinicial = parseInt($i(i3GEO.Interface.IDCORPO).style.left,10);
							topinicial = parseInt($i(i3GEO.Interface.IDCORPO).style.top,10);
						}
						clicinicialx = objposicaocursor.imgx;
						clicinicialy = objposicaocursor.imgy;
						ddinicialx = objposicaocursor.ddx;
						ddinicialy = objposicaocursor.ddy;
						//
						//faz os cálculos para o posicionamento do box sobre o mapa de referência
						//
						boxrefObj = $i("boxref");
						if(boxrefObj){
							proporcaoBox = i3GEO.parametros.w / parseInt(boxrefObj.style.width,10);
							boxrefObjLeft = parseInt(boxrefObj.style.left,10);
							boxrefObjTop = parseInt(boxrefObj.style.top,10);
						}
					}
				};
				panMapaDesloca = function(){
					var nx,ny,l,t;
					if ($i(i3GEO.Interface.IDMAPA) && (g_panM === "sim")){
						nx = objposicaocursor.telax - leftinicial - clicinicialx;
						ny = objposicaocursor.telay - topinicial - clicinicialy;
						if (i3GEO.configura.entorno === "nao"){
							l = 0;
							if (parseInt($i("i3geo").style.left,10))
							{l = parseInt($i("i3geo").style.left,10);}
							$i(i3GEO.Interface.IDMAPA).style.left = nx - l;
							t = 0;
							if (parseInt($i("i3geo").style.top,10))
							{t = parseInt($i("i3geo").style.top,10);}
							$i(i3GEO.Interface.IDMAPA).style.top = ny - t;
							if(boxrefObj){
								boxrefObj.style.left = boxrefObjLeft - (nx / proporcaoBox);
								boxrefObj.style.top = boxrefObjTop - (ny / proporcaoBox);
							}
						}
						else{
							$left("img",i3GEO.parametros.w*-1 + nx);
							$left("imgS",i3GEO.parametros.w*-1 + nx);
							$left("imgL",i3GEO.parametros.w + nx);
							$left("imgO",i3GEO.parametros.w*-3 + nx);
							$left("imgN",i3GEO.parametros.w*-1 + nx);
							$top("img",i3GEO.parametros.h*-1 + ny);
							$top("imgS",i3GEO.parametros.h*-1 + ny);
							$top("imgL",i3GEO.parametros.h*-1 + ny);
							$top("imgN",i3GEO.parametros.h*-1 + ny);
							$top("imgO",i3GEO.parametros.h*-1 + ny);
						}
					}
				};
				panMapaTermina = function(){
					if (g_tipoacao === "pan"){
						marcadorZoom = "";
						g_panM = "nao";
						//alert(ddinicialx+","+ddinicialy+","+objposicaocursor.ddx+","+objposicaocursor.ddy)
						try{
							var f = "i3GEO.navega.timerNavega = null;if("+
								"i3GEO.navega.xy2xy('"+
									i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"',"+ddinicialx+","+ddinicialy+","+objposicaocursor.ddx+","+objposicaocursor.ddy+",'"+i3GEO.parametros.mapexten+"','"+i3GEO.configura.tipoimagem+"'"+
									") == false"+
								"){"+
									"i3GEO.navega.zoompontoIMG('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"',"+objposicaocursor.imgx+","+objposicaocursor.imgy+")"+
								"}";
							clearTimeout(i3GEO.navega.timerNavega);
							i3GEO.navega.timerNavega = setTimeout(f,i3GEO.navega.TEMPONAVEGAR);
						}
						catch(e){
							if(typeof(console) !== 'undefined'){console.error(e);}
						}
					}
				};
				if(i3GEO.eventos.MOUSEDOWN.toString().search("panMapaInicia()") < 0)
				{i3GEO.eventos.MOUSEDOWN.push("panMapaInicia()");}
				if(i3GEO.eventos.MOUSEMOVE.toString().search("panMapaDesloca()") < 0)
				{i3GEO.eventos.MOUSEMOVE.push("panMapaDesloca()");}
				if(i3GEO.eventos.MOUSEUP.toString().search("panMapaTermina()") < 0)
				{i3GEO.eventos.MOUSEUP.push("panMapaTermina()");}
			}
		},
		{
			//botão que realiza a operação de zoom in.
			iddiv:"zoomiauto",
			tipo:"",
			dica:$trad("d5"),
			funcaoonclick:function(){
				i3GEO.navega.zoomin(i3GEO.configura.locaplic,i3GEO.configura.sid);
				marcadorZoom = '';
			}
		},
		{
			//botão que realiza a operação de zoom out
			iddiv:"zoomoauto",
			tipo:"",
			dica:$trad("d6"),
			funcaoonclick:function(){
				i3GEO.navega.zoomout(i3GEO.configura.locaplic,i3GEO.configura.sid);
				marcadorZoom = "";
			}
		},
		{
			//botão que abre a função de identificação.
			iddiv:"identifica",
			tipo:"dinamico",
			dica:$trad("d7"),
			funcaoonclick:function()
			{
				var temp;
				if($i(i3GEO.Interface.IDMAPA)){
					$i(i3GEO.Interface.IDMAPA).title = "";
					temp = "identifica";
					if(i3GEO.Interface.ATIVAMENUCONTEXTO && i3GEO.Interface.ATUAL !== "googlemaps")
					{temp = "identifica_contexto";}
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				}
				i3GEO.barraDeBotoes.ativaIcone("identifica");
				g_tipoacao='identifica';
				g_operacao='identifica';
				i3GEO.barraDeBotoes.BOTAOPADRAO = "identifica";
				cliqueIdentifica = function(){
					if (g_operacao === "identifica"){
						eval(i3GEO.configura.funcaoIdentifica);
					}
				};
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueIdentifica()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("cliqueIdentifica()");}
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("verificaTip()") > 0)
				{i3GEO.eventos.MOUSECLIQUE.remove("verificaTip()");}
				if(i3GEO.eventos.MOUSEPARADO.toString().search("verificaTip()") > 0)
				{i3GEO.eventos.MOUSEPARADO.remove("verificaTip()");}
			}
		},
		{
			//botão que abre a função de identificação do tipo balao.
			iddiv:"identificaBalao",
			tipo:"dinamico",
			dica:$trad("d7a"),
			funcaoonclick:function()
			{
				if(i3GEO.arvoreDeCamadas.filtraCamadas("etiquetas","","diferente",i3GEO.arvoreDeCamadas.CAMADAS) == "")
				{alert($trad("d31"));return;}
				var temp;
				if($i(i3GEO.Interface.IDMAPA)){
					$i(i3GEO.Interface.IDMAPA).title = "";
					temp = "identifica";
					if(i3GEO.Interface.ATIVAMENUCONTEXTO)
					{temp = "identifica_contexto";}
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				}
				i3GEO.barraDeBotoes.ativaIcone("identificaBalao");
				g_tipoacao='identifica';
				g_operacao='identifica';
				i3GEO.barraDeBotoes.BOTAOPADRAO = "identificaBalao";
				verificaTip = function(){
					if(g_operacao !== "identifica" || i3GEOF.identifica){return;}
					if($i("marcaIdentifica")){return;}
					//funcao default para pegar os dados
					if (g_operacao === "identifica"){
						eval(i3GEO.configura.funcaoTip);
					}
				};
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueIdentifica()") > 0)
				{i3GEO.eventos.MOUSECLIQUE.remove("cliqueIdentifica()");}				
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("verificaTip()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("verificaTip()");}
				if(i3GEO.eventos.MOUSEPARADO.toString().search("verificaTip()") < 0)
				{i3GEO.eventos.MOUSEPARADO.push("verificaTip()");}
			}
		},
		{
			//botão que abre a janela com o valor da extensão geográfica do mapa atual
			iddiv:"exten",
			tipo:"",
			dica:$trad("d8"),
			funcaoonclick:function()
			{i3GEO.mapa.dialogo.mostraExten();}
		},
		{
			//botão que abre a janela com o mapa de referência
			iddiv:"referencia",
			tipo:"",
			dica:$trad("d9"),
			funcaoonclick:function()
			{i3GEO.maparef.inicia();}
		},
		{
			//botão de busca na wikipedia
			iddiv:"wiki",
			tipo:"",
			dica:$trad("d11"),
			funcaoonclick:function()
			{i3GEO.navega.dialogo.wiki();}
		},
		{
			//botão de busca na rede metar
			iddiv:"metar",
			tipo:"",
			dica:$trad("d29"),
			funcaoonclick:function()
			{i3GEO.navega.dialogo.metar();}
		},
		{
			//botão de busca de fotos
			iddiv:"buscafotos",
			tipo:"",
			dica:"Fotos",
			funcaoonclick:function()
			{i3GEO.navega.dialogo.buscaFotos();}
		},
		{
			//botão de impressão
			iddiv:"imprimir",
			tipo:"",
			dica:$trad("d12"),
			funcaoonclick:function()
			{i3GEO.mapa.dialogo.imprimir();}
		},
		{
			//botão de localização do usuário pelo IP
			iddiv:"ondeestou",
			tipo:"",
			dica:$trad("d13"),
			funcaoonclick:function()
			{i3GEO.navega.zoomIP(i3GEO.configura.locaplic,i3GEO.configura.sid);}
		},
		{
			//abre a opção de geração de um modelo virtual de elevação
			iddiv:"v3d",
			tipo:"",
			dica:$trad("d14"),
			funcaoonclick:function()
			{i3GEO.mapa.dialogo.t3d();}
		},
		{
			iddiv:"google",
			tipo:"",
			dica:$trad("d15"),
			funcaoonclick:function()
			{i3GEO.navega.dialogo.google();}
		},
		{
			//Ativa o botão que realiza a operação de de busca no site Scielo
			//depreciado
			iddiv:"scielo",
			tipo:"",
			dica:$trad("d16"),
			funcaoonclick:function(){
				scieloAtivo = false;//esta variável é utilizada pela ferramenta durante a navegação no mapa. Se estiver true significa que a ferramenta está sendo atualizada durante um processo de navegação no mapa				
				g_operacao = "navega";
				i3GEO.janela.cria("450px","190px",i3GEO.configura.locaplic+"/ferramentas/scielo/index.htm","","","Scielo");
				atualizascielo = function(){
					var docel;
					try{
						docel = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
						if (docel.getElementById("resultadoscielo"))
						{$i("wdocai").src = i3GEO.configura.locaplic+"/ferramentas/scielo/index.htm";}
						else{
							i3GEO.eventos.NAVEGAMAPA.remove("atualizascielo()");
							if(i3GEO.Interface.ATUAL === "googlemaps"){
								GEvent.removeListener(scieloDragend);
								GEvent.removeListener(scieloZoomend);
							}
						}
					}
					catch(e){scieloAtivo = false;i3GEO.eventos.NAVEGAMAPA.remove("atualizascielo()");}
				};
				if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizascielo()") < 0){
					i3GEO.eventos.NAVEGAMAPA.push("atualizascielo()");
					if(i3GEO.Interface.ATUAL === "googlemaps"){
   						scieloDragend = GEvent.addListener(i3GeoMap, "dragend", function() {atualizascielo();});
   						scieloZoomend = GEvent.addListener(i3GeoMap, "zoomend", function() {atualizascielo();});						
					}
				}
			}
		},
		{
			//Ativa o botão que realiza a operação de de busca no site confluence
			iddiv:"confluence",
			tipo:"",
			dica:$trad("d17"),	
			funcaoonclick:function()
			{i3GEO.navega.dialogo.confluence();}
		},
		{
			//Ativa o botão que abre a lente de aumento
			iddiv:"lentei",
			tipo:"",
			dica:$trad("d18"),
			funcaoonclick:function(){
				if (i3GEO.navega.lente.ESTAATIVA === "nao")
				{i3GEO.navega.lente.inicia();}
				else
				{i3GEO.navega.lente.desativa();}
			}
		},
		{
			//Coloca as guias em uma janela móvel
			iddiv:"encolheFerramentas",
			tipo:"",
			dica:$trad("d19"),
			funcaoonclick:function()
			{i3GEO.guias.libera();}
		},
		{
			//botão de reinicialização do mapa que restaura as condições iniciais do mapa
			iddiv:"reinicia",
			tipo:"",
			dica:$trad("d20"),
			funcaoonclick:function(){
				i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
				var temp = function(){
					var url = (window.location.href.split("?"));
					window.location.href = url[0]+"?"+i3GEO.configura.sid;
				};
				i3GEO.php.reiniciaMapa(temp);
			}
		},
		{
			//botão de medição de distâncias
			iddiv:"mede",
			tipo:"dinamico",
			dica:$trad("d21"),
			funcaoonclick:function(){
				i3GEO.barraDeBotoes.ativaIcone("mede");
				if($i(i3GEO.Interface.IDMAPA)){
					$i(i3GEO.Interface.IDMAPA).title = "";
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,"distancia",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				}
				g_tipoacao = "";
				g_operacao="";
				i3GEO.analise.medeDistancia.inicia();
			}
		},
		{
			//botão de medição de área
			iddiv:"area",
			tipo:"dinamico",
			dica:$trad("d21a"),
			funcaoonclick:function(){
				i3GEO.barraDeBotoes.ativaIcone("area");
				if($i(i3GEO.Interface.IDMAPA)){
					$i(i3GEO.Interface.IDMAPA).title = "";
					i3GEO.util.mudaCursor(i3GEO.configura.cursores,"area",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
				}
				g_tipoacao = "";
				g_operacao="";
				i3GEO.analise.medeArea.inicia();
			}
		},
		{
			//botão de digitalização
			iddiv:"inserexy",
			tipo:"dinamico",
			dica:$trad("d22"),
			funcaoonclick:function(){
				i3GEO.barraDeBotoes.ativaIcone("inserexy");
				g_tipoacao = "";
				i3GEO.mapa.dialogo.cliquePonto();
			}
		},
		{
			//botão de inclusão de gráficos
			iddiv:"inseregrafico",
			tipo:"dinamico",
			dica:$trad("d23"),
			funcaoonclick:function(){
				g_tipoacao = "";
				i3GEO.mapa.dialogo.cliqueGrafico();
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pointer",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
			}
		},
		{
			//botão de seleção
			iddiv:"selecao",
			tipo:"dinamico",
			dica:$trad("d24"),
			funcaoonclick:function(){
				i3GEO.barraDeBotoes.ativaIcone("selecao");
				i3GEO.mapa.dialogo.selecao();
			}
		},
		{
			//botão de inserção de toponímia
			iddiv:"textofid",
			tipo:"dinamico",
			dica:$trad("d25"),
			funcaoonclick:function(){
				i3GEO.barraDeBotoes.ativaIcone("textofid");
				g_tipoacao = "";
				i3GEO.mapa.dialogo.cliqueTexto();
			}
		},
		{
			//monta rotas com o googlemaps
			iddiv:"rota",
			tipo:"",
			dica:"Rota",
			funcaoonclick:function(){
				if(i3GEO.Interface.ATUAL !== "googlemaps")
				{alert("Operacao disponivel apenas na interface Google Maps");return;}
   				counterClick = 1;
    			var parametrosRota = function(overlay,latlng){
    				var temp,janela;
    				if(counterClick === 1){	
    					counterClick++;
    					alert("Clique o ponto de destino da rota");
    					pontoRota1 = latlng;
    					return;
    				}
    				if(counterClick === 2){
    					pontoRota2 = latlng;
    					counterClick = 0;
    					GEvent.removeListener(rotaEvento);
    					janela = i3GEO.janela.cria("300px","300px","","center","","Rota");
    					janela[2].style.overflow = "auto";
    					janela[2].style.height = "300px";
						directions = new GDirections(i3GeoMap,janela[2]);
						temp = function(){
							$i("wdoca_corpo").innerHTML = "Não foi possível criar a rota";
						};
						GEvent.addListener(directions, "error", temp);
						directions.load("from: "+pontoRota1.lat()+","+pontoRota1.lng()+" to: "+pontoRota2.lat()+","+pontoRota2.lng());
    					//i3GeoMap.removeOverlay(directions)
    				}
    			};
   				rotaEvento = GEvent.addListener(i3GeoMap, "click", parametrosRota);
   				alert("Clique o ponto de origem da rota");
			}
		}
	]}
};
//YAHOO.log("carregou classe configura", "Classes i3geo");