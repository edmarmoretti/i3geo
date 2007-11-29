/*
Title: Configuração da interface.

Definição das variáveis de configuração da interface.

O I3Geo utiliza variáveis (veja o item específico na documentação) globais que possibilitam alterar algumas das características da interface.
Essas variáveis recebem valores default quando o I3Geo é iniciado mas podem ser alterados antes da inicialização do mapa (método inicializa()).
No arquivo aplicmapa/geral.htm existem exemplos de como fazer isso.
As variáveis globais podem também ser alteradas em tempo de execução.

Exemplo:

g_janelaMen = "nao"

objmapa = new Mapa()

objmapa.inicializa()

File: configura.js

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
Variable: g_traducao

Termos utilizados na interface conforme a linguagem

*/
g_traducao = {
//texto da janela de mensagens
"p1": [
{
pt:"O I3Geo &eacute; software livre! Para download clique <a href='http://mapas.mma.gov.br/download' target=blank >aqui</a>"
}],
//lista de propriedades do mapa
"p2": [
{
pt:"Tipo de imagem"
}],
"p3": [
{
pt: "Legenda"
}],
"p4": [
{
pt:"Escala"
}],
"p5": [
{
pt: "Tamanho"
}],
"p6": [
{
pt: "Ativa/desativa entorno"
}],
"p7": [
{
pt: "Ativa/desativa logo"
}],
"p8": [
{
pt: "Cor da selecao"
}],
"p9": [
{
pt: "Cor do fundo"
}],
"p10": [
{
pt: "Grade de coordenadas"
}],
"p11": [
{
pt: "Template"
}],
"p12": [
{
pt: "Temporizador"
}],
"p13": [
{
pt: "Propriedades do mapa"
}],
//itens do menu suspenso
"s1": [
{
pt: "Ajuda?"
}],
"s2": [
{
pt: "An&aacute;lise"
}],
"s3": [
{
pt: "Janelas"
}],
"s4": [
{
pt: "Arquivo"
}],
"s5": [
{
pt: "Propriedades"
}],
//submenus
"u1": [
{
pt: "Sobre o I3Geo"
}],
"u2": [
{
pt: "Sistema"
}],
"u3": [
{
pt: "WikiBook"
}],
"u4": [
{
pt: "Tutoriais"
}],
"u5": [
{
pt: "Blog"
}],
"u6": [
{
pt: "Geometrias"
}],
"u7": [
{
pt: "Grade de poligonos"
}],
"u8": [
{
pt: "Grade de pontos"
}],
"u9": [
{
pt: "Grade de hex&aacute;gonos"
}],
"u10": [
{
pt: "Entorno(Buffer)"
}],
"u11": [
{
pt: "Centr&oacute;ide"
}],
"u12": [
{
pt: "N pontos em poligono"
}],
"u13": [
{
pt: "Ponto em poligono/raster"
}],
"u14": [
{
pt: "Distribui&ccedil;&atilde;o de pontos"
}],
"u15": [
{
pt: "Barras de ferramentas"
}],
"u16": [
{
pt: "Janela de mensagens"
}],
"u17": [
{
pt: "Salvar mapa"
}],
"u18": [
{
pt: "Carregar mapa"
}],
"u19": [
{
pt: "Pegar imagens"
}],
"u20": [
{
pt: "Converter em WMS"
}],
"u21": [
{
pt: "Gerador de links"
}],
//arvore com a lista de temas
"t1": [
{
pt: "Camadas"
}],
"t2":[
{
pt:"arraste o tema aqui para excluir"
}],
"t3":[
{
pt:"Clique para ligar ou desligar esse tema, mostrando-o ou n&atilde;o no mapa. Ap&oacute;s alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no bot&atilde;o aplicar que ser&aacute; mostrado."
}],
"t4":[
{
pt:"limpa sele&ccedil;&atilde;o"
}],
"t5":[
{
pt:"Limpa sele&ccedil;&atilde;o existente nesse tema"
}],
"t6":[
{
pt:"Clique para fazer o download desse tema no formato shapefile"
}],
"t7":[
{
pt:"clique e arraste"
}],
"t8":[
{
pt:"arraste para mudar a ordem"
}],

"t9":[
{
pt:"A escala do tema &eacute; compat&iacute;vel com a escala do mapa"
}],
"t10":[
{
pt:"A escala do tema &eacute incompat&iacute;vel com a escala do mapa"
}],
"t11":[
{
pt:"A escala do tema n&atilde;o &eacute conhecida"
}],
"t12":[
{
pt:"excluir"
}],
"t12a":[
{
pt:"Clique para excluir esse tema do mapa."
}],
"t13":[
{
pt:"sobe"
}],
"t14":[
{
pt:"Clique para subir esse tema na ordem de desenho"
}],
"t15":[
{
pt:"desce"
}],
"t16":[
{
pt:"Clique para descer esse tema na ordem de desenho"
}],
"t17":[
{
pt:"zoom para o tema"
}],
"t18":[
{
pt:"Clique para ajustar o mapa de forma a mostrar todo o tema"
}],
"t18a":[
{
pt:"Op&ccedil;&otilde;es"
}],
"t18b":[
{
pt:"Legenda"
}],
"t19":[
{
pt:"Altera a transparência do tema, possibilitando que as camadas inferiores possam ser vistas."
}],
"t20":[
{
pt:"opacidade:"
}],
"t21a":[
{
pt:"Muda o nome atual do tema. Utilize para melhorar a legenda do mapa."
}],
"t21":[
{
pt:"novo nome:"
}],
"t22":[
{
pt:"Localize elementos no tema com base em seus atributos descritivos."
}],
"t23":[
{
pt:"procurar..."
}],
"t24":[
{
pt:"Crie uma nova camada no mapa para apresentar textos descritivos sobre esse tema, tendo como base a tabela de atributos."
}],
"t25":[
{
pt:"texto..."
}],
"t26":[
{
pt:"Defina as etiquetas que ser&atilde;o mostradas quando o mouse &eacute; estacionado sobre um elemento desse tema."
}],
"t27":[
{
pt:"etiquetas..."
}],
"t28":[
{
pt:"Insira um filtro nesse tema para mostrar apenas determinadas informa&ccedil;&otilde;es, com base na tabela de atributos."
}],
"t29":[
{
pt:"filtro..."
}],
"t30":[
{
pt:"Veja a tabela de atributos relacionada a esse tema."
}],
"t31":[
{
pt:"tabela..."
}],
"t32":[
{
pt:"Abre o editor de legenda, permitindo a alteração da forma de representação desse tema."
}],
"t33":[
{
pt:"editar legenda..."
}],
"t34":[
{
pt:"Mostra os dados desse tema em uma janela que acompanha o mouse."
}],
"t35":[
{
pt:"mostra em janela..."
}],
//guia adiciona
"a1":[
{
pt:"procurar:"
}],
"a2":[
{
pt:"Upload de arquivo local"
}],
"a3":[
{
pt:"Download de dados"
}],
"a4":[
{
pt:"Conectar com servidor WMS"
}],
"a5":[
{
pt:"Conectar com GeoRss"
}],
"a6":[
{
pt:"Acesso aos arquivos do servidor"
}],
"a7":[
{
pt:"Temas"
}],
"a8":[
{
pt:"Clique para ligar ou desligar esse tema, mostrando-o ou não no mapa. Após alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no botão aplicar que será mostrado."
}],
"a9":[
{
pt:"fonte"
}],
"a10":[
{
pt:"c&oacute;digo:"
}],
"a11":[
{
pt:"Sistemas"
}],
"a12":[
{
pt:"Abrir sistema"
}],
//guias principais
"g1":[
{
pt:"Temas"
}],
"g2":[
{
pt:"Adiciona"
}],
"g3":[
{
pt:"Legenda"
}],
"g4":[
{
pt:"Mapas"
}],
//outros
"o1":[
{
pt:"Aguarde..."
}],
"o2":[
{
pt:"busca r&aacute;pida..."
}],
"o3":[
{
pt:"Lendo imagem..."
}],
"o4":[
{
pt:"Aguarde...abrindo lente"
}],
"o5":[
{
pt:"Aguarde...iniciando"
}],
//dicas das ferramentas
"d1":[
{
pt:"Digite as coordenadas de um ponto (X=longitude e Y=latitude) para localiz&acute;-lo no mapa. O centro do mapa ser&acute; deslocado para o ponto digitado."
}],
"d2":[
{
pt:"Altera a escala do mapa ajustando-a para mostrar a mesma abrang&circ;ncia geogr&aacute;fica da inicializa&ccedil;&atilde;o."
}],
"d3":[
{
pt:"Amplia o mapa - coloca o ponto clicado no centro da tela ou amplia a regi&atilde;o indicada por um ret&acirc;ngulo.Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa na &aacute;rea de zoom desejada."
}],
"d4":[
{
pt:"Desloca a regi&atilde;o vis&iacute;vel no mapa. Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa para deslocar a regi&atilde;o vis&iacute;vel."
}],
"d5":[
{
pt:"Amplia o mapa tendo como refer&ecirc;cia o centro atual."
}],
"d6":[
{
pt:"Reduz o mapa tendo como refer&ecirccia o centro atual."
}],
"d7":[
{
pt:"Mostra informa&ccedil;&otilde;es sobre um ponto no mapa. Ap&oacute;s ativada, pare o mouse por alguns instantes no ponto desejado ou clique sobre o mesmo."
}],
"d8":[
{
pt:"Mostra a extens&atilde;o geogr&aacute;fica atual em coordenadas geogr&aacute;ficas"
}],
"d9":[
{
pt:"Abre-fecha o mapa de refer&ecirc;ncia"
}],
"d10":[
{
pt:"Digite o novo valor de escala e clique no bot&atilde;o aplicar para alterar a escala do mapa"
}],
"d11":[
{
pt:"Busca dados na Wikipedia na abrang&ecirc;ncia atual do mapa. Fa&ccedil;a um zoom no mapa antes de abrir essa op&ccedil;&atilde;o. Regi&ocirc;es muito extensas podem tornar a busca muito demorada"
}],
"d12":[
{
pt:"Imprime o mapa"
}],
"d13":[
{
pt:"Localiza o IP do usu&aacute;rio no mapa"
}],
"d14":[
{
pt:"Gera arquivo para 3d"
}],
"d15":[
{
pt:"Abre o Google Maps, mostrando uma imagem de sat&eacute;lite da regi&atilde;o vista no mapa principal"
}],
"d16":[
{
pt:"Pesquisa documentos na base de dados Scielo (dados preliminares)"
}],
"d17":[
{
pt:"Projeto Confluence. Pontos de intersec&ccedil;&atilde;o de coordenadas observadas em campo"
}],
"d18":[
{
pt:"Abre lente de amplia&ccedil;&atilde;o"
}],
"d19":[
{
pt:"Coloca as guias em uma janela m&oacute;vel"
}],
"d20":[
{
pt:"Redesenha o mapa com as configura&ccedil;&ocirc;es iniciais."
}],
"d21":[
{
pt:"Mede a dist&acirc;ncia entre dois ou mais pontos clicados no mapa (menor dist&acirc;ncia). O c&aacute;lculo de dist&acirc;ncia &eacute; aproximado e sua precis&atilde;o depende da escala do mapa."
}],
"d22":[
{
pt:"Insere pontos no mapa em coordenadas geogr&aacute;ficas. Os pontos inclu&iacute;dos podem ser transformados em linhas ou pol&iacute;gonos. Os pontos s&atilde;o armazenados em um tema tempor&aacute;rio, podendo-se fazer o download do arquivo shapefile."
}],
"d23":[
{
pt:"Insere um gr&aacute;fico no ponto clicado conforme os atributos existentes no tema escolhido. O tema deve possuir itens com valores num&eacute;ricos na tabela de atributos."
}],
"d24":[
{
pt:"Abre as ferramentas para sele&ccedil;&atilde;o de elementos de um tema. Os elementos selecionados podem ser utilizados em outras opera&ccedil;&ocirc;es, como buffer e sele&ccedil;&atilde;o por tema."
}],
"d25":[
{
pt:"Insere texto no mapa clicando em um ponto. Utilize essa op&ccedil;&atilde;o para adicionar informa&ccedil;&ocirc;es ao mapa."
}],
"d26":[
{
pt:"Escolha o visual para os botões e outras caracter&iacute;sticas visuais do mapa"
}]
};

/*
Variable: g_linguagem

Língua utilizada na interface.

*/
g_linguagem = "pt";
/*
Variable: g_posicaoLenteX

Posicionamento da lente de aumento em x.

*/
g_posicaoLenteX = 0;
/*
Variable: g_posicaoLenteY

Posicionamento da lente de aumento em y.

*/
g_posicaoLenteY = 0;
/*
Variable: g_autoRedesenho

Ativa o auto redesenho após um determinado tempo.

Após decorrido o tempo definido, o mapa é redesenhado. Se for 0 o temporizador não é ativado.
*/
g_autoRedesenho = 0;
/*
Variable: g_embedLegenda

Indica se a legenda deve ser incluida no corpo do mapa.

Values:

sim|nao

*/
g_embedLegenda = "nao";
/*
Variable: g_3dmap

Variável que define o nome do map_file que possuí o layer para uso na função 3d.
Pode ser caminho completo. Se não, busca no aplicmap.

*/
g_3dmap = "";
/*
Variable: g_opcoesTemas

Variável que define se as opcoes adicionais de cada tema serao mostradas. As opções são aquelas apresentadas na lista de temas do mapa quando um tema é expandido.

Values:

sim|nao

*/
g_opcoesTemas = "sim";
/*
Variable: g_mostraRosa

Variável que define se a rosa dos ventos deve ser mostrada junto ao mouse. A rosa dos ventos permite a navegação pelo mapa sem a necessidade de alterar a opção atual. Por exemplo, pode-se navegar pelo mapa mesmo estando na opção de identificação.

O aparecimento da rosa é temporizada.

Values:

sim|nao
*/
g_mostraRosa = "sim";
/*
Variable: g_visual

Indica qual o tipo de visual para abertura do mapa.

Os visuais disponíveis são obtidos do diretório i3geo/imagens/visual na inicialização do i3geo.
*/
g_visual = "default";

/*
Variable: g_janelaMen

Define se a janela de mensagens começará aberta.

Values:

siim|nao
*/
g_janelaMen = "sim";
/*
Variable: g_downloadbase

Define se na guia 2 será mostrada a opção de download dos dados.

Values:

sim|nao
*/
g_downloadbase = "sim";
/*
Variable: g_conectargeorss

Define se na guia 2 será mostrada a opção de conexão com GeoRSS.

Values:

sim|nao
*/
g_conectargeorss = "sim";
/*
Variable: g_uploadlocal

Variável que define se na guia 2 será mostrada a opção de upload.

Values:

sim|nao
*/
g_uploadlocal = "sim";
/*
Variable: g_conectarwms

Variável que define se na guia 2 será mostrada a opção de conexão com WMS.

Values:

sim|nao
*/
g_conectarwms = "sim";
/*
Variable: g_docaguias

Variável que define se o mapa deve iniciar com as guias em janela ou não. As guias em janela causam o desenho de um mapa com tamanho extendido.

Values:

sim|nao
*/
g_docaguias = "nao";
/*
Variable: g_barraFerramentas1

Define se a barra de ferramentas 1 será aberta ou não no mapa.

Values:

sim|nao
*/
g_barraFerramentas1 = "sim";
/*
Variable: g_barraFerramentas2

Define se a barra de ferramentas 2 será aberta ou não no mapa.

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

*/
g_diminuixM = 20;
/*
Variable: g_diminuixN

Diminui a largura do mapa em pixels no caso do navegador ser o FF.

*/
g_diminuixN = 25;
/*
Variable: g_diminuiyM

Diminui a altura do mapa em pixels no caso do navegador ser o IE.

*/
g_diminuiyM = 106;
/*
Variable: g_diminuiyN

Diminui a altura do mapa em pixels no caso do navegador ser o FF.

*/
g_diminuiyN = 103;
/*
Variable: g_mapaRefDisplay

Indica a visibilidade do mapa de referência na inicialização

Values:

block|none

*/
g_mapaRefDisplay = "block";
/*
Variable: g_funcaoTip

Função ajax que será executada para mostrar informações do tipo TIP.

A função é executada pelo CPAINT e avaliada com "eval".

Por padrão a função é a verificaTipDefault
*/
g_funcaoTip = "verificaTipDefault()";
/*
Variable: g_tempotip

Tempo utilizado para verificar se o mouse está parado.

Se o mouse estiver parado, a função de mostrar tip é ativada.
*/
g_tempotip = 4500;
/*
Variable: g_tipotip

Define como o tip será mostrado.

Values:

simples|completo
*/
g_tipotip = "completo";
/*
Variable: g_tipoimagem

Indica o tipo de filtro de imagem que está ativo. O filtro ativo é aplicado sobre a imagem toda a vez que o mapa é refeito.
*/
g_tipoimagem = "nenhum";
/*
Variable: g_sistemas

Nome do arquivo xml com a lista de sistemas que serão mostrados na guia de adição de temas.
O valor dessa variável é definido no arquivo "ms_configura.php" e é preenchida utilizando o ajax.
*/
g_sistemas = "";
/*
Variable: destacaTamanho

Valor em pixel do retângulo de destaque de temas.
*/
destacaTamanho = 75;
/*
Variable: g_mensagempadrao

Mensagem padrão que será mostrada na janela de mensagens.
*/
g_mensagempadrao = $trad("p1");//"O I3Geo &eacute; software livre! Para download clique <a href='http://mapas.mma.gov.br/download' target=blanck >aqui</a>";
/*
Variable: g_entorno

Indica se o preenchimento do entorno do mapa está ou não ativo.
Utilizado para criar o efeito de auto-preenchimento do mapa quando é executada a função pan.
É alterada em uma opção específica no menu suspenso.

Values:

sim|nao
*/
g_entorno = "nao";
/*
Variable: g_guiaativa

Indica qual guia do mapa iniciará ativa.
*/
g_guiaativa = "guia1";
/*
Variable: g_funcoesClickMapaDefault

Nome das funções padrão que serão executadas quando o usuário clicar no mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções, além das padrão, utilizando-se o objeto objmapa.funcoesClickMapa

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.
*/
g_funcoesClickMapaDefault = new Array(
	"cliqueIdentifica()",
	"cliqueInserexy()",
	"cliqueInseregrafico()",
	"cliqueInseretoponimo()",
	"cliqueSelecao()",
	"cliqueMede()",
	"cliqueSelecaoPoli()",
	"cliqueCapturaPt()"
);
/*
Variable: g_funcoesMousemoveMapaDefault

Nome das funções padrão que serão executadas quando o usuário mover o mouse sobre o mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.
*/
g_funcoesMousemoveMapaDefault = new Array(
	"movecursor()",
	"movePan()",
	"moveMede()",
	"movelentef()",
	"moveLonglat()",
	"moveSelecaoPoli()"
);

/*
Variable: g_listaPropriedades

Objeo com as funções que são incluidas no item propriedades do mapa

Parameters:

text - texto que será mostrado na tela

url - função que será executada
*/
g_listaPropriedades = {
	"propriedades": [
	{ text: "p2", url: "javascript:tipoimagem()" },
	{ text: "p3", url: "javascript:opcoesLegenda()" },
	{ text: "p4", url: "javascript:opcoesEscala()" },
	{ text: "p5", url: "javascript:tamanho()" },
	{ text: "p7", url: "javascript:ativaLogo()" },
	{ text: "p8", url: "javascript:queryMap()" },
	{ text: "p9", url: "javascript:corFundo()" },
	{ text: "p10", url: "javascript:gradeCoord()" }
]};
/*
Variable: oMenuData

Itens incluídos no menu suspenso


Parameters:

text - texto que serámostrado na tela

url - função que será executada
*/
oMenuData = {
	"ajudas": [ 
	{ text: $trad("u1"), url: "javascript:g_hlpt = 'sobrei3geo';ajudaf('abre')" },
	{ text: $trad("u2"), url: "javascript:abreDoc()" },
	{ text: $trad("u3"), url: "http://pt.wikibooks.org/wiki/I3geo" },
	{ text: $trad("u4"), url: "http://mapas.mma.gov.br/wikibooki3geo" },
	{ text: $trad("u5"), url: "http://sistemas.mma.gov.br/blogs/index.php?blog=6" }
	],
	"analise": [
	{ text: $trad("u6"), url: "javascript:analisaGeometrias()" },
	{ text: $trad("u7"), url: "javascript:gradePol()" },
	{ text: $trad("u8"), url: "javascript:gradePontos()" },
	{ text: $trad("u9"), url: "javascript:gradeHex()" },
	{ text: $trad("u10"), url: "javascript:buffer()" },
	{ text: $trad("u11"), url: "javascript:centroide()" },
	{ text: $trad("u12"), url: "javascript:nptPol()" },
	{ text: $trad("u13"), url: "javascript:pontoempoligono()" },
	{ text: $trad("u14"), url: "javascript:pontosdistri()" }
	]
};
oMenuData.janelas = [
	{ text: $trad("u16"), url: "javascript:initJanelaMen()" }        
	];
oMenuData.arquivo = [
	{ text: $trad("u17"), url: "javascript:salvaMapa()" },
	{ text: $trad("u18"), url: "javascript:carregaMapa()" },
	{ text: $trad("u20"), url: "javascript:convertews()" },
	{ text: $trad("u21"), url: "../geradordelinks.htm" }
	];
/*
Variable: g_listaFuncoesBotoes

Objeto com a lista de funcionalidades que serão adicionadas ao mapa.

Essa lista pode ser modificada antes da inicialização do mapa.

A montagem das operações é feita no iniciamma.js.

As funcionalidades apenas são incluídas se o elemento HTML indicado em iddiv existir. Por isso, caso uma função não seja desejada, basta excluir o div do HTML utilizado no mapa.

Parameters:

iddiv - id do elemento onde a ferramenta será incluída

dica - dica de tela que será acrescentada ao evento onmouseover

conteudo - conteudo de iddiv que será acrescentado como innerHTML

funcaoonclick - funcao que será incluida no onclick

constroiconteudo - função que ativará a opção. Essa opção atua como a opção conteúdo, porém, executa uma função para preenchimento do div.

*/
g_listaFuncoesBotoes = {
	"botoes": [
	{
		//Insere a opção de localização de coordenadas.
		iddiv:"localizarxy",
		dica:$trad("d1"),
		conteudo:"localiza X:<input class=digitar id='xg' title='grau' type=text size=5 value='-00'/>&nbsp;<input class=digitar id='xm' title='minuto' type=text size=3 value='00'/>&nbsp;<input class=digitar id='xs' title='segundo' type=text size=5 value='00.00'/>&nbsp;&nbsp;Y:<input class=digitar id='yg' title='grau' type=text size=3 value='-00'/>&nbsp;<input class=digitar id='ym' title='minuto' type=text size=3 value='00'/>&nbsp;<input class=digitar id='ys' title='segundo' type=text size=5 value='00.00'/><img  title='zoom' onclick='zoomPonto()' src=\"+$im(\"tic.png\")+\" id=procurarxy />"
	},
	{
		//Ativa o botão que realiza a operação de zoom para a extensão total do mapa.
		iddiv:"zoomtot",
		dica:$trad("d2"),
		funcaoonclick:function(){zoomtot();}
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
		funcaoonclick:function()
		{zoomiauto();}
	},
	{
		//botão que realiza a operação de zoom out
		iddiv:"zoomoauto",
		dica:$trad("d6"),
		funcaoonclick:function()
		{zoomoauto();}
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
		{mensagemf(objmapa.extent);}
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
		conteudo:"1:<input class='digitar' type='text' onchange='javascript:aplicaescala()' id=escalanum size=19 value=''/><img src=\"+$im(\"tic.png\")+\" onclick='javascript:aplicaescala()' />"
	},
	{
		//botão de busca na wikipedia
		iddiv:"wiki",
		dica:$trad("d11"),
		funcaoonclick:function()
		{wiki();}
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
		{zoomIP();}
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
		//ativa as opções de busca rápida
		iddiv:"buscaRapida",
		constroiconteudo:'ativaBuscaRapida("buscaRapida")'
	}
]};
