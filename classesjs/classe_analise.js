/*
Class:: i3GEO.analise

Funções geração e abertura dos diálogos das opções de análise espacial

Em i3GEO.analise.dialogo estão as funções de abertura dos diálogos 

File: i3geo/classesjs/classe_analise.js

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
i3GEO.analise = {
	/*
	Function: dialogo
	
	Abre as telas de diálogo das opções de análise
	*/
	dialogo:{
		/*
		Function: gradePontos

		Abre a janela que gera grade de pontos
		*/
		gradePontos: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos");},
		/*
		Function: gradePoligonos

		Abre a janela que gera grade de poligonos
		*/
		gradePol: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos");},
		/*
		Function: gradeHex

		Abre a janela que gera grade de hexágonos
		*/
		gradeHex: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos");},
		/*
		Function: analisaGeometrias

		Abre a janela com o sistema de análise de geometrias
		*/
		analisaGeometrias: function(){
			g_tipoacao = "selecao";
			objmapa.temaAtivo = "";
			i3GEO.janela.cria("500px","400px",i3GEO.configura.locaplic+'/ferramentas/analisageometrias/index.htm',"","","Sele&ccedil;&atilde;o");
		},
		/*
		Function: pontosdistri

		Abre a janela para executar análises de distribuição de pontos
		*/
		pontosdistri: function(){
			//a variável g_r indica se o R está instalado no servidor e é definida na inicialização do I3Geo
			if (g_r == "nao")
			{alert("Opção não disponível");}
			else
			{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribui&ccedil;&atilde;o de pontos");}
		},
		/*
		Function: pontoempoligono

		Abre a janela para cruzar um tema de pontos com um ou mais temas poligonais e gerar um novo tema
		*/
		pontoempoligono: function()
		{i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono");},
		/*
		Function: nptPol

		Abre a janela para cruzar um tema de pontos com um ou tema poligona e gerar um novo tema com o número de pontos em cada polígono
		*/
		nptPol: function()
		{i3GEO.janela.cria("400px","200px",i3GEO.configura.locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono");},
		/*
		Function: buffer

		Gera um buffer em elementos selecionados
		*/
		buffer: function()
		{i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/buffer/index.htm","","","Entorno");},
		/*
		Function: distanciaptpt

		Abre a janela para calcular a distância entre um ponto e outros pontos próximos
		*/
		distanciaptpt: function()
		{i3GEO.janela.cria("400px","220px",i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/index.htm","","","Dist&acirc;ncia");},
		/*
		Function: centroide

		Abre a janela que gera um tema com os centroides dos elementos selecionados
		*/
		centroide: function()
		{i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/centroide/index.htm","","","Centróide");},
		/*
		Function: dissolve

		Abre a janela que gera um tema dissolvendo as divisas entre polígonos.
		*/
		dissolve: function()
		{i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/dissolve/index.htm","","","Dissolve");},
		/*
		Function: agrupaElementos

		Abre a janela que gera um tema poligonal agrupando elementos de um tema.
		*/
		agrupaElementos: function()
		{i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/agrupaelementos/index.htm","","","Agrupa");},
	}
};