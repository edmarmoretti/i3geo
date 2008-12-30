/*
Class:: i3GEO.configura

Configuração do i3geo

Define os parâmetros variáveis do i3geo. Vc pode alterar com esta classe a maioria dos parâmetros que controlam
o funcionamento do i3geo.

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
i3GEO.configura = {
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
		{ text: "p2", url: "javascript:tipoimagem()"},
		{ text: "p3", url: "javascript:opcoesLegenda()"},
		{ text: "p4", url: "javascript:opcoesEscala()"},
		{ text: "p5", url: "javascript:tamanho()"},
		{ text: "p6", url: "javascript:ativaEntorno()"},
		{ text: "p7", url: "javascript:ativaLogo()"},
		{ text: "p8", url: "javascript:queryMap()"},
		{ text: "p9", url: "javascript:corFundo()"},
		{ text: "p10", url: "javascript:gradeCoord()"},
		{ text: "p11", url: "javascript:template()"},
		{ text: "p12", url: "javascript:autoredesenha()"}
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
	tempoMouseParado: 2500,
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
	mostraRosaDosVentos: "sim"
	/*
	Function: alteraVariavel
	*/
	/*
	Function: adicionaVariavel
	*/
};
//
//para efeitos de compatibilidade
try {
	if (g_listaPropriedades)
	{i3GEO.configura.listaDePropriedadesDoMapa = g_listaPropriedades;}
}
catch(e){};
try {
	if (g_tempo_aplicar)
	{i3GEO.configura.tempoAplicar = g_tempo_aplicar;}
}
catch(e){};
try {
	if (g_janelaMen == "nao")
	{i3GEO.configura.iniciaJanelaMensagens = false;}
}
catch(e){};
try {
	if (g_locaplic)
	{i3GEO.configura.locaplic = g_locaplic;}
}
catch(e){};
try {
	if (g_tempotip)
	{i3GEO.configura.tempoMouseParado = g_tempotip;}
}
catch(e){};
try {
	if (g_mostraRosa)
	{i3GEO.configura.mostraRosaDosVentos = g_mostraRosa;}
}
catch(e){};
try {
	if (g_visual)
	{i3GEO.configura.visual = g_visual;}
}
catch(e){};
//
//define a variável sid
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
i3GEO.configura.sid = g_sid;