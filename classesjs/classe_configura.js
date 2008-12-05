/*
Class:: i3GEO.configura

Configuração do i3geo

Define os parâmetros variáveis do i3geo. Vc pode alterar com esta classeamaioria dos parâmetros que controlam
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
	Variable: listaDePropriedadesDoMapa
	
	Lista com as funções que são incluídas no item "Propriedades do mapa"	
	*/
	listaDePropriedadesDoMapa: {
		"propriedades": [
		{ text: "p2", url: "javascript:tipoimagem()" },
		{ text: "p3", url: "javascript:opcoesLegenda()" },
		{ text: "p4", url: "javascript:opcoesEscala()" },
		{ text: "p5", url: "javascript:tamanho()" },
		{ text: "p6", url: "javascript:ativaEntorno()" },
		{ text: "p7", url: "javascript:ativaLogo()" },
		{ text: "p8", url: "javascript:queryMap()" },
		{ text: "p9", url: "javascript:corFundo()" },
		{ text: "p10", url: "javascript:gradeCoord()" },
		{ text: "p11", url: "javascript:template()" },
		{ text: "p12", url: "javascript:autoredesenha()"}
		]
	},
	/*
	Variable: tempoAplicar
	
	Tempo em milisegundos que será esperado até que o mapa seja desenhado automaticamente.
	
	Utilizado no botão Aplicar, quando o usuário liga/desliga ou adiciona umtema
	
	*/
	tempoAplicar: 4000,
	/*
	Variable: iniciaJanelaMensagens
	
	Inicia o i3geo com a janela de mensagens aberta ou fechada.
	
	Se o cookie g_janelaMen estiver definido, essa variável não terá efeito
	*/
	iniciaJanelaMensagens: true,
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