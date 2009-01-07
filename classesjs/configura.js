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
Variable: g_funcoesClickMapaDefault

Nome das funções padrão que serão executadas quando o usuário clicar no mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções, além das padrão, utilizando-se o objeto objmapa.funcoesClickMapa

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.

Veja:

<iniciamma.js>
*/
g_funcoesClickMapaDefault = new Array(
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
	"movePan()",
	"moveLonglat()",
	"moveSelecaoPoli()"
);
/*
Variable: g_funcoesNavegaMapaDefault

Nome das funções padrão que serão executadas quando o usuário navegar pelo mapa.

Veja:

<iniciamma.js>
*/
g_funcoesNavegaMapaDefault = new Array(
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
	{ text: $trad("u5a"), url: "http://www.softwarepublico.gov.br" },
	{ text: "i3Geo Blog", url: "http://sistemas.mma.gov.br/blogs/index.php?blog=6" }
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
	{ text: $trad("u19"), url: "javascript:i3GEO.gadgets.quadros.listaImagens()" },
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
		tipo:"",
		dica:$trad("d1"),
		constroiconteudo:'ativaHistoricoZoom("historicozoom")'
	},
	{
		//Ativa o botão que realiza a operação de zoom para a extensão total do mapa.
		iddiv:"zoomtot",
		tipo:"",
		dica:$trad("d2"),
		funcaoonclick:function(){
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,g_tipoimagem,objmapa.extentTotal);
			marcadorZoom = "";
		}
	},
	{
		//Ativa o botão que realiza a operação de zoom interativo.
		iddiv:"zoomli",
		tipo:"dinamico",
		dica:$trad("d3"),
		funcaoonclick:function(){
			g_operacao='navega';
			g_tipoacao='zoomli';
			i3GEO.barraDeBotoes.ativaIcone("zoomli");
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","img",i3GEO.configura.locaplic);
			}
			marcadorZoom = "";
		}
	},
	{
		//Ativa o botão que realiza a operação de deslocamento (pan).
		iddiv:"pan",
		tipo:"dinamico",
		dica:$trad("d4"),
		funcaoonclick:function(){
			g_tipoacao='pan';
			g_operacao='navega';
			i3GEO.barraDeBotoes.ativaIcone("pan");
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"pan","img",i3GEO.configura.locaplic);
			}
			marcadorZoom = "";
		}
	},
	{
		//botão que realiza a operação de zoom in.
		iddiv:"zoomiauto",
		tipo:"",
		dica:$trad("d5"),
		funcaoonclick:function(){
			i3GEO.navega.zoomin(i3GEO.configura.locaplic,i3GEO.configura.sid);
			marcadorZoom = "";
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
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"identifica","img",i3GEO.configura.locaplic);
			}
			i3GEO.barraDeBotoes.ativaIcone("identifica");
			g_tipoacao='identifica';
			cliqueIdentifica = function(){
				if (g_tipoacao == "identifica")
				{wdocaf("450px","250px",i3GEO.configura.locaplic+'/ferramentas/identifica/index.htm?&x='+objposicaocursor.ddx+'&y='+objposicaocursor.ddy+'&escala='+objmapa.scale,"","","Identifica");}
			};
			if(g_funcoesClickMapaDefault.toString().search("cliqueIdentifica()") < 0)
			{g_funcoesClickMapaDefault.push("cliqueIdentifica()");}
		}
	},
	{
		//botão que abre a janela com o valor da extensão geográfica do mapa atual
		iddiv:"exten",
		tipo:"",
		dica:$trad("d8"),
		funcaoonclick:function()
		{wdocaf("450px","340px",i3GEO.configura.locaplic+"/ferramentas/mostraexten/index.htm","","","Extensão geográfica");}
	},
	{
		//botão que abre a janela com o mapa de referência
		iddiv:"referencia",
		tipo:"",
		dica:$trad("d9"),
		funcaoonclick:function()
		{initJanelaRef();}
	},
	{
		//botão de busca na wikipedia
		iddiv:"wiki",
		tipo:"",
		dica:$trad("d11"),
		funcaoonclick:function(){
			g_operacao = "navega";
			wdocaf("450px","190px",i3GEO.configura.locaplic+"/ferramentas/wiki/index.htm","","","Wiki");
			if(g_funcoesNavegaMapaDefault.toString().search("atualizawiki()") < 0)
			{g_funcoesNavegaMapaDefault.push("atualizawiki()");}		
		}
	},
	{
		//botão de busca de fotos
		iddiv:"buscafotos",
		tipo:"",
		dica:"Fotos",
		funcaoonclick:function(){
			g_operacao = "navega";
			wdocaf("550px","400px",i3GEO.configura.locaplic+"/ferramentas/buscafotos/index.htm","","","Fotos");
			i3GEO.util.criaPin();
		}
	},
	{
		//botão de impressão
		iddiv:"imprimir",
		tipo:"",
		dica:$trad("d12"),
		funcaoonclick:function()
		{wdocaf("320px","180px",i3GEO.configura.locaplic+"/ferramentas/imprimir/index.htm","","","Imprimir");}
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
		{wdocaf("400px","200px",i3GEO.configura.locaplic+"/ferramentas/3d/index.htm","","","3d");}
	},
	{
		//Ativa o botão que realiza a operação de de busca no Google
		iddiv:"google",
		tipo:"",
		dica:$trad("d15"),
		funcaoonclick:function(){
			i3GEO.util.criaBox();
			g_operacao = "navega";
			if(navn){wdocaf((objmapa.w/2)+20+"px",(objmapa.h/2)+20+"px",i3GEO.configura.locaplic+"/ferramentas/googlemaps/index.php","","","Google maps");}
			else
			{wdocaf("500px","380px",i3GEO.configura.locaplic+"/ferramentas/googlemaps/index.php","","","Google maps");}
			if(g_funcoesNavegaMapaDefault.toString().search("atualizagoogle()") < 0)
			{g_funcoesNavegaMapaDefault.push("atualizagoogle()");}		
		}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site Scielo
		iddiv:"scielo",
		tipo:"",
		dica:$trad("d16"),
		funcaoonclick:function(){
			g_operacao = "navega";
			wdocaf("450px","190px",i3GEO.configura.locaplic+"/ferramentas/scielo/index.htm","","","Scielo");
			if(g_funcoesNavegaMapaDefault.toString().search("atualizascielo()") < 0)
			{g_funcoesNavegaMapaDefault.push("atualizascielo()");}
		}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site confluence
		iddiv:"confluence",
		tipo:"",
		dica:$trad("d17"),
		funcaoonclick:function(){
			g_operacao = "navega";
			wdocaf("250px","190px",i3GEO.configura.locaplic+"/ferramentas/confluence/index.htm","","","confluence");
			i3GEO.util.criaBox();
			if(g_funcoesNavegaMapaDefault.toString().search("atualizaconfluence()") < 0)
			{g_funcoesNavegaMapaDefault.push("atualizaconfluence()");}		
		}
	},
	{
		//Ativa o botão que abre a lente de aumento
		iddiv:"lentei",
		tipo:"",
		dica:$trad("d18"),
		funcaoonclick:function()
		{lenteDeAumento();}
	},
	{
		//Coloca as guias em uma janela móvel
		iddiv:"encolheFerramentas",
		tipo:"",
		dica:$trad("d19"),
		funcaoonclick:function()
		{docaguias();}
	},
	{
		//botão de reinicialização do mapa que restaura as condições iniciais do mapa
		iddiv:"reinicia",
		tipo:"",
		dica:$trad("d20"),
		funcaoonclick:function(){
			i3GEO.janela.abreAguarde("ajaxredesenha",$trad("o1"));
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"reiniciaMapa",ajaxredesenha);
		}
	},
	{
		//botão de medição de distâncias
		iddiv:"mede",
		tipo:"dinamico",
		dica:$trad("d21"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("mede");
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"distancia","img",i3GEO.configura.locaplic);
			}
			mede();
		}
	},
	{
		//botão de medição de área
		iddiv:"area",
		tipo:"dinamico",
		dica:$trad("d21a"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("area");
			if($i("img")){
				$i("img").title = "";
				i3GEO.util.mudaCursor(i3GEO.configura.cursores,"area","img",i3GEO.configura.locaplic);
			}
			area();
		}
	},
	{
		//botão de digitalização
		iddiv:"inserexy",
		tipo:"dinamico",
		dica:$trad("d22"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("inserexy");
			inserexy();
			if($i("img")){
				$i("img").title = "clique para inserir um ponto";
				$i("img").style.cursor="crosshair";
			}
		}
	},
	{
		//botão de inclusão de gráficos
		iddiv:"inseregrafico",
		tipo:"dinamico",
		dica:$trad("d23"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("inseregrafico");
			inseregrafico();
			if($i("img")){
				$i("img").title = "clique para incluir o gráfico";
				$i("img").style.cursor="pointer";
			}		
		}
	},
	{
		//botão de seleção
		iddiv:"selecao",
		tipo:"dinamico",
		dica:$trad("d24"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("selecao");
			selecao();
			if($i("img")){
				$i("img").title = "";
				$i("img").style.cursor="pointer";
			}
		}
	},
	{
		//botão de inserção de toponímia
		iddiv:"textofid",
		tipo:"dinamico",
		dica:$trad("d25"),
		funcaoonclick:function(){
			i3GEO.barraDeBotoes.ativaIcone("textofid");
			textofid();
			if($i("img")){
				$i("img").title = "clique para inserir o texto";
				$i("img").style.cursor="pointer";
			}
		}
	},
	{
		//monta o menu suspenso
		iddiv:"menus",
		tipo:"",
		constroiconteudo:'montaMenuSuspenso("menus")'
	}	
]};
