/*
Title: mapfiles

Funções javascript utilizadas no sistema de administração de mapfiles básicos

File: i3geo/admin/mapfiles.js

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
YAHOO.namespace("example.container");
/*
Function: iniciaAdmin

Inicializa as variáveis globais e checa o cadastro do editor do sistema de administração
*/
function initMenu()
{
	core_ativaPainelAjuda("ajuda","botaoAjuda");
	new YAHOO.widget.Button("botao2",{ onclick: { fn: function(){window.open('../../testainstal.php') }} });
	$parametros = {
	"simples": [
	{ mensagem: "Arquivo que define as fontes de texto utilizadas",cabeca: "FONTSET", variavel: "FONTSET"},
	{ mensagem: "Arquivo que define a simbologia",cabeca: "SYMBOLSET", variavel: "SYMBOLSET"},
	{ mensagem: "Diretório com o caminho padrão para arquivos shapefile",cabeca: "SHAPEPATH", variavel: "SHAPEPATH"},
	{ mensagem: "Extensão geográfica (xmin ymin xmax ymax). ",cabeca: "EXTENT", variavel: "EXTENT"},
	{ mensagem: "Endereço da imagem de referência",cabeca: "IMAGE", variavel: "IMAGE"},
	{ mensagem: "Caminho para o armazenamento das imagens temporárias",cabeca: "IMAGEPATH", variavel: "IMAGEPATH"},
	{ mensagem: "Complemento para a url das imagens",cabeca: "IMAGEURL", variavel: "IMAGEURL"}
	]};
	core_carregando("ativa");
	core_pegaDados("buscando parâmetros...","../php/mapfiles.php?funcao=pegaParametrosConfigura","pegaParametros")
}
/*
Function: pegaParametros

Pega os parâmetros do mapfiles.php

*/
function pegaParametros(retorno)
{
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>"
		ins += "<td><input onchange=\"this.style.color='blue'\" type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>"
		ins += "</fieldset><br>"	
	}
	$i("tabela").innerHTML += ins
	for (i=0;i<$parametros.simples.length;i++)
	{
		if($i($parametros.simples[i].variavel))
		{$i($parametros.simples[i].variavel).value = eval("retorno."+$parametros.simples[i].variavel);}
	}
	core_carregando("desativa");
}
/*
Function - salva

Salva o novo valor de uma variável
*/
function salva(variavel)
{
	core_pegaDados("gravando...","../php/mapfiles.php?funcao=salvaConfigura&variavel="+variavel+"&valor="+$i(variavel).value)
	$i(variavel).style.color = ""
}
YAHOO.util.Event.addListener(window, "load", initMenu);