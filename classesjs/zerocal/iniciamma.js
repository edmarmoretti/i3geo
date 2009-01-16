/*
Title: iniciamma.js

Cria o objeto objmapa e inicializa o i3geo.

Define as operações das funcionalidades principais.

O I3Geo utiliza variáveis (veja o item específico na documentação) globais que possibilitam alterar algumas das características da interface.
Essas variáveis recebem valores default quando o I3Geo é iniciado mas podem ser alterados antes da inicialização do mapa (método inicializa()).
No arquivo aplicmapa/geral.htm existem exemplos de como fazer isso.
As variáveis globais podem também ser alteradas em tempo de execução.

Exemplo:

g_janelaMen = "nao"

objmapa = new Mapa()

objmapa.inicializa()

File: iniciamma.js

About: Licença

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
/*
Section: variáveis de configuração calculadas na inicialização do mapa
*/
/*
Variable: g_sid

Id da seção atual no servidor.
Na inicialização o ID pode ser passado na URL logo após a ?, por exemplo, http://localhost/i3geo/aplicmap/geral.htm?xxxxxxxxxxxx
Se o id não for definido, significa que o I3Geo deverá criar os arquivos temporários necessários ao seu funcionamento, o que é feito via ajax.
*/
if (window.location.href.split("?")[1])
{
	g_sid = window.location.href.split("?")[1];
	//
	//a biblioteca YUI, por algum motivo, acrescenta # na URL. O # precisa ser removido, caso contrário, a opção de reload da página pelo browser as vezes não funciona
	//
	if (g_sid.split("#")[0])
	{g_sid = g_sid.split("#")[0];}
}
else 
{g_sid = "";}
/*
Variable: imagemxi

Inicialização da variável de cálculo de posicionamento que indica a posição em x do corpo do mapa.
É calculada na iniciallização e indica a posição em pixels do corpo do mapa na página. Muitos elementos da interface são posicionados em função desse valor.
*/
imagemxi = 0;
/*
Variable: imagemyi

Inicialização da variável de cálculo de posicionamento que indica a posição em x do corpo do mapa
É calculada na iniciallização e indica a posição em pixels do corpo do mapa na página. Muitos elementos da interface são posicionados em função desse valor.

*/
imagemyi = 0;
/*
Variable: navm

Verdadeiro (true) se o navegador for o Internet Explorer
*/
navm = false;
/*
Variable: navn

Verdadeiro (true) se o navegador for o Firefox
*/
navn = false;
//seta as variáveis navn e navm
var app = navigator.appName.substring(0,1);
if (app=='N') navn=true; else navm=true;
/*
Section: variáveis que são definidas para controle de processos das funções do I3Geo. São definidas aqui para não gerarem erros nas funções que as utilizam.
*/
/*
Variable: atuaLeg

Variável interna que define se a legenda docável deve ser atualizada.
Quando a legenda é colocada em uma janela móvel, essa variável é utilizada para demonstrar seu status.
Se sim, a legenda móvel é atualizada quando o mapa é alterado.
*/
atuaLeg="nao";
/*
Variable: g_mashuppar

Parâmetros de inicialização que podem ser utilizados na interface mashup.

Os parâmetros são os mesmos que podem ser utilizados quando o i3geo é inicializado pelo ms_criamapa.php.

Exemplo: g_mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"

A inicialização do I3Geo como Mashup possibilita que o I3Geo funcione dentro de uma página web qualquer, como um componente.
*/
g_mashuppar = "";
/*
Variable: g_operacao

Nome da última operação que foi executada.

Dependendo do tipo de operação são aplicadas as atualizações necessárias aos componentes do mapa. Por exemplo, redesenha o corpo do mapa, atualiza a lista de temas, etc.

Essas operações são controladas pela função ajaxiniciaparametros.
*/
g_operacao = "";
/*
Variable: g_nomepin

Nome do tema atual que irá receber dados pontuais ou toponimia.

*/
g_nomepin = "";
/*
Variable: g_arvoreClick (depreciado)

Item da árvore de temas que foi clicado por último. Guarda o identificador do nó da árvore de temas.
Essa variável permite que as funções lembrem qual foi o último tema sobre o qual o usuário fez alguma operação.
*/
g_arvoreClick = "";
g_arvoreClicks = "";
/*
Variable: g_tipoacao

Tipo de ação que está sendo executada.
Quando o usuário clica no mapa, essa variável é pesquisada para definir o tipo de operação que deve ser executada.
É definida quando o usuário seleciona uma determinada ferramenta do i3Geo.
*/
g_tipoacao = "zoomli";
/*
Variable: g_realca

Define se o realce do mapa deve ficar ativo.
O realce é um box que segue o mouse, por ter uma coloração diferente, provoca um efeito de destaque.
*/
g_realca = "nao";
/*
Variable: g_destaca

Armazena o código do tema que está em destaque.
Um tema em destaque é mostrado em um retângulo que segue o mouse.
O tema destacado é selecionado nas opções de cada tema.
*/
g_destaca = "";
/*
Variable: g_lenteaberta

Indica se a lente de aumento está ou não aberta.
É definida quando o usuário clica no ícone "lente".
Quando o mapa é redesenhado, essa variável é checada para verificar se a lente deve ser refeita.
*/
g_lenteaberta = "nao";
/*
Variable: g_panM

Indica se o mapa deve ou não ser deslocado.
É utilizada no controle da função "pan".
*/
g_panM = "nao";
/*
Variable: quadrofilme

Array que guarda os objetos do quadro de animação.
Cada elemento guarda um objeto com parâmetros específicos da classe quadrofilme
*/
quadrosfilme = new Array();
/*
Variable: g_quadrooriginal

Guarda a URL da imagem do mapa atual.
É utilizada para recuperar a imagem correta do corpo do mapa atual, uma vez que ao mover de um objeto quadofilme para outro, a imagem do corpo do mapa é alterada.
*/
g_quadrooriginal = "";
/*
Variable: g_r

Indica se o software R esta instalado (sim ou nao). É preenchida na inicialização do mapa via AJAX.
*/
g_r = "nao";
/*
Variable: cpObj

Objeto cpaint que pode ser reutilizado.

O objeto cpaint permite executar uma chamada ajax.
*/
cpObj = new cpaint();
cpObj.set_async("true");
cpObj.set_response_type("JSON");

g_postpx = "px";
g_tipotop = "top";
g_tipoleft = "left";
if (navm)
{
	g_postpx = "";  //utilizado para crossbrowser
	g_tipotop = "pixelTop"; //utilizado para crossbrowser
	g_tipoleft = "pixelLeft"; //utilizado para crossbrowser
}
/*
Class: Mapa

Objeto mapa (objmapa).

Executa os programas ajax que geram o corpo do mapa, o mapa de referência, a barra de escala e a legenda.
Preenche os elementos HTML necessários para visualização do mapa.

Parameters:

e - (opcional, se não existir, o valor será buscado na URL) extensão geográfica do mapa com valores separados por espaço

m - (opcional, se não existir, o valor será buscado na URL) nome do mapfile criado para o mapa

return:

objmapa - objeto mapa do i3geo

Constructor: 

objmapa = New Mapa()
*/
function Mapa(e,m)
{
	//
	//se o div listapropriedades não existir, as propriedades do mapa são incluídas no menu suspenso
	//
	//if (!$i("listaPropriedades"))
	//{
	//	oMenuData.propriedades = g_listaPropriedades;
	//}
	objaguarde = new aguarde();
	objposicaocursor = new posicaocursor();
	objposicaomouse = new posicaomouse();
	//faz o cache das imagens para desenhar mais rápido
	imgBranco = new Image();
	imgBranco.src = i3GEO.configura.locaplic+"/imagens/branco.gif";
	var temp = new Image();
	temp.src = i3GEO.configura.locaplic+"/pacotes/jsobjects/jsUI-Treeview/plus.gif";
	temp.src = i3GEO.configura.locaplic+"/pacotes/jsobjects/jsUI-Treeview/minus.gif";
	//calcula o tamanho do mapa
	var diminuix = (navm) ? g_diminuixM : g_diminuixN;
	var diminuiy = (navm) ? g_diminuiyM : g_diminuiyN;
	/*
	Variable: objmapa.w
	
	Largura do mapa criado

	É calculado em função do tamanho da tela. No caso do corpo do mapa possuir a propridedade de largura em seu estilo, é utilizado esse tamanho.
	*/
	/*
	Variable: objmapa.h
	
	Altura do mapa criado

	É calculado em função do tamanho da tela. No caso do corpo do mapa possuir a propridedade de largura em seu estilo, é utilizado esse tamanho.
	*/
	if (e == undefined)
	{
		var menos = 0;
		if ($i("contemFerramentas"))
		{menos = menos + parseInt($i("contemFerramentas").style.width);}
		//if ($i("encolheFerramentas"))
		//{menos = menos + parseInt($i("encolheFerramentas").style.width);}
		if ($i("ferramentas"))
		{menos = menos + parseInt($i("ferramentas").style.width);}
		var novow = screen.availWidth - diminuix;
		var novoh = screen.availHeight - diminuiy;
		if (novow >= 1024)
		{
			novow = 1000;
		}
		if (novoh >= 700)
		{
			novoh = 700;
		}
		if (document.body.style.width < 400)
		{
			var novow = screen.availWidth - diminuix;
			var novoh = screen.availHeight - diminuiy;
			window.resizeTo(screen.availWidth,screen.availHeight);
			window.moveTo(0,0);
		}
		document.body.style.width = novow;
		document.body.style.height = novoh;
		this.w = novow - menos - diminuix;
		this.h = novoh - diminuiy;
		if (document.getElementById("corpoMapa"))
		{
			if (document.getElementById("corpoMapa").style.width)
			{
				this.w = parseInt(document.getElementById("corpoMapa").style.width);
				this.h = parseInt(document.getElementById("corpoMapa").style.width);
			}
			if (document.getElementById("corpoMapa").style.height)
			{this.h = parseInt(document.getElementById("corpoMapa").style.height);}
		}
	}
	else
	{
		this.w = document.body.offsetWidth - parseInt($i("contemFerramentas").style.width) - diminuix;
		this.h = document.body.offsetHeight - diminuiy;
	}
	/*
	Variable: objmapa.navegacaoDir
	
	Indica se deve ser incluida a opção de navegação nos diretórios do servidor.

	A indicação sim|nao é obtida na inicialização do i3geo, e é definido no ms_configura.php
	*/
	this.navegacaoDir = "nao";	
	/*
	Variable: objmapa.listavisual
	
	String com a lista de visuais disponíveis no i3geo.

	A lista é obtida na inicialização do i3geo, lendo-se os diretórios disponíveis em imagens/visual
	*/
	this.listavisual = "";
	/*
	Variable: objmapa.visualatual
	
	Indica qual o visual atualmente em uso.
	*/
	this.visualatual = "default";
	/*
	Variable: objmapa.funcoesClickMapa
	
	Array com a lista de funções que serão executadas quando o usuário clica no mapa

	É utilizado quando o i3geo é customizado, acrescentando outras funcionalidades alé do padrão.
	
	Na customização, deve ser definida após a inicialização do mapa.
	*/
	this.funcoesClickMapa = new Array();
	/*
	Variable: objmapa.objtips
	
	Array que guarda os objetos tips fixos na tela.
	
	Os objetos são acrescentados à essa variável quando um tip é fixado na tela pelo usuário.
	
	Quando o mapa é redesenhado, essa variável é limpa.
	*/
	this.objtips = new Array(); //
	/*
	Variable: objmapa.tempo
	
	Inicia o temporizador para redesenhar o mapa.
	
	*/
	this.tempo = ""; //
	/*
	Variable: objmapa.autoRedesenho
	
	Inicia o temporizador para redesenhar o mapa automaticamente.
	
	*/
	this.tempoRedesenho = ""; //
	this.contaTempoRedesenho = ""; //
	/*
	Variable: objmapa.temaAtivo
	
	Tema que esta ativo.
	
	Utilizado em varias operacoes onde o tema e selecionado de um combo
	*/	
	this.temaAtivo = ""; 
	/*
	Variable: objmapa.pinmarca
	
	Simbolo utilizado para insercao de pontos.
	
	A inserção é utilizada em algumas ferramentas, como a digitalização de elementos.
	*/
	this.pinmarca = "marca"; //
	/*
	Variable: objmapa.pintamanho
	
	Tamanho da marca utilizada na inclusão de pontos
	*/
	this.pintamanho= "5";
	/*
	Variable: objmapa.escala
	
	Escala do mapa atual.
	
	É sempre redefinida quando o mapa é redesenhado.
	*/
	this.scale = 50000;
	/*
	Variable: objmapa.temas
	
	Temas disponíveis no mapa atual.
	
	Guarda a lista de temas e suas características. É definida quando o mapa é inicializado ou redesenhado.
	*/
	this.temas = "";
	/*
	Variable: objmapa.legenda
	
	Legenda HTML do mapa atual.
	
	Guarda o HTML que apresenta a legenda no mapa.
	*/
	this.legenda="";
	/*
	Variable: objmapa.finaliza
	
	Função que será executada no final do processo de montagem do mapa.
	
	Pode ser utilizada quando se deseja customizar o I3Geo.
	*/
	this.finaliza="";
	/*
	Variable: objmapa.guiaTemas
	
	Define qual a guia para listar os temas do mapa
	*/
	this.guiaTemas = "guia1";
	/*
	Variable: objmapa.guiaMenu
	
	Define qual a guia que receberá o menu de seleção de temas
	*/
	this.guiaMenu = "guia2";
	/*
	Variable: objmapa.guiaLegenda
	
	Define qual a guia receberá a legenda do mapa
	*/
	this.guiaLegenda = "guia4";
	/*
	Variable: objmapa.guiaListaMapas
	
	Define a guia que receberá a lista de mapas
	*/
	this.guiaListaMapas = "guia5";
	/*
	Variable: objmapa.cgi
	
	Indica a localização do mapserver cgi. É definida pelo i3geo na inicialização do mapa e configurada no arquivo ms_configura.php.
	*/
	this.cgi = "";
	/*
	Variable: objmapa.utilizacgi
	
	Indica se o mapserver está operando no modo cgi. É definida pelo i3geo na inicialização do mapa e configurada no arquivo ms_configura.php.
	*/
	this.utilizacgi = "";	
	/*
	Function: inicializa
	
	Inicializa o mapa
	
	Paremeters:
	
	void
	*/
	this.inicializa= function()
	{
		//
		//se não for encontrado nenhum div com o id i3geo, o corpo do html recebe esse identificador
		//
		if (!$i("i3geo"))
		{document.body.id = "i3geo";}
		//altera a classe do corpo do HTML. Utilizada pelo YUI.
		$i("i3geo").className = "yui-skin-sam";
		$i("i3geo").onmouseover = function()
		{
			this.onmousemove=function(exy1)
			{
				//
				//quando o mouse é movido sobre a tela, a posição de x e y são guardadas em objposicaomouse
				//
				if (navn)
				{
					objposicaomouse.x = exy1.clientX;
					objposicaomouse.y = exy1.clientY;
				}
				else
				{
					objposicaomouse.x = window.event.clientX;
					objposicaomouse.y = window.event.clientY;
				}
			};
		};
		//
		//se g_sid="", o html foi aberto diretamente
		//então, é necessário criar os arquivos temporários do mapa
		//essa operação deve ser assíncrona
		//
		if (g_sid=="")
		{
			var mashup = function (retorno)
			{
				g_sid = retorno.data;
				objmapa.inicializa();
			};
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa"+g_mashuppar;
			cpObj.call(p,"",mashup);
			return;
		}
		//	
		//testa se os javascripts foram carregados
		//
		if (!window.testafuncoes)
		{alert("funcoes.js com problemas");}
		if (!window.testaferramentas)
		{alert("ferramentas.js com problemas");}
		if (!window.testaajax)
		{alert("redesenho.js com problemas");}
		//
		//inicia o mapa
		//
		i3GEO.janela.abreAguarde("montaMapa",$trad("o5"));
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+g_embedLegenda+"&w="+this.w+"&h="+this.h+"&g_sid="+g_sid;
		cpObj.call(p,"iniciaMapa",this.montaMapa);
	};
	/*
	Function: montaMapa
	
	Processa os resultados da inicialização e monta o mapa
	
	Parameters:
	
	Resultado da função inicia retornado pela chamada em ajax
	*/
	this.montaMapa = function (retorno)
	{
		if (retorno.data.search(" erro.") > -1)
		{
			alert(retorno.data);
		}
		if (retorno.data == "linkquebrado")
		{
			i3GEO.janela.fechaAguarde("montaMapa");
			document.body.style.backgroundColor="white";
			document.body.innerHTML = "<br>Para abrir o mapa utilize o link:<br><a href="+i3GEO.configura.locaplic+"/ms_criamapa.php >"+i3GEO.configura.locaplic+"/ms_criamapa.php</a>";
			return("linkquebrado");
		}
		else
		{
			if ((retorno.data != "erro") && (retorno.data != undefined))
			{
				//
				//executa com eval a string que é retornada pelo servidor (função inicia do mapa_controle.php
				//
				eval(retorno.data);
				if (titulo != "")
				{top.document.title = titulo;}
				//
				//insere botao dinamico de aplicar
				//
				if (!$i("aplicari"))
				{
					var novoel = document.createElement("input");
					with(novoel)
					{
						id = 'aplicari';
						type = 'button';
						value = 'Aplicar';
						style.cursor="pointer";
						style.fontSize="10px";
						style.zIndex = 15000;
						style.position="absolute";
						style.display="none";
					}
					novoel.onclick=function()
					{
						remapaf();
						this.style.display="none"
					};
					novoel.onmouseover = function(){this.style.display="block";};
					novoel.onmouseout = function(){this.style.display="none";};
					document.body.appendChild(novoel);
				}
				//
				//inicia as barras de ferramentas
				//
				//
				//gera a lista de temas da guia temas
				//
				objmapa.atualizaListaTemas(temas);
				//
				//gera o mapa de referencia e outros elementos do mapa
				//
				objmapa.atualizaReferencia(mapexten);
				objmapa.scale = parseInt(mapscale);
				objmapa.temas = temas;
				objmapa.cellsize = g_celula;
				objmapa.extent = mapexten;
				objmapa.extentTotal = mapexten;
				objmapa.criaCorpoMapa();
				ajaxCorpoMapa(retorno);
				objmapa.criaEscalaGrafica();
				objmapa.atualizaEscalaGrafica();
				objmapa.ativaListaPropriedades("listaPropriedades");
				//
				//ativa os botões  das funções
				//
				var l = g_listaFuncoesBotoes.botoes;
				for(b=0;b<g_listaFuncoesBotoes.botoes.length;b++)
				{
					if ($i(l[b].iddiv))
					{
						if(l[b].conteudo)
						{eval('$i(l[b].iddiv).innerHTML = "'+l[b].conteudo+'"');}
						if(l[b].dica)
						{
							eval('$i("'+l[b].iddiv+'").onmouseover = function(){i3GEO.ajuda.mostraJanela("'+l[b].dica+'","");}');
							eval('$i("'+l[b].iddiv+'").onmouseout = function(){i3GEO.ajuda.mostraJanela("");};');
						}
						if(l[b].funcaoonclick)
						{
							$i(l[b].iddiv).onclick = l[b].funcaoonclick;
						}
						if(l[b].constroiconteudo)
						{eval(l[b].constroiconteudo);}
					}
				}
				//
				//ativa as guias
				//
				ativaGuias();
				//
				//calcula a posicao do mapa no browser
				//
				calcposf();
				g_leftinicial = imagemxi;
				if ($i("corpoMapa"))
				{
					with($i("img"))
					{
						style.width=objmapa.w +"px";
						style.height=objmapa.h +"px";
					}
					with($i("corpoMapa"))
					{
						style.width=objmapa.w +"px";
						style.height=objmapa.h +"px";
						style.clip = 'rect('+0+" "+(objmapa.w)+" "+(objmapa.h)+" "+0+')';
					}
				}
				var temp = 0;
				if ($i("contemFerramentas")){temp = temp + parseInt($i("contemFerramentas").style.width);}
				//if ($i("encolheFerramentas")){temp = temp + parseInt($i("encolheFerramentas").style.width);}
				if ($i("ferramentas")){temp = temp + parseInt($i("ferramentas").style.width);}
				$i("mst").style.width=objmapa.w + temp + "px";
				with($i("contemImg"))
				{
					style.height=objmapa.h + "px";
					style.width=objmapa.w + "px";
				}
				calcposf();
				//reposiciona a janela de botoes
				if(navn){var desloca = 40;}else{var desloca = 40;}
				mudaiconf("pan"); //inicia no icone de zoom por box
				if ($i("escalanum")){$i("escalanum").value = objmapa.scale;}
				if (objmapa.geoip == "nao"){$i("ondeestou").style.display="none";}
			}
			else
			{alert("Erro. Impossivel criar o mapa "+retorno.data);return;}
			//ativa a guia correta
			var temp = g_guiaativa.split("guia");
			mostraguiaf(temp[1]);
			//verifica se a guia5 (mapas) deve ou não ser mostrada
			if ($i(objmapa.guiaListaMapas))
			{
				if (g_locmapas == ""){$i(objmapa.guiaListaMapas).style.display = "none"}
			}
			if (pCookie("g_janelaMen")){g_janelaMen = pCookie("g_janelaMen");}
			if (g_janelaMen == "sim"){initJanelaMen();}
			if (pCookie("g_mapaRefDisplay")){g_mapaRefDisplay = pCookie("g_mapaRefDisplay");}
			if (g_mapaRefDisplay == "block"){initJanelaRef();}
			i3GEO.janela.fechaAguarde("montaMapa");
			if (g_docaguias == "sim"){docaguias();}
			if (document.getElementById("botao3d"))
			{
				if (g_3dmap == ""){document.getElementById("botao3d").style.display="none";}
			}
		}
	};
	/*
	Function: ativaListaPropriedades
	
	Mostra a lista de propriedades do mapa.
	
	Parameters:
	
	id - id do elemento que ativa a operação	
	*/	
	this.ativaListaPropriedades = function(id)
	{
		if ($i(id))
		{
			listaPr = new Object();
			listaPr = treeviewNew("listaPr", "default", id, null);
			listaPr.createItem("propriedadesRaiz", "<b>"+$trad("p13")+"</b>", "foldermapa1", true, false, true, null);
			var im = "";
			if (navn)
			{var im = "<img src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' width=0 height=13 />";}
			for (l=0;l<g_listaPropriedades.propriedades.length; l++)
			{
				var temp = g_listaPropriedades.propriedades[l].text;
				var temp = eval("g_traducao."+temp+"[0]."+g_linguagem);
				tnome = "<span onclick='"+g_listaPropriedades.propriedades[l].url+"'>"+im+"<img  src='"+i3GEO.configura.locaplic+"/imagens/tic.png' />&nbsp;"+temp+" </span>";
				listaPr.createItem("propriedadesMapa"+l, tnome, imgBranco, false, true, false, "propriedadesRaiz");
			}
			listaPr.createItem("","", imgBranco, false, true, false, "propriedadesRaiz");				

			//lista de funções
			listaF = new Object();
			listaF = treeviewNew("listaF", "default", id, null);
			listaF.createItem("listaFraiz", "<b>Fun&ccedil;&otilde;es</b>", "foldermapa1", true, false, true, null);
			var im = "";
			if (navn)
			{var im = "<img src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' width=0 height=13 />";}
			var conta = 0;
			for(nomeMenu in oMenuData)
			{
				var o = oMenuData[nomeMenu];
				//tnome = o;
				for (j=0;j<o.length; j++)
				{
					var temp = o[j].text;
					tnome = "<span onclick='"+o[j].url+"'>"+im+"<img  src='"+i3GEO.configura.locaplic+"/imagens/tic.png' />&nbsp;"+temp+" </span>";
					listaPr.createItem("funcoesMapa"+l, tnome, imgBranco, false, true, false, "listaFraiz");
					tnome = ""
				}
			}
			listaF.createItem("","", imgBranco, false, true, false, "listaFraiz");				
		}
	};
	/*
	Function: criaEscalaGrafica
	
	Cria a escala gráfica como um lemento HTML se existir o id escalaGrafica
	*/
	this.criaEscalaGrafica = function()
	{
		if ( ($i("escalaGrafica")) && (!$i("imagemEscalaGrafica")) )
		{$i("escalaGrafica").innerHTML = "<img src=\""+g_localimg+"/icon_menuarrow.gif\" title='op&ccedil;&otilde;es' onclick='opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />";}
	};
	/*
	Function: atualizaEscalaGrafica
	
	Atualilza a escala gráfica
	*/
	this.atualizaEscalaGrafica = function()
	{
		if ($i("escalaGrafica"))
		{
			//i3GEO.janela.abreAguarde("ajaxEscalaGrafica","Aguarde...criando escala gr&aacute;fica");
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+g_sid;
			cpObj.call(p,"retornaBarraEscala",ajaxEscalaGrafica);
		}
	};
	/*
	Function: atualizaReferencia
	
	Atualiza o mapa de referência
	
	Parameters:
	
	mapexten - extensão geográfica
	*/
	this.atualizaReferencia = function(mapexten)
	{
		//
		//se houve alteração na extensão, é preciso refazer o mapa de referência
		//se não, a imagem atual é armazenada no quado de animação
		//
		if ($i("mapaReferencia") && objmapa.extent != mapexten)
		{
			if(($i("imagemReferencia").src == "") || (objmapa.utilizacgi != "sim"))
			{
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+g_sid;
				cpObj.call(p,"retornaReferencia",ajaxReferencia);
			}
			else
			{
				var re = new RegExp("&mode=map", "g");
				$i("imagemReferencia").src = $i("img").src.replace(re,'&mode=reference');
			}
		}
	};
	/*
	Function: atualizaLegendaHTML
	
	Atualiza a legenda, em HTML, nos ids legenda e moveLegi
	*/
	this.atualizaLegendaHTML = function()
	{
		if  (($i("moveLegi")) || ($i("legenda") && $i(objmapa.guiaLegenda+"obj") && $i(objmapa.guiaLegenda+"obj").style.display == "block"))
		{
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&g_sid="+g_sid;
			cpObj.call(p,"criaLegenda",ajaxLegendaHTML);
		}
	};
	/*
	Function: atualizaLegendaImagem
	
	Atualiza a legenda no formato de uma imagem
	*/
	this.atualizaLegendaImagem = function()
	{
		if ($i("legenda"))
		{
			//i3GEO.janela.abreAguarde("ajaxLegenda","Aguarde...atualizando a legenda");
			var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+g_sid;
			cpObj.call(p,"legendaGrafica",ajaxLegendaImagem);
		}
	};
	/*
	Function: atualizaListaTemas
	
	Atualiza a lista de temas disponíveis no mapa (guia com a lista de temas)
	
	Parameters:
	
	temas - lista de temas. Se vazio, utiliza o objeto objmapa.temas
	*/
	this.atualizaListaTemas = function(temas)
	{
		if ( (($i("listaTemas")) && (objmapa.temas != temas)) || (!$i("listaTemas").hasChildNodes()) )
		{
			$i("listaTemas").innerHTML = "";
			var lista = temas.split(";");
			mytreeview1 = new Object();
			mytreeview1 = treeviewNew("mytreeview1", "default", "listaTemas", null);
			var titulo = "<b>"+$trad("t1")+"</b>";
			mytreeview1.createItem("g1",titulo, "foldermapa", true, true, true, null);
			mytreeview1.itemExpand = expandeTema;
			var cor = "rgb(250,250,250)";
			//codigo,status,nome,transparencia,tipo,selecao,escala,download,tem features,conexao,tem wfs
			for (l=0;l<lista.length; l++)
			{
				var ltema = lista[l].split("*");
				var ck = "";
				if(ltema[1] == 2){ck = 'CHECKED';}
				//ltema[8]==sim indica que e um tema com features
				if (ltema[8] == undefined){ltema[8] = "nao";}
				tnome = "<span id='arrastar_"+ltema[0]+"'><input class=inputsb style='cursor:pointer' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t3")+"','ligadesliga')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" type='checkbox' name=\"layer\" value='"+ltema[0]+"' "+ ck +" onclick='mudaboxnf(\"ligadesliga\")'/>";
				if (ltema[5] == "sim") //o tema tem selecao
				{tnome += "&nbsp;<img src="+$im("estasel.png")+" title='"+$trad("t4")+"' onclick='limpaseltemaf(this)' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t5")+"','limpasel')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
				//verifica se e um wms que tem wfs
				if ((ltema[10] == "sim") || (ltema[10] == "SIM"))
				{tnome += "&nbsp;<img src="+$im("down1.gif") +" title='download' onclick='download(\""+ltema[0]+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t6")+"','download')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
				if ((ltema[7] == "sim") || (ltema[7] == "SIM"))
				{tnome += "&nbsp;<img src="+$im("down1.gif") +" title='download' onclick='download(\""+ltema[0]+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t7")+"','download')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";}
				if (navm)
				{tnome += "<span title='"+$trad("t7")+"' style='background-color:"+cor+"' id=nometema"+ltema[0]+">&nbsp;" + ltema[2]+"</span></span>";}
				else
				{tnome += "<span title='"+$trad("t8")+"' style='background-color:"+cor+"' id=nometema"+ltema[0]+">&nbsp;" +"<img src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' width=0 height=15 />" +ltema[2]+"</span></div>";}
				mytreeview1.createItem(ltema[0], tnome, null, true, true, true, "g1");
				tnome = "<img width=0px src="+$im("branco.gif") + " />";
				mytreeview1.createItem("", tnome, imgBranco, false, true, false, ltema[0]);
				if (cor == "rgb(250,250,250)"){var cor = "none";}
				else
				{var cor = "rgb(250,250,250)";}
			}
		}
	};
	/*
	Function: atualizaFarol
	
	Atualiza o farol de cada tema.
	
	O farol identifica a compatibilidade da escala do mapa com a escala de cada tema
	
	Parameters:
	
	mapscale - escala de comparação com a escala de cada tema
	*/
	this.atualizaFarol = function(mapscale)
	{
		//mapscale é o valor da escala do novo mapa
		if (objmapa.scale != mapscale)
		{
			var lista = (objmapa.temas).split(";");
			var farol = "maisamarelo.png";
			for (l=0;l<lista.length; l++)
			{
				var ltema = lista[l].split("*");
				if (ltema[6]*1 < mapscale*1)
				{var farol = "maisverde.png";}
				if (ltema[6]*1 > mapscale*1)
				{var farol = "maisvermelho.png";}
				if (ltema[6]*1 == 0)
				{var farol = "maisamarelo.png";}
				if ($i("farol"+ltema[0]))
				{
					$i("farol"+ltema[0]).src = i3GEO.configura.locaplic+"/imagens/"+farol;
				}
			}
		}
	};
	/*
	Function: criaCorpoMapa
	
	Cria os objetos para preenchimento com a imagem do corpo do mapa.
	
	*/
	this.criaCorpoMapa = function()
	{
		if ($i("corpoMapa"))
		{
			var ins = "<table>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";
			ins += "<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";
			ins += "</table>";
			$i("corpoMapa").innerHTML = ins;
		}
		//insere a figura que segue o mouse
		var novoel = document.createElement("div");
		novoel.style.zIndex=1000;
		novoel.id="obj";
		var novoimg = document.createElement("img");
		with(novoimg)
		{
			src= i3GEO.configura.locaplic+"/imagens/pan.gif";
			name="imgh";
			id='imgh';
			style.width = "15px";
			style.height = "15px";
		}
		novoel.appendChild(novoimg);
		novoel.onmouseover = function()
		{this.style.display = "none";};
		novoel.onmouseout = function()
		{this.style.display = "block";};
		document.body.appendChild(novoel);
		var docMapa = "";
		if (document.getElementById("openlayers_OpenLayers_Container"))
		{
			var docMapa = $i("openlayers_OpenLayers_Container");
		}
		if (document.getElementById("img"))
		{
			var docMapa = $i("img");
			//insere box de zoom
			var novoel = document.createElement("div");
			with(novoel)
			{
				style.width = "0px";
				style.height = "0px";
				id = "box1";
				display = "none";
			}
			document.body.appendChild(novoel);
			if (navm)
			{
				$i("box1").style.filter = "alpha(opacity=25)";
			}
			$i("box1").onmousemove = function()
			{
				var wb = parseInt($i("box1").style.width);
				var hb = parseInt($i("box1").style.height);
				if (navm)
				{
					if(wb > 2)
					{$i("box1").style.width = wb - 2;}
					if(hb > 2)
					{$i("box1").style.height = hb - 2;}
				}
				else
				{
					with(this.style){width = wb - 10 + "px";}
					with(this.style){height = hb - 10 + "px";}
				}
			};
			$i("box1").onmouseup = function(){zoomboxf("termina")};
			//funcoes que operam sobre o mapa
			this.parado = "nao"; //utilizado para verificar se o mouse esta parado
		}
		if (docMapa != "")
		{
			ativaClicks(docMapa);
		}
		this.atualizaCorpoMapa = function()
		{
			i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&g_sid="+g_sid;
			cpObj.call(p,"redesenhaCorpo",ajaxCorpoMapa);
		};
		if (objmapa.finaliza)
		{eval(objmapa.finaliza);}
		//
		//altera o tamanho das guias
		//
		var temp = new Array("guiaTemas","guiaMenu","guiaLegenda");
		for(i=0;i<temp.length;i++)
		{
			eval("var s = objmapa."+temp[i]+"obj"); 
			if ($i(s))
			{
				var d = $i(s);
				with(d)
				{
					style.overflow="auto";
					style.height = objmapa.h-13;
					style.width = "100%";
				}
			}
		}
	};
	/*
	Function: verificaClickMapa
	
	Verifica se existem funções adicionais que devem ser executadas quando o usuário clica no mapa.
	*/
	this.verificaClickMapa = function()
	{
		if (this.funcoesClickMapa.length > 0)
		{
			for (f=0;f<this.funcoesClickMapa.length; f++)
			{
				eval(this.funcoesClickMapa[f]);
			}
		}
		if (g_funcoesClickMapaDefault.length > 0)
		{
			for (f=0;f<g_funcoesClickMapaDefault.length; f++)
			{
				eval(g_funcoesClickMapaDefault[f]);
			}
		}
	};
}