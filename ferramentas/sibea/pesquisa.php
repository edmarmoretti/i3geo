<?php
/*
Title: SIBEA-MMA (PHP)

Acessa os web services do MMA para recuperar dados sobre educadores ambientais.

Por ser executado dentro do I3Geo, boa parte dos parâmetros são obtidos da vari&aacute;vel de se&ccedil;ão.

Arquivos: 

i3geo/ferramentas/sibea/pesquisa.htm
i3geo/ferramentas/sibea/pesquisa.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

*/
require_once("../../pacotes/cpaint/cpaint2.inc.php");
require_once("../../classesphp/pega_variaveis.php");
if (function_exists('ereg'))
{require_once('../../pacotes/SOAPdepreciado/nusoap.php');}
else
{require_once('../../pacotes/SOAP/nusoap.php');}
if (isset($g_sid))
{session_id($g_sid);}
session_start();
foreach(array_keys($_SESSION) as $k)
{
	eval("\$".$k."='".$_SESSION[$k]."';");
}
require_once("../../pacotes/phpxbase/api_conversion.php");
require_once ("../../classesphp/carrega_ext.php");
$cp = new cpaint();
$servico = "http://mapas.mma.gov.br/webservices/sibeaws.php";

if ($funcao == "listaTipoFiltro")
{
	$cp->register('listaTipoFiltro');
	$cp->start();
	$cp->return_data();
}
if ($funcao == "listaValorFiltro")
{
	$cp->register('listaValorFiltro');
	$cp->start();
	$cp->return_data();
}
if ($funcao == "adicionatema")
{
	$cp->register('adicionatema');
	$cp->start();
	$cp->return_data();
}
/*
Function: listaTipoFiltro

Obt&eacute;m a lista de tipos de filtro.
*/
function listaTipoFiltro()
{
	global $cp,$servico;
	$resultado = array();
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);
	$resultado = $soapclient->call("tipoBusca","");
	$cp->set_data($resultado);
}
/*
Function: listaValorFiltro

Obt&eacute;m a lista de valores de um tipo de filtro.
*/
function listaValorFiltro()
{
	global $cp,$servico,$execFuncao;
	$resultado = array();
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);	$resultado = $soapclient->call($execFuncao,"");
	$cp->set_data($resultado);
}
/*
Function: adicionatema

Cria um arquivo shapefile com os dados dos planos de manejo.

Adiciona o shape file como uma nova camada no mapa.

Parameters:

map_file - arquivo map file atual

dir_tmp - diret&oacute;rio tempor&aacute;rio do Mapserver

imgdir - diret&oacute;rio tempor&aacute;rio para guardar as imagens do mapa atual

filtro - nome do tipo de filtro

valor - valor do filtro
*/
function adicionatema()
{
	global $map_file,$dir_tmp,$imgdir,$filtro,$valor,$servico,$cp,$nomevalor,$cor,$locaplic,$imgurl;
	//
	//pega a lista de c&oacute;digos siafi
	//
	if (function_exists('ereg'))
	$soapclient = new Xsoapclient($servico."?wsdl","wsdl");
	else
	$soapclient = new nusoap_client($servico);
	
	if ($filtro == "tipoTitulacaoMaxima")
	{
		$resultado = $soapclient->call("sibeaTitulacaoMaxima",$valor);
		$nometema = "Titula&ccedil;ão m&aacute;xima";		
	}
	if ($filtro == "tipoFormacao")
	{
		$resultado = $soapclient->call("sibeaFormacao",$valor);
		$nometema = "Forma&ccedil;ão";		
	}
	if ($filtro == "tipoAreaFormacao")
	{
		$resultado = $soapclient->call("sibeaGrandeArea",$valor);
		$nometema = "Grande &aacute;rea de forma&ccedil;ão";		
	}
	//
	//converte siafi-ibge
	//
	$listaSiafi = $resultado["sibea"][0];
	$resultado = $soapclient->call("converteSiafiIbge",$listaSiafi);
	//
	//monta o sql para o layer
	//
	$listaIbge = $resultado["sibea"][0];
	if ($listaIbge == '')
	{
		$cp->set_data("erro. Nada encontrado");
		return;
	}
	include("../../classesphp/classe_mapa.php");
	include("../../classesphp/funcoes_gerais.php");
	if ($listaIbge != '')
	{
		$retorno = "ok";
		$tema = "sibeapol";
		$servico = "http://mapas.mma.gov.br/webservices/sibeawms.php?gid=".$listaIbge."&cor=".$cor;
		$nome = "default";
		$proj = "EPSG:4618";
		$formato = "image/png";
		$nomecamada = $nometema." = ".$nomevalor;
		$suportasld = "nao";
		$versao = "1.1.0";
		$tiporep = "";
		$tipo = "";
		$m = new Mapa($map_file);
		$m->adicionatemawms($tema,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld);
		$m->salva();
	}
	$cp->set_data($retorno);	
	
	
/*
	$sql = "('".(str_replace(",","','",$listaIbge))."')";
	$nomes = "";
	$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$max = strlen($a)-1;
	for($i=0; $i < 10; $i++)
	{$nomes .= $a{mt_rand(0, $max)};}
	//adiciona o layer
	$mapa = ms_newMapObj($map_file);
	$layer = ms_newLayerObj($mapa);
	$layer->set("name",$nomes);
	$layer->set("connectiontype",MS_POSTGIS);
	$layer->set("connection","user=geodados password=geodados dbname=geodados host=10.1.1.36 port=5432");
	$layer->set("data","the_geom FROM (select * FROM brasil.bralim10 where geocodigo in $sql) as foo USING UNIQUE gid USING SRID=4291");
	$layer->setmetadata("TEMA",$nometema." = ".$nomevalor);
	$layer->setmetadata("CLASSE","sim");
	$layer->set("type",MS_LAYER_POLYGON);
	$layer->set("status",MS_DEFAULT);
	$classe = ms_newClassObj($layer);
	$classe->set("name"," ");
	$estilo = ms_newStyleObj($classe);
	$cors = $estilo->color;
	$cor = explode(",",$cor);
	$cors->setRGB($cor[0],$cor[1],$cor[2]);
	$salvo = $mapa->save($map_file);
	$cp->set_data("ok");
*/
}
?>