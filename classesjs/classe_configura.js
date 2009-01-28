/*
Title: Configurações gerais

File: i3geo/classesjs/classe_configura.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Class: i3GEO.configura

Configuração do i3geo

Define os parâmetros variáveis do i3geo. Vc pode alterar com esta classe a maioria dos parâmetros que controlam
o funcionamento do i3geo.
*/
i3GEO.configura = {
	/*
	Variable: mashuppar
	
	Define os parâmetros que devem ser aplicados no modo mashup
	
	O modo mashup possibilita que o i3Geo seja embutido dentro de uma página HTML. Nesse
	caso, o mapa não é criado no modo convencional, que utiliza o programa i3geo/ms_criamapa.php
	A variavel mashuppar deve conter os parâmetros que são utilizados pelo programa ms_criamapa
	
	Exemplo:
	
	i3GEO.configura.mashuppar = "&pontos=-54 -12&temasa=biomas&layers=biomas"
	*/
	mashuppar: "",
	/*
	Variable: sid
	
	Código da seção aberta pelo i3Geo no servidor.
	
	O código é gerado na inicialização do i3Geo pelo programa ms_criamapa.php
	
	Type:
	{String}
	*/
	sid: "",
	/*
	Variable: locaplic
	
	Localização da instalação do i3geo (URI)
	
	Por default, é definida na inicialização do i3Geo com o uso do i3GEO.util

	Type:
	{URI}
	*/
	locaplic: "",
	/*
	Variable: mapaRefDisplay
	
	Indica se o mapa de referência deverá ser aberto quando o i3Geo for inicializado.
	
	Type:
	{style.display}
	*/
	mapaRefDisplay: "block",
	/*
	Variable: visual
	
	Tipo de visual que será utilizado no mapa.
	
	A lista de visuais existentes é obtida na inicialização do i3geo.
	
	Veja o diretório i3geo/imagens/visual

	Type:
	{String}
	*/
	visual: "default",
	/*
	Variable: cursores
	
	Imagens utilizadas para os cursores do mouse mostrados no mapa	

	Type:
	{JSON}
	*/
	cursores: {
		"identifica":
		{ff:"/imagens/cursores/identifica.png",ie:"/imagens/cursores/identifica.cur"},
		"pan":
		{ff:"/imagens/cursores/pan.png",ie:"/imagens/cursores/pan.cur"},
		"area":
		{ff:"/imagens/cursores/area.png",ie:"/imagens/cursores/area.cur"},
		"distancia":
		{ff:"/imagens/cursores/distancia.png",ie:"/imagens/cursores/distancia.cur"},
		"zoom":
		{ff:"/imagens/cursores/zoom.png",ie:"/imagens/cursores/zoom.cur"}
	},
	/*
	Variable: listaDePropriedadesDoMapa
	
	Lista com as funções que são incluídas no item "Propriedades do mapa"	

	Type:
	{JSON}
	*/
	listaDePropriedadesDoMapa: {
		"propriedades": [
		{ text: "p2", url: "javascript:i3GEO.mapa.dialogo.tipoimagem()"},
		{ text: "p3", url: "javascript:i3GEO.mapa.dialogo.opcoesLegenda()"},
		{ text: "p4", url: "javascript:i3GEO.mapa.dialogo.opcoesEscala()"},
		{ text: "p5", url: "javascript:i3GEO.mapa.dialogo.tamanho()"},
		{ text: "p6", url: "javascript:i3GEO.navega.entorno.ativaDesativa()"},
		{ text: "p7", url: "javascript:i3GEO.mapa.ativaLogo()"},
		{ text: "p8", url: "javascript:i3GEO.mapa.dialogo.queryMap()"},
		{ text: "p9", url: "javascript:i3GEO.mapa.dialogo.corFundo()"},
		{ text: "p10", url: "javascript:i3GEO.mapa.dialogo.gradeCoord()"},
		{ text: "p11", url: "javascript:i3GEO.mapa.dialogo.template()"},
		{ text: "p12", url: "javascript:i3GEO.mapa.dialogo.autoredesenha()"}
		]
	},
	/*
	Variable: tempoAplicar
	
	Tempo em milisegundos que será esperado até que o mapa seja desenhado automaticamente.
	
	Utilizado no botão Aplicar, quando o usuário liga/desliga ou adiciona umtema
	
	Type:
	{Numeric}
	*/
	tempoAplicar: 4000,
	/*
	Variable: tempoMouseParado
	
	Tempo em milisegundos que será esperado para detectar que o mouse está parado.
	
	Controla o lapso de tempo utilizado para disparar as funções que ocorrem quando o mouse está parado sobre o mapa
	
	Type:
	{Numeric}
	*/
	tempoMouseParado: 3500,
	/*
	Variable: iniciaJanelaMensagens
	
	Inicia o i3geo com a janela de mensagens aberta ou fechada.
	
	Se o cookie g_janelaMen estiver definido, essa variável não terá efeito

	Type:
	{Boolean}
	*/
	iniciaJanelaMensagens: true,
	/*
	Variable: mostraRosaDosVentos
	
	Mostra ou não a rosa dos ventos sob o mouse quando estiver parado.

	Type:
	{sim|nao}
	*/	
	mostraRosaDosVentos: "nao",
	/*
	Variable: liberaGuias
	
	Indica se as guias serão montadas em uma janela flutuante sobre o mapa
	
	Type:
	{sim|nao}
	*/
	liberaGuias: "nao",
	/*
	Variable: entorno
	
	Define se o entorno do mapa será desenhado também
	
	O desenho do entorno permite a navegação no mapa no estilo "tiles"
	
	Type:
	{sim|nao}
	*/
	entorno: "nao"
};