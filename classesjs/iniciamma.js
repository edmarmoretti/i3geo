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

File: i3geo/classesjs/iniciamma.js

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
Variable: g_recupera

Conta quantas vezes foi feita uma tentativa de recuperar um mapa com problemas
*/
g_recupera = 0;
/*
Variable: imagemxi depreciada

Inicialização da variável de cálculo de posicionamento que indica a posição em x do corpo do mapa.
É calculada na iniciallização e indica a posição em pixels do corpo do mapa na página. Muitos elementos da interface são posicionados em função desse valor.
*/
imagemxi = 0;
/*
Variable: imagemyi depreciada

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
Variable: g_zoomRefDinamico

Define o fator de zoom que será aplicado ao mapa de referência quando este estiver no modo dinâmico.
*/
g_zoomRefDinamico = -3;
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
Variable: g_zoomProximo

Array com as extensões geográficas da função de zoom anterior e zoom próximo.

*/
g_zoomProximo = new Array();
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
	//para efeitos de compatibilidade
	try {
		i3GEO.configura.locaplic = g_locaplic;
	}
	catch(e){g_locaplic = i3GEO.configura.locaplic;};
	//
	objaguarde = new aguarde();
	objposicaocursor = new posicaocursor();
	objposicaomouse = new posicaomouse();
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
		if ($i("ferramentas"))
		{menos = menos + parseInt($i("ferramentas").style.width);}
		var novow = parseInt(screen.availWidth) - diminuix;
		var novoh = parseInt(screen.availHeight) - diminuiy;		
		if (novow >= 1024)
		{
			novow = 1000;
		}
		if (novoh >= 700)
		{
			novoh = 700;
		}
		//o try aqui é necessário por conta do uso possível do i3geo em um iframe
		try
		{
			if (document.body.style.width < 400)
			{
				var novow = parseInt(screen.availWidth) - diminuix;
				var novoh = parseInt(screen.availHeight) - diminuiy;
				window.resizeTo(screen.availWidth,screen.availHeight);
				window.moveTo(0,0);
			}
		}
		catch(e){var e = "";}
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
	YAHOO.log("Reposicionou a janela do navegador", "i3geo");
	if ($i("openlayers"))
	{
		$i("openlayers").style.width = this.w;
		$i("openlayers").style.height = this.h;
	}
	if ($i("flamingo"))
	{
		$i("flamingo").style.width = this.w;
		$i("flamingo").style.height = this.h;
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
	Variable: objmapa.tempoRedesenho
	
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
	Variable: objmapa.temas (depreciado)

	Utilize i3GEO.arvoreDeCamadas.CAMADAS
	
	Temas disponíveis no mapa atual.
	*/
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
	Variable: objmapa.versaoms
	
	Versão do mapserver em uso
	*/
	this.versaoms = "";	
	/*
	Function: inicializa
	
	Inicializa o mapa
	
	Paremeters:
	
	void
	*/
	this.inicializa= function()
	{
		YAHOO.log("Inicializando o i3geo", "i3geo");
		//
		//se não for encontrado nenhum div com o id i3geo, o corpo do html recebe esse identificador
		//
		if (!$i("i3geo"))
		{document.body.id = "i3geo";}
		//altera a classe do corpo do HTML. Utilizada pelo YUI.
		$i("i3geo").className = "yui-skin-sam";
		if($i("mst"))
		$i("mst").style.visibility ="hidden";
		//
		//se g_sid="", o html foi aberto diretamente
		//então, é necessário criar os arquivos temporários do mapa
		//essa operação deve ser assíncrona
		//
		if (i3GEO.configura.sid=="")
		{
			var mashup = function (retorno)
			{
				i3GEO.configura.sid = retorno.data;
				objmapa.inicializa();
			};
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+g_mashuppar;
			cpObj.call(p,"",mashup);
		}
		else
		{
			//
			//inicia o mapa
			//
			YAHOO.log("Chamada AJAX para obter o mapa inicial", "i3geo");
			i3GEO.janela.abreAguarde("montaMapa",$trad("o5"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+g_embedLegenda+"&w="+this.w+"&h="+this.h+"&g_sid="+i3GEO.configura.sid;
			cpObj.call(p,"iniciaMapa",this.montaMapa);
		}
	};
	/*
	Function: montaMapa
	
	Processa os resultados da inicialização e monta o mapa
	
	Parameters:
	
	Resultado da função inicia retornado pela chamada em ajax
	*/
	this.montaMapa = function (retorno)
	{
		YAHOO.log("Mapa obtido", "i3geo");
		if (retorno.data.erro)
		{
			i3GEO.janela.fechaAguarde("montaMapa");
			document.body.style.backgroundColor="white";
			document.body.innerHTML = "<br>Para abrir o mapa utilize o link:<br><a href="+i3GEO.configura.locaplic+"/ms_criamapa.php >"+i3GEO.configura.locaplic+"/ms_criamapa.php</a>";
			return("linkquebrado");
		}
		else
		{
			if (retorno.data.variaveis)
			{
				//
				//executa com eval a string que é retornada pelo servidor (função inicia do mapa_controle.php
				//
				var tempo = "";
				var titulo = "";
				eval(retorno.data.variaveis);
				try
				{
					if (titulo != "")
					{top.document.title = titulo;}
				}
				catch(e){var e = "";}
				mostradicasf("","Tempo de desenho em segundos: "+tempo,"");
				//
				//gera os ícones para animação
				//
				i3GEO.gadgets.quadros.inicia(10);
				i3GEO.gadgets.quadros.grava("extensao",mapexten);
				//
				//gera a lista de temas da guia temas
				//
				i3GEO.arvoreDeCamadas.cria("",retorno.data.temas,i3GEO.configura.sid,i3GEO.configura.locaplic);
				//
				//gera o mapa de referencia e outros elementos do mapa
				//
				objmapa.atualizaReferencia(mapexten);
				objmapa.scale = parseInt(mapscale);
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
				YAHOO.log("Ativando os botões", "i3geo");
				i3GEO.gadgets.mostraCoordenadasGEO();
				i3GEO.gadgets.mostraEscalaNumerica();
				i3GEO.gadgets.mostraBuscaRapida();
				i3GEO.gadgets.visual.inicia();
				//
				//ativa as guias
				//
				ativaGuias();
				//
				//monta a árvore de temas adicionais se existir a div arvoreAdicionaTema
				//
				if($i("arvoreAdicionaTema"))
				i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,"");
				//
				//calcula a posicao do mapa no browser
				//
				if ($i("corpoMapa"))
				{
					var i = $i("img").style;
					i.width=objmapa.w +"px";
					i.height=objmapa.h +"px";
					var i = $i("corpoMapa").style;
					i.width=objmapa.w +"px";
					i.height=objmapa.h +"px";
					i.clip = 'rect('+0+" "+(objmapa.w)+" "+(objmapa.h)+" "+0+')';
				}
				//
				//ativa as mensagens no banner
				//
				i3GEO.ajuda.ativaLetreiro(i3GEO.configura.locaplic,i3GEO.configura.sid);
				//
				//calcula (opcional) o tamanho correto da tabela onde fica o mapa
				//se não for feito esse cálculo, o mapa fica ajustado à esquerda
				//
				var temp = 0;
				if ($i("contemFerramentas")){temp = temp + parseInt($i("contemFerramentas").style.width);}
				if ($i("ferramentas")){temp = temp + parseInt($i("ferramentas").style.width);}
				if($i("mst"))
				{$i("mst").style.width=objmapa.w + temp + "px";}
				if($i("contemImg"))
				{
					var i = $i("contemImg").style;
					i.height=objmapa.h + "px";
					i.width=objmapa.w + "px";
				}
				calcposf();
				//
				//reposiciona a janela de botoes
				//
				var imagemxy = i3GEO.util.pegaPosicaoObjeto($i("corpoMapa"));
				//
				//inicia as barras de ferramentas
				//
				if ($i("barraDeBotoes1")){
					var x1 = imagemxy[0]+40;
					var y1 = imagemxy[1]+10;
				}
				if ($i("barraDeBotoes2")){
					var x2 = imagemxy[0];
					var y2 = imagemxy[1]+10;
				}
				else{
					if ($i("barraDeBotoes1")){
						var x1 = imagemxy[0];
						var x2 = imagemxy[1]+10;
					}
				}
				if ($i("barraDeBotoes1"))
				i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);
				if ($i("barraDeBotoes2"))
				i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);
				//ativa as funções dos botões
				i3GEO.barraDeBotoes.ativaBotoes();
				if (g_entorno == "sim")
				{
					geraURLentorno();
					var letras=["L","O","N","S"];
					for (var l=0;l<4; l++)
					{
						if ($i("img"+letras[l]))
						{
							$i("img"+letras[l]).style.width = objmapa.w;
							$i("img"+letras[l]).style.height = objmapa.h;
							$i("img"+letras[l]).style.display = "block";
						}
					}
					ajustaEntorno();
				}
				autoRedesenho("ativa");
				if ($i("i3geo_escalanum")){$i("i3geo_escalanum").value = objmapa.scale;}
				if ((objmapa.geoip == "nao") && ($i("ondeestou")))
				{$i("ondeestou").style.display="none";}
			}
			else
			{alert("Erro. Impossivel criar o mapa "+retorno.data);return;}
			//ativa a guia correta
			var temp = g_guiaativa.split("guia");
			mostraguiaf(temp[1]);
			//
			//ativa a cor da guia
			//
			/*
			if ($i("guia"+temp[1]))
			{
				$i("guia"+temp[1]).parentNode.parentNode.focus();
			}
			*/
			//
			//ativa a janela de mensagens se for o caso
			//
			if(document.getElementById("ajuda")) //para efeitos de compatibilidade com as versões anteriores a 4.1
			{i3GEO.ajuda.DIVAJUDA = "ajuda";}
			var abreJM = "sim";
			if (i3GEO.util.pegaCookie("g_janelaMen")){
				var abreJM = i3GEO.util.pegaCookie("g_janelaMen");
				if(abreJM == "sim")
				i3GEO.configura.iniciaJanelaMensagens = true;
				else
				i3GEO.configura.iniciaJanelaMensagens = false;
			}
			if(i3GEO.configura.iniciaJanelaMensagens == true)
			{i3GEO.ajuda.abreJanela();}
			
			if (g_mapaRefDisplay != "none")
			{
				if (i3GEO.util.pegaCookie("g_mapaRefDisplay")){g_mapaRefDisplay = i3GEO.util.pegaCookie("g_mapaRefDisplay");}
				if (g_mapaRefDisplay == "block"){initJanelaRef();}
			}
			i3GEO.janela.fechaAguarde("montaMapa");
			if (g_docaguias == "sim"){docaguias();}
			if (document.getElementById("botao3d"))
			{
				if (g_3dmap == ""){document.getElementById("botao3d").style.display="none";}
			}
		}
		//
		//zera os quadros de animação
		//
		rebobinaf();
		if($i("mst"))
		$i("mst").style.visibility ="visible";
		YAHOO.log("Fim objmapa.inicializa", "i3geo");
	};
	/*
	Function: ativaListaPropriedades
	
	Mostra a lista de propriedades do mapa.
	
	Parameters:
	
	id - id do elemento que receberá a árvore com a lista de propriedades.	
	*/	
	this.ativaListaPropriedades = function(id)
	{
		if ($i(id))
		{i3GEO.util.arvore("<b>"+$trad("p13")+"</b>",id,i3GEO.configura.listaDePropriedadesDoMapa);}
	};
	/*
	Function: criaEscalaGrafica
	
	Cria a escala gráfica como um lemento HTML se existir o id escalaGrafica
	*/
	this.criaEscalaGrafica = function()
	{
		if ( ($i("escalaGrafica")) && (!$i("imagemEscalaGrafica")) )
		{$i("escalaGrafica").innerHTML = "<img class='menuarrow' src=\""+g_localimg+"/branco.gif\" title='op&ccedil;&otilde;es' onclick='opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />";}
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
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;
			cpObj.call(p,"retornaBarraEscala",ajaxEscalaGrafica);
		}
	};
	/*
	Function: atualizaReferencia
	
	Atualiza o mapa de referência.
	
	Se o modo cgi estiver ativado, o mapa de referência é desenhado utilizando-se como src da imagem o programa cgi do Mapserver.
	
	No modo dinâmico, a imagem é gerada de forma diferenciada. Nesse caso, o modo cgi é desabilitado.
	
	O atualizaReferencia é sempre chamado após o mapa ser redesenhado.
	
	Se houve alteração na extensão, é preciso refazer o mapa de referência se não, a imagem atual é armazenada no quado de animação

	Parameters:
	
	mapexten - extensão geográfica do retângulo que será desenhado no mapa de referência. 
	Esse valor é utilizado apenas para comparar a extensão geográfica do mapa atual com a extensão geográfica do mapa seguinte.
	*/
	this.atualizaReferencia = function(mapexten)
	{
		if($i("boxRef")){$i("boxRef").style.display="none";} //div utilizado na ferramenta mostraexten
		var dinamico = false;
		if ($i("refDinamico"))
		{var dinamico = $i("refDinamico").checked;}
		if ($i("mapaReferencia") && objmapa.extent != mapexten)
		{
			YAHOO.log("Atualizando o mapa de referência", "i3geo");
			if(dinamico)
			{
				var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+g_zoomRefDinamico;
				cpObj.call(p,"retornaReferenciaDinamica",ajaxReferencia);
			}
			else
			{
				if(($i("imagemReferencia").src == "") || (objmapa.cgi != "sim"))
				{
					var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid;
					cpObj.call(p,"retornaReferencia",ajaxReferencia);
				}
				else
				{
					var re = new RegExp("&mode=map", "g");
					$i("imagemReferencia").src = $i("img").src.replace(re,'&mode=reference');
					i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src);
				}
			}
		}
		else
		{
			if($i("imagemReferencia"))
			i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src);
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
			YAHOO.log("Iniciando atualização da legenda HTML", "i3geo");
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&templateLegenda="+g_templateLegenda+"&g_sid="+i3GEO.configura.sid;
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
			var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;
			cpObj.call(p,"legendaGrafica",ajaxLegendaImagem);
		}
	};
	/*
	Function: atualizaListaTemas (depreciado)
	
	Atualiza a lista de temas disponíveis no mapa (guia com a lista de temas)
	*/
	this.atualizaListaTemas = function(temas)
	{alert("atualizaListaTemas foi depreciado. Utilize i3GEO.arvoreDeCamadas")};
	/*
	Function: criaCorpoMapa
	
	Cria os objetos para preenchimento com a imagem do corpo do mapa.
	
	*/
	this.criaCorpoMapa = function()
	{
		YAHOO.log("Criando o corpo do mapa", "i3geo");
		if ($i("corpoMapa"))
		{
			var ins = "<table>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";
			ins += "<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";
			ins += "<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";
			ins += "</table>";
			$i("corpoMapa").innerHTML = ins;
		}
		var docMapa = "";
		if (document.getElementById("openlayers"))
		{
			ativaClicks($i("openlayers"));
		}
		if (document.getElementById("img"))
		{
			//insere box de zoom
			var novoel = document.createElement("div");
			novoel.style.width = "0px";
			novoel.style.height = "0px";
			novoel.id = "box1";
			novoel.display = "none";
			document.body.appendChild(novoel);
			i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","box1",i3GEO.configura.locaplic);
			if (navm)
			{
				$i("box1").style.filter = "alpha(opacity=25)";
			}	
			$i("box1").onmousemove = function()
			{
				var b = $i("box1").style;
				var wb = parseInt(b.width);
				var hb = parseInt(b.height);
				if (navm)
				{
					if(wb > 2)
					{b.width = wb - 2;}
					if(hb > 2)
					{b.height = hb - 2;}
				}
				else
				{
					b.width = wb - 2 + "px";
					b.height = hb - 2 + "px";
				}
			};
			$i("box1").onmouseup = function(){zoomboxf("termina")};
			//funcoes que operam sobre o mapa
			this.parado = "nao"; //utilizado para verificar se o mouse esta parado
			ativaClicks($i("img"));
		}
		this.atualizaCorpoMapa = function()
		{
			i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&g_sid="+i3GEO.configura.sid+"&tipoimagem="+g_tipoimagem;
			cpObj.call(p,"redesenhaCorpo",ajaxCorpoMapa);
		};
		if (objmapa.finaliza)
		{eval(objmapa.finaliza);}
		//
		//altera o tamanho das guias
		//
		var temp = new Array("guiaTemas","guiaMenu","guiaLegenda");
		var i = temp.length-1;
		if (i >= 0)
		{
			do
			{
				eval("var s = objmapa."+temp[i]+"obj"); 
				if ($i(s))
				{
					var d = $i(s).style;
					d.style.overflow="auto";
					d.style.height = objmapa.h-13;
					d.style.width = "100%";
				}
			}
			while(i--)
		}
		YAHOO.log("Concluído o corpo do mapa", "i3geo");
	};
	/*
	Function: verificaClickMapa
	
	Verifica se existem funções adicionais que devem ser executadas quando o usuário clica no mapa.
	*/
	this.verificaClickMapa = function()
	{
		YAHOO.log("Verificando clicks no mapa", "i3geo");
		if (this.funcoesClickMapa.length > 0)
		{
			var f = this.funcoesClickMapa.length-1;
			if (f >= 0)
			{
				do
				{
					eval(this.funcoesClickMapa[f]);
				}
				while(f--)
			}
		}
		if (g_funcoesClickMapaDefault.length > 0)
		{
			var lle = g_funcoesClickMapaDefault.length;
			for (var f=0;f<lle; f++)
			{
				eval(g_funcoesClickMapaDefault[f]);
			}
		}
		YAHOO.log("Fim verificando clicks no mapa", "i3geo");
	};
	/*
	Function: verificaMousemoveMapa
	
	Verifica se existem funções adicionais que devem ser executadas quando o usuário mover o mouse sobre o mapa.
	*/
	this.verificaMousemoveMapa = function()
	{
		if (g_funcoesMousemoveMapaDefault.length > 0)
		{
			var f = g_funcoesMousemoveMapaDefault.length-1;
			if (f >= 0)
			{
				do
				{
					var temp = g_funcoesMousemoveMapaDefault[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function')
					eval(g_funcoesMousemoveMapaDefault[f]);
				}
				while(f--)
			}
		}
	};
	/*
	Function: verificaNavegaMapa
	
	Verifica se existem funções adicionais que devem ser executadas quando o usuário mover o mouse sobre o mapa.
	*/
	this.verificaNavegaMapa = function()
	{
		YAHOO.log("Verificando navegação", "i3geo");
		if (g_funcoesNavegaMapaDefault.length > 0)
		{
			var f = g_funcoesNavegaMapaDefault.length-1;
			if (f >= 0)
			{
				do
				{
					var temp = g_funcoesNavegaMapaDefault[f].replace("()", "");
					if(eval('typeof ' + temp) == 'function')
					eval(g_funcoesNavegaMapaDefault[f]);
				}
				while(f--)
			}
		}
		YAHOO.log("Concluído verificando navegação", "i3geo");
	};
}