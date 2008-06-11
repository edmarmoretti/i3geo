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
/*
Function: iniciaAdmin

Inicializa as variáveis globais e checa o cadastro do editor do sistema de administração
*/
function iniciaAdmin()
{
$parametros = {
	"simples": [
	{ mensagem: "Arquivo que define as fontes de texto utilizadas",cabeca: "FONTSET", variavel: "FONTSET"},
	{ mensagem: "Arquivo que define a simbologia",cabeca: "SYMBOLSET", variavel: "SYMBOLSET"},
	{ mensagem: "Diretório com o caminho padrão para arquivos shapefile",cabeca: "SHAPEPATH", variavel: "SHAPEPATH"},
	{ mensagem: "Extensão geográfica. Após alterar os valores, clique na imagem para atualizar.",cabeca: "EXTENT", variavel: "EXTENT"},
	{ mensagem: "Endereço da imagem de referência",cabeca: "IMAGE", variavel: "IMAGE"},
	{ mensagem: "Caminho para o armazenamento das imagens temporárias",cabeca: "IMAGEPATH", variavel: "IMAGEPATH"},
	{ mensagem: "Complemento para a url das imagens",cabeca: "IMAGEURL", variavel: "IMAGEURL"}
	]};
	verificaEditores()
}
/*
Function: montaParametros

Monta o html com os parametros
*/
function montaParametros()
{
	montaCampos()
	pegaParametros()
}
/*

http://labs.metacarta.com/wms-c/Basic.py?LAYERS=basic&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A4326&BBOX=-70,-40,-30,0&WIDTH=200&HEIGHT=200


Function: pegaParametros

Pega os parâmetros do mapfiles.php

*/
function pegaParametros()
{
	var l = $i("EXTENT").parentNode.parentNode.parentNode
	l.innerHTML += "<div id=mapaRef ></div>"
	var retorna = function(retorno)
	{
		for (i=0;i<$parametros.simples.length;i++)
		{
			if($i($parametros.simples[i].variavel))
			{$i($parametros.simples[i].variavel).value = eval("retorno.data."+$parametros.simples[i].variavel);}
		}
		maparef()
	}
	var p = "../php/mapfiles.php?funcao=pegaParametrosConfigura";
	cPaint.call(p,"",retorna);
}
function maparef()
{
	var bb = $i("EXTENT").value.split(" ")
	var bb = bb.toString()
	$i("mapaRef").innerHTML = "<br><img onclick='maparef()' title='Clique para atualizar' src='http://mapas.mma.gov.br/cgi-bin/mapserv?map=/opt/www/html/webservices/baseraster.map&LAYERS=baseraster&STYLES=default&SRS=EPSG%3A4326&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&FORMAT=image%2Fjpeg&BBOX="+bb+"&WIDTH=200&HEIGHT=200' />"
}
/*
Function - restauraPadrao

Copia o arquivo ms_configura.default para mapfiles.php
*/
function restauraPadrao()
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function(retorno)
		{window.location.reload();}
		var p = "../php/mapfiles.php?funcao=restauraConfigura";
		cPaint.call(p,"",retorna);	
	}
}
/*
Function - salva

Salva o novo valor de uma variável
*/
function salva(variavel)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function(retorno)
		{window.location.reload();}
		var p = "../php/mapfiles.php?funcao=salvaConfigura&variavel="+variavel+"&valor="+$i(variavel).value;
		cPaint.call(p,"",retorna);	
	}
}