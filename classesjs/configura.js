/*
Title: configura.js

Definição das variáveis de configuração da interface.

Aqui é feita a definição dos têrmos utilizados nos vários idiomas suportados pelo i3geo, definição dos
valores padrão das variáveis de configuração, definição do conteúdo do menu suspenso, definição das funções
que são executadas quando determinados eventos ocorrem, definição das funcionalidades dos botões, etc. 

O I3Geo utiliza variáveis (veja o item específico na documentação) globais que possibilitam 
alterar algumas das características da interface.
Essas variáveis recebem valores default quando o I3Geo é iniciado mas podem ser alterados 
antes da inicialização do mapa (método objmapa.inicializa()).
No arquivo aplicmapa/geral.htm existem exemplos de como fazer isso.
As variáveis globais podem também ser alteradas em tempo de execução.

Pode-se criar interfaces específicas com o i3geo onde essas variáveis são modificadas para atender
uma necessidade específica. Uma interface é um arquivo HTML que pode ser inicializado diretamente no navegador.
Veja o diretório i3geo/exemplos onde podem ser encontradas algumas interfaces.

Exemplo:

g_janelaMen = "nao"

objmapa = new Mapa()

objmapa.inicializa()

File: i3geo/classesjs/configura.js

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
Section: Variáveis de configuração
*/
/*
Variable: g_templateLegenda

Template HTML que será utilizado na geração da legenda HTML.

A sintaxe utilizada na montagem do template é baseado na sintaxe do próprio Mapserver.
O HTML pode ser armazenado em i3geo/aplicmap ou em um outro endereço no servidor.
O template serve para definir o layout da legenda que é mostrada quando a guia legenda é ativada.
Se for definido como "", é utilizado o template i3geo/aplicmapa/legenda.htm.
*/
g_templateLegenda = "";
/*
Variable: g_posicaoLenteX

Define o posicionamento da lente de aumento em relação ao corpo do mapa.

Veja:

<redesenho.js>
*/
g_posicaoLenteX = 0;
/*
Variable: g_posicaoLenteY

Define o posicionamento da lente de aumento em relação ao corpo do mapa.

Veja:

<redesenho.js>

*/
g_posicaoLenteY = 0;
/*
Variable: g_autoRedesenho

Ativa o auto redesenho do mapa conforme o intervalo de tempo definido em segundos.

Após decorrido o tempo definido, o mapa é redesenhado. Se for 0 o temporizador não é ativado.

Veja:

<funcoes.js>
*/
g_autoRedesenho = 0;
/*
Variable: g_tempo_aplicar (depreciado)
*/
/*
Variable: g_embedLegenda

Indica se a legenda deve ser incluida no corpo do mapa.

Veja:

<iniciamma.js>

Values:

sim|nao

*/
g_embedLegenda = "nao";
/*
Variable: g_3dmap

Variável que define o nome do map_file que possuí o layer para uso na função 3d.
Pode ser utilizado o caminho completo, se não, busca no diretório aplicmap.

O mapfile deve conter um layer para cálculo dos valores de Z para compor o modelo do relevo
sobre o qual o mapa será desenhado.

Por padrão, o i3geo utiliza o mapfile aplicmpa/3dmap.map

Veja:

<ferramentas/3d/index.js>

*/
g_3dmap = "";
/*
Variable: g_mostraRosa

Variável que define se a rosa dos ventos deve ser mostrada junto ao mouse.

A rosa dos ventos permite a navegação pelo mapa sem a necessidade de alterar a opção atual.
Por exemplo, pode-se navegar pelo mapa mesmo estando na opção de identificação.

O aparecimento da rosa é temporizada.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_mostraRosa = "sim";
/*
Variable: g_visual

Indica qual o tipo de visual para abertura do mapa.

Os visuais disponíveis são obtidos do diretório i3geo/imagens/visual.

Veja:

<funcoes.js>, <iniciamma.js>
*/
g_visual = "default";

/*
Variable: g_janelaMen (depreciado)
*/
/*
Variable: g_downloadbase (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de download dos dados.
*/
/*
Variable: g_conectargeorss (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de conexão com GeoRSS.
*/
/*
Variable: g_nuvemTags (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de busca de temas por tags.
*/
/*
Variable: g_uploadlocal (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de upload.
*/
/*
Variable: g_uploaddbf (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de upload de arquivo dbf.
*/
/*
Variable: g_conectarwms (depreciado)

Define se na árvore de adição de temas, será mostrada a opção de conexão com WMS.
*/
/*
Variable: g_docaguias

Variável que define se o mapa deve iniciar com as guias em janela ou não. As guias em janela causam o desenho de um mapa com tamanho extendido.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_docaguias = "nao";
/*
Variable: g_barraFerramentas1

Define se a barra de ferramentas 1 será aberta ou não no mapa.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_barraFerramentas1 = "sim";
/*
Variable: g_barraFerramentas2

Define se a barra de ferramentas 2 será aberta ou não no mapa.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_barraFerramentas2 = "sim";
/*
Variable: g_fatordezoom

Variável interna para a barra de zoom.

*/
g_fatordezoom = 0;
/*
Variable: g_diminuixM

Diminui a largura do mapa em pixels no caso do navegador ser o IE.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuixM = 20;
/*
Variable: g_diminuixN

Diminui a largura do mapa em pixels no caso do navegador ser o FF.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuixN = 25;
/*
Variable: g_diminuiyM

Diminui a altura do mapa em pixels no caso do navegador ser o IE.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuiyM = 106;
/*
Variable: g_diminuiyN

Diminui a altura do mapa em pixels no caso do navegador ser o FF.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuiyN = 103;
/*
Variable: g_mapaRefDisplay

Indica a visibilidade do mapa de referência na inicialização

Veja:

<iniciamma.js>

Values:

block|none

*/
g_mapaRefDisplay = "block";
/*
Variable: g_funcaoTip

Função ajax que será executada para mostrar informações em etiquetas.

A função é executada pelo CPAINT e avaliada com "eval".

Por padrão a função é a verificaTipDefault. Vc pode especificar uma outra função se for desejado.

Veja:

<funcoes.js>
*/
g_funcaoTip = "verificaTipDefault()";
/*
Variable: g_tempotip

Tempo utilizado para verificar se o mouse está parado.

Se o mouse estiver parado, a função de mostrar tip é ativada.

Veja:

<funcoes.js>
*/
g_tempotip = 2500;
/*
Variable: g_tipotip

Define como o tip será mostrado. O tipo simples mostra apenas os dados, sem o cabeçalho.

Veja:

<funcoes.js>

Values:

simples|completo
*/
g_tipotip = "completo";
/*
Variable: g_tipoimagem

Indica o tipo de filtro de imagem que está ativo.
O filtro ativo é aplicado sobre a imagem toda a vez que o mapa é refeito.

Veja:

<funcoes.js>, <iniciamma.js>, <redesenho.js>
*/
g_tipoimagem = "nenhum";
/*
Variable: g_sistemas

Nome do arquivo xml com a lista de sistemas que serão mostrados na guia de adição de temas.
O valor dessa variável é definido no arquivo "ms_configura.php" e é preenchida utilizando o ajax logo na inicialização do i3geo.
*/
g_sistemas = "";
/*
Variable: destacaTamanho

Valor em pixel do retângulo de destaque de temas utilizado na ferramenta destacatema.

Veja:

<funcoes.js>
*/
destacaTamanho = 75;
/*
Variable: g_entorno

Indica se o preenchimento do entorno do mapa está ou não ativo.
Utilizado para criar o efeito de auto-preenchimento do mapa quando é executada a função pan.
É alterada em uma opção específica no menu suspenso.

Veja:

<funcoes.js>, <iniciamma.js>, <redesenho.js>

Values:

sim|nao
*/
g_entorno = "nao";
/*
Variable: g_guiaativa

Indica qual guia do mapa iniciará ativa.

Veja:

<funcoes.js>, iniciamma.js>
*/
g_guiaativa = "guia1";
/*
Section: Eventos
*/
/*
Variable: g_funcoesMouseParado

Nome das funções padrão que serão executadas quando o usuário estaciona o mouse sobre o mapa por alguns instantes.

Veja:

<iniciamma.js>
*/
g_funcoesMouseParado = new Array(
	"pegaCoordenadaUTM()",
	"verificaTip()",
	"mostraRosaDosVentos()"
);
/*
Variable: g_funcoesClickMapaDefault

Nome das funções padrão que serão executadas quando o usuário clicar no mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções, além das padrão, utilizando-se o objeto objmapa.funcoesClickMapa

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.

Veja:

<iniciamma.js>
*/
g_funcoesClickMapaDefault = new Array(
	"cliqueIdentifica()",
	"cliqueInserexy()",
	"cliqueInseregrafico()",
	"cliqueInseretoponimo()",
	"cliqueSelecao()",
	"cliqueMede()",
	"cliqueArea()",
	"cliqueSelecaoPoli()",
	"cliqueCapturaPt()"
);
/*
Variable: g_funcoesMousemoveMapaDefault

Nome das funções padrão que serão executadas quando o usuário mover o mouse sobre o mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.

Veja:

<iniciamma.js>
*/
g_funcoesMousemoveMapaDefault = new Array(
	"movecursor()",
	"movePan()",
	"moveMede()",
	"movelentef()",
	"moveLonglat()",
	"moveSelecaoPoli()",
	"moveArea()",
	"atualizaLocalizarxy()"
);
/*
Variable: g_funcoesNevegaMapaDefault

Nome das funções padrão que serão executadas quando o usuário navegar pelo mapa.

Veja:

<iniciamma.js>
*/
g_funcoesNevegaMapaDefault = new Array(
	"atualizagoogle()",
	"atualizascielo()",
	"atualizawiki()",
	"atualizaconfluence()",
	"atualizaEscalaNumerica()"
);
/*
Variable: g_listaPropriedades (depreciado)
*/
/*
Section: Funcionalidades
*/
/*
Variable: oMenuData

Itens incluídos no menu suspenso

Veja:

<iniciamma.js>, <menususpenso.js>

Parâmetros:

text - texto que serámostrado na tela

url - função que será executada
*/
oMenuData = {
	"ajudas": [ 
	{ text: $trad("u1"), url: "http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332" },
	{ text: $trad("u2"), url: "javascript:abreDoc()" },
	{ text: $trad("u3"), url: "http://pt.wikibooks.org/wiki/I3geo" },
	{ text: $trad("u4"), url: "http://mapas.mma.gov.br/wikibooki3geo" },
	{ text: $trad("u5a"), url: "http://www.softwarepublico.gov.br" }
	],
	"analise": [
    { text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u22")+'</b></span>',url: "#"}, 
	{ text: $trad("u7"), url: "javascript:gradePol()"},
	{ text: $trad("u8"), url: "javascript:gradePontos()" },
	{ text: $trad("u9"), url: "javascript:gradeHex()" },
    { text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u23")+'</b></span>',url: "#"}, 
	{ text: $trad("u11a"), url: "javascript:distanciaptpt()" },
	{ text: $trad("u12"), url: "javascript:nptPol()" },
	{ text: $trad("u13"), url: "javascript:pontoempoligono()" },
	{ text: $trad("u14"), url: "javascript:pontosdistri()" },
    { text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u24")+'</b></span>',url: "#"}, 
	{ text: $trad("u11"), url: "javascript:centroide()" },
	{ text: $trad("u25"), url: "javascript:dissolve()" },
    { text: '<span style=color:gray;text-decoration:underline; ><b>'+$trad("u27")+'</b></span>',url: "#"}, 
	{ text: $trad("u6"), url: "javascript:analisaGeometrias()" },
	{ text: $trad("u10"), url: "javascript:buffer()" },
	{ text: $trad("u26"), url: "javascript:agrupaElementos()" }
	]
};
oMenuData.janelas = [
	{ text: $trad("u15"), url: "javascript:initJanelaZoom('1');initJanelaZoom('2')" },
	{ text: $trad("u16"), url: "javascript:i3GEO.ajuda.abreJanela()" }        
	];
oMenuData.arquivo = [
	{ text: $trad("u17"), url: "javascript:salvaMapa()" },
	{ text: $trad("u18"), url: "javascript:carregaMapa()" },
	{ text: $trad("u19"), url: "javascript:pegaimagens()" },
	{ text: $trad("u20"), url: "javascript:convertews()" },
	//{ text: $trad("u20a"), url: "javascript:abreKml('mapfile')" },
	{ text: $trad("u21"), url: "../geradordelinks.htm" }
	];
/*
Variable: g_listaFuncoesBotoes

Objeto com a lista de funcionalidades que serão adicionadas ao mapa.

Essa lista pode ser modificada antes da inicialização do mapa.

A montagem das operações é feita no iniciamma.js.

As funcionalidades apenas são incluídas se o elemento HTML indicado em iddiv existir. Por isso, caso uma função não seja desejada, basta excluir o div do HTML utilizado no mapa.


Veja:

<iniciamma.js>

Parâmetros:

iddiv - id do elemento onde a ferramenta será incluída

dica - dica de tela que será acrescentada ao evento onmouseover

conteudo - conteudo de iddiv que será acrescentado como innerHTML

funcaoonclick - funcao que será incluida no onclick

constroiconteudo - função que ativará a opção. Essa opção atua como a opção conteúdo, porém, executa uma função para preenchimento do div.

*/
g_listaFuncoesBotoes = {
	"botoes": [
	{
		//Insere a opção de zoom anterior e posterior.
		iddiv:"historicozoom",
		dica:$trad("d1"),
		constroiconteudo:'ativaHistoricoZoom("historicozoom")'
	},
	{
		//Insere a opção de localização de coordenadas.
		iddiv:"localizarxy",
		dica:$trad("d1"),
		constroiconteudo:'ativaLocalizarxy("localizarxy")'
	},
	{
		//Ativa o botão que realiza a operação de zoom para a extensão total do mapa.
		iddiv:"zoomtot",
		dica:$trad("d2"),
		funcaoonclick:function(){i3GEO.navega.zoomExt(g_locaplic,g_sid,g_tipoimagem,objmapa.extentTotal);}
	},
	{
		//Ativa o botão que realiza a operação de zoom interativo.
		iddiv:"zoomli",
		dica:$trad("d3"),
		funcaoonclick:function()
		{mudaiconf('zoomli');g_operacao='navega';}
	},
	{
		//Ativa o botão que realiza a operação de deslocamento (pan).
		iddiv:"pan",
		dica:$trad("d4"),
		funcaoonclick:function()
		{mudaiconf('pan');g_tipoacao='pan';g_operacao='navega';}
	},
	{
		//botão que realiza a operação de zoom in.
		iddiv:"zoomiauto",
		dica:$trad("d5"),
		funcaoonclick:function(){i3GEO.navega.zoomin(g_locaplic,g_sid);}
	},
	{
		//botão que realiza a operação de zoom out
		iddiv:"zoomoauto",
		dica:$trad("d6"),
		funcaoonclick:function(){i3GEO.navega.zoomout(g_locaplic,g_sid);}
	},
	{
		//botão que abre a função de identificação.
		iddiv:"identifica",
		dica:$trad("d7"),
		funcaoonclick:function()
		{mudaiconf('identifica');g_operacao='identifica';}
	},
	{
		//botão que abre a janela com o valor da extensão geográfica do mapa atual
		iddiv:"exten",
		dica:$trad("d8"),
		funcaoonclick:function()
		{mostraExten();}
	},
	{
		//botão que abre a janela com o mapa de referência
		iddiv:"referencia",
		dica:$trad("d9"),
		funcaoonclick:function()
		{initJanelaRef();}
	},
	{
		//apresentação da escala numérica
		iddiv:"escala",
		dica:$trad("d10"),
		constroiconteudo:'ativaEscalaNumerica("escala")'
	},
	{
		//botão de busca na wikipedia
		iddiv:"wiki",
		dica:$trad("d11"),
		funcaoonclick:function()
		{wiki();}
	},
	{
		//botão de busca de fotos
		iddiv:"buscafotos",
		dica:"Fotos",
		funcaoonclick:function()
		{buscafotos();}
	},
	{
		//botão de impressão
		iddiv:"imprimir",
		dica:$trad("d12"),
		funcaoonclick:function()
		{imprimir();}
	},
	{
		//botão de localização do usuário pelo IP
		iddiv:"ondeestou",
		dica:$trad("d13"),
		funcaoonclick:function()
		{i3GEO.navega.zoomIP(g_locaplic,g_sid);}
	},
	{
		//abre a opção de geração de um modelo virtual de elevação
		iddiv:"v3d",
		dica:$trad("d14"),
		funcaoonclick:function()
		{wdocaf("400px","200px",g_locaplic+"/ferramentas/3d/index.htm","","","3d");}
	},
	{
		//Ativa o botão que realiza a operação de de busca no Google
		iddiv:"google",
		dica:$trad("d15"),
		funcaoonclick:function()
		{google();}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site Scielo
		iddiv:"scielo",
		dica:$trad("d16"),
		funcaoonclick:function()
		{scielo();}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site confluence
		iddiv:"confluence",
		dica:$trad("d17"),
		funcaoonclick:function()
		{confluence();}
	},
	{
		//Ativa o botão que abre a lente de aumento
		iddiv:"lentei",
		dica:$trad("d18"),
		funcaoonclick:function()
		{lenteDeAumento();}
	},
	{
		//Coloca as guias em uma janela móvel
		iddiv:"encolheFerramentas",
		dica:$trad("d19"),
		funcaoonclick:function()
		{docaguias();}
	},
	{
		//botão de reinicialização do mapa que restaura as condições iniciais do mapa
		iddiv:"reinicia",
		dica:$trad("d20"),
		funcaoonclick:function()
		{reiniciaMapa();}
	},
	{
		//botão de medição de distâncias
		iddiv:"mede",
		dica:$trad("d21"),
		funcaoonclick:function()
		{mede();}
	},
	{
		//botão de medição de área
		iddiv:"area",
		dica:$trad("d21a"),
		funcaoonclick:function()
		{area();}
	},
	{
		//botão de digitalização
		iddiv:"inserexy",
		dica:$trad("d22"),
		funcaoonclick:function()
		{inserexy();}
	},
	{
		//botão de inclusão de gráficos
		iddiv:"inseregrafico",
		dica:$trad("d23"),
		funcaoonclick:function()
		{inseregrafico();}
	},
	{
		//botão de seleção
		iddiv:"selecao",
		dica:$trad("d24"),
		funcaoonclick:function()
		{selecao();}
	},
	{
		//botão de inserção de toponímia
		iddiv:"textofid",
		dica:$trad("d25"),
		funcaoonclick:function()
		{textofid();}
	},
	{
		//opções de alteração do visual do mapa
		iddiv:"visual",
		dica:$trad("d26"),
		funcaoonclick:"",
		constroiconteudo:'visual("visual")'
	},
	{
		//monta o menu suspenso
		iddiv:"menus",
		constroiconteudo:'montaMenuSuspenso("menus")'
	},
	{
		//ativa as opções de busca rápida
		iddiv:"buscaRapida",
		constroiconteudo:'ativaBuscaRapida("buscaRapida")'
	},
	{
		//sobe os botoes da barra de ferramentas
		iddiv:"sobeferramentas",
		funcaoonclick:function()
		{sobeferramentas();}
	},
	{
		//desce os botoes da barra de ferramentas
		iddiv:"desceferramentas",
		funcaoonclick:function()
		{desceferramentas();}
	}	
]};
